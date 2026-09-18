import {colors, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import ExerciseCard from './ExerciseCard';
import {Row} from '.';
import {useTranslation} from 'react-i18next';

const ExerciseRow = ({row}: {row: Row}) => {
  const {t} = useTranslation();
  return (
    <View>
      {row.type === 'header' && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>
            {t(`muscleGroups.${row.title}`, {defaultValue: row.title})}
          </Text>
        </View>
      )}
      {row.type === 'exercise' && <ExerciseCard exercise={row.exercise} />}
    </View>
  );
};

export default ExerciseRow;

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionHeaderText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
