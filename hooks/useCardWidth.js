import { useWindowDimensions } from 'react-native';

import { spacing, WIDE_SCREEN_BREAKPOINT } from '../theme';

// useWindowDimensions updates on rotation, unlike Dimensions.get('window'),
// which returns the value only at call time.
export function useCardWidth({
  horizontalPadding = spacing.xxl,
  gutter = spacing.md,
  columns,
} = {}) {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const resolvedColumns = columns ?? (width >= WIDE_SCREEN_BREAKPOINT ? 3 : 2);

  const available = width - horizontalPadding * 2 - gutter * (resolvedColumns - 1);
  const cardWidth = Math.floor(available / resolvedColumns);

  return { cardWidth, columns: resolvedColumns, isLandscape, windowWidth: width };
}
