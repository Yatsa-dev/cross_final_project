import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../screens/HomeScreen';
import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import VenueScreen from '../../screens/VenueScreen';
import { SCREENS, TITLES } from '../routes';
import { createStackScreenOptions } from '../screenOptions';
import { useTheme } from '../../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      {/* Home draws its own Header component, so the native header is hidden there. */}
      <Stack.Screen name={SCREENS.HOME} component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name={SCREENS.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
        options={{ title: TITLES[SCREENS.PRODUCT_DETAILS], headerBackTitle: 'Меню' }}
      />
      {/* Registered here as well as in the profile stack, the same way product
          details is shared between the menu and the search stack: tapping the
          address in the header opens it without switching tabs. */}
      <Stack.Screen
        name={SCREENS.VENUE}
        component={VenueScreen}
        options={{ title: TITLES[SCREENS.VENUE], headerBackTitle: 'Меню' }}
      />
    </Stack.Navigator>
  );
}
