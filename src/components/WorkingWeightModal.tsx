import {useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import type {Exercise} from '@/api/exercises';
import {useUpdateExerciseWorkingWeight} from '@/hooks/useUpdateExerciseWorkingWeight';
import {colors, radius, spacing} from '@/theme';
import Button from '@/ui/Button';

export default function WorkingWeightModal({
  exercise,
  visible,
  value,
  onClose,
}: {
  exercise: Exercise | null;
  visible: boolean;
  value?: number;
  onClose: () => void;
}) {
  const [weight, setWeight] = useState('');
  const {t} = useTranslation();
  const updateWorkingWeight = useUpdateExerciseWorkingWeight();

  useEffect(() => {
    if (visible) setWeight(value?.toString() ?? '');
  }, [value, visible]);

  function save(workingWeight?: number) {
    if (!exercise) return;
    updateWorkingWeight.mutate(
      {id: exercise.id, workingWeight},
      {onSuccess: onClose},
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Pressable style={styles.close} onPress={onClose} hitSlop={8}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.title}>{t('workingWeight.title')}</Text>
          <Text style={styles.exerciseName}>
            {exercise ? t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name}) : ''}
          </Text>
          {exercise?.category === 'bodyweight' ? (
            <Text style={styles.hint}>{t('workingWeight.bodyweight')}</Text>
          ) : (
            <>
              <Text style={styles.hint}>
                {value === undefined
                  ? t('workingWeight.noHistory')
                  : t('workingWeight.current', {weight: value})}
              </Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <Button
                text={t('common.save')}
                loading={updateWorkingWeight.isPending}
                disabled={updateWorkingWeight.isPending || !weight.trim()}
                onPress={() => {
                  const valueNumber = Number(weight.replace(',', '.'));
                  if (Number.isFinite(valueNumber) && valueNumber >= 0) save(valueNumber);
                }}
              />
              <Pressable disabled={updateWorkingWeight.isPending} onPress={() => save(undefined)}>
                <Text style={styles.reset}>{t('workingWeight.useHistory')}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: '#0009',
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  close: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.sm,
    zIndex: 1,
    padding: spacing.xs,
  },
  closeText: {color: colors.textMuted, fontSize: 24},
  title: {color: colors.text, fontSize: 20, fontWeight: '700'},
  exerciseName: {color: colors.text, fontSize: 16},
  hint: {color: colors.textMuted, fontSize: 14},
  input: {
    backgroundColor: colors.surfaceElevated,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: 18,
  },
  reset: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
