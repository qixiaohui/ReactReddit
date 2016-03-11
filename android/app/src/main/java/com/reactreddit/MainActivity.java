package com.reactreddit;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.widget.Toast;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.shell.MainReactPackage;
import com.reactreddit.fbpackage.FbReactPackage;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new FbReactPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactRootView.startReactApplication(mReactInstanceManager, "ReactReddit", null);
        setContentView(mReactRootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        if(mReactInstanceManager != null){
            mReactInstanceManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if(mReactInstanceManager != null){
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if(mReactInstanceManager != null){
            mReactInstanceManager.onResume(this, this);
        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        WritableNativeMap params = new WritableNativeMap();
        boolean handled = false;
        switch(keyCode){
            case KeyEvent.KEYCODE_DPAD_CENTER:
                params.putString("code", "0");
                handled = true;
                break;
            case KeyEvent.KEYCODE_DPAD_UP:
                params.putString("code", "1");
                handled = true;
                break;
            case KeyEvent.KEYCODE_DPAD_RIGHT:
                params.putString("code", "2");
                handled = true;
                break;
            case KeyEvent.KEYCODE_DPAD_DOWN:
                Log.i("dpad", "down");
                params.putString("code", "3");
                handled = true;
                break;
            case KeyEvent.KEYCODE_DPAD_LEFT:
                params.putString("code", "4");
                handled = true;
                break;
        }
        if(handled) {
            mReactInstanceManager.getCurrentReactContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("keyDown", params);
        }

        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}
