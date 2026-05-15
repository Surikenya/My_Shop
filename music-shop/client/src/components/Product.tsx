import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import type IProduct from '../interfaces/product.interface';

interface IProps {
  product: IProduct;
  onBuy: (product: IProduct) => void;
}

export default function Product({ product, onBuy }: IProps) {
  return (
    <Card sx={{ maxWidth: 320 }}>
      <CardMedia
        component="img"
        height="220"
        image={product.image}
        alt={product.title}
      />

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
          {product.description}
        </Typography>

        <Typography variant="body2">
          <strong>Бренд:</strong> {product.brand}
        </Typography>

        <Typography variant="body2">
          <strong>Категория:</strong> {product.category}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 700 }}>
          {product.price} ₽
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!product.inStock}
          onClick={() => onBuy(product)}
        >
          {product.inStock ? 'Купить' : 'Нет в наличии'}
        </Button>
      </CardContent>
    </Card>
  );
}
