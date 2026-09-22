import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CartScreen from '../../screens/CartScreen';
import CheckoutScreen from '../../screens/CheckoutScreen';
import ConfirmationScreen from '../../screens/ConfirmationScreen';
import { SCREENS, TITLES } from '../routes';
import { createStackScreenOptions } from '../screenOptions';
import { useTheme } from '../../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function CartStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.CART}
        component={CartScreen}
        options={{ title: TITLES[SCREENS.CART] }}
      />
      <Stack.Screen
        name={SCREENS.CHECKOUT}
        component={CheckoutScreen}
        options={{ title: TITLES[SCREENS.CHECKOUT] }}
      />
      <Stack.Screen
        name={SCREENS.CONFIRMATION}
        component={ConfirmationScreen}
        options={{
          title: TITLES[SCREENS.CONFIRMATION],
          // The order is already placed, so going back to checkout makes no sense.
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
