import { useCallback, useEffect, useReducer } from 'react';

export const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

const initialState = { status: STATUS.LOADING, data: null, error: null };

// useReducer keeps the three request states in one transition instead of three
// separate useState calls that could briefly disagree with each other.
function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return { status: STATUS.LOADING, data: null, error: null };
    case 'success':
      return { status: STATUS.SUCCESS, data: action.payload, error: null };
    case 'error':
      return { status: STATUS.ERROR, data: null, error: action.payload };
    default:
      return state;
  }
}

// Shared request lifecycle: the menu, a single drink and the favourites list all
// need the same loading / success / error transitions and the same protection
// against a stale response.
//
// `fetcher` must be stable - wrap it in useCallback - or the effect refires on
// every render of the calling screen.
//
// `enabled: false` reports success with no data instead of firing the request.
// A screen that already knows it has nothing to show should not depend on the
// network to say so.
export function useRequest(fetcher, { enabled = true } = {}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const run = useCallback(
    async (isActive) => {
      dispatch({ type: 'load' });
      try {
        const data = await fetcher();
        // Switching input fast can resolve an old request last, so a stale
        // response is dropped instead of overwriting the current one.
        if (!isActive || isActive()) dispatch({ type: 'success', payload: data });
      } catch (error) {
        if (!isActive || isActive()) dispatch({ type: 'error', payload: error.message });
      }
    },
    [fetcher]
  );

  // Wrapped rather than passed straight to onPress: a press handler would hand
  // run() the press event as its isActive argument.
  const reload = useCallback(() => run(), [run]);

  useEffect(() => {
    if (!enabled) {
      dispatch({ type: 'success', payload: null });
      return undefined;
    }

    let active = true;

    run(() => active);
    return () => {
      active = false;
    };
  }, [run, enabled]);

  return { ...state, reload };
}
