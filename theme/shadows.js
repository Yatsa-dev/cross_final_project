import { Platform } from 'react-native';

import { SHADOW_TINT } from './palettes';

// iOS draws shadows with shadow*, Android with elevation.
const shadow = ({ elevation, opacity, radius, offsetY }) =>
  Platform.select({
    ios: {
      shadowColor: SHADOW_TINT,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {},
  });

export const shadows = {
  card: shadow({ elevation: 2, opacity: 0.08, radius: 12, offsetY: 4 }),
  raised: shadow({ elevation: 6, opacity: 0.16, radius: 20, offsetY: 8 }),
};
