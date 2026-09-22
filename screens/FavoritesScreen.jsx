import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import ProductCard from '../components/ProductCard';
import RequestState from '../components/RequestState';
import { useCardWidth } from '../hooks/useCardWidth';
import { useFavoriteDrinks } from '../hooks/useFavoriteDrinks';
import { STATUS } from '../hooks/useRequest';
import { SCREENS, STACKS } from '../navigation/routes';
import { spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// Module scope keeps the reference stable across renders of the screen.
const keyExtractor = (item) => `${item.category}:${item.id}`;

export default function FavoritesScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { cardWidth, columns } = useCardWidth();

  const { status, drinks, error, reload } = useFavoriteDrinks();

  // Details live in the menu stack, so the jump goes through the tab navigator
  // and carries both parts of the drink identity.
  const openDrink = useCallback(
    (drinkId, category) =>
      navigation.getParent()?.navigate(STACKS.MENU, {
        screen: SCREENS.PRODUCT_DETAILS,
        params: { drinkId, category },
      }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        id={item.id}
        category={item.category}
        title={item.title}
        volume={item.volume}
        price={item.price}
        imageUrl={item.imageUrl}
        width={cardWidth}
        onPress={openDrink}
      />
    ),
    [cardWidth, openDrink]
  );

  if (status !== STATUS.SUCCESS) {
    return (
      <View style={styles.stateScreen}>
        <RequestState status={status} error={error} onRetry={reload} loadingText="Завантажуємо улюблене…" />
      </View>
    );
  }

  return (
    <FlatList
      // FlatList does not rebuild the grid when numColumns changes,
      // so the key forces a remount after rotation.
      key={columns}
      data={drinks}
      keyExtractor={keyExtractor}
      numColumns={columns}
      columnWrapperStyle={columns > 1 ? styles.row : undefined}
      contentContainerStyle={drinks.length ? styles.content : styles.emptyContent}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Тут поки порожньо</Text>
          <Text style={styles.emptyText}>
            Натисніть сердечко на картці напою — і він зʼявиться тут, навіть після
            перезапуску застосунку.
          </Text>
          <CustomButton
            title="Перейти до меню"
            onPress={() => navigation.getParent()?.navigate(STACKS.MENU)}
          />
        </View>
      }
    />
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      paddingHorizontal: spacing.xxl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xxxl,
      gap: spacing.md,
    },
    emptyContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.xxl,
    },
    row: {
      justifyContent: 'space-between',
    },
    stateScreen: {
      flex: 1,
      justifyContent: 'center',
      padding: spacing.xxl,
    },
    empty: {
      alignItems: 'center',
      gap: spacing.md,
    },
    emptyTitle: {
      ...typography.heading,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    emptyText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.sm,
    },
  });
