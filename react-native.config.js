module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  commands: [
    {
      name: 'run-ios-no-pods',
      func: () => {
        // Skip pod install
      },
    },
  ],
};
