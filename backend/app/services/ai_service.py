import os
import re
import json
import time
import socket
import ipaddress
import httpx
from typing import Optional, Dict, Any, List
from urllib.parse import urlparse
from sqlalchemy.orm import Session

from app.config import settings
from app.models.system import AIProviderConfig, AIUsageRecord
from app.schemas.ai import (
    AIGradingRequest,
    AIGradingResponse,
    AIConnectionTestResult,
    AITutorResponse,
    AIMistakeExplanationResponse
)

# Nexora Text Cleaning & JSON Extraction Algorithms
def clean_ai_output(raw_text: str) -> str:
    """
    Cleans AI output by removing chain-of-thought, thinking tags, and meta-prompts
    (Ported from Nexora v4 production engine).
    """
    if not raw_text:
        return ""
    text = str(raw_text)
    # Strip <think>...</think>, <thinking>, <reasoning>, <thought>, <s>
    text = re.sub(r"<think>[\s\S]*?(<\/think>|$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<thinking>[\s\S]*?(<\/thinking>|$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<reasoning>[\s\S]*?(<\/reasoning>|$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<thought>[\s\S]*?(<\/thought>|$)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<s>[\s\S]*?(<\/s>|$)", "", text, flags=re.IGNORECASE)

    # Strip common English meta-reasoning phrases if present
    text = re.sub(r"^Here'?s a thinking process:[\s\S]*?\n\n", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^Okay, the user (asks|wants|is asking)[\s\S]*?\n\n", "", text, flags=re.IGNORECASE)
    text = re.sub(r"^The user is asking for[\s\S]*?\n\n", "", text, flags=re.IGNORECASE)

    return text.strip()

def extract_json_response(raw_text: str) -> Optional[Dict[str, Any]]:
    """
    Safely extracts and parses JSON from model responses even if enclosed in markdown code fences
    or prefixed with commentary.
    """
    if not raw_text:
        return None
    cleaned = clean_ai_output(raw_text)
    # 1. Direct parse
    try:
        return json.loads(cleaned)
    except Exception:
        pass

    # 2. Extract from markdown ```json ... ```
    m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except Exception:
            pass

    # 3. Find outer braces { ... }
    m2 = re.search(r"\{[\s\S]*\}", cleaned)
    if m2:
        try:
            return json.loads(m2.group(0).strip())
        except Exception:
            pass

    return None

# System prompt for structured scientific Persian grading
GRADING_SYSTEM_PROMPT = """شما سامانه ارزیابی هوشمند و دستیار تصحیح پاسخ‌های تشریحی فیزیک در پلتفرم QUANTUM CUT هستید.
وظیفه شما ارزیابی دقیق، منصفانه و علمی پاسخ دانش‌آموز بر اساس راهنمای تصحیح (بارم‌بندی) است.

قوانین تصحیح:
۱. نمره نهایی باید بین ۰ تا سقف بارم (max_score) باشد.
۲. نمره جزئی (Partial Credit) بر اساس مفاهیم کلیدی ذکر شده اعطا شود.
۳. در صورت درستی مفاهیم علمی، تفاوت‌های نگارشی یا املایی بی‌ضرر در زبان فارسی یا نمادها نباید موجب کسر نمره شود.
۴. لحن محترمانه و لحن اعتمادبه‌نفسِ بدون استدلال علمی دانش‌آموز نباید نمره بگیرد؛ فقط درستی مفاهیم علمی ملاک است.
۵. خروجی باید حتماً و منحصراً یک ساختار معتبر JSON با این فیلدها باشد:
{
  "score": float,
  "max_score": float,
  "correct_concepts": ["مفهوم درست ۱", ...],
  "missing_concepts": ["مفهوم فراموش‌شده یا اشتباه ۱", ...],
  "feedback_fa": "توضیح بازخورد تشریحی و راهنمایی به زبان فارسی",
  "requires_review": bool
}"""

TUTOR_SYSTEM_PROMPT = """شما «دستیار هوشمند و معلم همراه فیزیک» در پلتفرم تخصصی QUANTUM CUT هستید.
مخاطب شما دانش‌آموز تیزهوش پایه {grade_number} است.

اصول راهنمایی آموزشی:
۱. لحن شما باید علمی، صمیمی، تشویق‌کننده و انگیزاننده باشد.
۲. آموزش به روش سقراطی: بلافاصله کل جواب مسائل چندمرحله‌ای را فاش نکنید، بلکه دانش‌آموز را با سرنخ‌ها و گام‌های منطقی هدایت نمایید.
۳. فرمول‌ها، یکاها در سیستم SI و روابط ریاضی را با دقت کامل و در فرمت استاندارد LaTeX و جهت LTR ($...$) بنویسید (مانند $\\rho = \\frac{{m}}{{V}}$, $F = ma$, $P = \\rho g h$).
۴. خطاهای رایج مفهومی را شفاف‌سازی کنید.
۵. خروجی را منحصراً در قالب JSON زیر تولید کنید:
{{
  "response_fa": "توضیح کامل و گام‌به‌گام آموزشی به زبان فارسی",
  "key_hints": ["سرنخ یا نکته کلیدی ۱", "سرنخ ۲"],
  "related_formulas": ["فرمول مرتبط ۱", "فرمول ۲"],
  "suggested_followups": ["پرسش تفکربرانگیز یا گام بعدی ۱", "پرسش ۲"]
}}"""

MISTAKE_SYSTEM_PROMPT = """شما کارشناس تحلیل خطاهای مفهومی فیزیک و یادگیری عمیق در پلتفرم QUANTUM CUT هستید.
وظیفه شما کالبدشکافی خطای دانش‌آموز، ریشه‌یابی کج‌فهمی علمی و ارائه راهکار اصلاحی است.

خروجی باید منحصراً در قالب JSON زیر باشد:
{
  "why_incorrect_fa": "توضیح دقیق اینکه چرا پاسخ یا گزینه انتخابی نادرست است و چه خطای مفهومی در آن رخ داده است.",
  "correct_concept_fa": "اصل علمی و فیزیکی صحیح مطابق با کتاب درسی.",
  "remedial_tip_fa": "یک تکنیک سریع ذهنی یا روش آزمون برای اینکه دانش‌آموز دیگر مرتکب این اشتباه نشود.",
  "key_formula": "فرمول اصلی مورد نیاز (به فرمت LaTeX LTR) یا خالی"
}"""

# Nexora AI Integration Constants & Fallback Chains
NEXORA_FREE_MODELS = [
    "poolside/laguna-s-2.1:free",
    "nvidia/nemotron-3.5-lightning:free",
    "liquid/lfm-2.5-2.6b:free",
    "poolside/laguna-xs-2.1:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free",
    "thinkingmachines/inkling:free",
    "thinkingmachines/inkling-small:free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "recursive/flint-v1.0:free",
    "xingchen-agi/xing4.0-29b-a4b:free",
    "z-ai/glm-5.2:free",
    "minimax/minimax-m3:free",
    "minimax/minimax-m2.7:free",
]

RETRYABLE_STATUS_CODES = {408, 409, 429, 500, 502, 503, 504}

_MODEL_STATUS_CACHE: Dict[str, Any] = {"time": 0.0, "data": {}}


def validate_base_url_ssrf(base_url: str, provider: str) -> str:
    """
    Prevents Server-Side Request Forgery (SSRF) when configuring custom AI base URLs.
    Blocks private IP ranges and cloud metadata endpoints for remote providers.
    Allows localhost only for local Ollama or Mock setups.
    """
    cleaned = base_url.strip()
    parsed = urlparse(cleaned)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("نشانی سرور هوش مصنوعی باید با http:// یا https:// آغاز شود.")

    hostname = parsed.hostname
    if not hostname:
        raise ValueError("نام میزبان (Host) در نشانی وارد شده نامعتبر است.")

    provider_clean = (provider or "").lower().strip()
    if provider_clean in ("ollama", "mock"):
        return cleaned

    # Check for private or loopback IPs in remote provider base URLs
    try:
        ip = ipaddress.ip_address(hostname)
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            raise ValueError(f"اتصال به نشانی‌های شبکه داخلی و خصوصی ({hostname}) برای ارائه‌دهندگان ابری به دلایل امنیتی مسدود است.")
    except ValueError as ve:
        if "شبکه داخلی" in str(ve):
            raise ve
        # If hostname is a domain, check DNS resolution against private IP ranges
        try:
            resolved_ip_str = socket.gethostbyname(hostname)
            resolved_ip = ipaddress.ip_address(resolved_ip_str)
            if resolved_ip.is_private or resolved_ip.is_loopback or resolved_ip.is_link_local or resolved_ip.is_reserved or resolved_ip.is_multicast:
                raise ValueError(f"دامنه {hostname} به نشانی خصوصی ({resolved_ip_str}) اشاره می‌کند و به دلایل امنیتی مسدود است.")
        except socket.gaierror:
            # Trusted domains pass through if DNS is offline/mock
            trusted = ("api.openai.com", "api.deepseek.com", "openrouter.ai", "localhost")
            if hostname not in trusted:
                pass

    return cleaned


class AIService:
    def __init__(self, db: Optional[Session] = None):
        self.db = db
        # Fallback to settings
        self.provider = settings.AI_PROVIDER
        self.base_url = settings.AI_BASE_URL
        self.api_key = settings.AI_API_KEY
        self.model = settings.AI_MODEL
        self.tutoring_model = settings.AI_MODEL
        self.grading_model = settings.AI_MODEL
        self.generation_model = settings.AI_MODEL
        self.explanation_model = settings.AI_MODEL
        self.timeout = settings.AI_TIMEOUT_SECONDS
        self.max_retries = settings.AI_MAX_RETRIES

        if db:
            active_conf = db.query(AIProviderConfig).filter(AIProviderConfig.is_active == True).first()
            if active_conf:
                self.provider = active_conf.provider_name
                self.base_url = active_conf.base_url
                self.model = active_conf.model_name
                self.tutoring_model = active_conf.tutoring_model or active_conf.model_name
                self.grading_model = active_conf.grading_model or active_conf.model_name
                self.generation_model = active_conf.generation_model or active_conf.model_name
                self.explanation_model = active_conf.explanation_model or active_conf.model_name
                self.timeout = active_conf.timeout_seconds
                self.max_retries = active_conf.max_retries
                if active_conf.api_key_encrypted and active_conf.api_key_encrypted != "***":
                    self.api_key = active_conf.api_key_encrypted

    def get_model_for_task(self, task: str) -> str:
        """Task-specific model routing"""
        mapping = {
            "tutoring": self.tutoring_model,
            "grading": self.grading_model,
            "generation": self.generation_model,
            "explanation": self.explanation_model
        }
        return mapping.get(task, self.model) or self.model

    def _get_request_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json"
        }
        if self.api_key and self.provider != "ollama":
            headers["Authorization"] = f"Bearer {self.api_key}"

        if self.provider == "openrouter":
            headers["HTTP-Referer"] = "https://quantumcut.ir"
            headers["X-Title"] = "QUANTUM CUT Platform"

        return headers

    @staticmethod
    def classify_error(status_code: int, raw_text: str = "") -> Dict[str, str]:
        """Classifies AI API errors into student-friendly diagnostic messages (inspired by Nexora)"""
        raw_lower = (raw_text or "").lower()
        if status_code in (429, 503, 502, 504, 408):
            return {
                "kind": "busy",
                "message_fa": "ترافیک بالای سرور هوش مصنوعی یا محدودیت نرخ موقت. سامانه به طور خودکار مدل جایگزین را امتحان می‌کند."
            }
        elif status_code in (401, 403) or "access denied" in raw_lower:
            return {
                "kind": "vpn",
                "message_fa": "خطای دسترسی یا مسدود بودن نشانی IP توسط ارائه‌دهنده. بررسی کلید و اتصال شبکه ضروری است."
            }
        elif status_code == 402 or "credit" in raw_lower:
            return {
                "kind": "credit",
                "message_fa": "اعتبار حساب ارائه‌دهنده مدل به پایان رسیده است یا نیاز به کلید دارای شارژ دارد."
            }
        elif status_code == 404 or "not found" in raw_lower:
            return {
                "kind": "offline",
                "message_fa": "مدل درخواستی در این ارائه‌دهنده فعال نیست یا از دسترس خارج شده است."
            }
        return {
            "kind": "network",
            "message_fa": f"خطای ارتباط با ارائه‌دهنده هوش مصنوعی (کد وضعیت: {status_code})."
        }

    def probe_model_health(self, model_id: str, timeout: float = 4.0) -> Dict[str, Any]:
        """
        Pings a single model with a minimal 1-token test prompt to evaluate latency and tier.
        Tiers:
          - 'best': latency < 2.5s
          - 'medium': 2.5s <= latency < 5.5s
          - 'busy': latency >= 5.5s or retryable status code
        """
        if self.provider == "mock" or not self.api_key or self.api_key == "mock-key-for-testing":
            return {"model": model_id, "tier": "best", "latency_ms": 12, "ok": True, "status": 200}

        headers = self._get_request_headers()
        payload = {
            "model": model_id,
            "messages": [{"role": "user", "content": "hi"}],
            "max_tokens": 1,
            "temperature": 0.0
        }
        url = f"{self.base_url.rstrip('/')}/chat/completions"
        start = time.time()
        try:
            with httpx.Client(timeout=timeout) as client:
                res = client.post(url, json=payload, headers=headers)
                elapsed = time.time() - start
                elapsed_ms = int(elapsed * 1000)
                if res.status_code == 200:
                    tier = "best" if elapsed < 2.5 else ("medium" if elapsed < 5.5 else "busy")
                    return {
                        "model": model_id,
                        "tier": tier,
                        "latency_ms": elapsed_ms,
                        "ok": True,
                        "status": 200
                    }
                else:
                    err_info = self.classify_error(res.status_code, res.text)
                    return {
                        "model": model_id,
                        "tier": "busy",
                        "latency_ms": elapsed_ms,
                        "ok": False,
                        "status": res.status_code,
                        "kind": err_info["kind"],
                        "message_fa": err_info["message_fa"]
                    }
        except httpx.TimeoutException:
            return {"model": model_id, "tier": "busy", "latency_ms": None, "ok": False, "status": 408, "kind": "busy", "message_fa": "مهلت زمانی پاسخ به پایان رسید."}
        except Exception as ex:
            return {"model": model_id, "tier": "busy", "latency_ms": None, "ok": False, "status": 500, "kind": "network", "message_fa": str(ex)}

    def get_model_statuses(self, model_ids: Optional[List[str]] = None) -> Dict[str, Any]:
        """Returns cached or freshly probed model health statuses for OpenRouter / LLM endpoints"""
        global _MODEL_STATUS_CACHE
        now = time.time()
        if _MODEL_STATUS_CACHE["data"] and (now - _MODEL_STATUS_CACHE["time"]) < 75:
            return {"ok": True, "statuses": _MODEL_STATUS_CACHE["data"], "cached": True}

        target_ids = model_ids or NEXORA_FREE_MODELS[:8]
        statuses = {}
        for mid in target_ids:
            statuses[mid] = self.probe_model_health(mid)

        _MODEL_STATUS_CACHE = {"time": now, "data": statuses}
        return {"ok": True, "statuses": statuses, "cached": False}

    def call_completion_with_fallback(
        self,
        messages: List[Dict[str, str]],
        preferred_model: Optional[str] = None,
        temperature: float = 0.35,
        max_tokens: int = 1800,
        response_format: Optional[Dict[str, str]] = None
    ) -> tuple[Optional[Dict[str, Any]], str, int, Optional[str]]:
        """
        Calls chat completions API with automatic model failover across Nexora free fallback models.
        Returns: (parsed_json_or_dict, model_used, latency_ms, error_message)
        """
        target_model = preferred_model or self.model
        chain = [target_model]
        if self.provider == "openrouter":
            for fb in NEXORA_FREE_MODELS:
                if fb != target_model and fb not in chain:
                    chain.append(fb)
            chain = chain[:8]

        headers = self._get_request_headers()
        url = f"{self.base_url.rstrip('/')}/chat/completions"
        last_error = None

        for model in chain:
            payload: Dict[str, Any] = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            # Only send response_format for remote providers that explicitly support json_object (NOT free openrouter models)
            if response_format and self.provider != "openrouter" and ":free" not in model:
                payload["response_format"] = response_format

            start_t = time.time()
            try:
                with httpx.Client(timeout=14.0) as client:
                    resp = client.post(url, json=payload, headers=headers)
                    elapsed_ms = int((time.time() - start_t) * 1000)

                    if resp.status_code == 200:
                        data = resp.json()
                        choices = data.get("choices") or []
                        if choices:
                            msg = choices[0].get("message") or {}
                            content = msg.get("content") or msg.get("reasoning") or ""
                            if content and len(str(content).strip()) > 0:
                                return data, model, elapsed_ms, None
                        last_error = f"Model {model} returned empty content"
                        continue

                    if resp.status_code in RETRYABLE_STATUS_CODES:
                        last_error = f"Model {model} returned HTTP {resp.status_code}: {resp.text[:120]}"
                        continue  # Try next model in fallback chain
                    else:
                        last_error = f"Model {model} returned HTTP {resp.status_code}: {resp.text[:120]}"
                        continue
            except (httpx.TimeoutException, httpx.NetworkError) as net_err:
                last_error = f"Network error on model {model}: {str(net_err)}"
                continue
            except Exception as ex:
                last_error = f"Exception on model {model}: {str(ex)}"
                continue

        return None, target_model, 0, last_error

    def test_connection(self) -> AIConnectionTestResult:
        """Tests connection with the configured provider"""
        start_time = time.time()
        if self.provider == "mock":
            return AIConnectionTestResult(
                success=True,
                provider="mock",
                model=self.model,
                latency_ms=10,
                message_fa="سرویس شبیه‌ساز هوش مصنوعی (Mock) فعال و آماده به کار است.",
                raw_response='{"status": "mock_ok"}'
            )

        headers = self._get_request_headers()
        test_payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a test assistant. Reply strictly in JSON: {\"ping\": \"pong\"}"},
                {"role": "user", "content": "ping"}
            ],
            "max_tokens": 50,
            "temperature": 0.1
        }

        url = f"{self.base_url.rstrip('/')}/chat/completions"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.post(url, json=test_payload, headers=headers)
                latency = int((time.time() - start_time) * 1000)
                if resp.status_code == 200:
                    return AIConnectionTestResult(
                        success=True,
                        provider=self.provider,
                        model=self.model,
                        latency_ms=latency,
                        message_fa=f"اتصال به ارائه‌دهنده {self.provider} با مدل {self.model} با موفقیت برقرار شد.",
                        raw_response=resp.text[:200]
                    )
                else:
                    return AIConnectionTestResult(
                        success=False,
                        provider=self.provider,
                        model=self.model,
                        latency_ms=latency,
                        message_fa=f"خطا در ارتباط با {self.provider} (کد: {resp.status_code}). پاسخ سرور: {resp.text[:200]}",
                        raw_response=resp.text[:200]
                    )
        except Exception as ex:
            latency = int((time.time() - start_time) * 1000)
            return AIConnectionTestResult(
                success=False,
                provider=self.provider,
                model=self.model,
                latency_ms=latency,
                message_fa=f"خطای شبکه یا عدم پاسخگویی سرور {self.provider}: {str(ex)}",
                raw_response=None
            )

    def grade_written_answer(self, req: AIGradingRequest) -> AIGradingResponse:
        """
        Evaluates a student's written response using grading_model.
        Awards partial credit, flags uncertain cases for admin review.
        """
        start_time = time.time()
        resp_clean = req.student_response.strip()
        if len(resp_clean) < 3:
            return AIGradingResponse(
                score=0.0,
                max_score=req.max_score,
                correct_concepts=[],
                missing_concepts=["عدم ارائه پاسخ یا پاسخ ناکافی"],
                feedback_fa="پاسخی از سوی دانش‌آموز ثبت نشده است یا پاسخ فاقد محتوای علمی است.",
                requires_review=False
            )

        if self.provider == "mock" or not self.api_key or self.api_key == "mock-key-for-testing":
            return self._mock_grade(req)

        model_to_use = self.get_model_for_task("grading")
        user_prompt = f"""صورت سؤال فیزیک:
{req.question_prompt}

پاسخ مرجع و راهنمای تصحیح:
{req.reference_answer}

حداکثر بارم سؤال: {req.max_score} نمره

پاسخ ارسالی دانش‌آموز:
\"\"\"{req.student_response}\"\"\"

لطفاً پاسخ دانش‌آموز را ارزیابی کرده و صرفاً ساختار JSON خواسته شده را بازگردانید."""

        headers = self._get_request_headers()
        payload = {
            "model": model_to_use,
            "messages": [
                {"role": "system", "content": GRADING_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": settings.AI_TEMPERATURE,
            "response_format": {"type": "json_object"}
        }

        url = f"{self.base_url.rstrip('/')}/chat/completions"
        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(url, json=payload, headers=headers)
                latency = int((time.time() - start_time) * 1000)

                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)

                    usage = data.get("usage", {})
                    p_tokens = usage.get("prompt_tokens", 0)
                    c_tokens = usage.get("completion_tokens", 0)
                    t_tokens = usage.get("total_tokens", p_tokens + c_tokens)

                    if self.db:
                        record = AIUsageRecord(
                            operation_type="written_grading",
                            prompt_tokens=p_tokens,
                            completion_tokens=c_tokens,
                            total_tokens=t_tokens,
                            status="success",
                            latency_ms=latency
                        )
                        self.db.add(record)
                        self.db.commit()

                    score = float(parsed.get("score", 0.0))
                    max_s = float(req.max_score)
                    bounded_score = max(0.0, min(max_s, round(score, 2)))

                    return AIGradingResponse(
                        score=bounded_score,
                        max_score=max_s,
                        correct_concepts=parsed.get("correct_concepts", []),
                        missing_concepts=parsed.get("missing_concepts", []),
                        feedback_fa=parsed.get("feedback_fa", "پاسخ ارزیابی شد."),
                        requires_review=bool(parsed.get("requires_review", False))
                    )
                else:
                    fallback = self._mock_grade(req)
                    fallback.requires_review = True
                    fallback.feedback_fa += f" (خطای ارائه‌دهنده: {res.status_code} - ارجاع به بازبینی دبیر)"
                    return fallback

        except Exception:
            fallback = self._mock_grade(req)
            fallback.requires_review = True
            fallback.feedback_fa += " (خطای اتصال به سرور هوش مصنوعی - ارجاع خودکار به دبیر)"
            return fallback

    def provide_tutoring(
        self,
        student_query: str,
        grade_number: int,
        chapter_title: Optional[str] = None,
        lesson_title: Optional[str] = None,
        question_prompt: Optional[str] = None,
        page_context: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
        preferred_model: Optional[str] = None
    ) -> AITutorResponse:
        """
        Interactive Socratic AI Tutoring for physics and science topics powered by Nexora Multi-Model Engine.
        """
        model_to_use = preferred_model or self.get_model_for_task("tutoring")

        context_parts = [f"پایه تحصیلی: پایه {grade_number}"]
        if chapter_title:
            context_parts.append(f"فصل جاری: {chapter_title}")
        if lesson_title:
            context_parts.append(f"درس یا مبحث: {lesson_title}")
        if question_prompt:
            context_parts.append(f"سؤال مورد نظر دانش‌آموز: {question_prompt}")
        if page_context:
            context_parts.append(f"محتوا یا صفحه جاری که دانش‌آموز در حال مشاهده آن است:\n{page_context}")

        context_str = "\n".join(context_parts)
        user_message = f"""زمینه درسی:
{context_str}

پرسش یا ابهام دانش‌آموز:
\"{student_query}\"

لطفاً به عنوان معلم فیزیک QUANTUM CUT، با لحنی علمی، انگیزاننده و به روش گام‌به‌گام و سقراطی دانش‌آموز را راهنمایی کنید. فرمول‌ها را به صورت استاندارد LaTeX بنویسید."""

        if self.provider == "mock" or not self.api_key or self.api_key == "mock-key-for-testing":
            return self._mock_tutoring(student_query, grade_number, chapter_title, question_prompt)

        messages = [
            {"role": "system", "content": TUTOR_SYSTEM_PROMPT.format(grade_number=grade_number)}
        ]
        if history:
            for item in history[-4:]:
                messages.append({"role": item.get("role", "user"), "content": item.get("content", "")})
        messages.append({"role": "user", "content": user_message})

        try:
            data, used_model, elapsed_ms, err = self.call_completion_with_fallback(
                messages=messages,
                preferred_model=model_to_use,
                temperature=0.35,
                max_tokens=1800
            )

            if data and data.get("choices"):
                msg = data["choices"][0].get("message") or {}
                raw_content = msg.get("content") or msg.get("reasoning") or ""
                parsed = extract_json_response(raw_content)
                if parsed and isinstance(parsed, dict):
                    # Unpack if nested in inner response_fa string
                    inner = parsed.get("response_fa")
                    if isinstance(inner, str) and inner.strip().startswith("{") and "response_fa" in inner:
                        try:
                            inner_dict = json.loads(inner)
                            if isinstance(inner_dict, dict) and "response_fa" in inner_dict:
                                parsed = inner_dict
                        except Exception:
                            pass

                    if "response_fa" in parsed:
                        return AITutorResponse(
                            response_fa=clean_ai_output(str(parsed.get("response_fa", ""))).strip(),
                            key_hints=parsed.get("key_hints", []) or [],
                            related_formulas=parsed.get("related_formulas", []) or [],
                            suggested_followups=parsed.get("suggested_followups", []) or [],
                            model_used=used_model
                        )
                elif raw_content:
                    cleaned = clean_ai_output(raw_content)
                    if len(cleaned) > 8:
                        return AITutorResponse(
                            response_fa=cleaned,
                            key_hints=["مرور دقیق مفاهیم و متن کتاب درسی", "یادداشت داده‌ها و روابط ریاضی مربوطه"],
                            related_formulas=[],
                            suggested_followups=["آیا روی نحوه حل عددی یا بررسی یکای این مبحث سؤالی داری؟"],
                            model_used=used_model
                        )
        except Exception:
            pass

        return self._mock_tutoring(student_query, grade_number, chapter_title, question_prompt)

    def explain_mistake(
        self,
        question_prompt: str,
        correct_answer: str,
        student_answer: str,
        options_info: Optional[str] = None
    ) -> AIMistakeExplanationResponse:
        """
        Deep diagnostic analysis of why a student's answer was incorrect.
        """
        model_to_use = self.get_model_for_task("explanation")
        if self.provider == "mock" or not self.api_key or self.api_key == "mock-key-for-testing":
            return self._mock_explain_mistake(question_prompt, correct_answer, student_answer)

        user_content = f"""صورت سؤال:
{question_prompt}

گزینه‌ها یا اطلاعات تکمیلی:
{options_info or "ندارد"}

پاسخ صحیح:
{correct_answer}

پاسخ یا گزینه انتخاب‌شده توسط دانش‌آموز:
{student_answer}

لطفاً خطای دانش‌آموز را تحلیل و خروجی JSON تولید کنید."""

        try:
            data, used_model, elapsed_ms, err = self.call_completion_with_fallback(
                messages=[
                    {"role": "system", "content": MISTAKE_SYSTEM_PROMPT},
                    {"role": "user", "content": user_content}
                ],
                preferred_model=model_to_use,
                temperature=0.3,
                max_tokens=1200
            )
            if data and data.get("choices"):
                msg = data["choices"][0].get("message") or {}
                raw_content = msg.get("content") or msg.get("reasoning") or ""
                parsed = extract_json_response(raw_content)
                if parsed and isinstance(parsed, dict) and "why_incorrect_fa" in parsed:
                    return AIMistakeExplanationResponse(
                        question_id=0,
                        why_incorrect_fa=parsed.get("why_incorrect_fa", "تحلیل خطای مفهومی"),
                        correct_concept_fa=parsed.get("correct_concept_fa", "مفهوم صحیح علمی"),
                        remedial_tip_fa=parsed.get("remedial_tip_fa", "نکته آموزشی"),
                        key_formula=parsed.get("key_formula", "")
                    )
                elif raw_content:
                    cleaned = clean_ai_output(raw_content)
                    if len(cleaned) > 10:
                        return AIMistakeExplanationResponse(
                            question_id=0,
                            why_incorrect_fa=cleaned,
                            correct_concept_fa=correct_answer,
                            remedial_tip_fa="دقت به مفاهیم پایه‌ای کتاب درسی و بررسی دوباره گزینه‌ها.",
                            key_formula=""
                        )
        except Exception:
            pass

        return self._mock_explain_mistake(question_prompt, correct_answer, student_answer)

    # ----------------- Mock & Intelligent Fallback Engines -----------------

    def _mock_grade(self, req: AIGradingRequest) -> AIGradingResponse:
        student_text = req.student_response.strip().lower()
        ref_text = req.reference_answer.lower()

        key_concepts = []
        if req.grading_rubric and "key_concepts" in req.grading_rubric:
            key_concepts = req.grading_rubric["key_concepts"]
        else:
            candidates = [w.strip() for w in ref_text.replace("،", " ").replace(".", " ").split() if len(w) > 3]
            key_concepts = candidates[:5]

        matched = []
        missing = []
        for c in key_concepts:
            c_clean = c.lower()
            if c_clean in student_text:
                matched.append(c)
            else:
                missing.append(c)

        if not key_concepts:
            ratio = min(1.0, len(student_text) / max(30.0, len(ref_text)))
            score = round(ratio * req.max_score, 1)
        else:
            match_ratio = len(matched) / len(key_concepts)
            score = round(match_ratio * req.max_score, 1)

        score = max(0.0, min(req.max_score, score))
        requires_review = (0.2 < score / max(1.0, req.max_score) < 0.8)

        feedback = f"پاسخ بررسی شد. نمره پیشنهادی: {score} از {req.max_score}."
        if matched:
            feedback += f" مفاهیم صحیح شناسایی‌شده: {', '.join(matched)}."
        if missing:
            feedback += f" نکات نیازمند تکمیل: {', '.join(missing)}."

        return AIGradingResponse(
            score=score,
            max_score=req.max_score,
            correct_concepts=matched,
            missing_concepts=missing,
            feedback_fa=feedback,
            requires_review=requires_review
        )

    def _mock_tutoring(
        self,
        query: str,
        grade_number: int,
        chapter_title: Optional[str] = None,
        question_prompt: Optional[str] = None
    ) -> AITutorResponse:
        q_lower = query.lower()

        if "چگالی" in q_lower or "شناوری" in q_lower:
            return AITutorResponse(
                response_fa="برای بررسی چگالی جسم، ابتدا باید نسبت جرم به حجم آن را محاسبه کنی. اگر چگالی جسم از چگالی مایع (برای آب ۱ گرم بر سانتی‌متر مکعب) کمتر باشد روی آب شناور می‌ماند و اگر بیشتر باشد ته‌نشین می‌شود.",
                key_hints=["یکای SI چگالی کیلوگرم بر متر مکعب ($kg/m^3$) است.", "نیروی شناوری ارشمیدس با وزن مایع هم‌حجم جسم برابر است."],
                related_formulas=["$\\rho = \\frac{m}{V}$", "$F_b = \\rho_{fluid} \\cdot V_{sub} \\cdot g$"],
                suggested_followups=["اگر حجم جسم ثابت بماند ولی جرم آن دو برابر شود چگالی چه تغییری می‌کند؟"],
                model_used="mock-physics-tutor"
            )
        elif "قانون دوم" in q_lower or "نیوتون" in q_lower or "نیرو" in q_lower:
            return AITutorResponse(
                response_fa="طبق قانون دوم نیوتون، هرگاه به جسمی نیروی خالص غیرصفر وارد شود، جسم در جهت نیرو شتاب می‌گیرد. این شتاب با نیروی خالص نسبت مستقیم و با جرم جسم نسبت عکس دارد.",
                key_hints=["نیرو یک کمیت برداری است و با دینامومتر (نیروسنج) سنجیده می‌شود.", "یکای نیرو نیوتون ($N$) است که معادل $kg \\cdot m/s^2$ می‌باشد."],
                related_formulas=["$F_{net} = m \\cdot a$", "$a = \\frac{F_{net}}{m}$"],
                suggested_followups=["اگر برآیند نیروهای وارد بر یک جسم صفر باشد، حرکت جسم چگونه خواهد بود؟"],
                model_used="mock-physics-tutor"
            )
        elif "فشار" in q_lower or "پاسکال" in q_lower:
            return AITutorResponse(
                response_fa="فشار برابر است با اندازه نیروی عمودی وارد بر واحد سطح. در شاره‌ها (مایعات و گازها) فشار به عمق، چگالی مایع و شتاب گرانش بستگی دارد و مستقل از شکل ظرف است.",
                key_hints=["یکای فشار در SI پاسکال ($Pa$) است که معادل یک نیوتون بر متر مربع می‌باشد.", "اصل پاسکال بیان می‌کند فشار وارد بر مایع محبوس بدون کاهش به تمام نقاط منتقل می‌شود."],
                related_formulas=["$P = \\frac{F}{A}$", "$P = \\rho g h$"],
                suggested_followups=["چرا فشار در ته یک سد عمیق آب بیشتر از سطح آن است؟"],
                model_used="mock-physics-tutor"
            )
        elif "تندی" in q_lower or "سرعت" in q_lower or "شتاب" in q_lower or "حرکت" in q_lower:
            return AITutorResponse(
                response_fa="تندی برابر است با مسافت پیموده‌شده بر زمان مصرف‌شده (کمیت نرده‌ای)، در حالی که سرعت برداری است و از تقسیم جابه‌جایی بر زمان به دست می‌آید. شتاب نیز آهنگ تغییرات سرعت در گذر زمان است.",
                key_hints=["یکای SI تندی و سرعت متر بر ثانیه ($m/s$) است.", "برای تبدیل $km/h$ به $m/s$ عدد را بر ۳.۶ تقسیم می‌کنیم."],
                related_formulas=["$s = \\frac{d}{t}$", "$\\vec{v}_{avg} = \\frac{\\Delta \\vec{x}}{\\Delta t}$", "$\\vec{a} = \\frac{\\Delta \\vec{v}}{\\Delta t}$"],
                suggested_followups=["اگر خودرویی با تندی ثابت روی میدان دایره‌ای حرکت کند، آیا شتاب دارد؟ چرا؟"],
                model_used="nexora-socratic-tutor"
            )
        elif "کار" in q_lower or "انرژی" in q_lower or "توان" in q_lower or "ژول" in q_lower:
            return AITutorResponse(
                response_fa="کار هنگامی انجام می‌شود که نیرویی به جسم وارد شده و جسم در جهت آن نیرو جابه‌جا شود ($W = F \\cdot d$). انرژی نیز توانایی انجام کار است و قانون پایستگی بیان می‌کند انرژی هرگز خلق یا نابود نمی‌شود.",
                key_hints=["یکای کار و تمام صورت‌های انرژی ژول ($J$) است.", "توان آهنگ انجام کار یا مصرف انرژی در واحد زمان است و یکای آن وات ($W$) می‌باشد."],
                related_formulas=["$W = F \\cdot d$", "$K = \\frac{1}{2}m v^2$", "$U = m g h$", "$P = \\frac{W}{t}$"],
                suggested_followups=["اگر وزنه‌ای را بدون جابه‌جا کردن روی دست نگه‌داریم، کار فیزیکی انجام داده‌ایم؟"],
                model_used="nexora-socratic-tutor"
            )
        elif "نور" in q_lower or "آینه" in q_lower or "شکست" in q_lower or "عدسی" in q_lower:
            return AITutorResponse(
                response_fa="نور در خط مستقیم سیر می‌کند و پدیده بازتابش بر اساس تساوی زاویه تابش و زاویه بازتابش رخ می‌دهد. در آینه‌های مقعر تصویر بسته به فاصله جسم می‌تواند حقیقی یا مجازی، بزرگ‌تر یا کوچک‌تر باشد.",
                key_hints=["تصویر در آینه تخت همواره مجازی، مستقیم و هم‌اندازه با جسم است.", "در شکست نور با ورود از محیط رقیق به غلیظ، نور به خط عمود نزدیک‌تر می‌شود."],
                related_formulas=["$\\theta_i = \\theta_r$", "$n = \\frac{c}{v}$", "$\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q}$"],
                suggested_followups=["چرا تصویر قاشق در لیوان آب شکسته‌شده به نظر می‌رسد؟"],
                model_used="nexora-socratic-tutor"
            )
        elif "گرما" in q_lower or "دما" in q_lower or "کالری" in q_lower or "رسانش" in q_lower:
            return AITutorResponse(
                response_fa="دما معیاری از میانگین انرژی جنبشی ذرات ماده است، در حالی که گرما انرژی منتقل‌شده به دلیل اختلاف دماست. انتقال گرما به سه روش رسانش، همرفت و تابش انجام می‌پذیرد.",
                key_hints=["دماسنج‌ها با تغییر ویژگی‌های فیزیکی وابسته به دما کار می‌کنند.", "یکای دمای ترمودینامیکی در SI کلوین ($K$) است: $T(K) = \\theta(^\\circ C) + 273$."],
                related_formulas=["$Q = m \\cdot c \\cdot \\Delta T$", "$T = \\theta + 273.15$"],
                suggested_followups=["چرا نسیم دریا در روز از سمت دریا به سمت ساحل می‌وزد؟"],
                model_used="nexora-socratic-tutor"
            )
        elif "الکتریسیته" in q_lower or "اهم" in q_lower or "مدار" in q_lower:
            return AITutorResponse(
                response_fa="در یک مدار الکتریکی، اختلاف پتانسیل (ولتاژ) عامل برقراری جریان است و مقاومت رسانا در برابر عبور بارها مخالفت می‌کند. رابطه بین این سه کمیت با قانون اهم توصیف می‌شود.",
                key_hints=["آمپرسنج به صورت متوالی و ولت‌سنج به صورت موازی در مدار بسته می‌شود.", "یکای مقاومت الکتریکی اهم ($\\Omega$) است."],
                related_formulas=["$I = \\frac{V}{R}$", "$V = I \\cdot R$"],
                suggested_followups=["اگر مقاومت مدار را دو برابر کنیم، شدت جریان عبوری چه تغییری خواهد کرد؟"],
                model_used="mock-physics-tutor"
            )
        else:
            return AITutorResponse(
                response_fa=f"پرسش بسیار خوبی در زمینه علوم پایه {grade_number} مطرح کردی. برای حل این مسئله ابتدا داده‌ها و مجهول را یادداشت کن، سپس رابطه ریاضی یا مفهوم فیزیکی مربوطه را مشخص نما و با تبدیل یکاها پاسخ را به دست آور.",
                key_hints=["همواره به تبدیل یکاها در دستگاه بین‌المللی SI توجه کن.", "مفاهیم کتاب درسی رسمی و نکات تکمیلی QUANTUM CUT مکمل یکدیگرند."],
                related_formulas=["$SIUnits$", "$DimensionalAnalysis$"],
                suggested_followups=["آیا می‌خواهی یک مثال عددی حل شده از این مبحث را با هم بررسی کنیم؟"],
                model_used="mock-physics-tutor"
            )

    def _mock_explain_mistake(
        self,
        question_prompt: str,
        correct_answer: str,
        student_answer: str
    ) -> AIMistakeExplanationResponse:
        return AIMistakeExplanationResponse(
            question_id=0,
            why_incorrect_fa=f"پاسخ انتخابی ({student_answer}) یک کج‌فهمی متداول است؛ در این حالت معمولاً جهت نیرو یا رابطه معکوس پارامترها نادیده گرفته می‌شود.",
            correct_concept_fa=f"پاسخ صحیح: «{correct_answer}». طبق قوانین فیزیک و متن صریح کتاب درسی، این پارامتر ارتباط مستقیمی با شرایط مسئله دارد.",
            remedial_tip_fa="همیشه ابتدا فرمول اصلی را بنویسید و بررسی کنید که متغیر مورد نظر در صورت کسر قرار دارد یا در مخرج کسر.",
            key_formula="\\Delta x = v \\cdot t"
        )
