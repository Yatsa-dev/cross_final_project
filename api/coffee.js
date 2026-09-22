// Public REST API with coffee drinks: https://api.sampleapis.com/coffee
// No key required, returns title, description, ingredients and an image per drink.
const API_BASE_URL = 'https://api.sampleapis.com/coffee';

export const CATEGORIES = [
  { id: 'hot', label: 'Гарячі' },
  { id: 'iced', label: 'Холодні' },
];

const REQUEST_TIMEOUT_MS = 10000;
const BASE_PRICE = 45;
const PRICE_STEP = 5;
const PRICE_VARIANTS = 6;
const VOLUMES = ['250 мл', '350 мл', '450 мл'];

// The API returns no price or volume. Both are derived from the id so the same
// drink always shows the same values instead of jumping between renders.
const priceFor = (id) => `${BASE_PRICE + (id % PRICE_VARIANTS) * PRICE_STEP} ₴`;
const volumeFor = (id) => VOLUMES[id % VOLUMES.length];

// Response shape differs from what the UI components expect, so every drink
// passes through this mapper and screens never touch raw API fields.
// The category travels with the drink because /hot and /iced reuse the same
// ids - four of them overlap - so an id alone does not identify a drink.
const mapDrink = (raw, category) => ({
  id: String(raw.id),
  category,
  title: raw.title,
  description: raw.description,
  ingredients: raw.ingredients ?? [],
  imageUrl: raw.image,
  price: priceFor(raw.id),
  volume: volumeFor(raw.id),
});

const NOT_FOUND = Symbol('notFound');

// fetch has no built-in timeout: without AbortController a dead network would
// leave the screen spinning forever instead of showing the error state.
async function request(url, { notFoundAsNull = false } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    // A missing drink is a normal outcome, not a failure: it is reported back
    // separately so the screen can say "no such drink" instead of "no connection".
    if (response.status === 404 && notFoundAsNull) {
      return NOT_FOUND;
    }

    if (!response.ok) {
      throw new Error(`Сервер відповів кодом ${response.status}.`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Сервер не відповів вчасно. Перевірте зʼєднання.');
    }
    // Errors thrown above already carry a readable message; only network-level
    // failures need to be translated.
    if (error instanceof TypeError) {
      throw new Error('Немає звʼязку з сервером. Перевірте інтернет.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchDrinks(category = CATEGORIES[0].id) {
  const data = await request(`${API_BASE_URL}/${category}`);
  return Array.isArray(data) ? data.map((raw) => mapDrink(raw, category)) : [];
}

export async function fetchDrinkById(id, category = CATEGORIES[0].id) {
  const data = await request(`${API_BASE_URL}/${category}/${id}`, { notFoundAsNull: true });
  if (data === NOT_FOUND) return null;
  return data && data.id ? mapDrink(data, category) : null;
}

// Favourites can hold drinks from both categories, so the screen that shows
// them needs the whole menu rather than one category at a time.
export async function fetchAllDrinks() {
  const lists = await Promise.all(CATEGORIES.map(({ id }) => fetchDrinks(id)));
  return lists.flat();
}
