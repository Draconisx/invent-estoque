export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  quantity: number;
}

export interface Movement {
  id: string;
  productId: string;
  productName: string;
  categoryName: string;
  type: 'add' | 'remove';
  quantity: number;
  finalidade: string;
  timestamp: string; // ISO string
}

export interface ItemDescription {
  id: string;
  movementId: string;
  productName: string;
  categoryName: string;
  description: string;
  year: number;
  timestamp: string; // ISO string of when description was added
}

export type Tab = 'estoque' | 'relatorios';
