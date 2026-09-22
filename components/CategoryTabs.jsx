import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { radii, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const ACTIVE_OPACITY = 0.8;
const TAB_HEIGHT = 36;

// Chip width follows its label: on a narrow screen the extra categories
// scroll out of view instead of shrinking.
function CategoryTabs({ categories = [], activeId, onChange }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => {
        const isActive = category.id === activeId;

        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
            onPress={() => onChange?.(category.id)}
            activeOpacity={ACTIVE_OPACITY}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

export default memo(CategoryTabs);

const createStyles = (colors) =>
  StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingRight: spacing.xxl,
  },
  tab: {
    height: TAB_HEIGHT,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.espresso,
  },
  tabInactive: {
    backgroundColor: colors.card,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.border,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.textOnDark,
  },
  labelInactive: {
    color: colors.textSecondary,
  },
});
