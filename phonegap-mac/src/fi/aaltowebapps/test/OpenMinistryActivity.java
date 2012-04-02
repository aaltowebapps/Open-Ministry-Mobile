package fi.aaltowebapps.test;

import org.apache.cordova.*;
import android.os.Bundle;

public class OpenMinistryActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}