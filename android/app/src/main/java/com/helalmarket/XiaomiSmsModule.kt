package com.helalmarket

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class XiaomiSmsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "XiaomiSms"
    }

    @ReactMethod
    fun openSmsApp(phoneNumber: String, message: String, promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("smsto:$phoneNumber")
                putExtra("sms_body", message)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            if (intent.resolveActivity(reactApplicationContext.packageManager) != null) {
                reactApplicationContext.startActivity(intent)
                promise.resolve(true)
            } else {
                val altIntent = Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_APP_MESSAGING)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }

                if (altIntent.resolveActivity(reactApplicationContext.packageManager) != null) {
                    reactApplicationContext.startActivity(altIntent)
                    promise.resolve(true)
                } else {
                    promise.reject("SMS_APP_NOT_FOUND", "SMS uygulaması bulunamadı")
                }
            }
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }
}
