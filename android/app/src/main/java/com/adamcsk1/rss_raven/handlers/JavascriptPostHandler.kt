package com.adamcsk1.rss_raven.handlers

import android.webkit.WebView
import com.adamcsk1.rss_raven.enums.JavascriptPostEventTypeEnum
import com.google.gson.Gson



class JavascriptPostHandler(private val webView: WebView) {
  fun postJsMessage(event: JavascriptPostEventTypeEnum, data: Any?) {
      try {
        webView.post {
          val jsonData = mapOf(
            "event" to event,
            "data" to data,
          )
          webView.evaluateJavascript("getNativeMessage('${Gson().toJson(jsonData)}');"){}
        }

      } catch (_: Exception) {}
  }
}
