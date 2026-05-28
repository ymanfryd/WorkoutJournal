export type Workout = {id: string; date: number; exercises: number};

let workouts = [
  {id: '5', date: Date.now(), exercises: 15},
  {id: '4', date: Date.now() - 1 * 24 * 60 * 60 * 1000, exercises: 6},
  {id: '3', date: Date.now() - 3 * 24 * 60 * 60 * 1000, exercises: 8},
  {id: '2', date: Date.now() - 7 * 24 * 60 * 60 * 1000, exercises: 5},
  {id: '1', date: Date.now() - 14 * 24 * 60 * 60 * 1000, exercises: 3},
];

export async function getWorkouts(): Promise<Workout[]> {
  await new Promise(r => setTimeout(r, 800));

  return [...workouts];
}

export async function createWorkout(input: {
  exercises: number;
}): Promise<Workout> {
  await new Promise(r => setTimeout(r, 500));

  const workout: Workout = {
    id: Date.now().toString(),
    date: Date.now(),
    exercises: input.exercises,
  };
  workouts.unshift(workout);
  return workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  await new Promise(r => setTimeout(r, 500));
  const idx = workouts.findIndex(w => w.id === id);
  if (idx >= 0) {
    workouts.splice(idx, 1);
  } else {
    throw new Error('Workout not found');
  }
}
