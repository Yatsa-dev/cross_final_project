import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useMemo } from 'react';

import DrawerNavigator from './DrawerNavigator';
import { DRAWER, SCREENS, STACKS } from './routes';
import { useTheme } from '../context/ThemeContext';

// Explicit paths for every screen: on web this turns the nested navigators into
// readable URLs, and drinkId travels in the path instead of being lost on reload.
const linking = {
  prefixes: [],
  config: {
    screens: {
      [DRAWER.TABS]: {
        screens: {
          [STACKS.MENU]: {
            screens: {
              [SCREENS.HOME]: 'menu',
              [SCREENS.PRODUCT_DETAILS]: 'menu/:drinkId',
              [SCREENS.VENUE]: 'menu/venue',
            },
          },
          [STACKS.SEARCH]: {
            screens: {
              [SCREENS.SEARCH]: 'search',
              [SCREENS.PRODUCT_DETAILS]: 'search/:drinkId',
            },
          },
          [STACKS.CART]: {
            screens: {
              [SCREENS.CART]: 'cart',
              [SCREENS.CHECKOUT]: 'checkout',
              [SCREENS.CONFIRMATION]: 'confirmation',
            },
          },
          [STACKS.PROFILE]: {
            screens: {
              [SCREENS.PROFILE]: 'profile',
              [SCREENS.ORDER_HISTORY]: 'orders',
              [SCREENS.FAVORITES]: 'favorites',
              [SCREENS.VENUE]: 'venue',
            },
          },
        },
      },
      [SCREENS.SUPPORT]: 'support',
      [SCREENS.ABOUT]: 'about',
    },
  },
};

export default function RootNavigator() {
  const { colors, isDark } = useTheme();

  // React Navigation keeps its own theme for screen backgrounds and transitions,
  // so the palette from the context is mapped onto it.
  const navigationTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.coffee,
        background: colors.cream,
        card: colors.card,
        text: colors.textPrimary,
        border: colors.border,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
