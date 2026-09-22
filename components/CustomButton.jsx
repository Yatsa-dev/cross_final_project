import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// Variants depend on the palette, so the map is built per theme rather than
// living as a module constant.
const createVariantStyles = (colors) => ({
  primary: {
    container: { backgroundColor: colors.espresso },
    label: { color: colors.textOnDark },
    content: colors.textOnDark,
  },
  secondary: {
    container: {
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
    },
    label: { color: colors.coffee },
    content: colors.coffee,
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    label: { color: colors.textSecondary },
    content: colors.textSecondary,
  },
});

const DISABLED_OPACITY = 0.45;
const ACTIVE_OPACITY = 0.8;

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  iconName,
  iconPosition = 'left',
  disabled = false,
  fullWidth = true,
  style,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const variantStyles = useMemo(() => createVariantStyles(colors), [colors]);
  const variantStyle = variantStyles[variant] ?? variantStyles.primary;
  const icon = iconName ? (
    <Ionicons name={iconName} size={sizes.iconMd} color={variantStyle.content} />
  ) : null;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={ACTIVE_OPACITY}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {iconPosition === 'left' ? icon : null}
      <Text style={[styles.label, variantStyle.label]} numberOfLines={1}>
        {title}
      </Text>
      {iconPosition === 'right' ? icon : null}
    </TouchableOpacity>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: sizes.controlLg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.pill,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: DISABLED_OPACITY,
  },
  label: {
    ...typography.bodyStrong,
  },
});
