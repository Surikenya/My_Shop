import Box from '@mui/material/Box';
import type IProduct from '../interfaces/product.interface';
import Product from './Product';

interface IProps {
  products: IProduct[];
  onBuy: (product: IProduct) => void;
}

export default function Products({ products, onBuy }: IProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
      }}
    >
      {products.map((product) => (
        <Product key={product.id} product={product} onBuy={onBuy} />
      ))}
    </Box>
  );
}
