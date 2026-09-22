import Ionicons from '@expo/vector-icons/Ionicons';
import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import { DRAWER, SCREENS, TITLES } from './routes';
import { createDrawerNavigatorOptions, createStackScreenOptions } from './screenOptions';
import { useTheme } from '../context/ThemeContext';
import InfoScreen from '../screens/InfoScreen';
import { sizes } from '../theme';

const Drawer = createDrawerNavigator();

const drawerIcon = (name) => ({ color }) => (
  <Ionicons name={name} size={sizes.iconMd} color={color} />
);

// Both drawer screens share InfoScreen and differ only by initialParams.
const SUPPORT_PARAMS = {
  icon: 'help-buoy-outline',
  title: 'Підтримка',
  text: 'Питання про замовлення, оплату чи бонусну картку — напишіть нам, відповідаємо протягом дня.',
  rows: [
    ['Телефон', '+380 32 000 00 00'],
    ['Пошта', 'help@brewgo.ua'],
    ['Час роботи', 'Щодня, 08:00 — 20:00'],
  ],
};

const ABOUT_PARAMS = {
  icon: 'cafe-outline',
  title: 'Про заклад',
  text: 'Кавʼярня BrewGo на Січових Стрільців. Смажимо зерно самі, готуємо напої на винос за попереднім замовленням.',
  rows: [
    ['Адреса', 'вул. Січових Стрільців, 12'],
    ['Wi-Fi', 'brewgo_guest'],
    ['Оплата', 'Картка, Apple Pay, готівка'],
  ],
};

export default function DrawerNavigator() {
  const { colors } = useTheme();
  const stackScreenOptions = createStackScreenOptions(colors);
  return (
    <Drawer.Navigator screenOptions={createDrawerNavigatorOptions(colors)}>
      <Drawer.Screen
        name={DRAWER.TABS}
        component={TabNavigator}
        options={{ title: 'Замовити каву', drawerIcon: drawerIcon('cafe') }}
      />
      <Drawer.Screen
        name={SCREENS.SUPPORT}
        component={InfoScreen}
        initialParams={SUPPORT_PARAMS}
        options={{
          ...stackScreenOptions,
          headerShown: true,
          title: TITLES[SCREENS.SUPPORT],
          drawerIcon: drawerIcon('help-buoy-outline'),
        }}
      />
      <Drawer.Screen
        name={SCREENS.ABOUT}
        component={InfoScreen}
        initialParams={ABOUT_PARAMS}
        options={{
          ...stackScreenOptions,
          headerShown: true,
          title: TITLES[SCREENS.ABOUT],
          drawerIcon: drawerIcon('information-circle-outline'),
        }}
      />
    </Drawer.Navigator>
  );
}
