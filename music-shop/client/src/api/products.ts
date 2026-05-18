import type IProduct from '../interfaces/product.interface';

const API_URL = '/api/products';

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  brandId?: number | null;
  category?: string;
  inStock?: boolean;
}

export async function getProducts(): Promise<IProduct[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Не удалось загрузить товары');
  }

  return response.json();
}

export async function updateProduct(
  id: number,
  productData: UpdateProductData,
): Promise<IProduct> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error('Не удалось обновить товар');
  }

  return response.json();
}

export async function uploadProductImage(
  id: number,
  image: File,
): Promise<IProduct> {
  const formData = new FormData();

  formData.append('image', image);

  const response = await fetch(`${API_URL}/${id}/image`, {
    method: 'PATCH',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Не удалось загрузить изображение');
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Не удалось удалить товар');
  }
}