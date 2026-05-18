import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import type IProduct from '../interfaces/product.interface';
import type { IBrand } from '../interfaces/product.interface';
import { deleteProduct, getProducts, updateProduct } from '../api/products';
import type { UpdateProductData } from '../api/products';
import { getBrands } from '../api/brands';
import Products from '../components/Products';
import ProductFilter from '../components/ProductFilter';
import type { ProductFilters } from '../components/ProductFilter';

const initialFilters: ProductFilters = {
  category: '',
  minPrice: '',
  maxPrice: '',
  availability: '',
};

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [cartAnchorElement, setCartAnchorElement] =
    useState<HTMLButtonElement | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);

  useEffect(() => {
    async function loadData() {
      try {
        const productsData = await getProducts();
        const brandsData = await getBrands();

        setProducts(productsData);
        setBrands(brandsData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      products.map((product) => product.category),
    );

    return Array.from(uniqueCategories);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productPrice = Number(product.price);

      const isCategoryMatch =
        !filters.category || product.category === filters.category;

      const isMinPriceMatch =
        !filters.minPrice || productPrice >= Number(filters.minPrice);

      const isMaxPriceMatch =
        !filters.maxPrice || productPrice <= Number(filters.maxPrice);

      const isAvailabilityMatch =
        !filters.availability ||
        (filters.availability === 'available' && product.inStock) ||
        (filters.availability === 'notAvailable' && !product.inStock);

      return (
        isCategoryMatch &&
        isMinPriceMatch &&
        isMaxPriceMatch &&
        isAvailabilityMatch
      );
    });
  }, [products, filters]);

  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
  }, [cartItems]);

  const cartProducts = useMemo(() => {
    return products.filter((product) => cartItems[product.id]);
  }, [products, cartItems]);

  const cartTotal = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      const quantity = cartItems[product.id] || 0;

      return sum + Number(product.price) * quantity;
    }, 0);
  }, [cartProducts, cartItems]);

  const isCartOpen = Boolean(cartAnchorElement);

  function handleOpenCart(event: MouseEvent<HTMLButtonElement>) {
    setCartAnchorElement(event.currentTarget);
  }

  function handleCloseCart() {
    setCartAnchorElement(null);
  }

  function handleCartIncrement(product: IProduct) {
    setCartItems((prevCartItems) => ({
      ...prevCartItems,
      [product.id]: (prevCartItems[product.id] || 0) + 1,
    }));
  }

  function handleCartDecrement(productId: number) {
    setCartItems((prevCartItems) => {
      const currentQuantity = prevCartItems[productId] || 0;

      if (currentQuantity <= 1) {
        const { [productId]: _removedProduct, ...restCartItems } =
          prevCartItems;

        return restCartItems;
      }

      return {
        ...prevCartItems,
        [productId]: currentQuantity - 1,
      };
    });
  }

  async function handleProductUpdate(
    id: number,
    productData: UpdateProductData,
  ) {
    const updatedProduct = await updateProduct(id, productData);

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? updatedProduct : product,
      ),
    );
  }

  async function handleProductDelete(id: number) {
    await deleteProduct(id);

    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    );

    setCartItems((prevCartItems) => {
      const { [id]: _removedProduct, ...restCartItems } = prevCartItems;

      return restCartItems;
    });
  }

  function handleResetFilters() {
    setFilters(initialFilters);
  }

  return (
    <main className="container main-content">
      <section className="hero">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            alignItems: 'flex-start',
          }}
        >
          <Box>
            <h2>Музыкальные инструменты и оборудование</h2>
            <p>
              Выберите подходящее оборудование для сцены, студии и домашних
              занятий.
            </p>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Badge badgeContent={cartCount} color="primary">
              <IconButton
                onClick={handleOpenCart}
                sx={{
                  width: 44,
                  height: 44,
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: '#111827',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                }}
              >
                <ShoppingCartIcon />
              </IconButton>
            </Badge>

            <Popover
              open={isCartOpen}
              anchorEl={cartAnchorElement}
              onClose={handleCloseCart}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box
                sx={{
                  width: 360,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="h6">Корзина</Typography>

                {cartProducts.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    В корзине пока нет товаров.
                  </Typography>
                )}

                {cartProducts.map((product) => {
                  const quantity = cartItems[product.id] || 0;
                  const productTotal = Number(product.price) * quantity;

                  return (
                    <Box key={product.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 2,
                          alignItems: 'flex-start',
                        }}
                      >
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {product.title}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {product.price} ₽ × {quantity} = {productTotal} ₽
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #1976d2',
                            borderRadius: '8px',
                            overflow: 'hidden',
                          }}
                        >
                          <Button
                            variant="text"
                            onClick={() => handleCartDecrement(product.id)}
                            sx={{ minWidth: 34 }}
                          >
                            −
                          </Button>

                          <Typography
                            sx={{
                              minWidth: 28,
                              textAlign: 'center',
                              fontWeight: 700,
                            }}
                          >
                            {quantity}
                          </Typography>

                          <Button
                            variant="text"
                            onClick={() => handleCartIncrement(product)}
                            sx={{ minWidth: 34 }}
                          >
                            +
                          </Button>
                        </Box>
                      </Box>

                      <Divider sx={{ mt: 1.5 }} />
                    </Box>
                  );
                })}

                {cartProducts.length > 0 && (
                  <Typography variant="h6" sx={{ textAlign: 'right' }}>
                    Итого: {cartTotal} ₽
                  </Typography>
                )}

                <Button variant="contained" onClick={handleCloseCart}>
                  ОК
                </Button>
              </Box>
            </Popover>

            <ProductFilter
              filters={filters}
              categories={categories}
              onFiltersChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </Box>
        </Box>
      </section>

      {loading && <p>Загрузка данных...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Найдено товаров: {filteredProducts.length}
          </Typography>

          <Products
            products={filteredProducts}
            brands={brands}
            cartItems={cartItems}
            onCartIncrement={handleCartIncrement}
            onCartDecrement={handleCartDecrement}
            onProductUpdate={handleProductUpdate}
            onProductDelete={handleProductDelete}
          />
        </>
      )}
    </main>
  );
}