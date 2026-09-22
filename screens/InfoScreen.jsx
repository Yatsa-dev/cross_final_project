import { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

// Shared layout for the two drawer screens: they differ only by content,
// so the data comes from route params set in the drawer navigator.
const HERO_ICON = 32;
export default function InfoScreen({ route, navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { icon = 'information-circle-outline', title = '', text = '', rows = [] } =
    route.params ?? {};

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.badge}>
        <Ionicons name={icon} size={HERO_ICON} color={colors.coffee} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>

      {rows.length > 0 ? (
        <View style={styles.card}>
          {rows.map(([label, value], index) => (
            <View key={label} style={[styles.row, index < rows.length - 1 && styles.rowDivider]}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue}>{value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <CustomButton title="Назад до меню" variant="secondary" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
  content: {
    padding: spacing.xxl,
    gap: spacing.md,
  },
  badge: {
    width: sizes.controlLg,
    height: sizes.controlLg,
    borderRadius: sizes.controlLg / 2,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  text: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    borderRadius: radii.lg,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rowValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
