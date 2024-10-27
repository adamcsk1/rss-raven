package com.adamcsk1.rss_raven.entities

import com.adamcsk1.rss_raven.enums.JavascriptGetEventTypeEnum

data class JavascriptSaveAsMessageEntity(val fileName: String, val content: String ) {
    data class Message(val event: JavascriptGetEventTypeEnum, val data: data) {
    }

    data class data(val fileName: String, val content: String ) {
    }
}
