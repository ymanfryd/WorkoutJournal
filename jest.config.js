module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-reanimated|react-native-worklets|react-native-gesture-handler|@shopify/react-native-skia|react-native-safe-area-context|react-native-screens|react-native-mmkv|@tanstack)/)',
  ],
};
