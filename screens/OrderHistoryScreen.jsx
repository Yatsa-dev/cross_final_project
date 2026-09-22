import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import BottomSheetModal from '../components/BottomSheetModal';
import CustomButton from '../components/CustomButton';
import OrderCard from '../components/OrderCard';
import { repeatOrder } from '../store/cartSlice';
import { markOrderDone, ORDER_STATUS, selectOrderById, selectOrders } from '../store/ordersSlice';
import { formatOrderDateTime } from '../utils/date';
import { SCREENS, STACKS } from '../navigation/routes';
import { spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// Module scope keeps the reference stable across renders of the screen.
const keyExtractor = (order) => order.id;

export default function OrderHistoryScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();

  const [openOrderId, setOpenOrderId] = useState(null);
  const openOrder = useSelector((state) => selectOrderById(state, openOrderId));

  const showDetails = useCallback((orderId) => setOpenOrderId(orderId), []);
  const closeDetails = useCallback(() => setOpenOrderId(null), []);

  // Without a backend nobody can report that a drink is ready, so the pickup is
  // confirmed by the person who placed the order.
  const confirmPickup = useCallback(
    (orderId) => {
      dispatch(markOrderDone(orderId));
      setOpenOrderId(null);
    },
    [dispatch]
  );

  // Repeating puts the saved lines straight back into the cart: the order
  // already holds everything a cart line needs, so nothing is re-fetched.
  const repeat = useCallback(
    (orderId) => {
      const order = orders.find((item) => item.id === orderId);
      if (!order) return;

      dispatch(repeatOrder(order.items));
      navigation.getParent()?.navigate(STACKS.CART, { screen: SCREENS.CART });
    },
    [orders, dispatch, navigation]
  );

  const renderItem = useCallback(
    ({ item }) => <OrderCard order={item} onPress={showDetails} onRepeat={repeat} />,
    [showDetails, repeat]
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        contentContainerStyle={orders.length ? styles.content : styles.emptyContent}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Замовлень ще немає</Text>
            <Text style={styles.emptyText}>
              Оформіть перше замовлення — воно збережеться тут і його можна буде повторити
              одним натисканням.
            </Text>
            <CustomButton
              title="Перейти до меню"
              onPress={() => navigation.getParent()?.navigate(STACKS.MENU)}
            />
          </View>
        }
      />

      <BottomSheetModal
        visible={Boolean(openOrder)}
        title={openOrder ? `Замовлення № ${openOrder.number}` : ''}
        onClose={closeDetails}
      >
        {openOrder ? (
          <>
            <View style={styles.sheetMeta}>
              <Text style={styles.sheetMetaLabel}>Оформлено</Text>
              <Text style={styles.sheetMetaValue}>
                {formatOrderDateTime(openOrder.createdAt)}
              </Text>
            </View>
            <View style={styles.sheetMeta}>
              <Text style={styles.sheetMetaLabel}>Час готовності</Text>
              <Text style={styles.sheetMetaValue}>{openOrder.time}</Text>
            </View>
            <View style={styles.sheetMeta}>
              <Text style={styles.sheetMetaLabel}>Оплата</Text>
              <Text style={styles.sheetMetaValue}>{openOrder.payment}</Text>
            </View>

            <View style={styles.sheetDivider} />

            {openOrder.items.map((item) => (
              <View key={item.id} style={styles.sheetLine}>
                <Text style={styles.sheetLineTitle} numberOfLines={1}>
                  {item.title}
                  {item.options ? ` · ${item.options}` : ''}
                </Text>
                <Text style={styles.sheetLineQty}>×{item.quantity}</Text>
                <Text style={styles.sheetLinePrice}>{item.price}</Text>
              </View>
            ))}

            <View style={styles.sheetDivider} />

            <View style={styles.sheetTotal}>
              <Text style={styles.sheetTotalLabel}>Сплачено</Text>
              <Text style={styles.sheetTotalValue}>{openOrder.total} ₴</Text>
            </View>

            {openOrder.status === ORDER_STATUS.PREPARING ? (
              <CustomButton
                title="Я забрав замовлення"
                variant="secondary"
                iconName="checkmark-circle-outline"
                onPress={() => confirmPickup(openOrder.id)}
              />
            ) : null}

            <CustomButton
              title="Повторити замовлення"
              onPress={() => {
                const orderId = openOrder.id;
                closeDetails();
                repeat(orderId);
              }}
            />
          </>
        ) : null}
      </BottomSheetModal>
    </View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: { flex: 1 },
    content: {
      padding: spacing.xxl,
      gap: spacing.md,
    },
    emptyContent: {
      flexGrow: 1,
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
    sheetMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    sheetMetaLabel: {
      ...typography.body,
      color: colors.textSecondary,
    },
    sheetMetaValue: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    sheetDivider: {
      height: StyleSheet.hairlineWidth * 2,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },
    sheetLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    sheetLineTitle: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    sheetLineQty: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    sheetLinePrice: {
      ...typography.bodyStrong,
      color: colors.coffee,
    },
    sheetTotal: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sheetTotalLabel: {
      ...typography.subheading,
      color: colors.textPrimary,
    },
    sheetTotalValue: {
      ...typography.subheading,
      color: colors.coffee,
    },
  });
