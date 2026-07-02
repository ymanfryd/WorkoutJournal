import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, radius, spacing} from '@/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProgressRing from '@/components/ProgressRing';
import {
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useState} from 'react';
import {scheduleOnRN} from 'react-native-worklets';
import Button from '@/components/Button';
import {haptics} from '@/haptics';

const REST_DURATION = 30000;

function ActiveWorkoutScreen() {
  const progress = useSharedValue(0);
  const navigation = useNavigation();

  const [remaining, setRemaining] = useState(30);

  useAnimatedReaction(
    () => progress.value >= 1,
    (done, wasDone) => {
      if (done && !wasDone) {
        scheduleOnRN(haptics.notification, 'success');
      }
    },
  );

  useAnimatedReaction(
    () => Math.ceil((1 - progress.value) * 30),
    seconds => {
      scheduleOnRN(setRemaining, seconds);
    },
  );

  const startTimer = () => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: REST_DURATION,
      easing: Easing.linear,
    });
  };

  const reset = () => {
    progress.value = 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({pressed}) => [styles.close, pressed && styles.closePressed]}>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.ringWrapper}>
          <ProgressRing progress={progress} size={240} />
          <View style={styles.ringText}>
            <Text style={styles.label}>Rest</Text>
            <Text style={styles.seconds}>{remaining}s</Text>
          </View>
        </View>
      </View>
      <View style={styles.controls}>
        <Button text="Start 30s rest" onPress={startTimer} />
        <Button text="Reset" onPress={reset} />
      </View>
    </SafeAreaView>
  );
}

export default ActiveWorkoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  close: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  closePressed: {
    opacity: 0.6,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  ringWrapper: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    position: 'absolute',
    alignItems: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  seconds: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '700',
  },
  controls: {
    gap: spacing.sm,
    width: '100%',
  },
});
