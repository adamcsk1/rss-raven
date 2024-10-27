package com.adamcsk1.rss_raven.utils

import android.content.Context
import android.os.Environment
import android.util.Base64
import com.adamcsk1.rss_raven.handlers.ToastHandler
import java.io.File
import java.io.FileOutputStream
import java.net.URLDecoder

object FileSaver {
  fun saveFile(context: Context, fileData: String, fileName: String) {
    val toast = ToastHandler(context)

    try {
      val fileBytesData = Base64.decode(
        fileData.split("data:text/plain;charset=utf-8,")[1],
        Base64.DEFAULT
      )

      val fileContent = URLDecoder.decode(fileBytesData.toString(Charsets.UTF_8), Charsets.UTF_8)

      val file = File(
        Environment.getExternalStoragePublicDirectory(
          Environment.DIRECTORY_DOCUMENTS
        ), fileName
      )
      FileOutputStream(file).use { fos ->
        fos.write(fileContent.toByteArray())
      }
      toast.show("File saved successfully in your Documents folder! ($fileName)")
    } catch (e: Exception) {
      println(e)
       toast.show("File save failed!")
    }
  }
}
