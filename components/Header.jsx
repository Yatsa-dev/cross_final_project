import { memo, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Badge from './Badge';
import { sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// The badge overhangs the round cart button by a couple of pixels.
const BADGE_OFFSET = -2;
const ACTIVE_OPACITY = 0.7;

function Header({
  label = 'ЗАБРАТИ В',
  title,
  cartCount = 0,
  onPressMenu,
  onPressLocation,
  onPressCart,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.container}>
      {onPressMenu ? (
        <TouchableOpacity
          style={styles.menu}
          onPress={onPressMenu}
          activeOpacity={ACTIVE_OPACITY}
          accessibilityRole="button"
          accessibilityLabel="Відкрити меню"
        >
          <Ionicons name="menu" size={sizes.iconLg} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        style={styles.location}
        onPress={onPressLocation}
        activeOpacity={ACTIVE_OPACITY}
        accessibilityRole="button"
      >
        <Text style={styles.label}>{label}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Ionicons name="chevron-forward" size={sizes.iconSm} color={colors.coffee} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cart}
        onPress={onPressCart}
        activeOpacity={ACTIVE_OPACITY}
        accessibilityRole="button"
        accessibilityLabel={`Кошик, товарів: ${cartCount}`}
      >
        <Ionicons name="bag-handle-outline" size={sizes.iconMd} color={colors.textOnDark} />
        {/* The badge overflows the round button, hence absolute positioning. */}
        <View style={styles.badge}>
          <Badge value={cartCount} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default memo(Header);

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  menu: {
    width: sizes.controlSm,
    height: sizes.controlSm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.xs,
  },
  location: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  title: {
    ...typography.subheading,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  cart: {
    width: sizes.controlMd,
    height: sizes.controlMd,
    borderRadius: sizes.controlMd / 2,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: BADGE_OFFSET,
    right: BADGE_OFFSET,
  },
});
