import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import LoyaltyProgress from '../components/LoyaltyProgress';
import { SCREENS } from '../navigation/routes';
import { selectFavoritesCount } from '../store/favoritesSlice';
import { LOYALTY_GOAL, selectLoyaltyCups, selectOrders } from '../store/ordersSlice';
import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.8;
const AVATAR_SIZE = 72;
export default function ProfileScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Everything on this screen now reflects real state instead of fixed text.
  const orders = useSelector(selectOrders);
  const cups = useSelector(selectLoyaltyCups);
  const favoritesCount = useSelector(selectFavoritesCount);

  const rows = useMemo(
    () => [
      {
        label: 'Мої замовлення',
        icon: 'receipt-outline',
        badge: orders.length ? String(orders.length) : null,
        onPress: () => navigation.navigate(SCREENS.ORDER_HISTORY),
      },
      {
        label: 'Улюблене',
        icon: 'heart-outline',
        badge: favoritesCount ? String(favoritesCount) : null,
        onPress: () => navigation.navigate(SCREENS.FAVORITES),
      },
      {
        label: 'Наш заклад',
        icon: 'map-outline',
        badge: null,
        onPress: () => navigation.navigate(SCREENS.VENUE),
      },
      {
        label: 'Підтримка',
        icon: 'help-buoy-outline',
        badge: null,
        onPress: () => navigation.dispatch(DrawerActions.jumpTo(SCREENS.SUPPORT)),
      },
      {
        label: 'Про заклад',
        icon: 'information-circle-outline',
        badge: null,
        onPress: () => navigation.dispatch(DrawerActions.jumpTo(SCREENS.ABOUT)),
      },
    ],
    [navigation, orders.length, favoritesCount]
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>ІЯ</Text>
        </View>
        <View>
          <Text style={styles.name}>Ігор Яцишин</Text>
          <Text style={styles.phone}>+380 67 123 45 67</Text>
        </View>
      </View>

      <LoyaltyProgress cups={cups} goal={LOYALTY_GOAL} />

      {/* The switch is the only control that writes to the theme context;
          every other component just reads the palette from it. */}
      <View style={styles.themeRow}>
        <Ionicons
          name={isDark ? 'moon' : 'sunny'}
          size={sizes.iconMd}
          color={colors.coffee}
        />
        <View style={styles.themeText}>
          <Text style={styles.rowLabel}>Темна тема</Text>
          <Text style={styles.themeHint}>{isDark ? 'Увімкнено' : 'Вимкнено'}</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.coffee }}
          thumbColor={colors.card}
          accessibilityLabel="Перемикач темної теми"
        />
      </View>

      <View style={styles.card}>
        {rows.map((row, index) => (
          <TouchableOpacity
            key={row.label}
            style={[styles.row, index < rows.length - 1 && styles.rowDivider]}
            onPress={row.onPress}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityRole="button"
          >
            <Ionicons name={row.icon} size={sizes.iconMd} color={colors.coffee} />
            <Text style={styles.rowLabel}>{row.label}</Text>
            {row.badge ? <Text style={styles.rowBadge}>{row.badge}</Text> : null}
            <Ionicons name="chevron-forward" size={sizes.iconSm} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  content: {
    padding: spacing.xxl,
    gap: spacing.lg,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.heading,
    color: colors.coffee,
  },
  name: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  phone: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
  },
  themeText: {
    flex: 1,
  },
  themeHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowBadge: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.coffee,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
});
