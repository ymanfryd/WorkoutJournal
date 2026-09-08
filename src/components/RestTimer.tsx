import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';
import ProgressRing from './ProgressRing';
import {haptics} from '@/haptics';
import {colors, radius, spacing} from '@/theme';

type Props = {
  duration: number; // seconds
  onComplete: () => void;
  onCancel: () => void;
};

function RestTimer({duration, onComplete, onCancel}: Props) {
  const progress = useSharedValue(0);
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    progress.value = 0;
    setRemaining(duration);
    progress.value = withTiming(1, {
      duration: duration * 1000,
      easing: Easing.linear,
    });
  }, [duration, progress]);

  useAnimatedReaction(
    () => Math.ceil((1 - progress.value) * duration),
    (seconds, prev) => {
      if (seconds !== prev) {
        scheduleOnRN(setRemaining, seconds);
      }
      if (seconds === 0 && prev !== null && prev > 0) {
        scheduleOnRN(haptics.notification, 'success');
        scheduleOnRN(onComplete);
      }
    },
  );

  return (
    <Animated.View style={styles.container}>
      <View style={styles.ringWrapper}>
        <ProgressRing progress={progress} size={44} strokeWidth={4} />
        <View style={styles.ringOverlay}>
          <Text style={styles.seconds}>{remaining}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>Rest</Text>
        <Text style={styles.hint}>Tap to cancel</Text>
      </View>

      <Pressable
        onPress={onCancel}
        hitSlop={12}
        style={({pressed}) => [styles.cancel, pressed && styles.cancelPressed]}>
        <Text style={styles.cancelText}>×</Text>
      </Pressable>
    </Animated.View>
  );
}

export default RestTimer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    paddingRight: spacing.md,
    borderRadius: radius.md,
  },
  ringWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seconds: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    color: colors.textMuted,
    fontSize: 11,
  },
  cancel: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelPressed: {
    opacity: 0.6,
  },
  cancelText: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
});
