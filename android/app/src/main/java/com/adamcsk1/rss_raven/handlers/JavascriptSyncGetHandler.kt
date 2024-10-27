package com.adamcsk1.rss_raven.handlers

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.concurrent.futures.CallbackToFutureAdapter
import androidx.work.ListenableWorker
import com.adamcsk1.rss_raven.entities.JavascriptSyncPostMessageEntity
import com.adamcsk1.rss_raven.enums.JavascriptSyncGetEventTypeEnum
import com.adamcsk1.rss_raven.utils.RunOnThread
import com.google.gson.Gson


class JavascriptSyncGetHandler(
  private val context: Context,
  private val webView: WebView,
  private val completer: CallbackToFutureAdapter.Completer<ListenableWorker.Result>
) {
  @JavascriptInterface
  fun postNativeMessage(message: String) {
    val messageEntity = Gson().fromJson(message, JavascriptSyncPostMessageEntity.Message::class.java)

    if(messageEntity.event == JavascriptSyncGetEventTypeEnum.backgroundSyncFinished)
      RunOnThread.runOnContextMain(context) {
        webView.destroy()
        completer.set(ListenableWorker.Result.success())
      }
  }
}
