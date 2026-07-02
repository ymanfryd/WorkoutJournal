import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly impact: (style: string) => void;
  readonly notification: (type: string) => void;
  readonly selection: () => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Haptics');
