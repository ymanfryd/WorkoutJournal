import {storage} from '@/storage/mmkv';
import {delay} from '@/utils/delay';

export type ExerciseCategory =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'bodyweight'
  | 'cable';
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core';

export type Exercise = {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
};

const KEY = 'exercises';

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'preset-1',
    name: 'Bench Press',
    category: 'barbell',
    muscleGroup: 'chest',
    isCustom: false,
  },
  {
    id: 'preset-2',
    name: 'Squat',
    category: 'barbell',
    muscleGroup: 'legs',
    isCustom: false,
  },
  {
    id: 'preset-3',
    name: 'Deadlift',
    category: 'barbell',
    muscleGroup: 'back',
    isCustom: false,
  },
  {
    id: 'preset-4',
    name: 'Overhead Press',
    category: 'barbell',
    muscleGroup: 'shoulders',
    isCustom: false,
  },
  {
    id: 'preset-5',
    name: 'Barbell Row',
    category: 'barbell',
    muscleGroup: 'back',
    isCustom: false,
  },
  {
    id: 'preset-6',
    name: 'Pull-up',
    category: 'bodyweight',
    muscleGroup: 'back',
    isCustom: false,
  },
  {
    id: 'preset-7',
    name: 'Dip',
    category: 'bodyweight',
    muscleGroup: 'chest',
    isCustom: false,
  },
  {
    id: 'preset-8',
    name: 'Dumbbell Curl',
    category: 'dumbbell',
    muscleGroup: 'arms',
    isCustom: false,
  },
  {
    id: 'preset-9',
    name: 'Tricep Extension',
    category: 'cable',
    muscleGroup: 'arms',
    isCustom: false,
  },
  {
    id: 'preset-10',
    name: 'Plank',
    category: 'bodyweight',
    muscleGroup: 'core',
    isCustom: false,
  },
];

function readAll(): Exercise[] {
  const raw = storage.getString(KEY);
  if (!raw) {
    writeAll(DEFAULT_EXERCISES);
    return [...DEFAULT_EXERCISES];
  }
  return JSON.parse(raw);
}

function writeAll(exercises: Exercise[]) {
  storage.set(KEY, JSON.stringify(exercises));
}

export async function getExercises(): Promise<Exercise[]> {
  await delay(300);
  return readAll();
}
