package com.adamcsk1.rss_raven.utils

import android.content.Context
import android.os.Handler
import android.os.Looper

object RunOnThread {
  fun runOnMain(runnable: Runnable) {
    Handler(Looper.getMainLooper()).post(runnable)
  }

  fun runOnMainDelayed(runnable: Runnable, timeout: Long) {
    Handler(Looper.getMainLooper()).postDelayed(runnable, timeout)
  }

  fun runOnContextMain(context: Context, runnable: Runnable) {
    Handler(context.mainLooper).post(runnable)
  }
}
