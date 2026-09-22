import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FavoritesScreen from '../../screens/FavoritesScreen';
import OrderHistoryScreen from '../../screens/OrderHistoryScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import VenueScreen from '../../screens/VenueScreen';
import { SCREENS, TITLES } from '../routes';
import { createStackScreenOptions } from '../screenOptions';
import { useTheme } from '../../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.PROFILE}
        component={ProfileScreen}
        options={{ title: TITLES[SCREENS.PROFILE] }}
      />
      <Stack.Screen
        name={SCREENS.ORDER_HISTORY}
        component={OrderHistoryScreen}
        options={{ title: TITLES[SCREENS.ORDER_HISTORY], headerBackTitle: 'Профіль' }}
      />
      <Stack.Screen
        name={SCREENS.FAVORITES}
        component={FavoritesScreen}
        options={{ title: TITLES[SCREENS.FAVORITES], headerBackTitle: 'Профіль' }}
      />
      <Stack.Screen
        name={SCREENS.VENUE}
        component={VenueScreen}
        options={{ title: TITLES[SCREENS.VENUE], headerBackTitle: 'Профіль' }}
      />
    </Stack.Navigator>
  );
}
