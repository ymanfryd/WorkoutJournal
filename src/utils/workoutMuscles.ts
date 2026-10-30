import type {Exercise} from '@/api/exercises';
import type {Workout, WorkoutMuscleSummary} from '@/api/workouts';
import type {MuscleId} from '@/data/muscles';

export function collectWorkoutMuscles(
  workout: Workout,
  exercises: Exercise[],
): WorkoutMuscleSummary {
  const primaryMuscles = new Set<MuscleId>();
  const secondaryMuscles = new Set<MuscleId>();
  const exercisesById = new Map(exercises.map(exercise => [exercise.id, exercise]));

  for (const workoutExercise of workout.exercises) {
    if (workoutExercise.sets.length === 0) continue;
    const exercise = exercisesById.get(workoutExercise.exerciseId);
    for (const muscle of exercise?.primaryMuscles ?? []) {
      primaryMuscles.add(muscle);
    }
    for (const muscle of exercise?.secondaryMuscles ?? []) {
      secondaryMuscles.add(muscle);
    }
  }

  for (const muscle of primaryMuscles) {
    secondaryMuscles.delete(muscle);
  }

  return {
    primaryMuscles: Array.from(primaryMuscles),
    secondaryMuscles: Array.from(secondaryMuscles),
  };
}
