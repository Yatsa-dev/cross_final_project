import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductDetailsScreen from '../../screens/ProductDetailsScreen';
import SearchScreen from '../../screens/SearchScreen';
import { SCREENS, TITLES } from '../routes';
import { createStackScreenOptions } from '../screenOptions';
import { useTheme } from '../../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function SearchStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen
        name={SCREENS.SEARCH}
        component={SearchScreen}
        options={{ title: TITLES[SCREENS.SEARCH] }}
      />
      <Stack.Screen
        name={SCREENS.PRODUCT_DETAILS}
        component={ProductDetailsScreen}
        options={{ title: TITLES[SCREENS.PRODUCT_DETAILS], headerBackTitle: 'Пошук' }}
      />
    </Stack.Navigator>
  );
}
