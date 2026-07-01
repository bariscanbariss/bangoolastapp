/**
 * @format
 */

import 'react-native-url-polyfill/auto';

import {AppRegistry, LogBox} from 'react-native';
import App from './app/app';
import {name as appName} from './app.json';

// Suppress known warnings from third-party libraries
LogBox.ignoreLogs([
  'SafeAreaView has been deprecated',
]);

AppRegistry.registerComponent(appName, () => App);
