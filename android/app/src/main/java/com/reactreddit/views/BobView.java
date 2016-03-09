package com.reactreddit.views;

/**
 * Created by TQi on 3/9/16.
 */

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.react.bridge.ReadableMap;
import com.reactreddit.R;
import com.squareup.picasso.Picasso;

public class BobView extends LinearLayout implements View.OnFocusChangeListener{

    private LayoutInflater mLayoutInflator;

    private RelativeLayout mBobView;
    private Context mContext;

    private ImageView mBoxArt;
    private TextView mTitle;
    private TextView mRating;
    private TextView mYear;
    private TextView mActors;
    private TextView mDescription;
    private RelativeLayout.LayoutParams p;
    private ViewGroup mDetail;
    private Boolean hasFocus = false;

    public BobView(Context context) {
        super(context);

        mContext = context;
        //mBobView = new RelativeLayout(context);
        TextView demo = new TextView(context);
        demo.setText("Demo!@#!@#!@");
        this.addView(demo);
    }

    /**
     *
     * @return
     */
    private void inflateBob (Context context) {
        mBobView.setId(R.id.bobView);

        p = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        mBoxArt.setId(R.id.imageArt);
        p.addRule(RelativeLayout.ALIGN_PARENT_LEFT, mBobView.getId());
        mBobView.addView(mBoxArt, p);

        p = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        mTitle.setId(R.id.title);
        p.addRule(RelativeLayout.ALIGN_RIGHT, mBoxArt.getId());
        p.addRule(RelativeLayout.ALIGN_PARENT_TOP, mBobView.getId());
        mBobView.addView(mTitle, p);

        p = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        mYear.setId(R.id.year);
        p.addRule(RelativeLayout.ALIGN_RIGHT, mBoxArt.getId());
        p.addRule(RelativeLayout.ALIGN_BOTTOM, mTitle.getId());
        mBobView.addView(mYear, p);

        p = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        mRating.setId(R.id.rating);
        p.addRule(RelativeLayout.ALIGN_RIGHT, mBoxArt.getId());
        p.addRule(RelativeLayout.ALIGN_BOTTOM, mYear.getId());
        mBobView.addView(mRating, p);

        p = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        mActors.setId(R.id.actor);
        p.addRule(RelativeLayout.ALIGN_RIGHT, mBoxArt.getId());
        p.addRule(RelativeLayout.ALIGN_BOTTOM, mActors.getId());
        mBobView.addView(mActors, p);

        Log.i("info", "*****&&&&");

//        mLayoutInflator = (LayoutInflater) context.getSystemService(context.LAYOUT_INFLATER_SERVICE);
//        mBobView = mLayoutInflator.inflate(R.layout.bob, null);
//
//        mDetail = (ViewGroup) mBobView.findViewById(R.id.bobDetails);
//
//        mBoxArt = (ImageView) mBobView.findViewById(R.id.boxArt);
//        mTitle = (TextView) mBobView.findViewById(R.id.bobTitle);
//        mRating = (TextView) mBobView.findViewById(R.id.bobRating);
//        mYear = (TextView) mBobView.findViewById(R.id.bobYear);
//        mActors = (TextView) mBobView.findViewById(R.id.bobActors);
//        mDescription = (TextView) mBobView.findViewById(R.id.bobDescription);
    }

    public void setInfo(ReadableMap map){
        mBoxArt = new ImageView(mContext);
        Picasso.with(mContext)
                .load(Uri.parse(map.getString("poster")))
                .resize(50, 50)
                .centerCrop()
                .into(mBoxArt);
        mTitle = new TextView(mContext);
        mTitle.setText(map.getString("title"));
        mYear = new TextView(mContext);
        mYear.setText(Integer.toString(map.getInt("year")));
        mActors = new TextView(mContext);
        mActors.setText(map.getString("actor"));
        mRating = new TextView(mContext);
        mRating.setText(Integer.toString(map.getInt("rating")));
        inflateBob(mContext);
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

    /**
     *
     * @return
     */
    public View getView () {
        return mBobView;
    }


    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        this.hasFocus = hasFocus;
    }

    public Boolean checkFocus(){
        return this.hasFocus;
    }
}
