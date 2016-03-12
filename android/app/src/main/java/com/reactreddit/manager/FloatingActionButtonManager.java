package com.reactreddit.manager;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.support.annotation.Nullable;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;


import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIProp;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageView;

/**
 * Created by TQi on 3/2/16.
 */
public class FloatingActionButtonManager extends SimpleViewManager<FloatingActionButton> {

    public static final String REACT_CLASS = "FloatingActionButton";

    private final @Nullable Object mCallerContext;

    public FloatingActionButtonManager(Object callerContext){
        mCallerContext = callerContext;
    }

    public FloatingActionButtonManager(){
        mCallerContext = null;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FloatingActionButton createViewInstance(ThemedReactContext reactContext) {
        FloatingActionButton button = new FloatingActionButton(reactContext);
        button.setImageDrawable(ContextCompat.getDrawable(button.getContext(), android.R.drawable.ic_input_add));
        button.setImageTintList(ContextCompat.getColorStateList(button.getContext(), android.R.color.white));
        button.setScaleType(ImageView.ScaleType.CENTER);
        return button;
    }

    @ReactProp(name="theme")
    public void setTheme(FloatingActionButton view, String theme){
        Log.i("theme", theme);
        view.setBackgroundTintList(ColorStateList.valueOf(Color.parseColor(theme)));
        //view.setBackgroundColor(Color.parseColor(theme));
    }
}
