package com.adamcsk1.rss_raven.store

import android.content.SharedPreferences
import com.adamcsk1.rss_raven.enums.StoreKeysEnum

class Store(private val sharedPref: SharedPreferences) {
    var backgroundSyncTime: Float
        get() = sharedPref.getFloat(StoreKeysEnum.backgroundSyncTime.name, 0.0F)
        set(value) {
            with (sharedPref.edit()) {
                putFloat(StoreKeysEnum.backgroundSyncTime.name, value)
                commit()
            }
        }
    var syncInProgress: Boolean
      get() = sharedPref.getBoolean(StoreKeysEnum.syncInProgress.name, false)
      set(value) {
        with (sharedPref.edit()) {
          putBoolean(StoreKeysEnum.syncInProgress.name, value)
          commit()
        }
      }
    var language: String
        get() = sharedPref.getString(StoreKeysEnum.language.name, "").toString()
        set(value) {
            with (sharedPref.edit()) {
                putString(StoreKeysEnum.language.name, value)
                commit()
            }
        }

}
