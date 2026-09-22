import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BootSplash from './components/BootSplash';
import RenderStatsOverlay from './dev/RenderStatsOverlay';
import { SHOW_RENDER_STATS } from './dev/renderStats';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import RootNavigator from './navigation/RootNavigator';
import { store } from './store';
import { useBootstrap } from './hooks/useBootstrap';

// Separate component because the status bar style has to read the theme,
// and the theme only exists below ThemeProvider.
function ThemedApp() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
      {/* Render counters for the optimisation report; off by default and
          stripped outside development. */}
      {__DEV__ && SHOW_RENDER_STATS ? <RenderStatsOverlay /> : null}
    </>
  );
}

export default function App() {
  // Cart, orders, favourites and the theme are restored before the first frame.
  const { isReady, savedThemeMode } = useBootstrap();

  return (
    // GestureHandlerRootView must wrap the tree for the drawer swipe gesture to work.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider>
          {/* ThemeProvider is mounted only once the saved mode is known.
              initialMode seeds useState, so mounting it earlier would start the
              provider in light mode and immediately overwrite the stored value. */}
          {isReady ? (
            <ThemeProvider initialMode={savedThemeMode}>
              <ThemedApp />
            </ThemeProvider>
          ) : (
            <BootSplash />
          )}
        </SafeAreaProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
