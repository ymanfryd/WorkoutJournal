import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly getVersion: () => string;
  readonly getBuildNumber: () => string;
  readonly getBundleId: () => string;
}

export default TurboModuleRegistry.getEnforcing<Spec>('AppInfo');
