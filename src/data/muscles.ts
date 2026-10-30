/** Stable identifiers for muscle regions that can be selected and highlighted on a body diagram. */
export const MUSCLE_IDS = [
  'pectoralis_clavicular',
  'pectoralis_sternocostal',
  'deltoid_anterior',
  'deltoid_lateral',
  'deltoid_posterior',
  'biceps_brachii',
  'brachialis',
  'triceps_brachii',
  'forearm_flexors',
  'forearm_extensors',
  'latissimus_dorsi',
  'teres_major',
  'trapezius_upper',
  'trapezius_middle',
  'trapezius_lower',
  'rhomboids',
  'erector_spinae',
  'rectus_abdominis',
  'obliques',
  'gluteus_maximus',
  'gluteus_medius',
  'adductors',
  'quadriceps',
  'hamstrings',
  'gastrocnemius',
  'soleus',
  'tibialis_anterior',
] as const;

export type MuscleId = (typeof MUSCLE_IDS)[number];

/** Display order shared by muscle pickers, legends, and body diagrams. */
export const MUSCLES: ReadonlyArray<{id: MuscleId; group: MuscleGroupId}> = [
  {id: 'pectoralis_clavicular', group: 'chest'},
  {id: 'pectoralis_sternocostal', group: 'chest'},
  {id: 'deltoid_anterior', group: 'shoulders'},
  {id: 'deltoid_lateral', group: 'shoulders'},
  {id: 'deltoid_posterior', group: 'shoulders'},
  {id: 'biceps_brachii', group: 'arms'},
  {id: 'brachialis', group: 'arms'},
  {id: 'triceps_brachii', group: 'arms'},
  {id: 'forearm_flexors', group: 'arms'},
  {id: 'forearm_extensors', group: 'arms'},
  {id: 'latissimus_dorsi', group: 'back'},
  {id: 'teres_major', group: 'back'},
  {id: 'trapezius_upper', group: 'back'},
  {id: 'trapezius_middle', group: 'back'},
  {id: 'trapezius_lower', group: 'back'},
  {id: 'rhomboids', group: 'back'},
  {id: 'erector_spinae', group: 'back'},
  {id: 'rectus_abdominis', group: 'core'},
  {id: 'obliques', group: 'core'},
  {id: 'gluteus_maximus', group: 'legs'},
  {id: 'gluteus_medius', group: 'legs'},
  {id: 'adductors', group: 'legs'},
  {id: 'quadriceps', group: 'legs'},
  {id: 'hamstrings', group: 'legs'},
  {id: 'gastrocnemius', group: 'legs'},
  {id: 'soleus', group: 'legs'},
  {id: 'tibialis_anterior', group: 'legs'},
];

export type MuscleGroupId =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core';
