import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';
import {useDerivedValue, type SharedValue} from 'react-native-reanimated';
import {colors} from '@/theme';

type Props = {
  progress: SharedValue<number>;
  size: number;
  strokeWidth?: number;
};

function ProgressRing({progress, size, strokeWidth = 12}: Props) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const arcPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(
      {
        x: strokeWidth / 2,
        y: strokeWidth / 2,
        width: size - strokeWidth,
        height: size - strokeWidth,
      },
      -90,
      progress.value * 360,
    );
    return path;
  });

  return (
    <Canvas style={{width: size, height: size}}>
      {/* фоновое кольцо */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        color="rgba(255, 255, 255, 0.1)"
        style="stroke"
        strokeWidth={strokeWidth}
      />
      {/* прогресс-арка */}
      <Path
        path={arcPath}
        color={colors.primary}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round"
      />
    </Canvas>
  );
}

export default ProgressRing;
