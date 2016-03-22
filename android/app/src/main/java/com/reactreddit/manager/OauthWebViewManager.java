package com.reactreddit.manager;

import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by TQi on 3/21/16.
 */
public class OauthWebViewManager extends SimpleViewManager<WebView> {
    public static final String CLASS_NAME = "OauthWebView";
    private WebView webView;

    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    protected WebView createViewInstance(final ThemedReactContext reactContext) {
        webView = new WebView(reactContext);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                if(url.indexOf("reactreddit") > -1) {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("OverrideUrl", url);
                }
                return true;
            }
        });
        return webView;
    }

    @ReactProp(name = "source")
    public void setSource(WebView view, String source){
        view.loadUrl(source);
    }
}
