import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';

import CustomButton from './CustomButton';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../store/ordersSlice';
import { formatOrderDate } from '../utils/date';
import { radii, shadows, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ENTER_DURATION = 260;
const LAYOUT_DURATION = 240;
const REPEAT_HEIGHT = 36;
const PRESSED_OPACITY = 0.85;

// Takes the order and reports its id back, so the screen keeps one callback for
// the whole list instead of a new arrow per card.
//
// "Open details" and "repeat" are siblings rather than nested: a button inside a
// button is invalid markup on web.
function OrderCard({ order, onPress, onRepeat }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handlePress = useCallback(() => onPress?.(order.id), [order.id, onPress]);
  const handleRepeat = useCallback(() => onRepeat?.(order.id), [order.id, onRepeat]);

  const summary = useMemo(
    () => order.items.map((item) => item.title).join(', '),
    [order.items]
  );

  const isDone = order.status === ORDER_STATUS.DONE;

  return (
    <Animated.View
      entering={FadeInDown.duration(ENTER_DURATION)}
      layout={LinearTransition.duration(LAYOUT_DURATION)}
    >
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [styles.openArea, pressed && styles.cardPressed]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`Замовлення № ${order.number}, деталі`}
        >
          <View style={styles.head}>
            <View>
              <Text style={styles.number}>№ {order.number}</Text>
              <Text style={styles.date}>{formatOrderDate(order.createdAt)}</Text>
            </View>

            <View style={[styles.status, isDone && styles.statusDone]}>
              <Text style={[styles.statusLabel, isDone && styles.statusLabelDone]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Text>
            </View>
          </View>

          <Text style={styles.items} numberOfLines={2}>
            {summary}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.total}>{order.total} ₴</Text>
          <CustomButton
            title="Повторити"
            variant="secondary"
            fullWidth={false}
            style={styles.repeat}
            onPress={handleRepeat}
          />
        </View>
      </View>
    </Animated.View>
  );
}

export default memo(OrderCard);

const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: colors.card,
      gap: spacing.sm,
      ...shadows.card,
    },
    openArea: {
      gap: spacing.sm,
    },
    cardPressed: {
      opacity: PRESSED_OPACITY,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    number: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    date: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    status: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.sm,
      backgroundColor: colors.muted,
    },
    statusDone: {
      backgroundColor: colors.success,
    },
    statusLabel: {
      ...typography.label,
      color: colors.coffee,
    },
    statusLabelDone: {
      color: colors.textOnDark,
    },
    items: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    total: {
      ...typography.subheading,
      color: colors.coffee,
    },
    repeat: {
      height: REPEAT_HEIGHT,
      paddingHorizontal: spacing.lg,
    },
  });
