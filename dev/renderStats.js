// Dev-only render accounting used to capture the before/after numbers for the
// re-render optimisation. Everything here is behind __DEV__ at the call sites,
// so no counter state ships in a production bundle.
//
// Flip this to true to bring the on-screen counter panel back; it stays off by
// default so it does not cover the interface during normal development.
export const SHOW_RENDER_STATS = false;
const counts = new Map();
const listeners = new Set();

const snapshot = () => [...counts.entries()].map(([label, total]) => ({ label, total }));

const notify = () => {
  const next = snapshot();
  listeners.forEach((listener) => listener(next));
};

export const bumpRender = (label) => {
  counts.set(label, (counts.get(label) ?? 0) + 1);
  notify();
};

export const resetRenderStats = () => {
  counts.clear();
  notify();
};

// The overlay mounts as a sibling of the navigator, so screens already flushed
// their counting effects by the time it subscribes. Replaying the current
// snapshot on subscribe keeps those first renders from being lost.
export const subscribeRenderStats = (listener) => {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
};
