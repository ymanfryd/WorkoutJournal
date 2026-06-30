import {storage} from '@/storage/mmkv';

export type Workout = {id: string; date: number; exercises: number};

const KEY = 'workouts';
const DEFAULT_WORKOUTS: Workout[] = [
  {id: '5', date: Date.now(), exercises: 15},
  {id: '4', date: Date.now() - 1 * 24 * 60 * 60 * 1000, exercises: 6},
  {id: '3', date: Date.now() - 3 * 24 * 60 * 60 * 1000, exercises: 8},
  {id: '2', date: Date.now() - 7 * 24 * 60 * 60 * 1000, exercises: 5},
  {id: '1', date: Date.now() - 14 * 24 * 60 * 60 * 1000, exercises: 3},
];

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
  await new Promise(r => setTimeout(r, 800));

  return readAll();
}

export async function createWorkout(input: {
  exercises: number;
}): Promise<Workout> {
  await new Promise(r => setTimeout(r, 500));
  const workouts = readAll();
  const workout: Workout = {
    id: Date.now().toString(),
    date: Date.now(),
    exercises: input.exercises,
  };
  workouts.unshift(workout);
  writeAll(workouts);
  return workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 500));
  const workouts = readAll();
  const before = workouts.length;
  const updated = workouts.filter(w => w.id !== id);
  if (updated.length === before) {
    throw new Error('Workout not found');
  }
  writeAll(updated);
}
