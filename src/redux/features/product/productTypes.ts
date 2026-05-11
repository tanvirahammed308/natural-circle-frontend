export interface ProductImage {
  url: string;
  publicId: string;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category:
    | "organic-fruits"
    | "organic-vegetables"
    | "organic-grains"
    | "natural-sweeteners"
    | "herbal-teas"
    | "nuts-seeds"
    | "superfoods"
    | "other";

  images: ProductImage[];

  stock: number;
  weight?: string;

  ingredients: string[];

  nutritionalInfo?: NutritionalInfo;

  isOrganic: boolean;
  isGlutenFree: boolean;
  isVegan: boolean;

  rating: number;
  numReviews: number;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}