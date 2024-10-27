package com.adamcsk1.rss_raven.utils

import android.annotation.SuppressLint
import android.content.Context
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import com.adamcsk1.rss_raven.handlers.JavascriptGetHandler
import com.adamcsk1.rss_raven.store.SingletonStore
import java.net.URLDecoder


class SetupWebView(private val context: Context, private val webView: WebView) {
  private val assetLoader =  WebViewAssetLoader.Builder().addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context)).build();
  private val hashMap = HashMap<String, String>()
  private val webResourceResponseError: WebResourceResponse

  init {
    hashMap["Connection"] = "close";
    hashMap["Content-Type"] = "text/plain";
    hashMap["Access-Control-Allow-Headers"] = "authorization, Content-Type";
    hashMap["Access-Control-Allow-Origin"] = "*"
    hashMap["Access-Control-Max-Age"] = "600";
    hashMap["Access-Control-Allow-Credentials"] = "true";
    hashMap["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    webResourceResponseError = WebResourceResponse(
      "text/plain",
      "UTF-8",
      200, // !! TODO error
      "OK",
      hashMap,
      null // !! TODO empty string
    )
  }

  @SuppressLint("SetJavaScriptEnabled")
  fun setSettings() {
    webView.settings.javaScriptEnabled = true
    webView.settings.javaScriptCanOpenWindowsAutomatically = true
    webView.settings.databaseEnabled = true
    webView.settings.domStorageEnabled = true
    webView.settings.allowFileAccess = false;
    webView.settings.allowContentAccess = false;
  }

  fun handleInterceptRequest(
    request: WebResourceRequest
  ): WebResourceResponse? {
    println(request.url)
    if( request.url.toString().startsWith(SingletonStore.fetchFeedUrl)) {

      try {
        val encodedUrl = request.url.toString().split(SingletonStore.fetchFeedUrl)[1]
        val url = URLDecoder.decode(encodedUrl, "UTF-8")
        val connection = HttpClient.get(url)

        return if (connection === null)
          webResourceResponseError
        else
          WebResourceResponse(
                "text/plain",
                "UTF-8",
                200,
                "OK",
                hashMap,
            connection.inputStream
          )
      }catch (e: Exception) {
        println(e)
        return webResourceResponseError
      }
    } else if(request.url.toString().startsWith(SingletonStore.appAssetsUrl))
      return  assetLoader.shouldInterceptRequest(request.url)
    else return null
  }
}
