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
const DEFAULT_WORKOUTS: Workout[] = Array.from({length: 500}, (_, i) => ({
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

export async function addExerciseToActiveWorkout(exercise: WorkoutExercise) {
  await delay(200);
  const activeWorkout = getActiveWorkout();
  if (!activeWorkout) {
    throw new Error('No active workout');
  }
  const filtered = readAll().filter(workout => workout !== activeWorkout);
  activeWorkout.exercises.push(exercise);
  writeAll([activeWorkout, ...filtered]);
}

export function getActiveWorkout(): Workout | null {
  const workouts = readAll();
  const activeWorkout = workouts.find(workout => workout.isActive);
  return activeWorkout ?? null;
}
