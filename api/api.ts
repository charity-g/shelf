const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3001";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

/**
 * Make an API request with optional API key
 */
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set Content-Type for non-FormData requests
  // FormData will automatically set the correct Content-Type with boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
  }

  console.log(`Requesting ${API_BASE_URL}${endpoint} with options:`, options);
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
