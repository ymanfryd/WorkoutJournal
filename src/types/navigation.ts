import {RootTabs} from '@/navigation/RootTabs';
import type {StaticParamList} from '@react-navigation/native';

export type RootTabsParamList = StaticParamList<typeof RootTabs>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabsParamList {}
  }
}
