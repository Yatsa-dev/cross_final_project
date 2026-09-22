import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { clamp, latToTileY, lonToTileX, TILE_SIZE, tileUrl } from '../utils/tiles';
import { radii, sizes, spacing, typography } from '../theme';
import { useTheme } from '../context/ThemeContext';

const MIN_ZOOM = 13;
const MAX_ZOOM = 18;
const DEFAULT_ZOOM = 16;
// A 5x5 block always covers the viewport plus a margin to drag into.
const GRID = 5;
const GRID_CENTER = Math.floor(GRID / 2);
const MAP_HEIGHT = 260;
const ZOOM_DURATION = 180;
const MARKER_SIZE = 34;
const PRESSED_OPACITY = 0.75;

// An interactive map without a mapping dependency: raster tiles come straight
// from OpenStreetMap and the pan gesture moves the tile layer. react-native-maps
// has no web implementation, and this app has to work in the browser too.
function VenueMap({ latitude, longitude, label }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [size, setSize] = useState({ width: 0, height: MAP_HEIGHT });

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  // Fractional tile position of the pin, split into the tile it sits in and the
  // offset inside that tile.
  const { tiles, pinLeft, pinTop } = useMemo(() => {
    const fx = lonToTileX(longitude, zoom);
    const fy = latToTileY(latitude, zoom);
    const centerX = Math.floor(fx);
    const centerY = Math.floor(fy);

    const grid = [];
    for (let row = 0; row < GRID; row += 1) {
      for (let column = 0; column < GRID; column += 1) {
        const x = centerX - GRID_CENTER + column;
        const y = centerY - GRID_CENTER + row;
        grid.push({
          key: `${zoom}/${x}/${y}`,
          x,
          y,
          left: column * TILE_SIZE,
          top: row * TILE_SIZE,
        });
      }
    }

    return {
      tiles: grid,
      pinLeft: (GRID_CENTER + (fx - centerX)) * TILE_SIZE,
      pinTop: (GRID_CENTER + (fy - centerY)) * TILE_SIZE,
    };
  }, [latitude, longitude, zoom]);

  // How far the layer may travel before an edge of the tile block would show.
  const limitX = Math.max(0, (GRID * TILE_SIZE - size.width) / 2);
  const limitY = Math.max(0, (GRID * TILE_SIZE - size.height) / 2);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          startX.value = offsetX.value;
          startY.value = offsetY.value;
        })
        .onUpdate((event) => {
          offsetX.value = clamp(startX.value + event.translationX, -limitX, limitX);
          offsetY.value = clamp(startY.value + event.translationY, -limitY, limitY);
        }),
    [limitX, limitY, offsetX, offsetY, startX, startY]
  );

  // Tiles are replaced on zoom, so a kept pan offset would point elsewhere.
  const changeZoom = useCallback(
    (step) => {
      setZoom((current) => clamp(current + step, MIN_ZOOM, MAX_ZOOM));
      offsetX.value = withTiming(0, { duration: ZOOM_DURATION });
      offsetY.value = withTiming(0, { duration: ZOOM_DURATION });
    },
    [offsetX, offsetY]
  );

  const recenter = useCallback(() => {
    offsetX.value = withTiming(0, { duration: ZOOM_DURATION });
    offsetY.value = withTiming(0, { duration: ZOOM_DURATION });
  }, [offsetX, offsetY]);

  const measure = useCallback((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  const layerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  // Positions the layer so the pin sits in the middle of the viewport before
  // any panning is applied.
  const layerBase = {
    left: size.width / 2 - pinLeft,
    top: size.height / 2 - pinTop,
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.viewport}
        onLayout={measure}
        accessibilityLabel="Карта закладу"
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.layer, layerBase, layerStyle]}>
            {tiles.map((tile) => (
              <Image
                key={tile.key}
                source={{ uri: tileUrl(tile.x, tile.y, zoom) }}
                style={[styles.tile, { left: tile.left, top: tile.top }]}
              />
            ))}

            <View
              style={[
                styles.marker,
                { left: pinLeft - MARKER_SIZE / 2, top: pinTop - MARKER_SIZE },
              ]}
            >
              <Ionicons name="location" size={MARKER_SIZE} color={colors.espresso} />
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={styles.controls}>
          <Pressable
            style={({ pressed }) => [styles.control, pressed && styles.controlPressed]}
            onPress={() => changeZoom(1)}
            disabled={zoom >= MAX_ZOOM}
            accessibilityRole="button"
            accessibilityLabel="Наблизити карту"
          >
            <Ionicons name="add" size={sizes.iconMd} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.control, pressed && styles.controlPressed]}
            onPress={() => changeZoom(-1)}
            disabled={zoom <= MIN_ZOOM}
            accessibilityRole="button"
            accessibilityLabel="Віддалити карту"
          >
            <Ionicons name="remove" size={sizes.iconMd} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.control, pressed && styles.controlPressed]}
            onPress={recenter}
            accessibilityRole="button"
            accessibilityLabel="Повернутись до закладу"
          >
            <Ionicons name="locate" size={sizes.iconMd} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Required by the OpenStreetMap tile usage policy. */}
        <Text style={styles.attribution}>© OpenStreetMap contributors</Text>
      </View>

      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

export default memo(VenueMap);

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      gap: spacing.sm,
    },
    viewport: {
      height: MAP_HEIGHT,
      borderRadius: radii.lg,
      overflow: 'hidden',
      backgroundColor: colors.muted,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: colors.border,
    },
    layer: {
      position: 'absolute',
      width: GRID * TILE_SIZE,
      height: GRID * TILE_SIZE,
    },
    tile: {
      position: 'absolute',
      width: TILE_SIZE,
      height: TILE_SIZE,
    },
    marker: {
      position: 'absolute',
      width: MARKER_SIZE,
      height: MARKER_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    controls: {
      position: 'absolute',
      right: spacing.sm,
      top: spacing.sm,
      gap: spacing.xs,
    },
    control: {
      width: sizes.controlSm,
      height: sizes.controlSm,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
    },
    controlPressed: {
      opacity: PRESSED_OPACITY,
    },
    attribution: {
      position: 'absolute',
      left: spacing.sm,
      bottom: spacing.xs,
      ...typography.label,
      color: colors.textSecondary,
      backgroundColor: colors.card,
      paddingHorizontal: spacing.xs,
      borderRadius: radii.sm,
    },
    label: {
      ...typography.caption,
      color: colors.textSecondary,
    },
  });
