import { useCallback } from 'react';

import { fetchDrinks } from '../api/coffee';
import { useRequest } from './useRequest';

export { STATUS } from './useRequest';

export function useCoffeeMenu(category) {
  const fetcher = useCallback(() => fetchDrinks(category), [category]);
  const { status, data, error, reload } = useRequest(fetcher);

  return { status, drinks: data ?? [], error, reload };
}
