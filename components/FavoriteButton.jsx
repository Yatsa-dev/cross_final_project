import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

import { favoriteKey, selectIsFavorite, toggleFavorite } from '../store/favoritesSlice';
import { radii, sizes, spacing } from '../theme';
import { useTheme } from '../context/ThemeContext';

const POP_SCALE = 1.3;
const POP_IN_DURATION = 110;
const POP_BACK = { damping: 6, stiffness: 220 };
const PRESSED_OPACITY = 0.7;

// This button reads the store itself instead of taking a flag from its parent.
// A list screen would otherwise have to pass a new prop to every card on each
// toggle, which would undo the re-render work done earlier in the project.
function FavoriteButton({ category, drinkId, onSurface = false }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const key = favoriteKey(category, drinkId);
  const isFavorite = useSelector((state) => selectIsFavorite(state, key));
  const dispatch = useDispatch();

  const scale = useSharedValue(1);

  const toggle = useCallback(() => {
    scale.value = withSequence(
      withTiming(POP_SCALE, { duration: POP_IN_DURATION }),
      withSpring(1, POP_BACK)
    );
    dispatch(toggleFavorite(category, drinkId));
  }, [dispatch, category, drinkId, scale]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={toggle}
      style={({ pressed }) => [
        styles.button,
        onSurface && styles.onSurface,
        pressed && styles.pressed,
      ]}
      hitSlop={spacing.sm}
      accessibilityRole="button"
      accessibilityState={{ selected: isFavorite }}
      accessibilityLabel={isFavorite ? 'Прибрати з улюбленого' : 'Додати в улюблене'}
    >
      <Animated.View style={popStyle}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={sizes.iconMd}
          color={isFavorite ? colors.caramel : colors.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

export default memo(FavoriteButton);

const createStyles = (colors) =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Over a photo the icon needs its own plate to stay readable.
    onSurface: {
      width: sizes.controlSm,
      height: sizes.controlSm,
      borderRadius: radii.sm,
      backgroundColor: colors.card,
    },
    pressed: {
      opacity: PRESSED_OPACITY,
    },
  });
