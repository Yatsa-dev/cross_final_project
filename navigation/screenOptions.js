import { Platform } from 'react-native';

import { spacing, typography } from '../theme';

// Options depend on the active palette, so each one is a factory instead of a
// constant object: navigators call it with the colours they get from the theme.
export const createStackScreenOptions = (colors) => ({
  headerStyle: { backgroundColor: colors.cream },
  headerTintColor: colors.coffee,
  headerTitleStyle: { ...typography.subheading, color: colors.textPrimary },
  headerTitleAlign: 'center',
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.cream },
  // iOS gets the native swipe-back gesture; on Android the hardware button covers it.
  gestureEnabled: Platform.select({ ios: true, android: false, default: true }),
});

export const createTabNavigatorOptions = (colors) => ({
  headerShown: false,
  tabBarActiveTintColor: colors.coffee,
  tabBarInactiveTintColor: colors.textSecondary,
  // The default bar is 49 px tall, which squeezes the label to zero height once the
  // icon and paddings are in. iOS gets extra room for the home indicator.
  tabBarStyle: {
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    height: Platform.select({ ios: 92, android: 72, default: 72 }),
    paddingTop: spacing.sm,
    paddingBottom: Platform.select({ ios: spacing.xxl, android: spacing.md, default: spacing.md }),
  },
  tabBarLabelStyle: { ...typography.label, marginTop: 0, marginBottom: 0 },
});

export const createDrawerNavigatorOptions = (colors) => ({
  headerShown: false,
  drawerType: 'front',
  drawerActiveTintColor: colors.coffee,
  drawerInactiveTintColor: colors.textSecondary,
  drawerActiveBackgroundColor: colors.muted,
  drawerStyle: { backgroundColor: colors.cream, width: 280 },
  drawerLabelStyle: { ...typography.bodyStrong },
});
