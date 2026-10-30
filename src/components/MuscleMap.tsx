import type {MuscleId} from '@/data/muscles';
import {colors, radius, spacing} from '@/theme';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Image, Path} from 'react-native-svg';
import {MUSCLE_SCHEME_PATHS} from './muscleSchemeV2';

const REGION_PREFIXES_BY_MUSCLE: Partial<Record<MuscleId, string[]>> = {
  pectoralis_clavicular: ['pectoralis_clavicular-'],
  pectoralis_sternocostal: ['pectoralis_sternocostal-'],
  deltoid_anterior: ['deltoid_anterior-'],
  deltoid_lateral: ['deltoid_lateral-'],
  deltoid_posterior: ['deltoid_posterior-'],
  biceps_brachii: ['biceps_brachii-'],
  brachialis: ['brachialis-'],
  triceps_brachii: ['triceps_brachii-'],
  forearm_flexors: ['forearm_flexors-'],
  forearm_extensors: ['forearm_extensors-'],
  latissimus_dorsi: ['latissimus_dorsi-'],
  teres_major: ['teres_major-'],
  trapezius_upper: ['trapezius_upper-'],
  trapezius_middle: ['trapezius_middle-'],
  trapezius_lower: ['trapezius_lower-'],
  erector_spinae: ['erector_spinae-'],
  rectus_abdominis: ['rectus_abdominis-'],
  obliques: ['obliques-'],
  gluteus_maximus: ['gluteus_maximus-'],
  gluteus_medius: ['gluteus_medius-'],
  adductors: ['adductors-', 'adductor_magnus-'],
  quadriceps: ['quadriceps-'],
  hamstrings: ['hamstrings-'],
  gastrocnemius: ['gastrocnemius-'],
  soleus: ['soleus-'],
  tibialis_anterior: ['tibialis_anterior-'],
};

function MuscleFigure({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
}) {
  const selected = new Map<string, string>();
  for (const id of secondaryMuscles) {
    for (const prefix of REGION_PREFIXES_BY_MUSCLE[id] ?? []) {
      selected.set(prefix, '#f7b84a');
    }
  }
  for (const id of primaryMuscles) {
    for (const prefix of REGION_PREFIXES_BY_MUSCLE[id] ?? []) {
      selected.set(prefix, '#ff6d55');
    }
  }
  return (
    <Svg viewBox="0 0 1378 1142" style={styles.figure}>
      <Image
        href={require('@/assets/muscles/muscle_scheme_segmented_v2.png')}
        x={0}
        y={0}
        width={1378}
        height={1142}
        preserveAspectRatio="none"
      />
      {Array.from(selected, ([prefix, color]) =>
        MUSCLE_SCHEME_PATHS.filter(path => {
          return path.id.startsWith(prefix);
        }).map(path => (
          <Path
            key={path.id}
            d={path.d}
            fill={color}
            fillOpacity={0.82}
            stroke="#34383b"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        )),
      )}
    </Svg>
  );
}

export default function MuscleMap({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: MuscleId[];
  secondaryMuscles: MuscleId[];
}) {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.figures}>
        <MuscleFigure
          primaryMuscles={primaryMuscles}
          secondaryMuscles={secondaryMuscles}
        />
      </View>
      {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
        <View style={styles.legend}>
          {primaryMuscles.length > 0 && (
            <View style={styles.legendRow}>
              <View style={[styles.dot, styles.primaryDot]} />
              <Text style={styles.legendText}>
                {t('muscles.primary')}: {primaryMuscles
                  .map(id => t(`muscleNames.${id}`))
                  .join(', ')}
              </Text>
            </View>
          )}
          {secondaryMuscles.length > 0 && (
            <View style={styles.legendRow}>
              <View style={[styles.dot, styles.secondaryDot]} />
              <Text style={styles.legendText}>
                {t('muscles.secondary')}: {secondaryMuscles
                  .map(id => t(`muscleNames.${id}`))
                  .join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  figures: {
    height: 280,
  },
  figure: {
    flex: 1,
    width: '100%',
  },
  legend: {
    gap: spacing.xs,
    padding: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    marginTop: 4,
  },
  primaryDot: {backgroundColor: '#ff6d55'},
  secondaryDot: {backgroundColor: '#f7b84a'},
  legendText: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
});
