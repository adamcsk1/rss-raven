package com.adamcsk1.rss_raven.activities

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.adamcsk1.rss_raven.R
import com.adamcsk1.rss_raven.store.Store
import com.adamcsk1.rss_raven.handlers.ToastHandler

open class FullscreenActivityBase : AppCompatActivity() {
    protected lateinit var store: Store
    protected lateinit var toast: ToastHandler

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        store = Store(
            getSharedPreferences(
                resources.getString(R.string.app_name),
                MODE_PRIVATE
            )
        )
        toast = ToastHandler(this)
    }
}
