export interface IBrand {
  id: number;
  name: string;
  country: string | null;
}

export default interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number | string;
  image: string;
  defaultImage: string | null;
  brand: IBrand | null;
  category: string;
  inStock: boolean;
  tmp?: string;
}