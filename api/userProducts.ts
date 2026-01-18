import { UserProduct } from "../types/UserProduct";
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
    ? `/processing/user-products?${queryString}`
    : "/processing/user-products";

  const data = await apiRequest(endpoint);
  return data.user_products || [];
}

/**
 * Fetch products for a specific user
 */
export async function fetchUserProductsByUserId(
  userId: string,
): Promise<UserProduct[]> {
  const data = await apiRequest(
    `/processing/user-products/${encodeURIComponent(userId)}`,
  );
  return data.user_products || [];
}

/**
 * Create a new user product
 */
export async function createUserProductText(product: {
  user_id: string;
  product_id: string;
  product_desc?: string;
  category?: string;
  time_of_day?: string;
  skin_type?: string;
  name?: string;
}) {
  return apiRequest("/user-products", {
    method: "POST",
    body: JSON.stringify({
      USER_ID: product.user_id,
      PRODUCT_ID: product.product_id,
      PRODUCT_DESC: product.product_desc,
      CATEGORY: product.category,
      TIME_OF_DAY: product.time_of_day,
      SKIN_TYPE: product.skin_type,
      NAME: product.name,
    }),
  });
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
    `/processing/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`,
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
    `/processing/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`,
    {
      method: "DELETE",
    },
  );
}
