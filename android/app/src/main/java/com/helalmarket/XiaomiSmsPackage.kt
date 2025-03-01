package com.helalmarket

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class XiaomiSmsPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList() // Bu modül herhangi bir ViewManager eklemez
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(XiaomiSmsModule(reactContext)) // XiaomiSmsModule'u listeye ekliyoruz
    }
}
