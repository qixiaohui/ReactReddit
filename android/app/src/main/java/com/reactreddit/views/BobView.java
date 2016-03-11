package com.reactreddit.views;

/**
 * Created by TQi on 3/9/16.
 */

import android.content.Context;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.ReadableMap;
import com.squareup.picasso.Picasso;
import com.reactreddit.*;

import java.io.InputStream;
import java.net.URL;

public class BobView extends LinearLayout implements View.OnFocusChangeListener{

    private RelativeLayout mBobView;
    private Context mContext;

    private ImageView mBoxArt;
    private TextView mTitle;
    private TextView mRating;
    private TextView mYear;
    private TextView mActors;
    private TextView mDescription;
    private ViewGroup mDetail;
    private Boolean hasFocus = false;
    private LayoutInflater mLayoutInflator;
    private LinearLayout.LayoutParams p;
    private ReadableMap mReadableMap;
    private LinearLayout linear;

    public BobView(Context context) {
        super(context);
        mContext = context;
        inflateBob(context);
        p = new LinearLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
        this.addView(mBobView, p);
    }

    private void setListener(){
        mBobView.setOnFocusChangeListener(new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                setFocus(hasFocus);
            }
        });
    }

    private void setFocus(Boolean focus){
        this.hasFocus = focus;
    }

    /**
     *
     * @return
     */
    private void inflateBob (Context context) {
        mLayoutInflator = (LayoutInflater) context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
        mBobView = (RelativeLayout)mLayoutInflator.inflate(R.layout.simple, null);
        Log.i("inflate relative", mBobView.toString());

        linear = (LinearLayout) mBobView.findViewById(R.id.bobDetails);
        mBoxArt = (ImageView) mBobView.findViewById(R.id.boxArt);
        mTitle = (TextView) mBobView.findViewById(R.id.bobTitle);
        mRating = (TextView) mBobView.findViewById(R.id.bobRating);
        mYear = (TextView) mBobView.findViewById(R.id.bobYear);
        mActors = (TextView) mBobView.findViewById(R.id.bobActors);
        mDescription = (TextView) mBobView.findViewById(R.id.bobDescription);
    }

    public RelativeLayout getmBobView(){
        return mBobView;
    }

    public void setInfo(ReadableMap map){
        mReadableMap = map;
        if(map.getString("poster").indexOf("/movie")>0){
            String url = "http://content6.flixster.com" + map.getString("poster").substring(map.getString("poster").lastIndexOf("/movie"), map.getString("poster").length());
            Picasso.with(mContext).load(url).into(mBoxArt);
        }else{
            mBoxArt.setImageDrawable(ContextCompat.getDrawable(mContext, R.drawable.deadpool));
        }

        //mBoxArt.setImageURI(Uri.parse(map.getString("poster")));
        mTitle.setText(map.getString("title"));
        mYear.setText(Integer.toString(map.getInt("year")));
        mActors.setText(map.getString("actor"));
        mRating.setText(Integer.toString(map.getInt("rating")));
        mDescription.setText(map.getString("description"));

    }

    public void setHighlight(String title){

    }

    /**
     *
     * @return
     */
    public ViewGroup getDetail () {
        return mDetail;
    }

    /**
     *
     */
//    public void onFocus () {
//        getBoxArt().setBackground(getResources().getDrawable(R.drawable.image_highlight));
//        inflateDetail();
//    }

    /**
     *
     */
    public void outOfFocus() {
        getBoxArt().setBackgroundResource(0);
        deflateDetail();
    }

    /**
     *
     */
    public void inflateDetail () {
        RelativeLayout.LayoutParams lp = (RelativeLayout.LayoutParams)getDetail().getLayoutParams();
        lp.width = 550; //magic numbers ???
        getDetail().setLayoutParams(lp);
    }

    /**
     *
     */
    public void deflateDetail () {
        RelativeLayout.LayoutParams lp = (RelativeLayout.LayoutParams)getDetail().getLayoutParams();
        lp.width = 0;
        getDetail().setLayoutParams(lp);
    }

    /**
     *
     * @return
     */
    public ImageView getBoxArt() {
        return mBoxArt;
    }

    /**
     *
     * @return
     */
    public TextView getYear () {
        return mYear;
    }

    /**
     *
     * @return
     */
    public TextView getTitle() {
        return mTitle;
    }

    /**
     *
     * @return
     */
    public TextView getRating() {
        return mRating;
    }

    /**
     *
     * @return
     */
    public TextView getActors() {
        return mActors;
    }

    /**
     *
     * @return
     */
    public TextView getDescription() {
        return mDescription;
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        this.hasFocus = hasFocus;
        Toast.makeText(mContext, "focused", Toast.LENGTH_LONG).show();
    }

    /**
     *
     * @return
     */
    public View getView () {
        return mBobView;
    }

    public Boolean checkFocus(){
        return this.hasFocus;
    }
}
