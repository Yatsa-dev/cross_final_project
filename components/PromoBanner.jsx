import { memo, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.9;
const TITLE_SIZE = 19;
const BANNER_HEIGHT = 96;
const DECOR_SIZE = 120;

// overflow: 'hidden' keeps the decorative circle inside the banner.
function PromoBanner({ title, subtitle, actionLabel, onPress }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      <View style={styles.decor} />

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {actionLabel ? (
        <TouchableOpacity
          style={styles.action}
          onPress={onPress}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityRole="button"
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default memo(PromoBanner);

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.coffee,
    overflow: 'hidden',
  },
  decor: {
    position: 'absolute',
    right: -DECOR_SIZE / 3,
    top: -DECOR_SIZE / 3,
    width: DECOR_SIZE,
    height: DECOR_SIZE,
    borderRadius: DECOR_SIZE / 2,
    backgroundColor: colors.caramel,
    opacity: 0.25,
  },
  text: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.heading,
    fontSize: TITLE_SIZE,
    color: colors.textOnDark,
  },
  // Banner background is colors.coffee, which inverts between themes,
  // so the subtitle follows textOnDark instead of a fixed accent.
  subtitle: {
    ...typography.caption,
    color: colors.textOnDark,
  },
  action: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.card,
  },
  actionLabel: {
    ...typography.label,
    color: colors.espresso,
  },
});
