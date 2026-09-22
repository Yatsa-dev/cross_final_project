import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import CustomButton from './CustomButton';
import { spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// Shared loading and error view so every screen that talks to the API
// reports progress and failures the same way.
export default function RequestState({ status, error, onRetry, loadingText = 'Завантажуємо меню…' }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.coffee} />
        <Text style={styles.text}>{loadingText}</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Не вдалося завантажити</Text>
        <Text style={styles.text}>{error}</Text>
        {onRetry ? (
          <CustomButton title="Спробувати ще раз" fullWidth={false} onPress={onRetry} />
        ) : null}
      </View>
    );
  }

  return null;
}

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
