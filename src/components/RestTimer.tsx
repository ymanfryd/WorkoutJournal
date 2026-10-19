import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import ProgressRing from '../ui/ProgressRing';
import {haptics} from '@/haptics';
import {colors, radius, spacing} from '@/theme';
import {useTranslation} from 'react-i18next';

type Props = {
  duration: number; // seconds
  onComplete: () => void;
  onCancel: () => void;
};

const TICK_MS = 200;

function RestTimer({duration, onComplete, onCancel}: Props) {
  const [remaining, setRemaining] = useState(duration);
  const {t} = useTranslation();

  // Countdown + completion on JS thread
  useEffect(() => {
    const deadline = Date.now() + duration * 1000;
    setRemaining(duration);

    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(timer);
        haptics.notification('success');
        onComplete();
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <ProgressRing progress={Math.min(1, Math.max(0, (duration - remaining) / duration))} size={44} strokeWidth={4} />
        <View style={styles.ringOverlay}>
          <Text style={styles.seconds}>{remaining}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>{t('restTimer.label')}</Text>
        <Text style={styles.hint}>{t('restTimer.hint')}</Text>
      </View>

      <Pressable
        onPress={onCancel}
        hitSlop={12}
        style={({pressed}) => [styles.cancel, pressed && styles.cancelPressed]}>
        <Text style={styles.cancelText}>×</Text>
      </Pressable>
    </View>
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
