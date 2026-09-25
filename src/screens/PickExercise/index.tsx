import {useAddExerciseToWorkout} from '@/hooks/useAddExerciseToWorkout';
import {useExercises} from '@/hooks/useExercises';
import {colors, radius, spacing} from '@/theme';
import {FlashList} from '@shopify/flash-list';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';

const PickExercise = () => {
  const {data, isLoading} = useExercises();
  const {mutate, isPending} = useAddExerciseToWorkout();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const navigation = useNavigation();
  const {t} = useTranslation();

  const onPickExercise = (id: string) => {
    setPendingId(id);
    mutate(id, {
      onSuccess: () => navigation.goBack(),
      onSettled: () => setPendingId(null),
    });
  };

  if (isLoading) return <ActivityIndicator />;
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Pressable
        style={styles.closeContainer}
        onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>{t('common.close')}</Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.title}>{t('pickExercise.title')}</Text>
      </View>
      <FlashList
        data={data}
        renderItem={({item}) => {
          const isThisPending = pendingId === item.id;
          return (
            <Pressable
              style={[styles.pickRow, isThisPending && styles.pickRowPending]}
              disabled={pendingId !== null}
              onPress={() => onPickExercise(item.id)}>
              <View style={styles.rowContent}>
                <Text style={styles.pickRowName}>
                  {t(`exerciseNames.${item.id}`, {defaultValue: item.name})}
                </Text>
                <Text style={styles.pickRowMeta}>
                  {t(`muscleGroups.${item.muscleGroup}`)}
                </Text>
              </View>
              {isThisPending && <ActivityIndicator color={colors.primary} />}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default PickExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  pickRow: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickRowPending: {
    opacity: 0.5,
  },
  pickRowName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  pickRowMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
