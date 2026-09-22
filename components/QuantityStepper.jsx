import { memo, useCallback, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { MAX_QUANTITY, MIN_QUANTITY } from '../store/cartSlice';
import { spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.7;
const STEPPER_ICON = 16;
const STEPPER_HEIGHT = 30;
const BUTTON_WIDTH = 30;

// Bounds default to the ones the cart reducer clamps to, so the control can
// never offer a value the store would silently correct.
function QuantityStepper({ value = MIN_QUANTITY, min = MIN_QUANTITY, max = MAX_QUANTITY, onChange }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const canDecrease = value > min;
  const canIncrease = value < max;

  const decrease = useCallback(() => {
    if (canDecrease) onChange?.(value - 1);
  }, [canDecrease, onChange, value]);
  const increase = useCallback(() => {
    if (canIncrease) onChange?.(value + 1);
  }, [canIncrease, onChange, value]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={decrease}
        disabled={!canDecrease}
        activeOpacity={ACTIVE_OPACITY}
        accessibilityRole="button"
        accessibilityLabel="Зменшити кількість"
      >
        <Ionicons
          name="remove"
          size={STEPPER_ICON}
          color={canDecrease ? colors.textPrimary : colors.border}
        />
      </TouchableOpacity>

      <Text style={styles.value}>{value}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={increase}
        disabled={!canIncrease}
        activeOpacity={ACTIVE_OPACITY}
        accessibilityRole="button"
        accessibilityLabel="Збільшити кількість"
      >
        <Ionicons name="add" size={STEPPER_ICON} color={canIncrease ? colors.textPrimary : colors.border} />
      </TouchableOpacity>
    </View>
  );
}

export default memo(QuantityStepper);

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: STEPPER_HEIGHT,
    borderRadius: STEPPER_HEIGHT / 2,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  button: {
    width: BUTTON_WIDTH,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: spacing.xl,
    textAlign: 'center',
  },
});
