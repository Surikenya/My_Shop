import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import type IProduct from '../interfaces/product.interface';
import { getProducts } from '../api/products';
import Products from '../components/Products';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Ошибка при загрузке товаров');
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  function handleBuy(product: IProduct) {
    setCartCount((prev) => prev + 1);
    console.log('Товар добавлен в корзину:', product.title);
  }

  return (
    <main className="container main-content">
      <section className="hero">
        <h2>Музыкальные инструменты и оборудование</h2>
        <p>
          Выберите подходящее оборудование для сцены, студии и домашних занятий.
        </p>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Товаров в корзине: {cartCount}
        </Typography>
      </section>

      {loading && <p>Загрузка товаров...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <Products products={products} onBuy={handleBuy} />
      )}
    </main>
  );
}
