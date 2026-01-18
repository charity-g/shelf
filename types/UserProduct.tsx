export interface UserProduct {
  USER_ID: string;
  PRODUCT_ID: string;
  PRODUCT_DESC?: string;
  CATEGORY?: string;
  TIME_OF_DAY?: string;
  SKIN_TYPE?: string;
  NAME?: string;
  INGREDIENTS?: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
}

export interface ProductDetails {
  id: string;
  name: string;
  brand: string;
  category: string;
  ingredients: string[];
}

export interface SimilarProduct {
  id: string;
  name: string;
  brand: string;
  matchPercentage: number;
  sharedIngredients: string[];
}
