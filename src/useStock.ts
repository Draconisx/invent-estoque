import { useState, useCallback } from 'react';
import type { Category, Product, Movement } from './types';
import * as store from './store';

export function useStock() {
  const [categories, setCategories] = useState<Category[]>(store.getCategories);
  const [products, setProducts] = useState<Product[]>(store.getProducts);
  const [movements, setMovements] = useState<Movement[]>(store.getMovements);

  const refresh = useCallback(() => {
    setCategories(store.getCategories());
    setProducts(store.getProducts());
    setMovements(store.getMovements());
  }, []);

  const addCategory = useCallback((name: string) => {
    const c: Category = { id: store.genId(), name };
    const updated = [...store.getCategories(), c];
    store.saveCategories(updated);
    refresh();
  }, [refresh]);

  const removeCategory = useCallback((id: string) => {
    store.saveCategories(store.getCategories().filter(c => c.id !== id));
    store.saveProducts(store.getProducts().filter(p => p.categoryId !== id));
    refresh();
  }, [refresh]);

  const addProduct = useCallback((categoryId: string, name: string, quantity: number, finalidade: string = '') => {
    const cats = store.getCategories();
    const cat = cats.find(c => c.id === categoryId);
    const p: Product = { id: store.genId(), categoryId, name, quantity };
    const updated = [...store.getProducts(), p];
    store.saveProducts(updated);
    const m: Movement = {
      id: store.genId(),
      productId: p.id,
      productName: name,
      categoryName: cat?.name || '',
      type: 'add',
      quantity,
      finalidade,
      timestamp: new Date().toISOString(),
    };
    store.addMovement(m);
    refresh();
  }, [refresh]);

  const removeProduct = useCallback((id: string) => {
    const prods = store.getProducts();
    const prod = prods.find(p => p.id === id);
    if (prod && prod.quantity > 0) {
      const cats = store.getCategories();
      const cat = cats.find(c => c.id === prod.categoryId);
      const m: Movement = {
        id: store.genId(),
        productId: id,
        productName: prod.name,
        categoryName: cat?.name || '',
        type: 'remove',
        quantity: prod.quantity,
        finalidade: 'Produto excluido do estoque',
        timestamp: new Date().toISOString(),
      };
      store.addMovement(m);
    }
    store.saveProducts(prods.filter(p => p.id !== id));
    refresh();
  }, [refresh]);

  const adjustQuantity = useCallback((productId: string, delta: number, type: 'add' | 'remove', finalidade: string = '') => {
    const prods = store.getProducts();
    const cats = store.getCategories();
    const idx = prods.findIndex(p => p.id === productId);
    if (idx === -1) return;
    const prod = prods[idx];
    const newQty = type === 'add' ? prod.quantity + delta : Math.max(0, prod.quantity - delta);
    const actualDelta = type === 'add' ? delta : prod.quantity - newQty;
    prods[idx] = { ...prod, quantity: newQty };
    store.saveProducts(prods);
    if (actualDelta > 0) {
      const cat = cats.find(c => c.id === prod.categoryId);
      const m: Movement = {
        id: store.genId(),
        productId,
        productName: prod.name,
        categoryName: cat?.name || '',
        type,
        quantity: actualDelta,
        finalidade,
        timestamp: new Date().toISOString(),
      };
      store.addMovement(m);
    }
    refresh();
  }, [refresh]);

  return { categories, products, movements, addCategory, removeCategory, addProduct, removeProduct, adjustQuantity };
}
