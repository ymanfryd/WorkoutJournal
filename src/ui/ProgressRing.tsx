import {Canvas, Circle, Path, Skia} from '@shopify/react-native-skia';
import {colors} from '@/theme';

type Props = {
  progress: number; // 0..1
  size: number;
  strokeWidth?: number;
};

function ProgressRing({progress, size, strokeWidth = 12}: Props) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const arcPath = Skia.PathBuilder.Make()
    .addArc(
      {
        x: strokeWidth / 2,
        y: strokeWidth / 2,
        width: size - strokeWidth,
        height: size - strokeWidth,
      },
      -90,
      progress * 360,
    )
    .build();

  return (
    <Canvas style={{width: size, height: size}}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        color="rgba(255, 255, 255, 0.1)"
        style="stroke"
        strokeWidth={strokeWidth}
      />
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
