package com.adamcsk1.rss_raven.utils

import java.net.URL
import javax.net.ssl.HttpsURLConnection

object HttpClient {
   fun get(url: String): HttpsURLConnection? {
     lateinit var connection: HttpsURLConnection

      return try {
        connection = URL(url).openConnection() as HttpsURLConnection
        connection.readTimeout = 5_000
        connection.connectTimeout= 5_000
        connection
      } catch (e: Exception) {
        return null
      }
  }
}
