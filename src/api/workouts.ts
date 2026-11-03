import {storage} from '@/storage/mmkv';
import {delay} from '@/utils/delay';
import type {MuscleId} from '@/data/muscles';
import {increaseExerciseWorkingWeights} from '@/api/exercises';

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  targetReps?: number;
  targetWeight?: number;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type WorkoutMuscleSummary = {
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
};

export type Workout = {
  id: string;
  date: number;
  exercises: WorkoutExercise[];
  isActive: boolean;
  duration?: number;
  muscleSummary?: WorkoutMuscleSummary;
  planId?: string;
  completionTracking?: boolean;
};

const KEY = 'workouts';
const DEFAULT_WORKOUTS: Workout[] = [];

function readAll(): Workout[] {
  const raw = storage.getString(KEY);
  if (!raw) {
    writeAll(DEFAULT_WORKOUTS);
    return DEFAULT_WORKOUTS;
  }
  const workouts = JSON.parse(raw) as Workout[];
  let migrated = false;
  for (const workout of workouts) {
    if (workout.completionTracking !== undefined) continue;
    workout.completionTracking = true;
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) set.completed = !workout.isActive;
    }
    migrated = true;
  }
  if (migrated) writeAll(workouts);
  return workouts;
}

function writeAll(workouts: Workout[]) {
  storage.set(KEY, JSON.stringify(workouts));
}

export async function getWorkouts(): Promise<Workout[]> {
  await delay(800);
  return readAll();
}

export async function createWorkout(plan?: {
  id: string;
  exercises: Array<{
    exerciseId: string;
    sets: Array<{reps: number; weight: number}>;
  }>;
}): Promise<Workout> {
  await delay(500);
  const workouts = readAll();
  if (workouts.some(w => w.isActive)) {
    throw new Error('Workout already active');
  }
  const workout: Workout = {
    id: Date.now().toString(),
    date: Date.now(),
    exercises: plan?.exercises.map((exercise, exerciseIndex) => ({
      id: `${Date.now()}-${exerciseIndex}-${Math.random().toString(36).slice(2, 6)}`,
      exerciseId: exercise.exerciseId,
      sets: exercise.sets.map((set, setIndex) => ({
        id: `${Date.now()}-${exerciseIndex}-${setIndex}-${Math.random().toString(36).slice(2, 6)}`,
        reps: set.reps,
        weight: set.weight,
        targetReps: set.reps,
        targetWeight: set.weight,
        completed: false,
      })),
    })) ?? [],
    isActive: true,
    completionTracking: true,
    planId: plan?.id,
  };
  workouts.unshift(workout);
  writeAll(workouts);
  return workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  await delay(500);
  const workouts = readAll();
  const before = workouts.length;
  const updated = workouts.filter(w => w.id !== id);
  if (updated.length === before) {
    throw new Error('Workout not found');
  }
  writeAll(updated);
}

export async function addExerciseToActiveWorkout(input: {
  exerciseId: string;
  workingWeight?: number;
}): Promise<void> {
  await delay(200);
  const workouts = readAll();
  const active = workouts.find(w => w.isActive);
  if (!active) throw new Error('No active workout');

  const newExercise: WorkoutExercise = {
    id: Date.now().toString(),
    exerciseId: input.exerciseId,
    sets: [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        reps: 8,
        weight: input.workingWeight ?? 0,
        completed: false,
      },
    ],
  };
  active.exercises.push(newExercise);

  writeAll(workouts);
}

export function getActiveWorkout(): Workout | null {
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  return activeWorkout ?? null;
}

export async function getWorkoutById(id: string): Promise<Workout | null> {
  await delay(300);
  const workouts = readAll();
  const workout = workouts.find(w => w.id === id);
  return workout ?? null;
}

export async function addSetToExercise(exerciseId: string) {
  await delay(150);
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  const exercise = activeWorkout?.exercises.find(we => we.id === exerciseId);
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  const previousSet = exercise.sets[exercise.sets.length - 1];

  const newSet: WorkoutSet = {
    id: Date.now().toString(),
    reps: previousSet?.reps || 0,
    weight: previousSet?.weight || 0,
    completed: false,
    targetReps: previousSet?.reps,
    targetWeight: previousSet?.weight,
  };
  exercise.sets.push(newSet);
  writeAll(workouts);
}

export async function updateSet(input: {
  workoutExerciseId: string;
  setId: string;
  patch: Partial<WorkoutSet>;
}) {
  await delay(150);
  const {workoutExerciseId, setId, patch} = input;
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  const exercise = activeWorkout?.exercises.find(
    we => we.id === workoutExerciseId,
  );
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  const set = exercise.sets.find(s => s.id === setId);
  if (!set) {
    throw new Error('Set not found');
  }
  Object.assign(set, patch);
  writeAll(workouts);
}

export async function deleteSet(input: {
  workoutExerciseId: string;
  setId: string;
}) {
  await delay(150);
  const {workoutExerciseId, setId} = input;
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  const exercise = activeWorkout?.exercises.find(
    we => we.id === workoutExerciseId,
  );
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  const set = exercise.sets.find(s => s.id === setId);
  if (!set) {
    throw new Error('Set not found');
  }
  exercise.sets = exercise.sets.filter(s => s.id !== setId);
  writeAll(workouts);
}

export async function finishActiveWorkout(muscleSummary?: WorkoutMuscleSummary) {
  await delay(150);
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  if (!activeWorkout) throw new Error('No active workout');
  const previousHistory = workouts.filter(workout => !workout.isActive);
  activeWorkout.duration = Date.now() - activeWorkout.date;
  if (muscleSummary) {
    activeWorkout.muscleSummary = muscleSummary;
  }
  activeWorkout.isActive = false;
  increaseExerciseWorkingWeights(
    activeWorkout.exercises.flatMap(exercise => {
      const completedWeights = exercise.sets
        .filter(set => set.completed && set.weight > 0)
        .map(set => set.weight);
      return completedWeights.length
        ? [{exerciseId: exercise.exerciseId, weight: Math.max(...completedWeights)}]
        : [];
    }),
    previousHistory,
  );
  writeAll(workouts);
}

export async function deleteExerciseFromActiveWorkout(
  workoutExerciseId: string,
) {
  await delay(150);
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  if (!activeWorkout) throw new Error('No active workout');
  const exercise = activeWorkout.exercises.find(
    we => we.id === workoutExerciseId,
  );
  if (!exercise) throw new Error('Exercise not found');
  activeWorkout.exercises = activeWorkout.exercises.filter(
    we => we.id !== workoutExerciseId,
  );
  writeAll(workouts);
}

export async function deleteEmptyActiveWorkout(): Promise<void> {
  await delay(150);
  const workouts = readAll();
  const filtered = workouts.filter(w => !w.isActive);
  writeAll(filtered);
}
