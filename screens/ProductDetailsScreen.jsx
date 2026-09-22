import { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import Collapsible from '../components/Collapsible';
import FavoriteButton from '../components/FavoriteButton';
import CustomButton from '../components/CustomButton';
import QuantityStepper from '../components/QuantityStepper';
import RequestState from '../components/RequestState';
import { useDispatch } from 'react-redux';

import { CATEGORIES, fetchDrinkById } from '../api/coffee';
import { addItem } from '../store/cartSlice';
import { SCREENS, STACKS, TITLES } from '../navigation/routes';
import { STATUS } from '../hooks/useCoffeeMenu';
import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const IMAGE_HEIGHT = 240;
const OPTION_HEIGHT = 40;
const SIZES = ['250 мл', '350 мл', '450 мл'];
const MILK = ['Звичайне', 'Безлактозне', 'Рослинне'];

export default function ProductDetailsScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Params are never trusted: a missing id short-circuits to the error state
  // without firing a request.
  const drinkId = route.params?.drinkId;
  const category = route.params?.category ?? CATEGORIES[0].id;

  const [status, setStatus] = useState(drinkId ? STATUS.LOADING : STATUS.ERROR);
  const [drink, setDrink] = useState(null);
  const [error, setError] = useState(drinkId ? null : 'Екран відкрито без коду напою.');

  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(SIZES[0]);
  const [milk, setMilk] = useState(MILK[0]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!drinkId) return;
    let active = true;

    const load = async () => {
      setStatus(STATUS.LOADING);
      try {
        const result = await fetchDrinkById(drinkId, category);
        if (!active) return;

        if (result) {
          setDrink(result);
          setStatus(STATUS.SUCCESS);
        } else {
          setError(`У меню немає позиції з кодом ${drinkId}.`);
          setStatus(STATUS.ERROR);
        }
      } catch (requestError) {
        if (!active) return;
        setError(requestError.message);
        setStatus(STATUS.ERROR);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [drinkId, category]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: drink?.title ?? TITLES[SCREENS.PRODUCT_DETAILS] });
  }, [navigation, drink]);

  if (status !== STATUS.SUCCESS || !drink) {
    return (
      <View style={styles.stateScreen}>
        <RequestState status={status} error={error} loadingText="Завантажуємо напій…" />
        {status === STATUS.ERROR ? (
          <CustomButton title="Повернутись до меню" onPress={() => navigation.popToTop()} />
        ) : null}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: drink.imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{drink.title}</Text>
        <FavoriteButton category={drink.category} drinkId={drink.id} />
        <Text style={styles.price}>{drink.price}</Text>
      </View>

      {drink.description || drink.ingredients.length > 0 ? (
        <Collapsible title="Опис і склад">
          {drink.description ? (
            <Text style={styles.description}>{drink.description}</Text>
          ) : null}
          {drink.ingredients.length > 0 ? (
            <Text style={styles.ingredients}>Склад: {drink.ingredients.join(', ')}</Text>
          ) : null}
        </Collapsible>
      ) : null}

      <Text style={styles.label}>РОЗМІР</Text>
      <OptionRow options={SIZES} value={size} onChange={setSize} styles={styles} />

      <Text style={styles.label}>МОЛОКО</Text>
      <OptionRow options={MILK} value={milk} onChange={setMilk} styles={styles} />

      <View style={styles.quantityRow}>
        <Text style={styles.quantityLabel}>Кількість</Text>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </View>

      <CustomButton
        title={`Додати в кошик · ${drink.price}`}
        iconName="bag-add-outline"
        // The drink is already loaded here, so it goes straight into the store —
        // no second request. Navigation then just switches to the cart tab.
        onPress={() => {
          dispatch(addItem(drink));
          navigation.getParent()?.navigate(STACKS.CART, { screen: SCREENS.CART });
        }}
      />
    </ScrollView>
  );
}

// Styles arrive as a prop: they already depend on the active palette,
// so the row does not need its own theme subscription.
function OptionRow({ options, value, onChange, styles }) {
  return (
    <View style={styles.optionRow}>
      {options.map((option) => (
        <CustomButton
          key={option}
          title={option}
          variant={option === value ? 'primary' : 'secondary'}
          fullWidth={false}
          style={styles.option}
          onPress={() => onChange(option)}
        />
      ))}
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  content: {
    padding: spacing.xxl,
    gap: spacing.md,
  },
  stateScreen: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: radii.lg,
    backgroundColor: colors.muted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    flex: 1,
  },
  price: {
    ...typography.heading,
    color: colors.coffee,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  ingredients: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    height: OPTION_HEIGHT,
    paddingHorizontal: spacing.lg,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  quantityLabel: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
