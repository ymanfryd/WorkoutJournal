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

  const canSave = name.trim().length > 0 && !isPending;

  function onSave() {
    mutate(
      {name: name.trim(), category, muscleGroup},
      {onSuccess: () => navigation.goBack()},
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.title}>New exercise</Text>
        <View style={styles.w50} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Incline Dumbbell Press"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(c => (
              <Chip
                key={c}
                label={c}
                active={category === c}
                onPress={() => setCategory(c)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Muscle Group</Text>
          <View style={styles.chipRow}>
            {MUSCLE_GROUPS.map(m => (
              <Chip
                key={m}
                label={m}
                active={muscleGroup === m}
                onPress={() => setMuscleGroup(m)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button text="Save" onPress={onSave} disabled={!canSave} />
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
    width: 50,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
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
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.md,
  },
  w50: {width: 50},
});
