// Screen and navigator names are kept here so no route is referenced by a raw string.
export const SCREENS = {
  HOME: 'Home',
  PRODUCT_DETAILS: 'ProductDetails',
  SEARCH: 'Search',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  CONFIRMATION: 'Confirmation',
  PROFILE: 'Profile',
  ORDER_HISTORY: 'OrderHistory',
  FAVORITES: 'Favorites',
  VENUE: 'Venue',
  SUPPORT: 'Support',
  ABOUT: 'About',
};

export const STACKS = {
  MENU: 'MenuStack',
  SEARCH: 'SearchStack',
  CART: 'CartStack',
  PROFILE: 'ProfileStack',
};

export const DRAWER = {
  TABS: 'Tabs',
  SUPPORT: SCREENS.SUPPORT,
  ABOUT: SCREENS.ABOUT,
};

export const TITLES = {
  [SCREENS.HOME]: 'Меню',
  [SCREENS.PRODUCT_DETAILS]: 'Напій',
  [SCREENS.SEARCH]: 'Пошук',
  [SCREENS.CART]: 'Кошик',
  [SCREENS.CHECKOUT]: 'Оформлення',
  [SCREENS.CONFIRMATION]: 'Замовлення',
  [SCREENS.PROFILE]: 'Профіль',
  [SCREENS.ORDER_HISTORY]: 'Мої замовлення',
  [SCREENS.FAVORITES]: 'Улюблене',
  [SCREENS.VENUE]: 'Наш заклад',
  [SCREENS.SUPPORT]: 'Підтримка',
  [SCREENS.ABOUT]: 'Про заклад',
};

// Ionicons names for the bottom tabs, in the same order as the tab navigator.
export const TAB_ICONS = {
  [STACKS.MENU]: { active: 'grid', inactive: 'grid-outline' },
  [STACKS.SEARCH]: { active: 'search', inactive: 'search-outline' },
  [STACKS.CART]: { active: 'bag-handle', inactive: 'bag-handle-outline' },
  [STACKS.PROFILE]: { active: 'person', inactive: 'person-outline' },
};

export const TAB_LABELS = {
  [STACKS.MENU]: 'Меню',
  [STACKS.SEARCH]: 'Пошук',
  [STACKS.CART]: 'Кошик',
  [STACKS.PROFILE]: 'Профіль',
};
