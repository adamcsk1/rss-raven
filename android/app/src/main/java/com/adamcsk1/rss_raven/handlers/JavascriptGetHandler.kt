package com.adamcsk1.rss_raven.handlers

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.adamcsk1.rss_raven.entities.JavascriptPostMessageEntity
import com.adamcsk1.rss_raven.entities.JavascriptSaveAsMessageEntity
import com.adamcsk1.rss_raven.enums.JavascriptGetEventTypeEnum
import com.adamcsk1.rss_raven.store.SingletonStore
import com.adamcsk1.rss_raven.store.Store
import com.adamcsk1.rss_raven.utils.FileSaver
import com.adamcsk1.rss_raven.utils.RunOnThread
import com.google.gson.Gson


class JavascriptGetHandler(private val context: Context, private val webView: WebView, private val toast: ToastHandler, private val store: Store) {
  @JavascriptInterface
  fun postNativeMessage(message: String) {
    println(message)
    val messageEntity = Gson().fromJson(message, JavascriptPostMessageEntity.Message::class.java)

    if(messageEntity.event == JavascriptGetEventTypeEnum.reload)
      RunOnThread.run {
        webView.loadUrl(SingletonStore.localUrl)
      }

    if(messageEntity.event == JavascriptGetEventTypeEnum.toast)
      toast.show(messageEntity.data.toString())

    if(messageEntity.event == JavascriptGetEventTypeEnum.saveAs){
      val saveAsMessageEntity = Gson().fromJson(message, JavascriptSaveAsMessageEntity.Message::class.java)
      FileSaver.saveFile(context, saveAsMessageEntity.data.content, saveAsMessageEntity.data.fileName)
    }

    if(messageEntity.event == JavascriptGetEventTypeEnum.backgroundSyncTime)
      store.backgroundSyncTime = messageEntity.data.toString().toFloatOrNull() ?: 0.0F

    if(messageEntity.event == JavascriptGetEventTypeEnum.syncInProgress)
      store.syncInProgress =  messageEntity.data.toString().toBoolean()

    if(messageEntity.event == JavascriptGetEventTypeEnum.language)
      store.language =  messageEntity.data.toString() // !! TODO set app lang
  }
}
