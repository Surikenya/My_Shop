export class CreateProductDto {
  title: string;
  description: string;
  price: number;
  image: string;
  defaultImage?: string | null;
  brandId?: number | null;
  category: string;
  inStock: boolean;
}