import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CartItem from '../components/CartItem';
import CustomButton from '../components/CustomButton';
import { useTheme } from '../context/ThemeContext';
import { SCREENS } from '../navigation/routes';
import {
  clearCart,
  removeItem,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '../store/cartSlice';
import { radii, spacing, typography } from '../theme';

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  // One callback per operation for the whole list: every row receives the same
  // reference, so a change in one line no longer re-renders the others.
  const changeQuantity = useCallback(
    (id, quantity) => dispatch(updateQuantity({ id, quantity })),
    [dispatch]
  );
  const remove = useCallback((id) => dispatch(removeItem(id)), [dispatch]);
  const clear = useCallback(() => dispatch(clearCart()), [dispatch]);

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Кошик порожній</Text>
        <Text style={styles.emptyText}>Додайте напій із меню — це займе кілька секунд.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {items.map((item) => (
        <CartItem
          key={item.id}
          // Line id travels as a prop, so the component itself stays free of store logic.
          id={item.id}
          title={item.title}
          options={item.options}
          price={item.price}
          quantity={item.quantity}
          imageUrl={item.imageUrl}
          onChangeQuantity={changeQuantity}
          onRemove={remove}
        />
      ))}

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Позицій</Text>
          <Text style={styles.summaryValue}>{items.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>До сплати</Text>
          <Text style={styles.totalValue}>{total} ₴</Text>
        </View>
      </View>

      <CustomButton
        title="Перейти до оплати"
        onPress={() => navigation.navigate(SCREENS.CHECKOUT)}
      />
      <CustomButton title="Очистити кошик" variant="ghost" onPress={clear} />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      padding: spacing.xxl,
      gap: spacing.md,
    },
    summary: {
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: colors.card,
      gap: spacing.sm,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    summaryLabel: {
      ...typography.body,
      color: colors.textSecondary,
    },
    summaryValue: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    totalLabel: {
      ...typography.subheading,
      color: colors.textPrimary,
    },
    totalValue: {
      ...typography.subheading,
      color: colors.coffee,
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: spacing.xxl,
    },
    emptyTitle: {
      ...typography.heading,
      color: colors.textPrimary,
    },
    emptyText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
