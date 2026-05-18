import Box from '@mui/material/Box';
import type IProduct from '../interfaces/product.interface';
import type { IBrand } from '../interfaces/product.interface';
import type { UpdateProductData } from '../api/products';
import Product from './Product';

interface IProps {
  products: IProduct[];
  brands: IBrand[];
  cartItems: Record<number, number>;
  onCartIncrement: (product: IProduct) => void;
  onCartDecrement: (productId: number) => void;
  onProductUpdate: (id: number, productData: UpdateProductData) => Promise<void>;
  onProductDelete: (id: number) => Promise<void>;
}

export default function Products({
  products,
  brands,
  cartItems,
  onCartIncrement,
  onCartDecrement,
  onProductUpdate,
  onProductDelete,
}: IProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 3,
        alignItems: 'stretch',

        '& > .MuiCard-root': {
          width: '100%',
          maxWidth: 'none !important',
        },
      }}
    >
      {products.map((product) => (
        <Product
          key={product.id}
          product={product}
          brands={brands}
          quantity={cartItems[product.id] || 0}
          onCartIncrement={onCartIncrement}
          onCartDecrement={onCartDecrement}
          onProductUpdate={onProductUpdate}
          onProductDelete={onProductDelete}
        />
      ))}
    </Box>
  );
}