import {ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ScreenLayout from '@/ui/ScreenLayout';
import Button from '@/ui/Button';
import {colors, radius, spacing} from '@/theme';
import {useWorkoutPlans} from '@/hooks/useWorkoutPlans';
import {useDeleteWorkoutPlan} from '@/hooks/useDeleteWorkoutPlan';
import {useCreateWorkout} from '@/hooks/useCreateWorkout';
import {useExercises} from '@/hooks/useExercises';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

export default function WorkoutPlansScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<{
    EditWorkoutPlan: {id?: string} | undefined;
  }>>();
  const {t} = useTranslation();
  const {data: plans = [], isLoading} = useWorkoutPlans();
  const {data: exercises = []} = useExercises();
  const deletePlan = useDeleteWorkoutPlan();
  const startWorkout = useCreateWorkout();

  function confirmDelete(id: string) {
    Alert.alert(t('workoutPlans.deleteTitle'), t('workoutPlans.deleteBody'), [
      {text: t('common.close'), style: 'cancel'},
      {text: t('common.delete'), style: 'destructive', onPress: () => deletePlan.mutate(id)},
    ]);
  }

  return (
    <ScreenLayout
      title={t('workoutPlans.title')}
      rightSlot={
        <Pressable accessibilityRole="button" accessibilityLabel={t('common.close')} onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.close}>×</Text>
        </Pressable>
      }>
      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.centered}><ActivityIndicator color={colors.primary} /></View>
        ) : plans.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.empty}>{t('workoutPlans.empty')}</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {plans.map(plan => (
              <View key={plan.id} style={styles.card}>
                <Pressable onPress={() => navigation.navigate('EditWorkoutPlan', {id: plan.id})}>
                  <Text style={styles.name}>{plan.name}</Text>
                  <Text style={styles.meta}>{t('workoutPlans.exerciseCount', {count: plan.exercises.length})}</Text>
                  <View style={styles.exerciseList}>
                    {plan.exercises.slice(0, 4).map(entry => {
                      const exercise = exercises.find(item => item.id === entry.exerciseId);
                      return exercise ? <Text key={entry.id} style={styles.exerciseName}>{t(`exerciseNames.${exercise.id}`, {defaultValue: exercise.name})}</Text> : null;
                    })}
                    {plan.exercises.length > 4 && <Text style={styles.meta}>+{plan.exercises.length - 4}</Text>}
                  </View>
                </Pressable>
                <View style={styles.actions}>
                  <Button text={t('workoutPlans.start')} loading={startWorkout.isPending} disabled={startWorkout.isPending || plan.exercises.length === 0} onPress={() => startWorkout.mutate(plan, {onSuccess: () => navigation.goBack()})} />
                  <Pressable onPress={() => confirmDelete(plan.id)}><Text style={styles.delete}>{t('common.delete')}</Text></Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
        <View style={styles.footer}>
          <Button text={t('workoutPlans.create')} onPress={() => navigation.navigate('EditWorkoutPlan')} />
        </View>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg, gap: spacing.md},
  body: {flex: 1},
  footer: {padding: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border},
  empty: {color: colors.textMuted, fontSize: 16, textAlign: 'center'},
  closeButton: {paddingHorizontal: spacing.sm, paddingVertical: spacing.xs},
  close: {color: colors.primary, fontSize: 30, lineHeight: 32},
  list: {padding: spacing.md, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, gap: spacing.md},
  name: {color: colors.text, fontSize: 18, fontWeight: '700'},
  meta: {color: colors.textMuted, fontSize: 13, marginTop: spacing.xs},
  exerciseList: {gap: spacing.xs, marginTop: spacing.sm},
  exerciseName: {color: colors.textMuted, fontSize: 14},
  actions: {gap: spacing.sm, alignItems: 'center'},
  delete: {color: colors.danger, padding: spacing.sm},
});
