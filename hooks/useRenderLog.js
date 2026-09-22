import { useEffect } from 'react';

import { bumpRender } from '../dev/renderStats';

// Counts one render of the calling component. The bump runs in an effect rather
// than during render so React's double-invocation in development does not
// inflate the numbers shown in the README comparison.
export function useRenderLog(label) {
  useEffect(() => {
    if (!__DEV__) return;
    bumpRender(label);
    console.log(`[render] ${label}`);
  });
}
