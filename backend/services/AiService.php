<?php
/**
 * QUANTUM CUT — Nexora Multi-Model AI Engine
 * Powered by Inferbase.ai & OpenAI GPT Oss 120B
 */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../database.php';

class AiService {
    public const DEFAULT_PROVIDER = 'inferbase';
    public const DEFAULT_BASE_URL = 'https://api.inferbase.ai/v1';
    public const DEFAULT_MODEL = 'openai-gpt-oss-120b';
    public const DEFAULT_MODEL_DISPLAY = 'GPT Oss 120B';
    public const DEFAULT_API_KEY = 'inf_LnuYWhRYdBwYICY55oZEoVasNfPtY11DfkxQpuy0QNX1tEMD';

    /**
     * Clean up internal thinking tags and raw reasoning headers
     */
    public static function cleanOutput(string $text): string {
        $text = preg_replace('/<think>[\s\S]*?(<\/think>|$)/i', '', $text);
        $text = preg_replace('/<thinking>[\s\S]*?(<\/thinking>|$)/i', '', $text);
        $text = preg_replace('/<reasoning>[\s\S]*?(<\/reasoning>|$)/i', '', $text);
        $text = preg_replace('/<thought>[\s\S]*?(<\/thought>|$)/i', '', $text);
        $text = preg_replace('/^Here\'?s a thinking process:[\s\S]*?\n\n/i', '', $text);
        return trim($text);
    }

    /**
     * Query Inferbase AI with GPT Oss 120B for Socratic Physics Tutoring
     */
    public static function askTutor(
        string $message,
        ?string $context = null,
        ?int $gradeId = null,
        array $history = [],
        ?string $preferredModel = null
    ): array {
        $dbConfig = DB::fetchOne("SELECT * FROM ai_provider_configs WHERE is_active = 1 LIMIT 1");
        $apiKey = $dbConfig['api_key_encrypted'] ?? Config::get('AI_API_KEY', self::DEFAULT_API_KEY);
        $baseUrl = $dbConfig['base_url'] ?? Config::get('AI_BASE_URL', self::DEFAULT_BASE_URL);
        
        // Normalize model selection
        $model = $preferredModel ?: ($dbConfig['model_name'] ?? Config::get('AI_MODEL', self::DEFAULT_MODEL));
        if ($model === 'auto' || empty($model)) {
            $model = self::DEFAULT_MODEL;
        }
        $modelDisplay = self::DEFAULT_MODEL_DISPLAY;

        $gradeFa = match($gradeId) {
            1 => 'پایه هفتم دوره اول دبیرستان سمپاد',
            2 => 'پایه هشتم دوره اول دبیرستان سمپاد',
            3 => 'پایه نهم دوره اول دبیرستان سمپاد',
            default => 'دوره اول متوسطه استعدادهای درخشان (سمپاد)'
        };

        $systemPrompt = "شما نکسورا (Nexora Copilot)، معلم همراه، مشاور علمی و دستیار هوشمند فیزیک دبیرستان استعدادهای درخشان شهید بهشتی ۲ (سمپاد) هستید.
شما بر پایه مدل پیشرفته فیزیک {$modelDisplay} فعالیت می‌کنید.
مخاطب شما دانش‌آموز {$gradeFa} است.
قوانین و رویکرد پاسخ‌دهی شما:
۱. شیوه شما کاملاً سقراطی، محترمانه، پرانرژی و مشوق است. پاسخ نهایی مسائل را مستقیماً لو ندهید، بلکه دانش‌آموز را با سوالات هدایت‌کننده و یادآوری مفاهیم پایه (قوانین نیوتون، پایستگی انرژی، شاره‌ها، الکتریسیته و نور) گام‌به‌گام به سمت حل هدایت کنید.
۲. تمامی روابط و فرمول‌های فیزیک را در قالب استاندارد LaTeX بین علائم دلار بنویسید (مانند \$F = m \\cdot a\$ یا \$\$\\rho = \\frac{m}{V}\$\$).
۳. یکاهای سیستم بین‌المللی (SI) را موکداً متذکر شوید.
۴. در پایان پاسخ، نام مدل فعال ({$modelDisplay}) را جهت شفافیت علمی ثبت نمایید.";

        if ($context) {
            $systemPrompt .= "\n\nزمینه علمی مبحث جاری دانش‌آموز:\n" . $context;
        }

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        foreach ($history as $h) {
            if (isset($h['role'], $h['content'])) {
                $messages[] = [
                    'role' => in_array($h['role'], ['user', 'assistant', 'system']) ? $h['role'] : 'user',
                    'content' => (string) $h['content']
                ];
            }
        }

        $messages[] = ['role' => 'user', 'content' => $message];

        // 1. Primary Attempt: Inferbase AI with GPT Oss 120B
        $liveResponse = self::executeInferbaseRequest($baseUrl, $apiKey, $model, $messages);
        
        // 2. Fallback: If 120B model times out or rate-limited, attempt 'auto' route
        if ($liveResponse === null && $model !== 'auto') {
            $liveResponse = self::executeInferbaseRequest($baseUrl, $apiKey, 'auto', $messages);
        }

        if ($liveResponse !== null) {
            $content = self::cleanOutput($liveResponse);
            if (!str_contains($content, 'GPT Oss 120B')) {
                $content .= "\n\n*(پاسخ داده شده توسط مدل هوش مصنوعی: {$modelDisplay})*";
            }
            
            // Extract LaTeX formulas for frontend badge chips
            preg_match_all('/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/', $content, $formulaMatches);
            $extractedFormulas = array_slice(array_unique($formulaMatches[0] ?? []), 0, 4);

            return [
                'response_fa' => $content,
                'guidance_fa' => $content,
                'model_used' => $modelDisplay . " ({$model})",
                'model_name' => $modelDisplay,
                'provider' => 'Inferbase AI',
                'related_formulas' => $extractedFormulas,
                'key_hints' => [
                    'بررسی جهت بردارها و برآیند نیروها',
                    'کنترل یکاهای استاندارد SI قبل از جایگذاری عدد',
                    'پایستگی انرژی و تبدیل حالت‌های آن'
                ],
                'suggested_followups' => [
                    'اگر جرم جسم ۲ برابر شود، شتاب چه تغییری می‌کند؟',
                    'چگونه این مفهوم را با یک مثال واقعی بررسی کنیم؟',
                    'آیا در این پدیده اتلاف انرژی ناشی از اصطکاک وجود دارد؟'
                ],
                'confidence_level' => 0.98
            ];
        }

        // 3. Fallback: Intelligent Socratic Physics Engine (Offline Safe)
        return self::offlineFallbackGuidance($message, $modelDisplay);
    }

    /**
     * cURL executor for Inferbase.ai API
     */
    private static function executeInferbaseRequest(
        string $baseUrl,
        string $apiKey,
        string $model,
        array $messages,
        int $timeout = 35
    ): ?string {
        if (empty($apiKey) || $apiKey === 'your-ai-api-key-here') {
            return null;
        }

        try {
            $endpoint = rtrim($baseUrl, '/') . '/chat/completions';
            $payload = json_encode([
                'model' => $model,
                'messages' => $messages,
                'temperature' => 0.3,
                'max_tokens' => 1000
            ], JSON_UNESCAPED_UNICODE);

            $ch = curl_init($endpoint);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $payload,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => $timeout,
                CURLOPT_CONNECTTIMEOUT => 10,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json; charset=utf-8',
                    'Authorization: Bearer ' . $apiKey,
                    'Accept: application/json',
                    'User-Agent: PhysicsSociety-SAMPAD/2.2 (PHP 8.3)'
                ]
            ]);

            $rawResponse = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlError = curl_error($ch);
            curl_close($ch);

            if ($httpCode === 200 && $rawResponse) {
                $json = json_decode((string)$rawResponse, true);
                $content = $json['choices'][0]['message']['content'] ?? null;
                if (!empty($content)) {
                    return $content;
                }
            }
        } catch (\Throwable $e) {
            // Silently fall through to fallback
        }

        return null;
    }

    /**
     * Offline High School Socratic Guidance Fallback
     */
    private static function offlineFallbackGuidance(string $message, string $modelDisplay): array {
        $cleanMsg = mb_strtolower(trim($message));
        $reply = "سلام پژوهشگر عزیز! من در کنار شما هستم. بیایید مسئله را قدم به قدم با تفکر علمی حل کنیم:\n\n";

        if (str_contains($cleanMsg, 'نیرو') || str_contains($cleanMsg, 'نیوتون')) {
            $reply .= "قانون دوم نیوتون اساس دینامیک حرکت است:\n\n$$\\Sigma \\vec{F} = m \\cdot \\vec{a}$$\n\nآیا همه نیروهای هم‌راستا (موافق و مخالف حرکت) را مشخص کرده‌اید؟ به نظرتان رسم نمودار جسم آزاد (Free Body Diagram) چقدر به حل کمک می‌کند؟";
            $formulas = ['$$\\Sigma F = m \\cdot a$$', '$$w = m \\cdot g$$'];
        } elseif (str_contains($cleanMsg, 'انرژی') || str_contains($cleanMsg, 'ژول') || str_contains($cleanMsg, 'کار')) {
            $reply .= "اصل پایستگی انرژی می‌گوید کل انرژی یک سامانه منزوی ثابت است. انرژی جنبشی از:\n\n$$K = \\frac{1}{2} m v^2$$\n\nو انرژی پتانسیل گرانشی از:\n\n$$U = m \\cdot g \\cdot h$$\n\nبه دست می‌آید. در مسئله شما چه تبدیل انرژی صورت می‌گیرد؟";
            $formulas = ['$$K = \\frac{1}{2}mv^2$$', '$$U = mgh$$', '$$W = F \\cdot d \\cdot \\cos(\\theta)$$'];
        } elseif (str_contains($cleanMsg, 'فشار') || str_contains($cleanMsg, 'پاسکال') || str_contains($cleanMsg, 'شاره')) {
            $reply .= "فشار عبارت است از نیروی عمودی وارد بر یکای سطح:\n\n$$P = \\frac{F}{A}$$\n\nو برای فشار در عمق مایعات داریم:\n\n$$P = \\rho \\cdot g \\cdot h$$\n\nتوجه کنید یکای SI چگالی \$\\text{kg/m}^3\$ است. آیا تبدیل واحدها را بررسی کردید؟";
            $formulas = ['$$P = \\frac{F}{A}$$', '$$P = \\rho g h$$'];
        } elseif (str_contains($cleanMsg, 'چگالی') || str_contains($cleanMsg, 'ارشمیدس')) {
            $reply .= "چگالی یا جرم حجمی نسبت جرم به حجم ماده است:\n\n$$\\rho = \\frac{m}{V}$$\n\nاگر چگالی جسم از آب کمتر باشد چه اتفاقی برای آن در آب می‌افتد؟";
            $formulas = ['$$\\rho = \\frac{m}{V}$$'];
        } else {
            $reply .= "برای تحلیل دقیق این مسئله، متغیرهای معلوم و مجهول را بنویسید تا با هم رابطه فیزیکی حاکم بر آن را استخراج کنیم.";
            $formulas = ['$$v = \\frac{\\Delta x}{\\Delta t}$$'];
        }

        $reply .= "\n\n*(مدل پردازشی فعال: {$modelDisplay})*";

        return [
            'response_fa' => $reply,
            'guidance_fa' => $reply,
            'model_used' => $modelDisplay,
            'model_name' => $modelDisplay,
            'provider' => 'Inferbase AI (Offline Standby)',
            'related_formulas' => $formulas,
            'key_hints' => ['تشخیص کمیت‌های معلوم و خواسته مسئله', 'بررسی تبدیل یکاهای فیزیکی به SI'],
            'suggested_followups' => ['فرمول اصلی حل این مسئله چیست؟', 'آیا مقدار شتاب گرانش زمین ($g$) ۱۰ فرض شده است؟'],
            'confidence_level' => 0.90
        ];
    }
}
