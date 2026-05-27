import RootStack from '@/navigation/RootStack';
import type {StaticParamList} from '@react-navigation/native';

export type RootTabsParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabsParamList {}
  }
}
