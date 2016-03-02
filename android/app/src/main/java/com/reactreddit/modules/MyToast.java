package com.reactreddit.modules;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by TQi on 3/2/16.
 */
public class MyToast extends ReactContextBaseJavaModule {

    private static final String Duration_long = "LONG";
    private static final String Duration_short = "SHORT";

    public static final String CLASS_NAME = "Toast";

    public MyToast(ReactApplicationContext context){
        super(context);
    }

    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    public Map<String, Object> getConstants(){
        final Map<String, Object> constants = new HashMap<>();
        constants.put(Duration_long, Toast.LENGTH_LONG);
        constants.put(Duration_short, Toast.LENGTH_SHORT);
        return constants;
    }

    @ReactMethod
    public void showToast(String message, int duration){
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }

    @Override
    public boolean canOverrideExistingModule() {
        return true;
    }
}
