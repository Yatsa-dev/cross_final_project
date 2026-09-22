import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInDown,
  FadeOutRight,
  LinearTransition,
} from 'react-native-reanimated';

import QuantityStepper from './QuantityStepper';
import { radii, shadows, sizes, spacing, typography } from '../theme';
import { useRenderLog } from '../hooks/useRenderLog';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.7;
const ENTER_DURATION = 260;
const EXIT_DURATION = 200;
const LAYOUT_DURATION = 240;

// Like ProductCard, the row reports its own id back so the cart screen keeps one
// dispatch callback for the whole list.
function CartItem({
  id,
  title,
  options,
  price,
  quantity = 1,
  imageUrl,
  onChangeQuantity,
  onRemove,
}) {
  useRenderLog('CartItem');
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleQuantity = useCallback(
    (next) => onChangeQuantity?.(id, next),
    [id, onChangeQuantity]
  );
  const handleRemove = useCallback(() => onRemove?.(id), [id, onRemove]);

  return (
    // Entering / exiting make an added or removed line visible, and the layout
    // transition slides the remaining rows into their new place instead of
    // snapping them.
    <Animated.View
      style={styles.container}
      entering={FadeInDown.duration(ENTER_DURATION)}
      exiting={FadeOutRight.duration(EXIT_DURATION)}
      layout={LinearTransition.duration(LAYOUT_DURATION)}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {options ? (
          <Text style={styles.options} numberOfLines={1}>
            {options}
          </Text>
        ) : null}
        <QuantityStepper value={quantity} onChange={handleQuantity} />
      </View>

      <View style={styles.trailing}>
        <Text style={styles.price}>{price}</Text>
        {onRemove ? (
          <TouchableOpacity
            onPress={handleRemove}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityRole="button"
            accessibilityLabel={`Видалити ${title} з кошика`}
          >
            <Ionicons name="trash-outline" size={sizes.iconMd} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

export default memo(CartItem);

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  image: {
    width: sizes.thumbMd,
    height: sizes.thumbMd,
    borderRadius: radii.md,
    backgroundColor: colors.muted,
  },
  body: {
    // Takes the free space so the price stays pinned to the right edge.
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  options: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  price: {
    ...typography.bodyStrong,
    color: colors.coffee,
  },
});
