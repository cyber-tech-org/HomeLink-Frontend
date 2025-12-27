import { registerRootComponent } from 'expo';

import { LogBox } from 'react-native';

// Suppress SafeAreaView deprecation warning from dependencies
LogBox.ignoreLogs([
    'SafeAreaView has been deprecated',
]);

// Also suppress console warnings
const originalWarn = console.warn;
console.warn = (...args) => {
    if (args[0]?.includes?.('SafeAreaView has been deprecated')) {
        return;
    }
    originalWarn.apply(console, args);
};

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
