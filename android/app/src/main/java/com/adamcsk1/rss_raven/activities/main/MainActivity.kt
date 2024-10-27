package com.adamcsk1.rss_raven.activities.main

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.ValueCallback
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import androidx.activity.addCallback
import androidx.activity.result.contract.ActivityResultContracts
import com.adamcsk1.rss_raven.enums.JavascriptPostEventTypeEnum
import com.adamcsk1.rss_raven.store.SingletonStore
import com.adamcsk1.rss_raven.utils.PeriodicalWorker


class MainActivity : Setup() {
    private var getFileChooserContent = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if(uri != null)
            fileUploadValueCallback?.onReceiveValue(arrayOf(uri))
        else
            fileUploadValueCallback?.onReceiveValue(null)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (SingletonStore.webViewState != null)
            binding.webView.restoreState(SingletonStore.webViewState!!)

        if(SingletonStore.webViewState == null)
            showWebView()
        else
            restoreInstanceStates()

        this.onBackPressedDispatcher.addCallback(this) { handleSystemBack() }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        val bundle = Bundle()
        binding.webView.saveState(bundle)
        SingletonStore.webViewState = bundle
    }
  public override fun onResume() {
    super.onResume()
    periodicalWorker.stop()
  }

  public override fun onDestroy() {
    super.onDestroy()
    periodicalWorker.create()
  }

  public override fun onPause() {
    super.onPause()
    periodicalWorker.create()
  }


    private fun restoreInstanceStates() =
        SingletonStore.webViewState?.let {
            binding.webView.restoreState(it)
        }

    override fun handleWebViewPageFinished(url: String) {
        if (binding.webView.visibility == View.GONE)
            showWebView()
    }

    override fun handleOverrideUrlLoading(request: WebResourceRequest): Boolean {
        val url = request.url.toString()
        if(!url.contains(SingletonStore.appAssetsUrl))
            startActivity(Intent(Intent.ACTION_VIEW, request.url))
        else
          binding.webView.loadUrl(url)

        return true
    }
  override fun handleWebViewError(request: WebResourceRequest, error: WebResourceError) {
    val url = request.url.toString()
    if(url.contains(SingletonStore.appAssetsUrl) && url.contains("#"))
      binding.webView.loadUrl(SingletonStore.localUrl)
  }


    override fun handleShowFileChooser(filePathCallback: ValueCallback<Array<Uri>>) : Boolean {
      fileUploadValueCallback = filePathCallback
      getFileChooserContent.launch("*/*")
      return true
    }

    private fun showWebView() {
        binding.logoLayout.visibility = View.GONE
        binding.webView.visibility = View.VISIBLE
        binding.webView.loadUrl(SingletonStore.localUrl)
    }

    private fun handleSystemBack() {
        javascriptPostHandler.postJsMessage(JavascriptPostEventTypeEnum.back, null)
    }
}
