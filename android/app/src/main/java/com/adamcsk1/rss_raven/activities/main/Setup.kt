package com.adamcsk1.rss_raven.activities.main

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.PowerManager
import android.provider.Settings
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import com.adamcsk1.rss_raven.activities.FullscreenActivityBase
import com.adamcsk1.rss_raven.databinding.ActivityMainBinding
import com.adamcsk1.rss_raven.handlers.JavascriptGetHandler
import com.adamcsk1.rss_raven.handlers.JavascriptPostHandler
import com.adamcsk1.rss_raven.utils.PeriodicalWorker
import com.adamcsk1.rss_raven.utils.SetupWebView


open class Setup : FullscreenActivityBase() {
    protected lateinit var binding: ActivityMainBinding
    protected var fileUploadValueCallback: ValueCallback<Array<Uri>>? = null
    protected lateinit var javascriptPostHandler: JavascriptPostHandler
    protected  lateinit var periodicalWorker: PeriodicalWorker

  override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        val view = binding.root
        setContentView(view)

        if (supportActionBar != null)
            supportActionBar?.hide()

        setupWebView()
        periodicalWorker = PeriodicalWorker(this, store)
    }
    protected open fun handleWebViewPageFinished(url: String) {}
    protected open fun handleWebViewError(request: WebResourceRequest, error: WebResourceError) {}
    protected open fun handleOverrideUrlLoading(request: WebResourceRequest): Boolean {return true}
    protected open fun handleShowFileChooser(filePathCallback:ValueCallback<Array<Uri>>): Boolean {return true}

    private fun setupWebView() {
        javascriptPostHandler = JavascriptPostHandler(binding.webView)
        val setupWebView = SetupWebView(this, binding.webView)
        setupWebView.setSettings()
        binding.webView.addJavascriptInterface(JavascriptGetHandler(this, binding.webView,  toast, store), "RssrJavascriptHandler")
        binding.webView.webViewClient = object : WebViewClient(){
            override fun onPageFinished(view: WebView, url: String) = handleWebViewPageFinished(url)
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean = handleOverrideUrlLoading(request)
           override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) = handleWebViewError(request, error)
           override fun shouldInterceptRequest(
              webView: WebView,
              request: WebResourceRequest
            ): WebResourceResponse? {
              val response = setupWebView.handleInterceptRequest(request)
              if(response ===null) return super.shouldInterceptRequest(webView, request)
              return response
            }
        }

        binding.webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(webView: WebView, filePathCallback:ValueCallback<Array<Uri>>, fileChooserParams: FileChooserParams): Boolean = handleShowFileChooser(filePathCallback)
        }
    }
}
