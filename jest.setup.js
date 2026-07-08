jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn, ...args) => fn(...args),
  scheduleOnUI: (fn, ...args) => fn(...args),
  runOnJS: fn => fn,
  runOnUI: fn => fn,
}));

jest.mock('react-native-reanimated', () => {
  const RN = require('react-native');
  return {
    __esModule: true,
    default: {
      View: RN.View,
      Text: RN.Text,
      createAnimatedComponent: c => c,
    },
    useSharedValue: val => ({value: val}),
    useAnimatedStyle: () => ({}),
    useDerivedValue: fn => ({value: fn()}),
    useAnimatedReaction: () => {},
    withSpring: v => v,
    withTiming: v => v,
    Easing: {linear: () => {}, inOut: () => {}, quad: () => {}},
  };
});

jest.mock('@/haptics', () => ({
  haptics: {
    impact: jest.fn(),
    notification: jest.fn(),
    selection: jest.fn(),
  },
}));

jest.mock('@/storage/mmkv', () => {
  let store = {};
  return {
    storage: {
      getString: key => store[key],
      set: (key, value) => {
        store[key] = value;
      },
      remove: key => {
        delete store[key];
      },
    },
    __resetMockStore: () => {
      store = {};
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const RN = require('react-native');
  return {
    GestureDetector: ({children}) => children,
    GestureHandlerRootView: RN.View,
    usePanGesture: () => ({}),
    useTapGesture: () => ({}),
    useCompetingGestures: () => ({}),
    usePinchGesture: () => ({}),
    useLongPressGesture: () => ({}),
  };
});

jest.mock('@shopify/flash-list', () => ({
  FlashList: require('react-native').FlatList,
}));
