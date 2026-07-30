import {haptics} from '@/haptics';
import {colors, radius} from '@/theme';
import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

const OPEN_POSITION = -100;
const SNAP_THRESHOLD = -50;

type Props = {
  id: string;
  children: React.ReactNode;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
  deletePending?: boolean;
};

const CardWithGesture = ({
  id,
  onPress,
  onDelete,
  deletePending,
  children,
}: Props) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    startX.value = 0;
  }, [id]);

  const pan = usePanGesture({
    activeOffsetX: [-10, 10],
    onBegin: () => {
      startX.value = translateX.value;
    },
    onUpdate: e => {
      const next = startX.value + e.translationX;
      translateX.value = Math.min(0, Math.max(OPEN_POSITION, next));
    },
    onFinalize: () => {
      if (translateX.value < SNAP_THRESHOLD) {
        translateX.value = withSpring(OPEN_POSITION);
        scheduleOnRN(haptics.impact, 'medium');
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const tap = useTapGesture({
    onActivate: () => {
      scheduleOnRN(onPress, id);
    },
  });
  const composed = useCompetingGestures(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <View style={styles.row}>
      <Pressable style={styles.deleteZone} onPress={() => onDelete(id)}>
        {deletePending ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.deleteText}>Delete</Text>
        )}
      </Pressable>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.cardWrapper, cardStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default CardWithGesture;
const styles = StyleSheet.create({
  row: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius.md,
    flex: 1,
  },
  deleteZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  cardWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
});
