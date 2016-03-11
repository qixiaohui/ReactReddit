package com.reactreddit.manager;

import android.media.Image;
import android.net.Uri;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.reactreddit.views.BobView;
import com.squareup.picasso.Picasso;

/**
 * Created by TQi on 3/9/16.
 */
public class BobViewManager extends SimpleViewManager<BobView>{
    static final private String CLASS_NAME = "BobView";
    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    protected BobView createViewInstance(ThemedReactContext reactContext) {
        Log.i("bobview", "render");
       return new BobView(reactContext);
    }

    @ReactProp(name="bobInfo")
    public void setBobInfo(BobView view, @Nullable ReadableMap bobInfo){
        view.setInfo(bobInfo);
    }


}