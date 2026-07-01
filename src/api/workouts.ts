import {storage} from '@/storage/mmkv';

export type Workout = {id: string; date: number; exercises: number};

const KEY = 'workouts';
const DEFAULT_WORKOUTS: Workout[] = Array.from({length: 500}, (_, i) => ({
  id: (i + 1).toString(),
  date: Date.now() - i * 24 * 60 * 60 * 1000,
  exercises: 3 + (i % 15),
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
