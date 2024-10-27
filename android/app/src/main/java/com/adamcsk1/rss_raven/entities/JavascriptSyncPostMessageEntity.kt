package com.adamcsk1.rss_raven.entities

import com.adamcsk1.rss_raven.enums.JavascriptGetEventTypeEnum
import com.adamcsk1.rss_raven.enums.JavascriptSyncGetEventTypeEnum

class JavascriptSyncPostMessageEntity {
  data class Message(val event: JavascriptSyncGetEventTypeEnum, val data: Any?) {
  }
}
