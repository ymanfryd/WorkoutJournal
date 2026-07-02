package com.workoutjournal.modules.haptics

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.view.HapticFeedbackConstants
import com.facebook.react.bridge.ReactApplicationContext
import com.workoutjournal.specs.NativeHapticsSpec

class HapticsModule(context: ReactApplicationContext) : NativeHapticsSpec(context) {
    override fun getName() = "Haptics"

    private val vibrator: Vibrator? by lazy {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = reactApplicationContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            manager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            reactApplicationContext.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }

    private fun performFeedback(constant: Int) {
        val activity = reactApplicationContext.currentActivity ?: return
        activity.window.decorView.performHapticFeedback(constant)
    }

    private fun vibratePattern(timings: LongArray, amplitudes: IntArray) {
        val v = vibrator ?: return
        val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
        v.vibrate(effect)
    }

    override fun impact(style: String) {
        val constant = when (style) {
            "light" -> HapticFeedbackConstants.KEYBOARD_TAP
            "medium" -> HapticFeedbackConstants.LONG_PRESS
            "heavy" -> HapticFeedbackConstants.CONTEXT_CLICK
            else -> HapticFeedbackConstants.KEYBOARD_TAP
        }
        performFeedback(constant)
    }

    override fun notification(type: String) {
        when (type) {
            "success" -> vibratePattern(
                longArrayOf(0, 40, 60, 40),          // wait, buzz, wait, buzz
                intArrayOf(0, 180, 0, 180)
            )
            "warning" -> vibratePattern(
                longArrayOf(0, 80),
                intArrayOf(0, 220)
            )
            "error" -> vibratePattern(
                longArrayOf(0, 60, 40, 60, 40, 60),  // три коротких сильных
                intArrayOf(0, 255, 0, 255, 0, 255)
            )
        }
    }

    override fun selection() {
        vibratePattern(
            longArrayOf(0, 15),
            intArrayOf(0, 120)
        )
    }
}