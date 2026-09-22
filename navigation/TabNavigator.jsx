import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

import CartStack from './stacks/CartStack';
import MenuStack from './stacks/MenuStack';
import ProfileStack from './stacks/ProfileStack';
import SearchStack from './stacks/SearchStack';
import { STACKS, TAB_ICONS, TAB_LABELS } from './routes';
import { createTabNavigatorOptions } from './screenOptions';
import { useTheme } from '../context/ThemeContext';
import { selectCartCount } from '../store/cartSlice';

const Tab = createBottomTabNavigator();

// One icon factory for all four tabs: the name comes from TAB_ICONS
// and switches between the filled and outlined variant on focus.
const tabIcon = (routeName) => ({ focused, color, size }) => (
  <Ionicons
    name={focused ? TAB_ICONS[routeName].active : TAB_ICONS[routeName].inactive}
    size={size}
    color={color}
  />
);

export default function TabNavigator() {
  const { colors } = useTheme();
  // The badge reads the store, so adding a drink anywhere updates the tab instantly.
  const cartCount = useSelector(selectCartCount);

  return (
    <Tab.Navigator screenOptions={createTabNavigatorOptions(colors)}>
      <Tab.Screen
        name={STACKS.MENU}
        component={MenuStack}
        options={{ title: TAB_LABELS[STACKS.MENU], tabBarIcon: tabIcon(STACKS.MENU) }}
      />
      <Tab.Screen
        name={STACKS.SEARCH}
        component={SearchStack}
        options={{ title: TAB_LABELS[STACKS.SEARCH], tabBarIcon: tabIcon(STACKS.SEARCH) }}
      />
      <Tab.Screen
        name={STACKS.CART}
        component={CartStack}
        options={{
          title: TAB_LABELS[STACKS.CART],
          tabBarIcon: tabIcon(STACKS.CART),
          tabBarBadge: cartCount || undefined,
        }}
      />
      <Tab.Screen
        name={STACKS.PROFILE}
        component={ProfileStack}
        options={{ title: TAB_LABELS[STACKS.PROFILE], tabBarIcon: tabIcon(STACKS.PROFILE) }}
      />
    </Tab.Navigator>
  );
}
