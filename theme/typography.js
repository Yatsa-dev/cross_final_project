import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

// Android has no intermediate fontWeight for the system font, so the medium face is set explicitly.
const mediumFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
});

export const typography = {
  display: { fontFamily, fontSize: 28, lineHeight: 34, fontWeight: '700' },
  heading: { fontFamily, fontSize: 22, lineHeight: 28, fontWeight: '600' },
  subheading: { fontFamily: mediumFamily, fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body: { fontFamily, fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontFamily: mediumFamily, fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontFamily, fontSize: 13, lineHeight: 18, fontWeight: '400' },
  label: { fontFamily: mediumFamily, fontSize: 11, lineHeight: 14, fontWeight: '600' },
};
