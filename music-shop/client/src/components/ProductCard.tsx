import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <img
        className="product-image"
        src={product.image}
        alt={product.title}
      />

      <div className="product-content">
        <h2 className="product-title">{product.title}</h2>

        <p className="product-description">{product.description}</p>

        <div className="product-meta">
          <span><strong>Бренд:</strong> {product.brand}</span>
          <span><strong>Категория:</strong> {product.category}</span>
        </div>

        <div className="product-bottom">
          <span className="product-price">{product.price} ₽</span>
          <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
