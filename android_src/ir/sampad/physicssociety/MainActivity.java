package ir.sampad.physicssociety;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.SslErrorHandler;
import android.webkit.PermissionRequest;
import android.net.http.SslError;
import android.graphics.Bitmap;
import android.widget.ProgressBar;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    // Primary URL is public Tailscale Funnel domain (accessible globally & mobile internet)
    private static final String PRIMARY_URL = "https://server-lenova-home.tailc6e81e.ts.net:10000";
    // Fallback URL is local LAN IP
    private static final String LOCAL_URL = "http://192.168.1.150:18000";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, 
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, 
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setLayoutParams(new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, 
            12
        ));
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);

        rootLayout.addView(webView);
        rootLayout.addView(progressBar);
        setContentView(rootLayout);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        try {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        } catch (Throwable ignored) {}
        settings.setUserAgentString(settings.getUserAgentString() + " SampadPhysicsApp/2.2");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // Trust self-signed or Tailscale internal certificates
                handler.proceed();
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                String errorHtml = "<!DOCTYPE html><html dir='rtl' lang='fa'><head><meta charset='UTF-8'>"
                    + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                    + "<style>"
                    + "body{font-family:sans-serif;background:#f8fafc;color:#0f172a;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:90vh;margin:0;padding:24px;text-align:center;}"
                    + ".card{background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:28px 24px;max-width:440px;width:100%;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);}"
                    + "h2{color:#0284c7;margin:0 0 10px 0;font-size:20px;font-weight:800;}"
                    + "p{color:#64748b;font-size:14px;line-height:1.7;margin:0 0 20px 0;}"
                    + ".btn{display:block;width:100%;box-sizing:border-box;margin-top:10px;background:#0284c7;color:#fff;border:none;padding:13px 20px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:14px;box-shadow:0 4px 12px rgba(2,132,199,0.25);}"
                    + ".btn-outline{background:#f1f5f9;color:#334155;box-shadow:none;border:1px solid #cbd5e1;}"
                    + ".input-box{width:100%;box-sizing:border-box;padding:12px;border:1px solid #cbd5e1;border-radius:10px;font-size:13px;margin-top:16px;text-align:left;direction:ltr;font-family:monospace;}"
                    + "</style></head>"
                    + "<body><div class='card'>"
                    + "<h2>سامانه انجمن فیزیک سمپاد</h2>"
                    + "<p>اتصال مستقیم به سرور مرکزی برقرار نشد.<br>می‌توانید روش اتصال را تغییر دهید:</p>"
                    + "<button class='btn' onclick=\"location.href='" + PRIMARY_URL + "'\">اتصال اینترنتی سراسری (تانل مرکزی)</button>"
                    + "<button class='btn btn-outline' onclick=\"location.href='" + LOCAL_URL + "'\">اتصال شبکه محلی وای‌فای (192.168.1.150)</button>"
                    + "<input id='cust' type='text' class='input-box' value='" + PRIMARY_URL + "' placeholder='آدرس سرور دلخواه'>"
                    + "<button class='btn btn-outline' style='margin-top:8px;' onclick=\"location.href=document.getElementById('cust').value\">اتصال به آدرس وارد شده</button>"
                    + "</div></body></html>";
                view.loadDataWithBaseURL(null, errorHtml, "text/html", "utf-8", null);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Grant camera / mic permission for Live Lab
                request.grant(request.getResources());
            }
        });

        // Load primary URL
        webView.loadUrl(PRIMARY_URL);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
