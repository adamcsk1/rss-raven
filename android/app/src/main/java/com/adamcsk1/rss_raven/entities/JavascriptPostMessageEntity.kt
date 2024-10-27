package com.adamcsk1.rss_raven.entities

import com.adamcsk1.rss_raven.enums.JavascriptGetEventTypeEnum

class JavascriptPostMessageEntity {
  data class Message(val event: JavascriptGetEventTypeEnum, val data: Any?) {
  }
}
