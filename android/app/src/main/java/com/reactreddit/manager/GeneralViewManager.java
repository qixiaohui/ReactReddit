package com.reactreddit.manager;

import android.support.annotation.Nullable;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by TQi on 3/3/16.
 */
public class GeneralViewManager extends SimpleViewManager<ViewGroup> {
    public static final String CLASS_NAME = "GeneralView";
    private final @Nullable
    Object mCallerContext;

    public GeneralViewManager(Object context){
        this.mCallerContext = context;
    }

    public GeneralViewManager(){
        this.mCallerContext = null;
    }

    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    protected ViewGroup createViewInstance(ThemedReactContext reactContext) {
        ViewGroup view = new ViewGroup(reactContext) {
            @Override
            protected void onLayout(boolean changed, int l, int t, int r, int b) {

            }
        };
        return view;
    }
}
