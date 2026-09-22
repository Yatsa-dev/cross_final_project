import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback, useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import FavoriteButton from './FavoriteButton';
import { radii, shadows, sizes, spacing, typography } from '../theme';
import { useRenderLog } from '../hooks/useRenderLog';
import { useTheme } from '../context/ThemeContext';

const PRESSED_OPACITY = 0.9;
const IMAGE_RATIO = 0.62; // image height relative to card width

// The card takes an id and hands it back to the screen, so the whole grid can
// share one callback instead of getting a fresh arrow per item on every render.
//
// The card itself is a plain View. The three controls it holds - open details,
// favourite and add - are siblings, never nested: a pressable inside a pressable
// renders as a button inside a button on web, which is invalid markup.
function ProductCard({
  id,
  category,
  title,
  volume,
  price,
  imageUrl,
  width,
  onPress,
  onAdd,
}) {
  useRenderLog('ProductCard');
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Both parts of the drink identity travel back, because /hot and /iced
  // reuse ids and the id alone would not be enough to open the right drink.
  const handlePress = useCallback(() => onPress?.(id, category), [id, category, onPress]);
  const handleAdd = useCallback(() => onAdd?.(id, category), [id, category, onAdd]);

  // Both styles mix a sheet entry with a runtime size, so they are composed once
  // per width change instead of allocating a new array on every render.
  const containerStyle = useMemo(() => [styles.container, { width }], [styles, width]);
  const imageStyle = useMemo(
    () => [styles.image, { height: width * IMAGE_RATIO }],
    [styles, width]
  );

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.openArea, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${price}`}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={imageStyle} resizeMode="cover" />
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {volume ? <Text style={styles.volume}>{volume}</Text> : null}
          <Text style={styles.price}>{price}</Text>
        </View>
      </Pressable>

      <View style={styles.favorite}>
        <FavoriteButton category={category} drinkId={id} onSurface />
      </View>

      <Pressable
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        onPress={handleAdd}
        accessibilityRole="button"
        accessibilityLabel={`Додати ${title} у кошик`}
      >
        <Ionicons name="add" size={sizes.iconMd} color={colors.textOnDark} />
      </Pressable>
    </View>
  );
}

export default memo(ProductCard);

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: radii.lg,
      padding: spacing.md,
      ...shadows.card,
    },
    openArea: {
      // Leaves room for the add button, which is positioned over this corner.
      paddingBottom: spacing.xs,
    },
    pressed: {
      opacity: PRESSED_OPACITY,
    },
    imageWrapper: {
      position: 'relative',
    },
    image: {
      width: '100%',
      borderRadius: radii.md,
      backgroundColor: colors.muted,
    },
    favorite: {
      position: 'absolute',
      top: spacing.md + spacing.sm,
      right: spacing.md + spacing.sm,
    },
    body: {
      marginTop: spacing.md,
      gap: 2,
      // Keeps the price clear of the add button in the opposite corner.
      paddingRight: sizes.controlSm + spacing.sm,
    },
    title: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    volume: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    price: {
      ...typography.bodyStrong,
      color: colors.coffee,
      marginTop: spacing.xs,
    },
    addButton: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      width: sizes.controlSm,
      height: sizes.controlSm,
      borderRadius: sizes.controlSm / 2,
      backgroundColor: colors.espresso,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
