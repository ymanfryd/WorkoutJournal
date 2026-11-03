import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import type {Exercise} from '@/api/exercises';
import type {WorkoutPlanExercise, WorkoutPlanSet} from '@/api/workoutPlans';
import {useExercises} from '@/hooks/useExercises';
import {useWorkouts} from '@/hooks/useWorkouts';
import {useWorkoutPlans} from '@/hooks/useWorkoutPlans';
import {useCreateWorkoutPlan} from '@/hooks/useCreateWorkoutPlan';
import {useUpdateWorkoutPlan} from '@/hooks/useUpdateWorkoutPlan';
import {getWorkingWeight} from '@/utils/workingWeight';
import {colors, radius, spacing} from '@/theme';
import Button from '@/ui/Button';
import {useScrollInputIntoView} from '@/hooks/useScrollInputIntoView';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function PlanWeightInput({
  value,
  onValueChange,
  focusInput,
  placeholder,
}: {
  value: number;
  onValueChange: (value: number) => void;
  focusInput: (input: TextInput | null) => void;
  placeholder: string;
}) {
  const inputRef = useRef<TextInput | null>(null);
  const isFocused = useRef(false);
  const [text, setText] = useState(value > 0 ? String(value) : '');

  useEffect(() => {
    if (!isFocused.current) setText(value > 0 ? String(value) : '');
  }, [value]);

  function commitText() {
    isFocused.current = false;
    const parsed = Number(text.replace(',', '.'));
    const nextValue = text.trim() && Number.isFinite(parsed) ? parsed : 0;
    onValueChange(nextValue);
    setText(nextValue > 0 ? String(nextValue) : '');
  }

  return (
    <TextInput
      ref={inputRef}
      value={text}
      onFocus={() => {
        isFocused.current = true;
        setText('');
        onValueChange(0);
        focusInput(inputRef.current);
      }}
      onChangeText={nextText => {
        setText(nextText);
        const parsed = Number(nextText.replace(',', '.'));
        onValueChange(Number.isFinite(parsed) ? parsed : 0);
      }}
      onEndEditing={commitText}
      onBlur={() => focusInput(null)}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      keyboardType="decimal-pad"
      style={styles.setInput}
    />
  );
}

export default function EditWorkoutPlanScreen() {
  const route = useRoute();
  const planId = (route.params as {id?: string} | undefined)?.id;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {data: plans = []} = useWorkoutPlans();
  const {data: exercises = []} = useExercises();
  const {data: workouts = []} = useWorkouts();
  const createPlan = useCreateWorkoutPlan();
  const updatePlan = useUpdateWorkoutPlan();
  const [name, setName] = useState('');
  const [planExercises, setPlanExercises] = useState<WorkoutPlanExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');
  const hydratedPlanId = useRef<string | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const inputRefs = useRef(new Map<string, TextInput>());
  const {focusInput, handleScroll} = useScrollInputIntoView(scrollRef);
  const isPending = createPlan.isPending || updatePlan.isPending;
  const hasValidSets = planExercises.every(entry =>
    entry.sets.length > 0 && entry.sets.every(set =>
      Number.isFinite(set.reps) && set.reps > 0 &&
      Number.isFinite(set.weight) && set.weight >= 0,
    ),
  );
  const selectedPlan = plans.find(plan => plan.id === planId);

  useEffect(() => {
    if (!selectedPlan || hydratedPlanId.current === selectedPlan.id) return;
    setName(selectedPlan.name);
    setPlanExercises(selectedPlan.exercises);
    hydratedPlanId.current = selectedPlan.id;
  }, [selectedPlan]);

  function addExercise(exercise: Exercise) {
    const workingWeight = getWorkingWeight(exercise, workouts) ?? 0;
    const sets: WorkoutPlanSet[] = Array.from({length: 3}, () => ({id: makeId(), reps: 8, weight: workingWeight}));
    setPlanExercises(current => [...current, {id: makeId(), exerciseId: exercise.id, sets}]);
    setShowPicker(false);
    setSearch('');
  }

  function updateSet(exerciseEntryId: string, setId: string, patch: Partial<WorkoutPlanSet>) {
    setPlanExercises(current => current.map(entry => entry.id === exerciseEntryId
      ? {...entry, sets: entry.sets.map(set => set.id === setId ? {...set, ...patch} : set)}
      : entry));
  }

  const filteredExercises = exercises.filter(exercise => {
    const label = t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name}).toLowerCase();
    return label.includes(search.trim().toLowerCase());
  });

  function save() {
    if (!name.trim() || planExercises.length === 0 || !hasValidSets) return;
    const input = {name: name.trim(), exercises: planExercises};
    if (planId) updatePlan.mutate({id: planId, input}, {onSuccess: () => navigation.goBack()});
    else createPlan.mutate(input, {onSuccess: () => navigation.goBack()});
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardArea} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()}><Text style={styles.close}>{t('common.close')}</Text></Pressable>
          <Text style={styles.title}>{t(planId ? 'workoutPlans.editTitle' : 'workoutPlans.createTitle')}</Text>
          <Pressable onPress={save} disabled={isPending || !name.trim() || planExercises.length === 0 || !hasValidSets}>
            <Text style={[styles.save, (isPending || !name.trim() || planExercises.length === 0 || !hasValidSets) && styles.saveDisabled]}>{t('common.save')}</Text>
          </Pressable>
        </View>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'} onScroll={handleScroll} scrollEventThrottle={16}>
        {(createPlan.isError || updatePlan.isError) && <Text style={styles.error}>{t('workoutPlans.saveError')}</Text>}
        <Text style={styles.label}>{t('workoutPlans.name')}</Text>
        <TextInput value={name} onChangeText={setName} style={styles.nameInput} placeholder={t('workoutPlans.namePlaceholder')} placeholderTextColor={colors.textMuted} />
        {planExercises.map((entry, index) => {
          const exercise = exercises.find(item => item.id === entry.exerciseId);
          if (!exercise) return null;
          return (
            <View key={entry.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseTitleWrap}>
                  <Text style={styles.exerciseTitle}>{index + 1}. {t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name})}</Text>
                  <Text style={styles.exerciseMeta}>{t(`muscleGroups.${exercise.muscleGroup}`)}</Text>
                </View>
                <Pressable onPress={() => setPlanExercises(current => current.filter(item => item.id !== entry.id))}>
                  <Text style={styles.remove}>{t('common.delete')}</Text>
                </Pressable>
              </View>
              <View style={styles.setLabels}>
                <Text style={styles.setLabel}>{t('workoutPlans.setNumber')}</Text>
                {exercise.category !== 'bodyweight' && <Text style={styles.setLabel}>{t('workout.weight')}</Text>}
                <Text style={styles.setLabel}>{t('workout.reps')}</Text>
                <View style={styles.removeSpacer} />
              </View>
              {entry.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  {exercise.category !== 'bodyweight' && (
                    <PlanWeightInput
                      value={set.weight}
                      onValueChange={weight => updateSet(entry.id, set.id, {weight})}
                      focusInput={focusInput}
                      placeholder={t('workout.weight')}
                  />
                  )}
                  <TextInput
                    ref={input => {
                      const key = `${entry.id}:${set.id}:reps`;
                      if (input) inputRefs.current.set(key, input);
                      else inputRefs.current.delete(key);
                    }}
                    value={set.reps > 0 ? String(set.reps) : ''}
                    onFocus={() => {
                      updateSet(entry.id, set.id, {reps: 0});
                      focusInput(inputRefs.current.get(`${entry.id}:${set.id}:reps`) ?? null);
                    }}
                    onChangeText={value => updateSet(entry.id, set.id, {reps: Number(value) || 0})}
                    onBlur={() => focusInput(null)}
                    placeholder={t('workout.reps')}
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                    style={styles.setInput}
                  />
                  <Pressable onPress={() => setPlanExercises(current => current.map(item => item.id === entry.id ? {...item, sets: item.sets.filter(target => target.id !== set.id)} : item))}>
                    <Text style={styles.remove}>×</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable onPress={() => setPlanExercises(current => current.map(item => item.id === entry.id ? {...item, sets: [...item.sets, {id: makeId(), reps: 8, weight: getWorkingWeight(exercise, workouts) ?? 0}]} : item))}>
                <Text style={styles.addSet}>{t('workout.addSet')}</Text>
              </Pressable>
            </View>
          );
        })}
        <Button text={t('workoutPlans.addExercise')} onPress={() => setShowPicker(true)} />
      </ScrollView>
      </KeyboardAvoidingView>
      <Modal visible={showPicker} animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <SafeAreaView edges={[]} style={[styles.picker, {paddingTop: insets.top}]}>
          <View style={styles.pickerHeader}>
            <Pressable onPress={() => setShowPicker(false)}><Text style={styles.close}>{t('common.close')}</Text></Pressable>
            <Text style={styles.title}>{t('workoutPlans.addExercise')}</Text>
            <View style={styles.spacer} />
          </View>
          <TextInput value={search} onChangeText={setSearch} style={styles.nameInput} placeholder={t('workoutPlans.search')} placeholderTextColor={colors.textMuted} />
          <ScrollView contentContainerStyle={styles.pickerList}>
            {filteredExercises.map(exercise => (
              <Pressable key={exercise.id} style={styles.pickerRow} onPress={() => addExercise(exercise)}>
                <Text style={styles.exerciseTitle}>{t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name})}</Text>
                <Text style={styles.exerciseMeta}>{t(`muscleGroups.${exercise.muscleGroup}`)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  keyboardArea: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm},
  pickerHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md},
  close: {color: colors.primary, fontSize: 16, fontWeight: '600'},
  title: {color: colors.text, fontSize: 16, fontWeight: '600'},
  save: {color: colors.primary, fontSize: 16, fontWeight: '600'},
  saveDisabled: {color: colors.textMuted, opacity: 0.5},
  spacer: {width: 50},
  content: {padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl},
  label: {color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1},
  nameInput: {backgroundColor: colors.surface, color: colors.text, padding: spacing.md, borderRadius: radius.md, fontSize: 16, marginHorizontal: spacing.md},
  exerciseCard: {backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm},
  exerciseHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm},
  exerciseTitleWrap: {flex: 1, gap: spacing.xs},
  exerciseTitle: {color: colors.text, fontSize: 15, fontWeight: '600'},
  exerciseMeta: {color: colors.textMuted, fontSize: 12},
  remove: {color: colors.danger, fontSize: 13, padding: spacing.xs},
  setRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  setLabels: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  setLabel: {color: colors.textMuted, fontSize: 11, flex: 1, textAlign: 'center'},
  removeSpacer: {width: 22},
  setNumber: {color: colors.textMuted, width: 22, textAlign: 'center'},
  setInput: {backgroundColor: colors.surfaceElevated, color: colors.text, padding: spacing.sm, borderRadius: radius.sm, minWidth: 72, flex: 1, textAlign: 'center'},
  addSet: {color: colors.primary, paddingVertical: spacing.sm, textAlign: 'center'},
  picker: {flex: 1, backgroundColor: colors.background},
  pickerList: {padding: spacing.md, gap: spacing.sm},
  pickerRow: {backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, gap: spacing.xs},
  error: {color: colors.danger},
});
