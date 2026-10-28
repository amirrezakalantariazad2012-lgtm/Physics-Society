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
import android.graphics.Bitmap;
import android.widget.ProgressBar;
import android.widget.FrameLayout;

public class MainActivity extends Activity {
    private WebView webView;
    private ProgressBar progressBar;
    private static final String DEFAULT_URL = "http://192.168.1.150:18000";

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
        settings.setUserAgentString(settings.getUserAgentString() + " SampadPhysicsApp/2.1");

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
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                String errorHtml = "<!DOCTYPE html><html dir='rtl'><head><meta charset='UTF-8'>"
                    + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                    + "<style>body{font-family:sans-serif;background:#0f172a;color:#f8fafc;display:flex;flex-direction:column;align-items:center;justify-content:center;height:90vh;margin:0;padding:24px;text-align:center;}"
                    + "h2{color:#38bdf8;margin-bottom:12px;font-size:22px;}p{color:#94a3b8;font-size:15px;line-height:1.7;max-width:400px;}"
                    + "button{margin-top:24px;background:#0284c7;color:#fff;border:none;padding:14px 28px;border-radius:12px;font-weight:bold;cursor:pointer;font-size:16px;box-shadow:0 4px 14px rgba(2,132,199,0.4);}</style></head>"
                    + "<body><h2>سامانه انجمن فیزیک سمپاد</h2>"
                    + "<p>اتصال به سرور مرکزی برقرار نشد.<br>لطفاً اطمینان حاصل کنید به شبکه وای‌فای متصل هستید و سرور دردسترس است.</p>"
                    + "<button onclick=\"location.href='" + DEFAULT_URL + "'\">تلاش مجدد</button></body></html>";
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
        });

        webView.loadUrl(DEFAULT_URL);
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

