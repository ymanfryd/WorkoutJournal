import {useMemo} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Canvas, Rect, RoundedRect} from '@shopify/react-native-skia';
import {colors, radius, spacing} from '@/theme';
import {useWorkouts} from '@/hooks/useWorkouts';
import type {Workout} from '@/api/workouts';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const WEEKS_TO_SHOW = 6;

type Stats = {
  total: number;
  thisWeek: number;
  totalExercises: number;
  totalSets: number;
};

function computeStats(workouts: Workout[]): Stats {
  const completed = workouts.filter(w => !w.isActive);
  const oneWeekAgo = Date.now() - WEEK_MS;

  return {
    total: completed.length,
    thisWeek: completed.filter(w => w.date > oneWeekAgo).length,
    totalExercises: completed.reduce(
      (sum, w) => sum + w.exercises.length,
      0,
    ),
    totalSets: completed.reduce(
      (sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets.length, 0),
      0,
    ),
  };
}

function computeWeeklyCounts(workouts: Workout[]): number[] {
  const completed = workouts.filter(w => !w.isActive);
  const now = Date.now();
  const counts: number[] = new Array(WEEKS_TO_SHOW).fill(0);

  for (const w of completed) {
    const weeksAgo = Math.floor((now - w.date) / WEEK_MS);
    if (weeksAgo >= 0 && weeksAgo < WEEKS_TO_SHOW) {
      counts[WEEKS_TO_SHOW - 1 - weeksAgo]++;
    }
  }

  return counts;
}

function StatsScreen() {
  const {data: workouts, isLoading} = useWorkouts();

  const stats = useMemo(
    () => computeStats(workouts ?? []),
    [workouts],
  );
  const weeklyCounts = useMemo(
    () => computeWeeklyCounts(workouts ?? []),
    [workouts],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Stats</Text>

        <View style={styles.grid}>
          <StatCard label="Workouts" value={stats.total.toString()} />
          <StatCard label="This week" value={stats.thisWeek.toString()} />
          <StatCard label="Exercises" value={stats.totalExercises.toString()} />
          <StatCard label="Sets" value={stats.totalSets.toString()} />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartLabel}>
            Workouts per week (last {WEEKS_TO_SHOW})
          </Text>
          <WeeklyChart counts={weeklyCounts} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {hint && <Text style={styles.cardHint}>{hint}</Text>}
    </View>
  );
}

const CHART_HEIGHT = 120;
const CHART_PADDING = 12;
const BAR_GAP = 8;

function WeeklyChart({counts}: {counts: number[]}) {
  const max = Math.max(...counts, 1);
  const chartWidth = 300;
  const barCount = counts.length;
  const barWidth = (chartWidth - CHART_PADDING * 2 - BAR_GAP * (barCount - 1)) / barCount;

  return (
    <View style={styles.chartWrapper}>
      <Canvas style={{width: chartWidth, height: CHART_HEIGHT}}>
        {counts.map((count, i) => {
          const height = count === 0 ? 4 : (count / max) * (CHART_HEIGHT - 32);
          const x = CHART_PADDING + i * (barWidth + BAR_GAP);
          const y = CHART_HEIGHT - height - 24;
          return (
            <RoundedRect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              r={4}
              color={count === 0 ? colors.surface : colors.primary}
            />
          );
        })}
        <Rect
          x={0}
          y={CHART_HEIGHT - 20}
          width={chartWidth}
          height={1}
          color={colors.border}
        />
      </Canvas>
      <View style={styles.chartAxis}>
        {counts.map((count, i) => (
          <Text key={i} style={styles.chartAxisLabel}>
            {count}
          </Text>
        ))}
      </View>
    </View>
  );
}

export default StatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  cardHint: {
    color: colors.textMuted,
    fontSize: 11,
  },
  chartSection: {
    gap: spacing.sm,
  },
  chartLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  chartWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  chartAxis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 300 - CHART_PADDING * 2,
  },
  chartAxisLabel: {
    color: colors.textMuted,
    fontSize: 11,
    minWidth: 20,
    textAlign: 'center',
  },
});
