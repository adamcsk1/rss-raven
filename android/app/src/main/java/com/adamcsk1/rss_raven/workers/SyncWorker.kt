package com.adamcsk1.rss_raven.workers

import android.app.Service
import android.content.Context
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.concurrent.futures.CallbackToFutureAdapter
import androidx.work.ListenableWorker
import androidx.work.WorkerParameters
import com.adamcsk1.rss_raven.handlers.JavascriptSyncGetHandler
import com.adamcsk1.rss_raven.store.SingletonStore
import com.adamcsk1.rss_raven.store.Store
import com.adamcsk1.rss_raven.utils.SetupWebView
import com.google.common.util.concurrent.ListenableFuture

class SyncWorker(private val context: Context, workerParams: WorkerParameters): ListenableWorker(context,
  workerParams
) {

  override fun startWork(): ListenableFuture<Result> {
    println("startWork")
    return CallbackToFutureAdapter.getFuture { completer ->
      this.sync(completer)
    }
  }

  private fun sync(completer: CallbackToFutureAdapter.Completer<Result>) {
    try {
      val sharedPreference = applicationContext.getSharedPreferences(
        "Rss Raven", // !! TODO from const
        Service.MODE_PRIVATE
      )
      val store = Store(sharedPreference)

      if (!store.syncInProgress) {
        println("worker run")
        val webView = WebView(applicationContext);
        val setupWebView = SetupWebView(applicationContext, webView)
        setupWebView.setSettings()
        webView.addJavascriptInterface(
          JavascriptSyncGetHandler(context, webView, completer),
          "RssrJavascriptHandler"
        )
        webView.webViewClient = object : WebViewClient() {
          override fun shouldInterceptRequest(
            webView: WebView,
            request: WebResourceRequest
          ): WebResourceResponse? {
            val response = setupWebView.handleInterceptRequest(request)
            if (response === null) return super.shouldInterceptRequest(webView, request)
            return response
          }
        }
        webView.loadUrl(SingletonStore.localUrl + "#/background-sync")
      } else {
        completer.set(Result.success())
      }
    }catch (_: Exception) {
      completer.set(Result.success())
    }
  }

}
