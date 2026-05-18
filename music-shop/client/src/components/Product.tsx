import { useEffect, useState, type ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type IProduct from '../interfaces/product.interface';
import type { IBrand } from '../interfaces/product.interface';
import { uploadProductImage } from '../api/products';
import type { UpdateProductData } from '../api/products';

interface IProps {
  product: IProduct;
  brands: IBrand[];
  quantity: number;
  onCartIncrement: (product: IProduct) => void;
  onCartDecrement: (productId: number) => void;
  onProductUpdate: (id: number, productData: UpdateProductData) => Promise<void>;
  onProductDelete: (id: number) => Promise<void>;
}

function getFallbackImage(product: IProduct) {
  return product.defaultImage || '/images/no-image.jpg';
}

export default function Product({
  product,
  brands,
  quantity,
  onCartIncrement,
  onCartDecrement,
  onProductUpdate,
  onProductDelete,
}: IProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState(product.image);
  const [previewImage, setPreviewImage] = useState(product.image);

  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    price: String(product.price),
    image: product.image,
    brandId: product.brand ? String(product.brand.id) : '',
    category: product.category,
    inStock: product.inStock,
  });

  useEffect(() => {
    setCurrentImage(product.image);
    setPreviewImage(product.image);

    setFormData({
      title: product.title,
      description: product.description,
      price: String(product.price),
      image: product.image,
      brandId: product.brand ? String(product.brand.id) : '',
      category: product.category,
      inStock: product.inStock,
    });
  }, [product]);

  const brandName = product.brand ? product.brand.name : 'Бренд не указан';

  function resetForm() {
    setSelectedFile(null);
    setCurrentImage(product.image);
    setPreviewImage(product.image);

    setFormData({
      title: product.title,
      description: product.description,
      price: String(product.price),
      image: product.image,
      brandId: product.brand ? String(product.brand.id) : '',
      category: product.category,
      inStock: product.inStock,
    });
  }

  function handleStartEdit() {
    resetForm();
    setIsEditing(true);
  }

  function handleCancel() {
    resetForm();
    setIsEditing(false);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  }

  function handleImageError() {
    setCurrentImage(getFallbackImage(product));
  }

  function handlePreviewImageError() {
    setPreviewImage(getFallbackImage(product));
  }

  async function handleSave() {
    let imagePath = formData.image;

    if (selectedFile) {
      const productWithNewImage = await uploadProductImage(
        product.id,
        selectedFile,
      );

      imagePath = productWithNewImage.image;
    }

    await onProductUpdate(product.id, {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      image: imagePath,
      brandId: formData.brandId ? Number(formData.brandId) : null,
      category: formData.category,
      inStock: formData.inStock,
    });

    setSelectedFile(null);
    setPreviewImage(imagePath);
    setCurrentImage(imagePath);
    setIsEditing(false);
  }

  async function handleDelete() {
    const isConfirmed = window.confirm(
      `Удалить товар "${product.title}"? Это действие нельзя отменить.`,
    );

    if (!isConfirmed) {
      return;
    }

    await onProductDelete(product.id);
  }

  if (isEditing) {
    return (
      <Card sx={{ maxWidth: 320 }}>
        <CardMedia
          component="img"
          height="220"
          image={previewImage}
          alt={formData.title}
          onError={handlePreviewImageError}
        />

        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Название"
              value={formData.title}
              onChange={(event) =>
                setFormData({ ...formData, title: event.target.value })
              }
              fullWidth
            />

            <TextField
              label="Описание"
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Цена"
              type="number"
              value={formData.price}
              onChange={(event) =>
                setFormData({ ...formData, price: event.target.value })
              }
              fullWidth
            />

            <Button variant="outlined" component="label">
              Выбрать фото с компьютера
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {selectedFile && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Выбран файл: {selectedFile.name}
              </Typography>
            )}

            <TextField
              label="Путь к изображению"
              value={formData.image}
              onChange={(event) => {
                setFormData({ ...formData, image: event.target.value });
                setPreviewImage(event.target.value);
                setSelectedFile(null);
              }}
              fullWidth
            />

            <TextField
              select
              label="Бренд"
              value={formData.brandId}
              onChange={(event) =>
                setFormData({ ...formData, brandId: event.target.value })
              }
              fullWidth
            >
              <MenuItem value="">Без бренда</MenuItem>

              {brands.map((brand) => (
                <MenuItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Категория"
              value={formData.category}
              onChange={(event) =>
                setFormData({ ...formData, category: event.target.value })
              }
              fullWidth
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.inStock}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      inStock: event.target.checked,
                    })
                  }
                />
              }
              label="В наличии"
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSave}>
                Сохранить
              </Button>

              <Button variant="outlined" onClick={handleCancel}>
                Отмена
              </Button>
            </Box>

            <Button color="error" variant="outlined" onClick={handleDelete}>
              Удалить товар
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 320 }}>
      <CardMedia
        component="img"
        height="220"
        image={currentImage}
        alt={product.title}
        onError={handleImageError}
      />

      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.title}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
          {product.description}
        </Typography>

        <Typography variant="body2">
          <strong>Бренд:</strong> {brandName}
        </Typography>

        <Typography variant="body2">
          <strong>Категория:</strong> {product.category}
        </Typography>

        <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 700 }}>
          {product.price} ₽
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
          {quantity > 0 ? (
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
                onClick={() => onCartDecrement(product.id)}
                sx={{ minWidth: 40 }}
              >
                −
              </Button>

              <Typography
                sx={{
                  minWidth: 32,
                  textAlign: 'center',
                  fontWeight: 700,
                }}
              >
                {quantity}
              </Typography>

              <Button
                variant="text"
                onClick={() => onCartIncrement(product)}
                sx={{ minWidth: 40 }}
              >
                +
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              disabled={!product.inStock}
              onClick={() => onCartIncrement(product)}
            >
              {product.inStock ? 'Купить' : 'Нет в наличии'}
            </Button>
          )}

          <Button variant="outlined" onClick={handleStartEdit}>
            Редактировать
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}