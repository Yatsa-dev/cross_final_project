import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const BACKDROP = 'rgba(0, 0, 0, 0.45)';
const SHEET_DURATION = 260;
const HANDLE_WIDTH = 44;
const HANDLE_HEIGHT = 4;

// A reusable sheet rather than a screen-specific one: the backdrop, the close
// button and the slide-in belong to the pattern, not to any single caller.
function BottomSheetModal({ visible, title, onClose, children }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(SHEET_DURATION)}
        exiting={FadeOut.duration(SHEET_DURATION)}
        style={styles.backdrop}
      >
        {/* Tapping outside closes the sheet; the sheet itself swallows the press. */}
        <Pressable style={styles.backdropPress} onPress={onClose} accessibilityLabel="Закрити" />

        <Animated.View
          entering={SlideInDown.duration(SHEET_DURATION)}
          exiting={SlideOutDown.duration(SHEET_DURATION)}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.head}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Закрити вікно"
              hitSlop={spacing.sm}
            >
              <Ionicons name="close" size={sizes.iconMd} color={colors.textSecondary} />
            </Pressable>
          </View>

          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default memo(BottomSheetModal);

const createStyles = (colors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: BACKDROP,
    },
    backdropPress: {
      ...StyleSheet.absoluteFillObject,
    },
    sheet: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radii.xl,
      borderTopRightRadius: radii.xl,
      padding: spacing.xxl,
      paddingTop: spacing.md,
      gap: spacing.md,
    },
    handle: {
      alignSelf: 'center',
      width: HANDLE_WIDTH,
      height: HANDLE_HEIGHT,
      borderRadius: HANDLE_HEIGHT / 2,
      backgroundColor: colors.border,
      marginBottom: spacing.sm,
    },
    head: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    title: {
      ...typography.subheading,
      color: colors.textPrimary,
      flex: 1,
    },
  });
