import type IProduct from '../interfaces/product.interface';

const API_URL = 'http://localhost:3000/api/products';

export async function getProducts(): Promise<IProduct[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Не удалось загрузить товары');
  }

  return response.json();
}