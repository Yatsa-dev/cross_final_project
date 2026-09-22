import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const BADGE_SIZE = 18;
const DEFAULT_MAX = 99;
const BADGE_PADDING = 4;
const POP_SCALE = 1.4;
const POP_IN_DURATION = 110;
const POP_BACK = { damping: 6, stiffness: 220 };

// Renders nothing at zero so callers don't need their own condition.
function Badge({ value = 0, max = DEFAULT_MAX, backgroundColor }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scale = useSharedValue(1);

  // A number swapping in place is easy to miss, so every change gives the badge
  // a short overshoot that settles back with a spring.
  useEffect(() => {
    if (!value) return;
    scale.value = withSequence(
      withTiming(POP_SCALE, { duration: POP_IN_DURATION }),
      withSpring(1, POP_BACK)
    );
  }, [value, scale]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Default cannot live in the signature: the palette is only known inside the component.
  const fill = backgroundColor ?? colors.caramel;
  if (!value || value <= 0) return null;

  const label = value > max ? `${max}+` : String(value);

  return (
    <Animated.View style={[styles.container, { backgroundColor: fill }, popStyle]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Animated.View>
  );
}

export default memo(Badge);

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    paddingHorizontal: BADGE_PADDING,
    borderRadius: BADGE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.label,
    color: colors.espresso,
  },
});
