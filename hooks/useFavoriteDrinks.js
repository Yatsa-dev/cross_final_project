import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { fetchAllDrinks } from '../api/coffee';
import { favoriteKey, selectFavoriteKeys } from '../store/favoritesSlice';
import { useRequest } from './useRequest';

// Favourites hold only identifiers, so the drinks themselves are fetched from
// the API and filtered here. Both categories are requested because a favourite
// can come from either one.
//
// With nothing marked there is nothing to filter, so the request is skipped:
// an empty list must not depend on the network to appear.
export function useFavoriteDrinks() {
  const keys = useSelector(selectFavoriteKeys);
  const { status, data, error, reload } = useRequest(fetchAllDrinks, {
    enabled: keys.length > 0,
  });

  const drinks = useMemo(
    () => (data ?? []).filter((drink) => keys.includes(favoriteKey(drink.category, drink.id))),
    [data, keys]
  );

  return { status, drinks, error, reload };
}
