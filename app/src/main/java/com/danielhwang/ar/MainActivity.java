package com.danielhwang.ar;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.location.Location;
import android.location.LocationListener;
import android.webkit.WebView;

import com.wikitude.architect.ArchitectStartupConfiguration;
import com.wikitude.architect.ArchitectView;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private ArchitectView architectView;
    private LocationProvider locationProvider;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        WebView.setWebContentsDebuggingEnabled(true);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        this.architectView = (ArchitectView) this.findViewById(R.id.architectView);
        final ArchitectStartupConfiguration config = new ArchitectStartupConfiguration();
        //config.setLicenseKey("Q/LnrgaADwLY3r3kmTYou8mRx97PtaVdFW2+cDcxFgH5bBlHyI23YMcnCFXZy8iFey5wFme8/JWaT88S3hvRFg0DdFemOgg+TJY4/GsOULXBWVUU7KP/V3GViUh/vjzGg2r09/5L6rVHmVmvOp28SVKmw9I0DXzvO/P2Qop8dFNTYWx0ZWRfXxkMckO8df7goCaz+wmXQVCFPD+eKCdM8W8K+s0hn5cr9OP28odHcG4+Dfmm/MhsdFcdmz6RFlMPn4C7ezZurmDxd9TVfFOS7AuBd5Yui0gcpNi2bd/mZoTxDtvhgPWvzQMa6fxzC4jn4PZwYrlLNsywmFq10EKK+KU/XPPv0QcQZwnTMcfm5C2Bn1ZZOLysfminLstDvuEfharIWHz4DXlQiJB/x1wfssLpluJACsvIHbD9/MuZeRVIT8dMP/wNY1fTr538VgmBkZW7GbHvhr5ovg/SuPwtrMavIMTndBgY9fvDU4YzJtkxEwpUxnY25HyFj58wujtj9hS7bVaMTxOfUrDw/jjX4cAM3nRebRZfH06Q4UIgEe9zyLxRYYTiQo8edZEHqETuMdWs4T/SejmtuiLAb6LM5IYVeUc+vW93ao1mqD2790dIWagLKrV2x++2FL904wZZ+yl0nRetVvgSlQftZFl8IGhbl3xH/ZO2C0zf+Ry8pV8JU+nBnIB6fRYfixgOYMyCwKC2TvUP+rohB/SvIBbpWw==");
        config.setLicenseKey("0eao4B2/gE5apd3QMw8zEbr4/5a9ba7+AKIIq60wlU8Nfzxl6G/wg/OGO2Rt26tZ5Dsz0R/tI8sNfADkIshpY5pimLsHI9xCBx0zXG9IIlNeK3oqn5MMpZSBcnWtAyiQnlb0k/A5eEHyhH+1Rv+sRtiZjcoND1T9VmOlXCS6EuBTYWx0ZWRfX7VOVWtohJ2uz88rBJuk4FngJkN+E4mpXUBrjtebsfgbHawlqaJNmjezrt3xl7Re1I55tDfncwoyadaYlFkM+qhrf3lzBJRCDyxVNx1PhRe+P76K24KGsBenMawcmjM3yM4FsnlwGINjhKqPQbkytiZvo/4uoQuP9D60UqeY0VqXx5vmfAaBDwiDzjEcg/M6VdxyCiumMTMCb+vNzjC584sTAwyq40Yc+37fj1snW6cPcIOfTXDNWkb6PmcPEkMnEe9vwWI++97EU27jkuuStrlRzthmMx2SgasflVaYkgSp+z7SI/2uRN9bzxoBSVt0vTlTbimuYw2vifmtNaF2mGOc2uuw2k5JrvvJMtFtt843W+lnFqED5OouxcCJOfFLuoEDP1XE6XURaw2We+aXPjUUJDWhnVtHEEN72fR76lwuf77EDiCSmFj7xkRIlDAGCoVXvX3jPaBcPvYQGh+/qVQ4o+qxSGIbwRGW0BIm6JEta3Mp7VKh56GonlTzB8bf1Z7LC6b9+BLFylC0UU2TqUEWI38NfPoMccugA8pS6H7II3Pmuhl9S0c=");
        this.architectView.onCreate(config);
        locationProvider = new LocationProvider(this, new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                if (location!=null && MainActivity.this.architectView != null ) {
                    if ( location.hasAltitude() && location.hasAccuracy() && location.getAccuracy()<7) {
                        MainActivity.this.architectView.setLocation( location.getLatitude(), location.getLongitude(), location.getAltitude(), location.getAccuracy() );
                    } else {
                        MainActivity.this.architectView.setLocation( location.getLatitude(), location.getLongitude(), location.hasAccuracy() ? location.getAccuracy() : 1000 );
                    }
                }
            }

            @Override public void onStatusChanged(String s, int i, Bundle bundle) {}
            @Override public void onProviderEnabled(String s) {}
            @Override public void onProviderDisabled(String s) {}
        });
    }


    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        architectView.onPostCreate();
        try {
            architectView.load("index.html");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        architectView.onResume();
        // start location updates
        locationProvider.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        architectView.onPause();
        // stop location updates
        locationProvider.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        architectView.onDestroy();
    }
}
