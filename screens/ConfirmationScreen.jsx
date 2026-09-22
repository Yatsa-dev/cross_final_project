import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import CustomButton from '../components/CustomButton';
import { SCREENS, STACKS } from '../navigation/routes';
import { selectOrderById } from '../store/ordersSlice';
import { formatOrderDateTime } from '../utils/date';
import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const SEAL_SIZE = 88;
const SEAL_ICON = 40;
export default function ConfirmationScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Only the id travels through navigation; the order itself is read from the
  // store, so this screen always shows what was actually saved.
  const orderId = route.params?.orderId;
  const order = useSelector((state) => selectOrderById(state, orderId));

  const rows = useMemo(
    () => [
      ['Номер замовлення', order ? `№ ${order.number}` : '—'],
      ['Оформлено', order ? formatOrderDateTime(order.createdAt) : '—'],
      ['Час готовності', order?.time ?? '—'],
      ['Спосіб оплати', order?.payment ?? '—'],
      ['Позицій', order ? String(order.items.length) : '—'],
      ['Сплачено', order ? `${order.total} ₴` : '—'],
    ],
    [order]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.badge}>
        <Ionicons name="checkmark" size={SEAL_ICON} color={colors.textOnDark} />
      </View>

      <Text style={styles.title}>Замовлення прийнято</Text>
      <Text style={styles.subtitle}>Ми надішлемо сповіщення, коли напій буде готовий.</Text>

      <View style={styles.card}>
        {rows.map(([label, value], index) => (
          <View
            key={label}
            style={[styles.row, index < rows.length - 1 && styles.rowDivider]}
          >
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Order history lives in the profile stack, so the jump goes through the
          tab navigator instead of this stack. */}
      <CustomButton
        title="Мої замовлення"
        variant="secondary"
        onPress={() =>
          navigation
            .getParent()
            ?.navigate(STACKS.PROFILE, { screen: SCREENS.ORDER_HISTORY })
        }
      />
      {/* popToTop returns to the first screen of this stack instead of stacking more screens. */}
      <CustomButton title="На головну" variant="ghost" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xxl,
  },
  badge: {
    width: SEAL_SIZE,
    height: SEAL_SIZE,
    borderRadius: SEAL_SIZE / 2,
    backgroundColor: colors.espresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    alignSelf: 'stretch',
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
