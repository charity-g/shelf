# Postman API Testing Guide

## Prerequisites

1. **Install Postman** (if not already installed)
   - Download from [postman.com](https://www.postman.com/downloads/)
   - Or use the web version at [postman.com/web](https://www.postman.com/web)

2. **Set up your local environment**
   - Ensure you have a `.env` file in the `backend` directory with your Snowflake credentials
   - See `.env.example` or `README.md` for required variables

## Step 1: Start the Local Server

```bash
cd backend
npm install  # If you haven't already
npm start   # Starts server on http://localhost:3001
```

Or for development with auto-reload:
```bash
npm run dev
```

You should see:
```
Backend server running on port 3001
Environment: development
```

## Step 2: Import Postman Collection (Optional)

You can manually create requests or import a collection. Below are all the endpoints you can test.

## Step 3: Test Endpoints

### Base URL
```
http://localhost:3001
```

---

## Endpoint 1: Health Check (GET)

**Purpose**: Verify server is running and Snowflake connection is working

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/health`
- **Headers**: None required

**Expected Response (200 OK):**
```json
{
  "ok": true,
  "user": "SKINCARE_SERVICE",
  "role": "SKINCARE_APP_ROLE",
  "database": "DAVID",
  "schema": "PUBLIC"
}
```

**Postman Steps:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3001/health`
4. Click "Send"
5. Verify response shows `"ok": true` and Snowflake connection details

---

## Endpoint 2: Get Tables (GET)

**Purpose**: List all tables in the schema

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/tables`
- **Headers**: None required

**Expected Response (200 OK):**
```json
{
  "tables": [
    {
      "name": "SKINCARE_DESC",
      ...
    },
    {
      "name": "INGREDIENTS_DESC",
      ...
    },
    {
      "name": "USER_ID",
      ...
    }
  ]
}
```

**Postman Steps:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3001/tables`
4. Click "Send"
5. Verify you see a list of tables

---

## Endpoint 3: Get Categories (GET)

**Purpose**: Get all skincare categories

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/categories`
- **Headers**: None required

**Expected Response (200 OK):**
```json
{
  "categories": [
    {
      "ID": 1,
      "INGREDIENT_TYPE": "Humectants",
      "DESCRIPTION": "..."
    },
    ...
  ]
}
```

**Postman Steps:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3001/categories`
4. Click "Send"
5. Verify you see categories array

---

## Endpoint 4: Get Ingredients by Type (GET)

**Purpose**: Get ingredients filtered by type

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/ingredients?type=humectants`
- **Headers**: None required
- **Query Parameters**:
  - `type` (required): e.g., "humectants", "emollients", etc.

**Expected Response (200 OK):**
```json
{
  "ingredients": [
    {
      "id": 1,
      "name": "Hyaluronic Acid",
      "ingredient_type": "humectants",
      "description": "..."
    },
    ...
  ]
}
```

**Postman Steps:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3001/ingredients`
4. Go to "Params" tab
5. Add query parameter:
   - Key: `type`
   - Value: `humectants`
6. Click "Send"
7. Verify filtered ingredients are returned

**Try different types:**
- `type=humectants`
- `type=emollients`
- `type=occlusives`
- `type=antioxidants`

---

## Endpoint 5: Create Category (POST)

**Purpose**: Add a new skincare category

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3001/categories`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "INGREDIENT_TYPE": "Test Category",
  "DESCRIPTION": "This is a test category"
}
```

**Alternative body formats (all supported):**
```json
{
  "ingredient_type": "Test Category",
  "description": "This is a test category"
}
```

```json
{
  "name": "Test Category",
  "DESCRIPTION": "This is a test category"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": []
}
```

**Postman Steps:**
1. Create new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3001/categories`
4. Go to "Headers" tab:
   - Add `Content-Type: application/json`
   - Add `x-api-key: your-api-key` (if API_KEY is set)
5. Go to "Body" tab:
   - Select "raw"
   - Select "JSON" from dropdown
   - Paste the JSON body above
6. Click "Send"
7. Verify success response

---

## Endpoint 6: Update Category (PUT)

**Purpose**: Update an existing category

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3001/categories/1` (replace `1` with actual category ID)
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "DESCRIPTION": "Updated description"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": []
}
```

**Postman Steps:**
1. Create new request
2. Set method to `PUT`
3. Enter URL: `http://localhost:3001/categories/1` (use actual ID from GET /categories)
4. Add headers (Content-Type and x-api-key if needed)
5. Add JSON body
6. Click "Send"

---

## Endpoint 7: Delete Category (DELETE)

**Purpose**: Delete a category

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3001/categories/1` (replace `1` with actual category ID)
- **Headers**:
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": []
}
```

**Postman Steps:**
1. Create new request
2. Set method to `DELETE`
3. Enter URL: `http://localhost:3001/categories/1` (use actual ID)
4. Add `x-api-key` header if needed
5. Click "Send"

---

## Endpoint 8: Get User Products (GET)

**Purpose**: Get user products with optional filters

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/user-products`
- **Query Parameters** (all optional):
  - `user_id`: Filter by user ID
  - `product_id`: Filter by product ID
  - `category`: Filter by category
  - `skin_type`: Filter by skin type

**Examples:**
- `http://localhost:3001/user-products`
- `http://localhost:3001/user-products?user_id=123`
- `http://localhost:3001/user-products?category=cleanser&skin_type=oily`

**Expected Response (200 OK):**
```json
{
  "user_products": [
    {
      "USER_ID": "123",
      "PRODUCT_ID": "456",
      "PRODUCT_DESC": "...",
      "CATEGORY": "cleanser",
      "SKIN_TYPE": "oily",
      ...
    }
  ]
}
```

**Postman Steps:**
1. Create new request
2. Set method to `GET`
3. Enter URL: `http://localhost:3001/user-products`
4. Optionally add query parameters in "Params" tab
5. Click "Send"

---

## Endpoint 9: Get User Products by User ID (GET)

**Purpose**: Get all products for a specific user

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/user-products/123` (replace `123` with actual user_id)

**Expected Response (200 OK):**
```json
{
  "user_products": [...]
}
```

---

## Endpoint 10: Create User Product (POST)

**Purpose**: Add a new user product

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3001/user-products`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "USER_ID": "123",
  "PRODUCT_ID": "456",
  "PRODUCT_DESC": "A great cleanser",
  "CATEGORY": "cleanser",
  "TIME_OF_DAY": "morning",
  "SKIN_TYPE": "oily",
  "NAME": "My Favorite Cleanser"
}
```

**Required Fields**: `USER_ID`, `PRODUCT_ID`
**Optional Fields**: `PRODUCT_DESC`, `CATEGORY`, `TIME_OF_DAY`, `SKIN_TYPE`, `NAME`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User product created successfully",
  "data": []
}
```

---

## Endpoint 11: Update User Product (PUT)

**Purpose**: Update a user product

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3001/user-products/123/456` (user_id/product_id)
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "CATEGORY": "updated_category",
  "SKIN_TYPE": "dry"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User product updated successfully",
  "data": []
}
```

---

## Endpoint 12: Delete User Product (DELETE)

**Purpose**: Delete a user product

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3001/user-products/123/456` (user_id/product_id)
- **Headers**:
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User product deleted successfully",
  "data": []
}
```

---

## Endpoint 13: Create Ingredient (POST)

**Purpose**: Add a new ingredient

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3001/ingredients`
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "name": "Niacinamide",
  "ingredient_type": "antioxidants",
  "description": "Vitamin B3 derivative"
}
```

**Required Fields**: `name`, `ingredient_type`
**Optional Fields**: `description`

---

## Endpoint 14: Update Ingredient (PUT)

**Purpose**: Update an ingredient

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3001/ingredients/1` (replace `1` with actual ingredient ID)
- **Headers**:
  - `Content-Type: application/json`
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)
- **Body** (raw JSON):
```json
{
  "description": "Updated description"
}
```

---

## Endpoint 15: Delete Ingredient (DELETE)

**Purpose**: Delete an ingredient

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3001/ingredients/1` (replace `1` with actual ingredient ID)
- **Headers**:
  - `x-api-key: your-api-key` (only if `API_KEY` is set in `.env`)

---

## Testing Tips

### 1. Setting up Environment Variables in Postman

Create a Postman Environment for easier testing:

1. Click "Environments" in left sidebar
2. Click "+" to create new environment
3. Add variables:
   - `base_url`: `http://localhost:3001`
   - `api_key`: `your-api-key` (if using API key)
4. Use in requests: `{{base_url}}/health`

### 2. Testing API Key Protection

If you set `API_KEY` in your `.env`:
- GET requests work without API key
- POST/PUT/DELETE requests require `x-api-key` header
- Test without API key to verify 401 Unauthorized response

### 3. Common Issues

**Connection Refused:**
- Make sure server is running (`npm start`)
- Check port is 3001 (or match your PORT env var)

**401 Unauthorized:**
- Add `x-api-key` header for POST/PUT/DELETE requests
- Or remove `API_KEY` from `.env` to disable API key requirement

**500 Internal Server Error:**
- Check server console for error details
- Verify Snowflake credentials in `.env`
- Check Snowflake connection in `/health` endpoint

**400 Bad Request:**
- Verify required fields are included in request body
- Check query parameters are correct format

### 4. Quick Test Sequence

Run these in order to verify everything works:

1. ✅ `GET /health` - Verify server and Snowflake connection
2. ✅ `GET /tables` - Verify database access
3. ✅ `GET /categories` - Test read operation
4. ✅ `POST /categories` - Test create operation (if API key set, add header)
5. ✅ `GET /ingredients?type=humectants` - Test query parameters
6. ✅ `GET /user-products` - Test user products endpoint

---

## Postman Collection JSON (Optional)

You can import this collection into Postman:

```json
{
  "info": {
    "name": "Shelf Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Get Tables",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/tables",
          "host": ["{{base_url}}"],
          "path": ["tables"]
        }
      }
    },
    {
      "name": "Get Categories",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/categories",
          "host": ["{{base_url}}"],
          "path": ["categories"]
        }
      }
    },
    {
      "name": "Get Ingredients",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/ingredients?type=humectants",
          "host": ["{{base_url}}"],
          "path": ["ingredients"],
          "query": [
            {
              "key": "type",
              "value": "humectants"
            }
          ]
        }
      }
    },
    {
      "name": "Create Category",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "x-api-key",
            "value": "{{api_key}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"INGREDIENT_TYPE\": \"Test Category\",\n  \"DESCRIPTION\": \"Test description\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/categories",
          "host": ["{{base_url}}"],
          "path": ["categories"]
        }
      }
    }
  ]
}
```

Save this as `Shelf_Backend_API.postman_collection.json` and import into Postman.

---

## Next Steps

After testing locally:
1. ✅ Verify all endpoints work correctly
2. ✅ Test error cases (missing fields, invalid IDs, etc.)
3. ✅ Test API key protection (if enabled)
4. ✅ Check server logs for any warnings
5. ✅ Proceed with Render deployment (see `RENDER_DEPLOY.md`)
