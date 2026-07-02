import NativeHaptics from '@/specs/NativeHaptics';

export const haptics = {
  impact: (style: 'light' | 'medium' | 'heavy') => NativeHaptics.impact(style),
  notification: (type: 'success' | 'warning' | 'error') =>
    NativeHaptics.notification(type),
  selection: () => NativeHaptics.selection(),
};
