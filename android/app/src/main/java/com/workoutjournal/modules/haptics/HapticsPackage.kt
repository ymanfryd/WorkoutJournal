package com.workoutjournal.modules.haptics

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class HapticsPackage : BaseReactPackage() {
    override fun getModule(name: String, ctx: ReactApplicationContext): NativeModule? =
        if (name == "Haptics") HapticsModule(ctx) else null

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            "Haptics" to ReactModuleInfo(
                "Haptics",
                "HapticsModule",
                false,
                false,
                false,
                true
            )
        )
    }
}