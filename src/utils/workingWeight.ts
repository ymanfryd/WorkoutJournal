import type {Exercise} from '@/api/exercises';
import type {Workout} from '@/api/workouts';

/** Stored working weight wins; otherwise use the latest completed workout entry. */
export function getWorkingWeight(
  exercise: Pick<Exercise, 'id' | 'workingWeight'>,
  workouts: Workout[],
): number | undefined {
  if (exercise.workingWeight != null && exercise.workingWeight >= 0) {
    return exercise.workingWeight;
  }

  const latestWorkout = [...workouts]
    .filter(workout => !workout.isActive)
    .sort((left, right) => right.date - left.date)
    .find(workout =>
      workout.exercises.some(entry =>
        entry.exerciseId === exercise.id &&
        entry.sets.some(set => set.completed && set.weight > 0),
      ),
    );
  if (!latestWorkout) return undefined;

  const weights = latestWorkout.exercises
    .filter(entry => entry.exerciseId === exercise.id)
    .flatMap(entry => entry.sets)
    .filter(set => set.completed && set.weight > 0)
    .map(set => set.weight);
  return weights.length ? Math.max(...weights) : undefined;
}
