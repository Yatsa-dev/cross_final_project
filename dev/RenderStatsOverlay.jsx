import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resetRenderStats, subscribeRenderStats } from './renderStats';

// Fixed palette instead of theme tokens: the panel has to stay readable over
// both themes, and it must not re-render when the theme changes.
const PANEL_BG = 'rgba(17, 12, 9, 0.88)';
const PANEL_TEXT = '#F6EFE9';
const PANEL_ACCENT = '#D2A77C';
const PANEL_RIGHT = 12;
// Clears the tab bar so the panel never hides navigation in a screenshot.
const PANEL_BOTTOM = 100;
const PANEL_WIDTH = 190;
const PANEL_RADIUS = 10;
const PANEL_GAP = 4;
const PANEL_FONT = 12;
const PANEL_FONT_SM = 11;
const PANEL_PADDING = 10;

// Mirrors the render counters on screen so the before/after comparison can be
// captured in a plain screenshot instead of a devtools console.
export default function RenderStatsOverlay() {
  const [stats, setStats] = useState([]);

  useEffect(() => subscribeRenderStats(setStats), []);

  if (!__DEV__) return null;

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Лічильник рендерів</Text>

      {stats.length === 0 ? (
        <Text style={styles.empty}>ще нічого не рендерилось</Text>
      ) : (
        stats.map(({ label, total }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
            <Text style={styles.total}>{total}</Text>
          </View>
        ))
      )}

      <Pressable onPress={resetRenderStats} style={styles.reset}>
        <Text style={styles.resetLabel}>Скинути</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    right: PANEL_RIGHT,
    bottom: PANEL_BOTTOM,
    width: PANEL_WIDTH,
    padding: PANEL_PADDING,
    borderRadius: PANEL_RADIUS,
    backgroundColor: PANEL_BG,
    gap: PANEL_GAP,
    pointerEvents: 'box-none',
    zIndex: 999,
  },
  title: {
    color: PANEL_ACCENT,
    fontSize: PANEL_FONT_SM,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    color: PANEL_TEXT,
    fontSize: PANEL_FONT_SM,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: PANEL_GAP,
  },
  label: {
    color: PANEL_TEXT,
    fontSize: PANEL_FONT,
    flex: 1,
  },
  total: {
    color: PANEL_ACCENT,
    fontSize: PANEL_FONT,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  reset: {
    marginTop: PANEL_GAP,
    alignSelf: 'flex-start',
  },
  resetLabel: {
    color: PANEL_ACCENT,
    fontSize: PANEL_FONT_SM,
    textDecorationLine: 'underline',
  },
});
