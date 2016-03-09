package com.reactreddit.manager;

import android.media.Image;
import android.net.Uri;
import android.widget.ImageView;
import android.widget.TextView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.squareup.picasso.Picasso;

/**
 * Created by TQi on 3/9/16.
 */
public class BobViewManager extends SimpleViewManager<ImageView>{
    static final private String CLASS_NAME = "BobView";
    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    protected ImageView createViewInstance(ThemedReactContext reactContext) {
        ImageView view = new ImageView(reactContext);
        Picasso.with(reactContext)
                .load(Uri.parse("http://resizing.flixster.com/bf6mnOcCcWqn5lM6z5Vt5WiUkYo=/54x80/dkpu1ddg7pbsk.cloudfront.net/movie/11/31/80/11318068_ori.png"))
                .resize(50, 50)
                .centerCrop()
                .into(view);
       return view;
    }

//    @ReactProp(name="bobInfo")
//    public void setBobInfo(BobView view, ReadableMap bobInfo){
//        view.setInfo(bobInfo);
//    }


}