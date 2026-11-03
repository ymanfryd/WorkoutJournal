import {storage} from '@/storage/mmkv';
import {delay} from '@/utils/delay';

export type WorkoutPlanSet = {
  id: string;
  reps: number;
  weight: number;
};

export type WorkoutPlanExercise = {
  id: string;
  exerciseId: string;
  sets: WorkoutPlanSet[];
};

export type WorkoutPlan = {
  id: string;
  name: string;
  exercises: WorkoutPlanExercise[];
  updatedAt: number;
};

export type WorkoutPlanInput = Omit<WorkoutPlan, 'id' | 'updatedAt'>;

const KEY = 'workout-plans';

function readAll(): WorkoutPlan[] {
  const raw = storage.getString(KEY);
  return raw ? (JSON.parse(raw) as WorkoutPlan[]) : [];
}

function writeAll(plans: WorkoutPlan[]) {
  storage.set(KEY, JSON.stringify(plans));
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  await delay(100);
  return readAll();
}

export async function createWorkoutPlan(input: WorkoutPlanInput): Promise<WorkoutPlan> {
  await delay(150);
  const plan: WorkoutPlan = {
    ...input,
    id: newId(),
    updatedAt: Date.now(),
  };
  writeAll([plan, ...readAll()]);
  return plan;
}

export async function updateWorkoutPlan(
  id: string,
  input: WorkoutPlanInput,
): Promise<WorkoutPlan> {
  await delay(150);
  const plans = readAll();
  if (!plans.some(plan => plan.id === id)) {
    throw new Error('Workout plan not found');
  }
  const updated: WorkoutPlan = {...input, id, updatedAt: Date.now()};
  writeAll(plans.map(plan => (plan.id === id ? updated : plan)));
  return updated;
}

export async function deleteWorkoutPlan(id: string): Promise<void> {
  await delay(150);
  const plans = readAll();
  writeAll(plans.filter(plan => plan.id !== id));
}

export function removeExerciseFromWorkoutPlans(exerciseId: string): void {
  const plans = readAll();
  let changed = false;
  const updated = plans.map(plan => {
    const exercises = plan.exercises.filter(entry => entry.exerciseId !== exerciseId);
    if (exercises.length === plan.exercises.length) return plan;
    changed = true;
    return {...plan, exercises};
  });
  if (changed) writeAll(updated);
}
