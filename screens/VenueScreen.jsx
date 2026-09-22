import Ionicons from '@expo/vector-icons/Ionicons';
import { useCallback, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

import CustomButton from '../components/CustomButton';
import VenueMap from '../components/VenueMap';
import { VENUE } from '../data/venue';
import { STACKS } from '../navigation/routes';
import { radii, shadows, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

export default function VenueScreen({ navigation }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // A geo: link opens the platform map app; the browser falls back to the
  // OpenStreetMap page, so the button works everywhere the app runs.
  const openInMaps = useCallback(() => {
    const { latitude, longitude } = VENUE;
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`;
    Linking.openURL(url);
  }, []);

  const call = useCallback(() => {
    Linking.openURL(`tel:${VENUE.phone.replace(/\s/g, '')}`);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <VenueMap
        latitude={VENUE.latitude}
        longitude={VENUE.longitude}
        label="Перетягніть карту, щоб роздивитись район"
      />

      <View style={styles.card}>
        <Text style={styles.title}>{VENUE.title}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={sizes.iconMd} color={colors.coffee} />
          <Text style={styles.address}>{VENUE.address}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ГРАФІК РОБОТИ</Text>
        {VENUE.hours.map((entry) => (
          <View key={entry.days} style={styles.hoursRow}>
            <Text style={styles.hoursDays}>{entry.days}</Text>
            <Text style={styles.hoursTime}>{entry.time}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>ПРО ЗАКЛАД</Text>
        {VENUE.highlights.map((item) => (
          <View key={item.label} style={styles.highlightRow}>
            <Ionicons name={item.icon} size={sizes.iconMd} color={colors.coffee} />
            <Text style={styles.highlight}>{item.label}</Text>
          </View>
        ))}
      </View>

      <CustomButton title="Прокласти маршрут" iconName="navigate-outline" onPress={openInMaps} />
      <CustomButton title={VENUE.phone} variant="secondary" iconName="call-outline" onPress={call} />
      <CustomButton
        title="Замовити на самовивіз"
        variant="ghost"
        onPress={() => navigation.getParent()?.navigate(STACKS.MENU)}
      />
    </ScrollView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    content: {
      padding: spacing.xxl,
      gap: spacing.md,
    },
    card: {
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: colors.card,
      gap: spacing.sm,
      ...shadows.card,
    },
    title: {
      ...typography.subheading,
      color: colors.textPrimary,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    address: {
      ...typography.body,
      color: colors.textSecondary,
      flex: 1,
    },
    label: {
      ...typography.label,
      color: colors.textSecondary,
    },
    hoursRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    hoursDays: {
      ...typography.body,
      color: colors.textSecondary,
    },
    hoursTime: {
      ...typography.bodyStrong,
      color: colors.textPrimary,
    },
    highlightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    highlight: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
  });
