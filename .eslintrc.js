module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    jest: true,
  },
  rules: {
    'react-native/no-unused-styles': 'warn',
    'react-native/no-single-element-style-arrays': 'warn',
    'react-native/no-color-literals': 'off',
    'react-native/no-inline-styles': 'warn',
  },
};
