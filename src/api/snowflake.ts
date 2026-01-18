const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

/**
 * Make an API request with optional API key
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (API_KEY) {
        headers['x-api-key'] = API_KEY;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

/**
 * Health check endpoint
 */
export async function fetchHealth() {
    return apiRequest('/health');
}

/**
 * Fetch all tables in the schema
 */
export async function fetchTables() {
    const data = await apiRequest('/tables');
    return data.tables || [];
}

/**
 * Fetch skincare categories
 */
export async function fetchCategories() {
    const data = await apiRequest('/categories');
    return data.categories || [];
}

/**
 * Fetch ingredients by type
 */
export async function fetchIngredients(type: string) {
    const data = await apiRequest(`/ingredients?type=${encodeURIComponent(type)}`);
    return data.ingredients || [];
}

/**
 * Create a new category
 */
export async function createCategory(name: string, description?: string) {
    return apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
    });
}

/**
 * Update a category
 */
export async function updateCategory(id: string | number, updates: { name?: string; description?: string }) {
    return apiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string | number) {
    return apiRequest(`/categories/${id}`, {
        method: 'DELETE',
    });
}

/**
 * Create a new ingredient
 */
export async function createIngredient(name: string, ingredient_type: string, description?: string) {
    return apiRequest('/ingredients', {
        method: 'POST',
        body: JSON.stringify({ name, ingredient_type, description }),
    });
}

/**
 * Update an ingredient
 */
export async function updateIngredient(
    id: string | number,
    updates: { name?: string; ingredient_type?: string; description?: string }
) {
    return apiRequest(`/ingredients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

/**
 * Delete an ingredient
 */
export async function deleteIngredient(id: string | number) {
    return apiRequest(`/ingredients/${id}`, {
        method: 'DELETE',
    });
}

// ============================================
// User Products API
// ============================================

export interface UserProduct {
    USER_ID: string;
    PRODUCT_ID: string;
    PRODUCT_DESC?: string;
    CATEGORY?: string;
    TIME_OF_DAY?: string;
    SKIN_TYPE?: string;
    NAME?: string;
}

/**
 * Fetch all user products with optional filters
 */
export async function fetchUserProducts(filters?: {
    user_id?: string;
    product_id?: string;
    category?: string;
    skin_type?: string;
}) {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.product_id) params.append('product_id', filters.product_id);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.skin_type) params.append('skin_type', filters.skin_type);

    const queryString = params.toString();
    const endpoint = queryString ? `/user-products?${queryString}` : '/user-products';
    
    const data = await apiRequest(endpoint);
    return data.user_products || [];
}

/**
 * Fetch products for a specific user
 */
export async function fetchUserProductsByUserId(userId: string) {
    const data = await apiRequest(`/user-products/${encodeURIComponent(userId)}`);
    return data.user_products || [];
}

/**
 * Create a new user product
 */
export async function createUserProduct(product: {
    user_id: string;
    product_id: string;
    product_desc?: string;
    category?: string;
    time_of_day?: string;
    skin_type?: string;
    name?: string;
}) {
    return apiRequest('/user-products', {
        method: 'POST',
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
    }
) {
    return apiRequest(`/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

/**
 * Delete a user product
 */
export async function deleteUserProduct(userId: string, productId: string) {
    return apiRequest(`/user-products/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
    });
}