package com.adamcsk1.rss_raven.utils

import android.content.Context
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.adamcsk1.rss_raven.store.Store
import com.adamcsk1.rss_raven.workers.SyncWorker
import java.util.concurrent.TimeUnit

class PeriodicalWorker(private val context: Context, private val store:Store) {
  fun create() {
    val backgroundSyncTime = store.backgroundSyncTime
    if(backgroundSyncTime != 0.0F) {
      println("create")
      val work = PeriodicWorkRequestBuilder<SyncWorker>(
        (backgroundSyncTime * 60).toLong(), TimeUnit.MINUTES,
      )

      // !! TODO constraints

      val workManager = WorkManager.getInstance(context)
      workManager.enqueueUniquePeriodicWork(
        "RssRavenBackgroundSync", // "!! TODO"
        ExistingPeriodicWorkPolicy.UPDATE,
        work.build()
      )
    }
  }

  fun stop() {
    println("stop")
    val workManager = WorkManager.getInstance(context)
    workManager.cancelUniqueWork("RssRavenBackgroundSync")
  }
}
