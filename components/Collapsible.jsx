import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const DURATION = 240;
const CHEVRON_TURN = 180;
const PRESSED_OPACITY = 0.7;

// Expand / collapse driven by one shared value: it feeds both the body height
// and the chevron rotation, so the two always stay in step.
function Collapsible({ title, initiallyOpen = false, children }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [isOpen, setIsOpen] = useState(initiallyOpen);
  // Height is measured instead of hardcoded, because the drink description
  // varies in length between items.
  const [contentHeight, setContentHeight] = useState(0);
  const progress = useSharedValue(initiallyOpen ? 1 : 0);

  const toggle = useCallback(() => {
    setIsOpen((wasOpen) => {
      progress.value = withTiming(wasOpen ? 0 : 1, { duration: DURATION });
      return !wasOpen;
    });
  }, [progress]);

  const measure = useCallback((event) => {
    setContentHeight(event.nativeEvent.layout.height);
  }, []);

  const bodyStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * CHEVRON_TURN}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggle}
        style={({ pressed }) => [styles.head, pressed && styles.headPressed]}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={title}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={sizes.iconMd} color={colors.coffee} />
        </Animated.View>
      </Pressable>

      <Animated.View style={[styles.body, bodyStyle]}>
        {/* Absolute so the measured block never adds its own height to the row:
            the visible height comes only from the animated style. */}
        <View style={styles.measure} onLayout={measure}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
}

export default memo(Collapsible);

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      borderRadius: radii.lg,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
      backgroundColor: colors.card,
      paddingHorizontal: spacing.lg,
      overflow: 'hidden',
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.md,
    },
    headPressed: {
      opacity: PRESSED_OPACITY,
    },
    title: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    body: {
      overflow: 'hidden',
    },
    measure: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      gap: spacing.sm,
      paddingBottom: spacing.lg,
    },
  });
