import {colors, radius, spacing} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import ExerciseCard from './ExerciseCard';
import {Row} from '.';

const ExerciseRow = ({row}: {row: Row}) => {
  return (
    <View>
      {row.type === 'header' && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{row.title}</Text>
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
  deleteZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  deleteText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
