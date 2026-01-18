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

export interface ocrExtractedProduct {
  user_id: string;
  product_id: string;
  product_desc?: string;
  category?: string;
  time_of_day?: string;
  skin_type?: string;
  name?: string;
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

export interface ProductsByCategory {
  [category: string]: Product[];
}

// Categories to display
export const CATEGORIES = [
  "Cleanser",
  "Toner",
  "Exfoliant",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Face Masks",
];
