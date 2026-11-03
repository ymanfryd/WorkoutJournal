import Svg, {Circle, G, Line, Path, Rect} from 'react-native-svg';
import {colors} from '@/theme';

type TabIconName = 'workout' | 'exercises' | 'stats' | 'history' | 'settings';

type Props = {
  name: TabIconName;
  focused: boolean;
  size: number;
};

export default function TabIcon({name, focused, size}: Props) {
  const stroke = focused ? colors.primary : colors.text;
  const common = {
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const scaledCommon = {...common, strokeWidth: 1.8};

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      {name === 'workout' && (
        <>
          <Line x1="2" y1="16" x2="5" y2="16" {...common} strokeLinecap="butt" />
          <Line x1="12" y1="16" x2="20" y2="16" {...common} strokeLinecap="butt" />
          <Line x1="27" y1="16" x2="30" y2="16" {...common} strokeLinecap="butt" />
          <Rect x="8" y="9" width="4" height="14" rx="1.2" {...common} />
          <Rect x="5" y="10" width="3" height="12" rx="1.2" {...common} />
          <Rect x="20" y="9" width="4" height="14" rx="1.2" {...common} />
          <Rect x="24" y="10" width="3" height="12" rx="1.2" {...common} />
        </>
      )}
      {name === 'exercises' && (
        <G transform="translate(4.5 4.4) scale(.72)">
          <Path
            d="M2.8 26.8 3.2 20 4.2 16.4 4.6 16 6 12 6.4 9.4 6.8 8.6 7.2 4.8 8 3.4 8.8 2.8 9.2 1.8 10.4.6 11 .4 16.6 2.2 17.2 2.8 17.2 3.8 16.6 4.6 17.4 5.2 17.6 5.8 17.4 6.8 15.8 8 15 9.4 12.8 10.6 11.8 10.8 11.6 11.2 11.4 20.8 11 23.8 11.4 23.6 12 22 12.4 21.8 13.2 20.2 16 17.6 17.6 16.8 19.4 16.4 22.2 16.4 25.2 17.2 27 18.2 27.4 18.8 27.8 18.8 30.2 21.2 31.4 24 31.4 25 30.8 26.8 28.8 28.6 24.6 30.4 19.8 31.4 13.8 31.6 10 31 4 31.2 2.8 30.6 2.4 29.8Z"
            {...scaledCommon}
          />
          <Path d="M12.4 22.7c2.7-4.1 6.4-6.3 10.9-6.1" {...scaledCommon} />
        </G>
      )}
      {name === 'stats' && (
        <>
          <Path d="M5 26h22" {...common} />
          <Rect x="7" y="17" width="4.5" height="9" rx="1" {...common} />
          <Rect x="14" y="12" width="4.5" height="14" rx="1" {...common} />
          <Rect x="21" y="7" width="4.5" height="19" rx="1" {...common} />
        </>
      )}
      {name === 'history' && (
        <>
          <Rect x="5.5" y="7" width="21" height="20" rx="3" {...common} />
          <Path d="M5.5 13h21" {...common} />
          <Line x1="11" y1="5" x2="11" y2="9" {...common} />
          <Line x1="21" y1="5" x2="21" y2="9" {...common} />
          <Path d="m12 20 2.5 2.5 5.5-5.5" {...common} />
        </>
      )}
      {name === 'settings' && (
        <G transform="translate(3.2 3.2) scale(.8)">
          <Path
            d="M13 2H19L20 6 23 7 27 5 30 8 27 12Q28 14 28.5 15L30 15.5V16.5L28.5 17Q28 19 27 20L30 24 27 27 23 25 20 26 19 30H13L12 26 9 25 5 27 2 24 5 20Q4 18 3.5 17L2 16.5V15.5L3.5 15Q4 13 5 12L2 8 5 5 9 7 12 6Z"
            {...scaledCommon}
          />
          <Circle cx="16" cy="16" r="4" {...scaledCommon} />
        </G>
      )}
    </Svg>
  );
}
