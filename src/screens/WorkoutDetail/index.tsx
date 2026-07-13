import {colors, spacing, radius} from '@/theme';
import {StyleSheet, Text, View} from 'react-native';
import {
  StaticParamList,
  useNavigation,
  type StaticScreenProps,
} from '@react-navigation/native';
import Button from '@/components/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDeleteWorkout} from '@/hooks/useDeleteWorkout';
import {HistoryStack} from '@/navigation/HistoryStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = StaticScreenProps<{id: string}>;
type HistoryStackParamList = StaticParamList<typeof HistoryStack>;

function WorkoutDetailScreen({route}: Props) {
  const {id} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<HistoryStackParamList>>();
  const deleteWorkout = useDeleteWorkout();

  function goBack() {
    navigation.popTo('HistoryList');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Workout</Text>
        <Text style={styles.id}>#{id}</Text>
      </View>
      <Button
        disabled={deleteWorkout.isPending}
        text={'Delete workout'}
        onPress={() => {
          deleteWorkout.mutate(id, {onSuccess: goBack});
        }}
      />
      <Button text={'Back'} onPress={goBack} />
    </SafeAreaView>
  );
}

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  id: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
});
