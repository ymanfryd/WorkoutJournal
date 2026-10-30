import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Button from '@/ui/Button';
import {colors, radius, spacing} from '@/theme';
import {useCreateExercise} from '@/hooks/useCreateExercise';
import type {ExerciseCategory, MuscleGroup} from '@/api/exercises';
import {MUSCLES, type MuscleId} from '@/data/muscles';
import {useTranslation} from 'react-i18next';

const CATEGORIES: ExerciseCategory[] = [
  'barbell',
  'dumbbell',
  'machine',
  'bodyweight',
  'cable',
];
const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'shoulders',
  'legs',
  'arms',
  'core',
];

function EditExerciseScreen() {
  const navigation = useNavigation();
  const {mutate, isPending} = useCreateExercise();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('barbell');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest');
  const [primaryMuscles, setPrimaryMuscles] = useState<MuscleId[]>([]);
  const [secondaryMuscles, setSecondaryMuscles] = useState<MuscleId[]>([]);
  const {t} = useTranslation();
  const groupMuscles = MUSCLES.filter(muscle => muscle.group === muscleGroup);

  function onMuscleGroupChange(group: MuscleGroup) {
    setMuscleGroup(group);
    const allowedIds = new Set(
      MUSCLES.filter(muscle => muscle.group === group).map(muscle => muscle.id),
    );
    setPrimaryMuscles(current => current.filter(id => allowedIds.has(id)));
    setSecondaryMuscles(current => current.filter(id => allowedIds.has(id)));
  }

  const canSave = name.trim().length > 0 && !isPending;

  function onSave() {
    mutate(
      {
        name: name.trim(),
        category,
        muscleGroup,
        primaryMuscles,
        secondaryMuscles,
      },
      {onSuccess: () => navigation.goBack()},
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.close} numberOfLines={1}>
            {t('common.close')}
          </Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {t('editExercise.title')}
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.name')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('editExercise.namePlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.category')}</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(c => (
              <Chip
                key={c}
                label={t(`categories.${c}`)}
                active={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.muscleGroup')}</Text>
          <View style={styles.chipRow}>
            {MUSCLE_GROUPS.map(m => (
              <Chip
                key={m}
                label={t(`muscleGroups.${m}`)}
                active={muscleGroup === m}
                onPress={() => onMuscleGroupChange(m)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.primaryMuscles')}</Text>
          <View style={styles.chipRow}>
            {groupMuscles.map(muscle => (
              <Chip
                key={muscle.id}
                label={t(`muscleNames.${muscle.id}`)}
                active={primaryMuscles.includes(muscle.id)}
                onPress={() => {
                  setPrimaryMuscles(current =>
                    current.includes(muscle.id)
                      ? current.filter(id => id !== muscle.id)
                      : [...current, muscle.id],
                  );
                  setSecondaryMuscles(current =>
                    current.filter(id => id !== muscle.id),
                  );
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.secondaryMuscles')}</Text>
          <View style={styles.chipRow}>
            {groupMuscles.map(muscle => (
              <Chip
                key={muscle.id}
                label={t(`muscleNames.${muscle.id}`)}
                active={secondaryMuscles.includes(muscle.id)}
                onPress={() => {
                  setSecondaryMuscles(current =>
                    current.includes(muscle.id)
                      ? current.filter(id => id !== muscle.id)
                      : [...current, muscle.id],
                  );
                  setPrimaryMuscles(current =>
                    current.filter(id => id !== muscle.id),
                  );
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button text={t('common.save')} onPress={onSave} disabled={!canSave} />
      </View>
    </SafeAreaView>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default EditExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  close: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  headerRightSpacer: {
    width: 60,
  },
  form: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: 16,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  chipTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
  },
});
