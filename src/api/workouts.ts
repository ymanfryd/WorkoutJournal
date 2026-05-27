export type Workout = {id: string; date: number; exercises: number};

export async function getWorkouts(): Promise<Workout[]> {
  await new Promise(r => setTimeout(r, 800));
  const workouts = [
    {id: '5', date: Date.now(), exercises: 15},
    {id: '4', date: Date.now() - 1 * 24 * 60 * 60 * 1000, exercises: 6},
    {id: '3', date: Date.now() - 3 * 24 * 60 * 60 * 1000, exercises: 8},
    {id: '2', date: Date.now() - 7 * 24 * 60 * 60 * 1000, exercises: 5},
    {id: '1', date: Date.now() - 14 * 24 * 60 * 60 * 1000, exercises: 3},
  ];
  return workouts;
}
