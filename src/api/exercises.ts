import {storage} from '@/storage/mmkv';
import {delay} from '@/utils/delay';
import type {MuscleId} from '@/data/muscles';

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
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
  isCustom: boolean;
};

export type NewExercise = Omit<Exercise, 'id' | 'isCustom'> & {
  primaryMuscles?: MuscleId[];
  secondaryMuscles?: MuscleId[];
};

const KEY = 'exercises';

const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'preset-1',
    name: 'Bench Press',
    category: 'barbell',
    muscleGroup: 'chest',
    primaryMuscles: ['pectoralis_clavicular', 'pectoralis_sternocostal'],
    secondaryMuscles: ['deltoid_anterior', 'triceps_brachii'],
    isCustom: false,
  },
  {
    id: 'preset-2',
    name: 'Squat',
    category: 'barbell',
    muscleGroup: 'legs',
    primaryMuscles: ['quadriceps', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings', 'adductors', 'erector_spinae'],
    isCustom: false,
  },
  {
    id: 'preset-3',
    name: 'Deadlift',
    category: 'barbell',
    muscleGroup: 'back',
    primaryMuscles: ['gluteus_maximus', 'hamstrings', 'erector_spinae'],
    secondaryMuscles: ['latissimus_dorsi', 'trapezius_upper', 'forearm_flexors'],
    isCustom: false,
  },
  {
    id: 'preset-4',
    name: 'Overhead Press',
    category: 'barbell',
    muscleGroup: 'shoulders',
    primaryMuscles: ['deltoid_anterior', 'deltoid_lateral'],
    secondaryMuscles: ['triceps_brachii', 'trapezius_upper'],
    isCustom: false,
  },
  {
    id: 'preset-5',
    name: 'Barbell Row',
    category: 'barbell',
    muscleGroup: 'back',
    primaryMuscles: ['latissimus_dorsi', 'rhomboids', 'trapezius_middle'],
    secondaryMuscles: ['deltoid_posterior', 'biceps_brachii', 'brachialis'],
    isCustom: false,
  },
  {
    id: 'preset-6',
    name: 'Pull-up',
    category: 'bodyweight',
    muscleGroup: 'back',
    primaryMuscles: ['latissimus_dorsi', 'teres_major'],
    secondaryMuscles: ['biceps_brachii', 'brachialis', 'trapezius_middle'],
    isCustom: false,
  },
  {
    id: 'preset-7',
    name: 'Dip',
    category: 'bodyweight',
    muscleGroup: 'chest',
    primaryMuscles: ['pectoralis_sternocostal', 'triceps_brachii'],
    secondaryMuscles: ['deltoid_anterior'],
    isCustom: false,
  },
  {
    id: 'preset-8',
    name: 'Dumbbell Curl',
    category: 'dumbbell',
    muscleGroup: 'arms',
    primaryMuscles: ['biceps_brachii'],
    secondaryMuscles: ['brachialis', 'forearm_flexors'],
    isCustom: false,
  },
  {
    id: 'preset-9',
    name: 'Tricep Extension',
    category: 'cable',
    muscleGroup: 'arms',
    primaryMuscles: ['triceps_brachii'],
    secondaryMuscles: ['deltoid_posterior'],
    isCustom: false,
  },
  {
    id: 'preset-10',
    name: 'Plank',
    category: 'bodyweight',
    muscleGroup: 'core',
    primaryMuscles: ['rectus_abdominis', 'obliques'],
    secondaryMuscles: ['gluteus_maximus', 'deltoid_anterior'],
    isCustom: false,
  },
];

export async function createExercise(
  input: NewExercise,
): Promise<Exercise> {
  await delay(200);
  const exercise: Exercise = {
    id: Date.now().toString(),
    isCustom: true,
    ...input,
    primaryMuscles: input.primaryMuscles ?? [],
    secondaryMuscles: input.secondaryMuscles ?? [],
  };
  const exercises = readAll();
  writeAll([exercise, ...exercises]);
  return exercise;
}

export async function deleteExercise(id: string): Promise<void> {
  await delay(200);
  const exercises = readAll();
  const updated = exercises.filter(i => i.id !== id);
  if (exercises.length === updated.length) {
    throw new Error('Exercise not found');
  }
  writeAll(updated);
}

function readAll(): Exercise[] {
  const raw = storage.getString(KEY);
  if (!raw) {
    writeAll(DEFAULT_EXERCISES);
    return [...DEFAULT_EXERCISES];
  }
  const stored = JSON.parse(raw) as Array<
    Partial<Exercise> &
      Pick<Exercise, 'id' | 'name' | 'category' | 'muscleGroup' | 'isCustom'>
  >;
  const defaultsById = new Map(DEFAULT_EXERCISES.map(exercise => [exercise.id, exercise]));
  return stored.map(exercise => {
    const preset = defaultsById.get(exercise.id);
    return {
      ...exercise,
      // Refresh preset muscle mapping when the catalog taxonomy changes.
      primaryMuscles: preset?.primaryMuscles ?? exercise.primaryMuscles ?? [],
      secondaryMuscles: preset?.secondaryMuscles ?? exercise.secondaryMuscles ?? [],
    } as Exercise;
  });
}

function writeAll(exercises: Exercise[]) {
  storage.set(KEY, JSON.stringify(exercises));
}

export async function getExercises(): Promise<Exercise[]> {
  await delay(300);
  return readAll();
}

export async function getExerciseById(id: string) {
  await delay(200);
  const allExercises = readAll();
  const exercise = allExercises.find(ex => ex.id === id);
  if (!exercise) {
    throw new Error('Exercise not found');
  }
  return exercise;
}
