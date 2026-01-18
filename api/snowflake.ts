import { apiRequest } from "./apiRequest";

// ============================================
// Categories API
// ============================================
/**
 * Health check endpoint
 */
export async function fetchHealth() {
  return apiRequest("/health");
}

/**
 * Fetch all tables in the schema
 */
export async function fetchTables() {
  const data = await apiRequest("/tables");
  return data.tables || [];
}

/**
 * Fetch skincare categories
 */
export async function fetchCategories() {
  const data = await apiRequest("/categories");
  return data.categories || [];
}

/**
 * Fetch ingredients by type
 */
export async function fetchIngredients(type: string) {
  const data = await apiRequest(
    `/ingredients?type=${encodeURIComponent(type)}`,
  );
  return data.ingredients || [];
}

/**
 * Create a new category
 */
export async function createCategory(name: string, description?: string) {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify({ name, description }),
  });
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string | number,
  updates: { name?: string; description?: string },
) {
  return apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string | number) {
  return apiRequest(`/categories/${id}`, {
    method: "DELETE",
  });
}

/**
 * Create a new ingredient
 */
export async function createIngredient(
  name: string,
  ingredient_type: string,
  description?: string,
) {
  return apiRequest("/ingredients", {
    method: "POST",
    body: JSON.stringify({ name, ingredient_type, description }),
  });
}

/**
 * Update an ingredient
 */
export async function updateIngredient(
  id: string | number,
  updates: { name?: string; ingredient_type?: string; description?: string },
) {
  return apiRequest(`/ingredients/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

/**
 * Delete an ingredient
 */
export async function deleteIngredient(id: string | number) {
  return apiRequest(`/ingredients/${id}`, {
    method: "DELETE",
  });
}
