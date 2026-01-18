import {
  Product,
  ProductDetails,
  ProductsByCategory,
  SimilarProduct,
  UserProduct,
  ocrExtractedProduct,
} from "../types/UserProduct";
import { apiRequest } from "./api";

// ============================================
// User Products API
// ============================================

/**
 * Fetch all user products with optional filters
 */
export async function fetchUserProducts(filters?: {
  user_id?: string;
  product_id?: string;
  category?: string;
  skin_type?: string;
}): Promise<UserProduct[]> {
  const params = new URLSearchParams();
  if (filters?.user_id) params.append("user_id", filters.user_id);
  if (filters?.product_id) params.append("product_id", filters.product_id);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.skin_type) params.append("skin_type", filters.skin_type);

  const queryString = params.toString();
  const endpoint = queryString
    ? `/user-products?${queryString}`
    : "/user-products";

  const data = await apiRequest(endpoint);
  return data.user_products || [];
}

/**
 * Fetch products for a specific user
 */
export async function fetchUserProductsByUserId(
  userId: string,
): Promise<UserProduct[]> {
  const data = await apiRequest(`/user-products/${encodeURIComponent(userId)}`);
  return data.user_products || [];
}

/**
 * Create a new user product
 */
export async function createUserProductText(
  product: ocrExtractedProduct,
): Promise<UserProduct> {
  const userProduct: UserProduct = {
    USER_ID: product.user_id,
    PRODUCT_ID: product.product_id,
    PRODUCT_DESC: product.product_desc,
    CATEGORY: product.category,
    TIME_OF_DAY: product.time_of_day,
    SKIN_TYPE: product.skin_type,
    NAME: product.name,
  };
  await apiRequest("/user-products", {
    method: "POST",
    body: JSON.stringify(userProduct),
  });
  return userProduct;
}

/**
 * Create a new user product
 */
export async function createUserProduct(image: any, user_id: string) {
  return apiRequest("/processsing/user-products", {
    method: "POST",
    body: JSON.stringify({
      USER_ID: user_id,
    }),
  });
}

/**
 * Update a user product
 */
export async function updateUserProduct(
  userId: string,
  productId: string,
  updates: {
    product_desc?: string;
    category?: string;
    time_of_day?: string;
    skin_type?: string;
    name?: string;
  },
) {
  return apiRequest(
    `/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
  );
}

/**
 * Delete a user product
 */
export async function deleteUserProduct(userId: string, productId: string) {
  return apiRequest(
    `/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    },
  );
}

// ===========================================
// PRODUCT COMPARISON
// ===========================================

// Transform backend UserProduct to frontend Product format
function transformUserProduct(userProduct: UserProduct): Product {
  return {
    id: userProduct.PRODUCT_ID,
    name: userProduct.NAME || userProduct.PRODUCT_DESC || "Unknown Product",
    brand: userProduct.PRODUCT_DESC || "",
    category: userProduct.CATEGORY || "Uncategorized",
  };
}

// Fetch user's products from backend API
export async function fetchUserProductsByUser(
  currentUserId: string,
): Promise<Product[]> {
  try {
    const userProducts = await fetchUserProducts({
      user_id: currentUserId,
    });
    return userProducts.map(transformUserProduct);
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
}

// Placeholder endpoint: Get product details with ingredients
export async function fetchProductDetails(
  userId: string,
  productId: string,
): Promise<ProductDetails> {
  // In real implementation:
  // const response = await fetch(`${API_BASE}/products/${productId}/details`);
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockDetails: Record<string, ProductDetails> = {
    "1": {
      id: "1",
      name: "Gentle Foaming Cleanser",
      brand: "CeraVe",
      category: "Cleanser",
      ingredients: [
        "Ceramides",
        "Hyaluronic Acid",
        "Niacinamide",
        "Glycerin",
        "Cholesterol",
      ],
    },
    "2": {
      id: "2",
      name: "Soy Face Cleanser",
      brand: "Fresh",
      category: "Cleanser",
      ingredients: [
        "Soy Proteins",
        "Cucumber Extract",
        "Rose Water",
        "Aloe Vera",
        "Amino Acids",
      ],
    },
    "3": {
      id: "3",
      name: "Facial Treatment Essence",
      brand: "SK-II",
      category: "Toner",
      ingredients: [
        "Pitera",
        "Galactomyces Ferment Filtrate",
        "Butylene Glycol",
        "Sodium Benzoate",
      ],
    },
    "4": {
      id: "4",
      name: "Hyaluronic Acid 2% + B5",
      brand: "The Ordinary",
      category: "Serum",
      ingredients: [
        "Hyaluronic Acid",
        "Vitamin B5",
        "Sodium Hyaluronate",
        "Pentylene Glycol",
      ],
    },
    "5": {
      id: "5",
      name: "Niacinamide 10% + Zinc 1%",
      brand: "The Ordinary",
      category: "Serum",
      ingredients: [
        "Niacinamide",
        "Zinc PCA",
        "Tamarindus Indica Seed Gum",
        "Isoceteth-20",
      ],
    },
    "6": {
      id: "6",
      name: "Moisturizing Cream",
      brand: "CeraVe",
      category: "Moisturizer",
      ingredients: [
        "Ceramides",
        "Hyaluronic Acid",
        "Petrolatum",
        "Glycerin",
        "Dimethicone",
      ],
    },
    "7": {
      id: "7",
      name: "UV Aqua Rich Watery Essence",
      brand: "Biore",
      category: "Sunscreen",
      ingredients: [
        "Octinoxate",
        "Zinc Oxide",
        "Hyaluronic Acid",
        "Royal Jelly Extract",
        "Citrus Extract",
      ],
    },
  };

  return mockDetails[productId] || mockDetails["1"];
}

// Placeholder endpoint: Get similar products from user's collection
export async function fetchSimilarProducts(
  userId: string,
  productId: string,
): Promise<SimilarProduct[]> {
  // In real implementation:
  // const response = await fetch(`${API_BASE}/products/${productId}/similar`);
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 600));

  const mockSimilar: Record<string, SimilarProduct[]> = {
    "1": [
      {
        id: "2",
        name: "Soy Face Cleanser",
        brand: "Fresh",
        matchPercentage: 72,
        sharedIngredients: ["Glycerin", "Amino Acids"],
      },
      {
        id: "6",
        name: "Moisturizing Cream",
        brand: "CeraVe",
        matchPercentage: 85,
        sharedIngredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
      },
    ],
    "2": [
      {
        id: "1",
        name: "Gentle Foaming Cleanser",
        brand: "CeraVe",
        matchPercentage: 72,
        sharedIngredients: ["Glycerin", "Amino Acids"],
      },
    ],
    "3": [
      {
        id: "4",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        matchPercentage: 45,
        sharedIngredients: ["Butylene Glycol"],
      },
    ],
    "4": [
      {
        id: "6",
        name: "Moisturizing Cream",
        brand: "CeraVe",
        matchPercentage: 78,
        sharedIngredients: ["Hyaluronic Acid", "Glycerin"],
      },
      {
        id: "7",
        name: "UV Aqua Rich Watery Essence",
        brand: "Biore",
        matchPercentage: 55,
        sharedIngredients: ["Hyaluronic Acid"],
      },
    ],
    "5": [
      {
        id: "1",
        name: "Gentle Foaming Cleanser",
        brand: "CeraVe",
        matchPercentage: 68,
        sharedIngredients: ["Niacinamide"],
      },
    ],
    "6": [
      {
        id: "1",
        name: "Gentle Foaming Cleanser",
        brand: "CeraVe",
        matchPercentage: 85,
        sharedIngredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
      },
      {
        id: "4",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        matchPercentage: 78,
        sharedIngredients: ["Hyaluronic Acid", "Glycerin"],
      },
    ],
    "7": [
      {
        id: "4",
        name: "Hyaluronic Acid 2% + B5",
        brand: "The Ordinary",
        matchPercentage: 55,
        sharedIngredients: ["Hyaluronic Acid"],
      },
    ],
  };

  return mockSimilar[productId] || [];
}

export async function fetchProducts(userId: string): Promise<Product[]> {
  try {
    const userProducts = await fetchUserProducts({ user_id: userId });
    return userProducts.map(transformUserProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

// Group products by category
export function groupByCategory(products: Product[]): ProductsByCategory {
  return products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as ProductsByCategory);
}
