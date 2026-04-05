import type { Category, Product, Movement, ItemDescription } from './types';

const STORAGE_KEYS = {
  categories: 'stock_categories',
  products: 'stock_products',
  movements: 'stock_movements',
  descriptions: 'stock_descriptions',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getCategories(): Category[] {
  return load(STORAGE_KEYS.categories, []);
}
export function saveCategories(c: Category[]) {
  save(STORAGE_KEYS.categories, c);
}

export function getProducts(): Product[] {
  return load(STORAGE_KEYS.products, []);
}
export function saveProducts(p: Product[]) {
  save(STORAGE_KEYS.products, p);
}

export function getMovements(): Movement[] {
  return load(STORAGE_KEYS.movements, []);
}
export function saveMovements(m: Movement[]) {
  save(STORAGE_KEYS.movements, m);
}

export function addMovement(m: Movement) {
  const all = getMovements();
  all.push(m);
  save(STORAGE_KEYS.movements, all);
}

export function getDescriptions(): ItemDescription[] {
  return load(STORAGE_KEYS.descriptions, []);
}
export function saveDescriptions(d: ItemDescription[]) {
  save(STORAGE_KEYS.descriptions, d);
}
export function addDescription(d: ItemDescription) {
  const all = getDescriptions();
  all.push(d);
  save(STORAGE_KEYS.descriptions, all);
}

export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
