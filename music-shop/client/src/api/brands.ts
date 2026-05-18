import type { IBrand } from '../interfaces/product.interface';

const API_URL = '/api/brands';

export async function getBrands(): Promise<IBrand[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Не удалось загрузить бренды');
  }

  return response.json();
}