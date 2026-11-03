import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Button from '@/ui/Button';
import {colors, radius, spacing} from '@/theme';
import {useCreateExercise} from '@/hooks/useCreateExercise';
import {useUpdateExercise} from '@/hooks/useUpdateExercise';
import {useExerciseById} from '@/hooks/useExerciseById';
import type {ExerciseCategory, MuscleGroup} from '@/api/exercises';
import {MUSCLES, type MuscleId} from '@/data/muscles';
import {useTranslation} from 'react-i18next';
import {useWorkouts} from '@/hooks/useWorkouts';
import {getWorkingWeight} from '@/utils/workingWeight';

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
  const route = useRoute();
  const exerciseId = (route.params as {id?: string} | undefined)?.id;
  const existingExercise = useExerciseById(exerciseId);
  const createExercise = useCreateExercise();
  const updateExercise = useUpdateExercise();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ExerciseCategory>('barbell');
  const [musclePickerGroup, setMusclePickerGroup] =
    useState<MuscleGroup>('chest');
  const [muscleSelection, setMuscleSelection] = useState<{
    primary: MuscleId[];
    secondary: MuscleId[];
  }>({primary: [], secondary: []});
  const [workingWeight, setWorkingWeight] = useState('');
  const workingWeightEdited = useRef(false);
  const {data: workouts = []} = useWorkouts();
  const hydratedExerciseId = useRef<string | null>(null);
  const {t} = useTranslation();
  const isPending = createExercise.isPending || updateExercise.isPending;

  useEffect(() => {
    const exercise = existingExercise.data;
    if (!exercise || hydratedExerciseId.current === exercise.id) return;
    const primaryGroup = MUSCLES.find(
      muscle => muscle.id === exercise.primaryMuscles[0],
    )?.group;
    const primary = primaryGroup
      ? exercise.primaryMuscles.filter(
          id => MUSCLES.find(muscle => muscle.id === id)?.group === primaryGroup,
        )
      : [];
    const movedToSecondary = primaryGroup
      ? exercise.primaryMuscles.filter(
          id => MUSCLES.find(muscle => muscle.id === id)?.group !== primaryGroup,
        )
      : [];
    setName(exercise.name);
    setCategory(exercise.category);
    setMusclePickerGroup(primaryGroup ?? exercise.muscleGroup);
    setMuscleSelection({
      primary,
      secondary: Array.from(
        new Set([...exercise.secondaryMuscles, ...movedToSecondary]),
      ).filter(id => !primary.includes(id)),
    });
    hydratedExerciseId.current = exercise.id;
  }, [existingExercise.data]);

  useEffect(() => {
    const exercise = existingExercise.data;
    if (!exercise || workingWeightEdited.current) return;
    setWorkingWeight(
      (exercise.workingWeight ?? getWorkingWeight(exercise, workouts))?.toString() ?? '',
    );
  }, [existingExercise.data, workouts]);

  function onMuscleGroupChange(group: MuscleGroup) {
    setMusclePickerGroup(group);
  }

  function renderMuscleChoices(
    selected: MuscleId[],
    onToggle: (id: MuscleId) => void,
    activeColor: string,
  ) {
    return (
      <View style={styles.chipRow}>
        {MUSCLES.filter(muscle => muscle.group === musclePickerGroup).map(
          muscle => (
            <Chip
              key={muscle.id}
              label={t(`muscleNames.${muscle.id}`)}
              active={selected.includes(muscle.id)}
              activeColor={activeColor}
              onPress={() => onToggle(muscle.id)}
            />
          ),
        )}
      </View>
    );
  }

  function togglePrimaryMuscle(id: MuscleId) {
    setMuscleSelection(current => {
      const muscleGroupForId = MUSCLES.find(muscle => muscle.id === id)?.group;
      const currentPrimaryGroup = MUSCLES.find(
        muscle => muscle.id === current.primary[0],
      )?.group;
      const selectingNewGroup =
        current.primary.length > 0 && currentPrimaryGroup !== muscleGroupForId;

      if (current.primary.includes(id)) {
        return {
          ...current,
          primary: current.primary.filter(muscleId => muscleId !== id),
        };
      }

      return {
        primary: selectingNewGroup ? [id] : [...current.primary, id],
        secondary: Array.from(
          new Set([
            ...current.secondary,
            ...(selectingNewGroup ? current.primary : []),
          ]),
        ).filter(muscleId => muscleId !== id),
      };
    });
  }

  const parsedWorkingWeight =
    workingWeight.trim() === '' ? undefined : Number(workingWeight.replace(',', '.'));
  const canSave =
    name.trim().length > 0 &&
    !isPending &&
    (parsedWorkingWeight === undefined ||
      (Number.isFinite(parsedWorkingWeight) && parsedWorkingWeight >= 0));

  function onSave() {
    const exercise = {
      name: name.trim(),
      category,
      muscleGroup:
        MUSCLES.find(muscle => muscle.id === muscleSelection.primary[0])?.group ??
        musclePickerGroup,
      primaryMuscles: muscleSelection.primary,
      secondaryMuscles: muscleSelection.secondary,
      workingWeight: category === 'bodyweight' ? undefined : parsedWorkingWeight,
    };
    const callbacks = {onSuccess: () => navigation.goBack()};
    if (exerciseId) {
      updateExercise.mutate({id: exerciseId, exercise}, callbacks);
    } else {
      createExercise.mutate(exercise, callbacks);
    }
  }

  if (exerciseId && (existingExercise.isLoading || !existingExercise.data)) {
    return (
      <SafeAreaView style={[styles.container, styles.loading]}>
        {existingExercise.isError ? (
          <Text style={styles.errorText}>{t('editExercise.loadError')}</Text>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.close}>{t('common.close')}</Text>
        </Pressable>
      </SafeAreaView>
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
          {t(exerciseId ? 'editExercise.editTitle' : 'editExercise.title')}
        </Text>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        {(createExercise.isError || updateExercise.isError) && (
          <Text style={styles.errorText}>{t('editExercise.saveError')}</Text>
        )}
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

        {category !== 'bodyweight' && (
          <View style={styles.field}>
            <Text style={styles.label}>{t('workingWeight.title')}</Text>
            <TextInput
              value={workingWeight}
              onChangeText={value => {
                workingWeightEdited.current = true;
                setWorkingWeight(value);
              }}
              placeholder={t('workingWeight.fromHistory')}
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.musclePickerGroup')}</Text>
          <View style={styles.chipRow}>
            {MUSCLE_GROUPS.map(m => (
              <Chip
                key={m}
                label={t(`muscleGroups.${m}`)}
                active={musclePickerGroup === m}
                onPress={() => onMuscleGroupChange(m)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.primaryMuscles')}</Text>
          {renderMuscleChoices(
            muscleSelection.primary,
            togglePrimaryMuscle,
            colors.musclePrimary,
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('editExercise.secondaryMuscles')}</Text>
          {renderMuscleChoices(
            muscleSelection.secondary,
            id => {
              setMuscleSelection(current => ({
                primary: current.primary.filter(muscleId => muscleId !== id),
                secondary: current.secondary.includes(id)
                  ? current.secondary.filter(muscleId => muscleId !== id)
                  : [...current.secondary, id],
              }));
            },
            colors.muscleSecondary,
          )}
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
  activeColor,
  onPress,
}: {
  label: string;
  active: boolean;
  activeColor?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active &&
          (activeColor ? {backgroundColor: activeColor} : styles.chipActive),
      ]}>
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
          active && activeColor && styles.muscleChipTextActive,
        ]}>
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
  muscleChipTextActive: {
    color: colors.background,
  },
  footer: {
    padding: spacing.md,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
  },
});
