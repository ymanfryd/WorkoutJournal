import {storage} from '@/storage/mmkv';
import {delay} from '@/utils/delay';

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type WorkoutExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
};

export type Workout = {
  id: string;
  date: number;
  exercises: WorkoutExercise[];
  isActive: boolean;
  duration?: number;
};

const KEY = 'workouts';
const DEFAULT_WORKOUTS: Workout[] = Array.from({length: 10}, (_, i) => ({
  id: (i + 1).toString(),
  date: Date.now() - i * 24 * 60 * 60 * 1000,
  exercises: [],
  isActive: false,
}));

function readAll(): Workout[] {
  const raw = storage.getString(KEY);
  if (!raw) {
    writeAll(DEFAULT_WORKOUTS);
    return DEFAULT_WORKOUTS;
  }
  return JSON.parse(raw);
}

function writeAll(workouts: Workout[]) {
  storage.set(KEY, JSON.stringify(workouts));
}

export async function getWorkouts(): Promise<Workout[]> {
  await delay(800);
  return readAll();
}

export async function createWorkout(): Promise<Workout> {
  await delay(500);
  const workouts = readAll();
  if (workouts.some(w => w.isActive)) {
    throw new Error('Workout already active');
  }
  const workout: Workout = {
    id: Date.now().toString(),
    date: Date.now(),
    exercises: [],
    isActive: true,
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

export async function addExerciseToActiveWorkout(
  exerciseId: string,
): Promise<void> {
  await delay(200);
  const workouts = readAll();
  const active = workouts.find(w => w.isActive);
  if (!active) throw new Error('No active workout');

  const newExercise: WorkoutExercise = {
    id: Date.now().toString(),
    exerciseId,
    sets: [],
  };
  active.exercises.push(newExercise);

  writeAll(workouts);
}

export function getActiveWorkout(): Workout | null {
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  return activeWorkout ?? null;
}

export async function addSetToExercise(exerciseId: string) {
  await delay(150);
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  const exercise = activeWorkout?.exercises.find(we => we.id === exerciseId);
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  const newSet: WorkoutSet = {
    id: Date.now().toString(),
    reps: 0,
    weight: 0,
    completed: false,
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

export async function finishActiveWorkout() {
  await delay(150);
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  if (!activeWorkout) throw new Error('No active workout');
  activeWorkout.duration = Date.now() - activeWorkout.date;
  activeWorkout.isActive = false;
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
