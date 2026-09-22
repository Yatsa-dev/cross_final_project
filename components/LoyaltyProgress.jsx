import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const BAR_HEIGHT = 8;
const FILL_DURATION = 420;
const FULL = 100;

// The card used to show a fixed "6 з 8". It now counts real cups and animates
// the bar whenever an order adds to the total.
function LoyaltyProgress({ cups, goal }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Cups keep counting past a full card, so only the remainder is shown.
  const earned = goal > 0 ? cups % goal : 0;
  const freeDrinks = goal > 0 ? Math.floor(cups / goal) : 0;
  const isComplete = cups > 0 && earned === 0;
  const filled = isComplete ? goal : earned;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(goal > 0 ? (filled / goal) * FULL : 0, {
      duration: FILL_DURATION,
    });
  }, [filled, goal, progress]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value}%` }));

  return (
    <View style={styles.card}>
      <Text style={styles.label}>БОНУСНА КАРТКА</Text>
      <Text style={styles.value}>
        {filled} з {goal} стаканів
      </Text>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
      </View>

      <Text style={styles.hint}>
        {isComplete
          ? 'Картку заповнено — наступний напій у подарунок'
          : `Ще ${goal - filled} до безкоштовного напою`}
      </Text>

      {freeDrinks > 0 ? (
        <Text style={styles.hint}>Заповнених карток: {freeDrinks}</Text>
      ) : null}
    </View>
  );
}

export default memo(LoyaltyProgress);

// The card sits on colors.coffee, which is dark in the light theme and light in
// the dark one. textOnDark flips with it, so the text stays readable.
const createStyles = (colors) =>
  StyleSheet.create({
    card: {
      padding: spacing.lg,
      borderRadius: radii.xl,
      backgroundColor: colors.coffee,
      gap: spacing.xs,
    },
    label: {
      ...typography.label,
      color: colors.textOnDark,
    },
    value: {
      ...typography.heading,
      color: colors.textOnDark,
    },
    track: {
      height: BAR_HEIGHT,
      borderRadius: BAR_HEIGHT / 2,
      backgroundColor: colors.muted,
      overflow: 'hidden',
      marginVertical: spacing.xs,
    },
    fill: {
      height: '100%',
      borderRadius: BAR_HEIGHT / 2,
      backgroundColor: colors.espresso,
    },
    hint: {
      ...typography.caption,
      color: colors.textOnDark,
    },
  });
