import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CustomButton from '../components/CustomButton';
import { SCREENS } from '../navigation/routes';
import { clearCart, selectCartItems, selectCartTotal } from '../store/cartSlice';
import { placeOrder } from '../store/ordersSlice';
import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.8;
const CHIP_HEIGHT = 40;
const RADIO_SIZE = 20;
// Thick enough that the filled ring reads as a selected dot.
const RADIO_RING = 6;
const PICKUP_TIMES = ['Якнайшвидше · 10 хв', '12:30', '13:00'];
const PAYMENTS = ['Apple Pay', 'Картка •••• 1234', 'Готівка в закладі'];

export default function CheckoutScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // The sum is read from the store rather than carried in route params: it can
  // no longer disagree with the cart if the screen is reopened.
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dispatch = useDispatch();

  const [time, setTime] = useState(PICKUP_TIMES[0]);
  const [payment, setPayment] = useState(PAYMENTS[0]);

  const confirm = useCallback(() => {
    // The action creator builds the number and timestamp, so the id it returns
    // is the only thing the confirmation screen needs to look the order up.
    const { payload } = dispatch(placeOrder({ items, total, time, payment }));
    dispatch(clearCart());
    navigation.navigate(SCREENS.CONFIRMATION, { orderId: payload.id });
  }, [dispatch, items, total, time, payment, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.label}>ЧАС САМОВИВОЗУ</Text>
      <View style={styles.chips}>
        {PICKUP_TIMES.map((option) => (
          <CustomButton
            key={option}
            title={option}
            variant={option === time ? 'primary' : 'secondary'}
            fullWidth={false}
            style={styles.chip}
            onPress={() => setTime(option)}
          />
        ))}
      </View>

      <Text style={styles.label}>СПОСІБ ОПЛАТИ</Text>
      <View style={styles.card}>
        {PAYMENTS.map((option, index) => (
          <TouchableOpacity
            key={option}
            style={[styles.payment, index < PAYMENTS.length - 1 && styles.paymentDivider]}
            activeOpacity={ACTIVE_OPACITY}
            onPress={() => setPayment(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: option === payment }}
          >
            <View style={[styles.radio, option === payment && styles.radioActive]} />
            <Text style={styles.paymentLabel}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>До сплати</Text>
        <Text style={styles.totalValue}>{total} ₴</Text>
      </View>

      <CustomButton
        title="Підтвердити замовлення"
        onPress={confirm}
        disabled={items.length === 0}
      />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  content: {
    padding: spacing.xxl,
    gap: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    height: CHIP_HEIGHT,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  paymentDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  radio: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioActive: {
    borderColor: colors.coffee,
    borderWidth: RADIO_RING,
  },
  paymentLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  totalLabel: {
    ...typography.subheading,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.subheading,
    color: colors.coffee,
  },
});
