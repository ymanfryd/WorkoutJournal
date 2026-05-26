package com.workoutjournal.modules.appinfo

import com.facebook.react.bridge.ReactApplicationContext
import com.workoutjournal.specs.NativeAppInfoSpec
import com.workoutjournal.BuildConfig

class AppInfoModule(context: ReactApplicationContext) : NativeAppInfoSpec(context) {
    override fun getName() = "AppInfo"

    override fun getVersion(): String {
        return BuildConfig.VERSION_NAME
    }

    override fun getBuildNumber(): String {
        return BuildConfig.VERSION_CODE.toString()
    }

    override fun getBundleId(): String {
        return BuildConfig.APPLICATION_ID
    }
}