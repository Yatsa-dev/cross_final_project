import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palettes, THEME_MODES } from '../theme/palettes';
import { spacing, typography } from '../theme';

// Shown for the few milliseconds it takes to read storage. It cannot use the
// theme context: which theme to apply is exactly what is still being loaded,
// so the light palette stands in as the documented default.
const colors = palettes[THEME_MODES.LIGHT];

export default function BootSplash() {
  return (
    <View style={styles.screen}>
      <Text style={styles.wordmark}>BrewGo</Text>
      <ActivityIndicator color={colors.coffee} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    backgroundColor: colors.cream,
  },
  wordmark: {
    ...typography.display,
    color: colors.espresso,
  },
});
