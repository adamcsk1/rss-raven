package com.adamcsk1.rss_raven.store

import android.os.Bundle

object SingletonStore {
    const val appAssetsUrl = "https://appassets.androidplatform.net/"
    const val localUrl = "https://appassets.androidplatform.net/assets/index.html"
    const val proxyUrl = "https://rssr-raven.android-native.localhost/api/v1/"
    const val fetchFeedUrl= proxyUrl + "fetch-feed?url="
    private var _webViewState: Bundle? = null
    var webViewState: Bundle?
        get() = _webViewState
        set(value) {
            _webViewState = value
        }

}
