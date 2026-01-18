# Testing Guide: Postman & Snowflake Online

This guide shows you how to test your backend API using Postman and verify data directly in Snowflake.

## Prerequisites

1. **Backend server running**: Make sure your backend is running:
   ```bash
   cd backend
   npm run dev
   ```
   Server should be running on `http://localhost:3001`

2. **Postman installed**: Download from [postman.com](https://www.postman.com/downloads/)

3. **Snowflake account access**: You need access to Snowflake web UI

### ⚠️ Important: About API Keys

**The `x-api-key` header is OPTIONAL!**

- ✅ **If you DON'T have `API_KEY` in your `.env` file**: You don't need to use API keys at all. Just skip the `x-api-key` header in all requests.
- ⚠️ **If you DO have `API_KEY` in your `.env` file**: You'll need to add `x-api-key: YOUR_API_KEY` header for POST, PUT, DELETE requests (GET requests work without it).

**For testing, it's simpler to NOT use API keys** - just make sure `API_KEY` is not set in your `.env` file.

The API key is separate from Snowflake authentication - it's an optional extra security layer for your API endpoints.

---

## Part 1: Testing with Postman

### Step 1: Start Your Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
Backend server running on http://localhost:3001
```

### Step 2: Create a Postman Collection

1. Open Postman
2. Click **New** → **Collection**
3. Name it: `Shelf Backend API`

### Step 3: Test Each Endpoint

#### 🔍 **1. Health Check** (Test Connection)

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/health`
- **Headers**: None required

**Expected Response:**
```json
{
  "ok": true,
  "user": "SKINCARE_SERVICE",
  "role": "SKINCARE_APP_ROLE",
  "database": "DAVID",
  "schema": "PUBLIC"
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ `ok: true` means connection successful
- ✅ Verify user, role, database, schema match your config

---

#### 📋 **2. Get All Tables**

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/tables`
- **Headers**: None required

**Expected Response:**
```json
{
  "tables": [
    {
      "created_on": "2024-01-01 00:00:00",
      "name": "SKINCARE_DESC",
      "database_name": "DAVID",
      "schema_name": "PUBLIC",
      ...
    },
    ...
  ]
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ Should see `SKINCARE_DESC` and `INGREDIENTS_DESC` tables

---

#### 📂 **3. Get Categories**

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/categories`
- **Headers**: None required

**Expected Response:**
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Moisturizers",
      "description": "Hydrating products"
    },
    ...
  ]
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ Returns array of categories
- ✅ Max 500 results

---

#### 🧪 **4. Get Ingredients by Type**

**Request:**
- **Method**: `GET`
- **URL**: `http://localhost:3001/ingredients?type=humectants`
- **Headers**: None required

**Query Parameters:**
- `type` (required): e.g., `humectants`, `emollients`, `occlusives`

**Expected Response:**
```json
{
  "ingredients": [
    {
      "id": 1,
      "name": "Hyaluronic Acid",
      "ingredient_type": "humectants",
      "description": "Attracts moisture"
    },
    ...
  ]
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ Only returns ingredients of specified type
- ✅ Case-insensitive matching

**Try different types:**
- `http://localhost:3001/ingredients?type=humectants`
- `http://localhost:3001/ingredients?type=emollients`
- `http://localhost:3001/ingredients?type=occlusives`

---

#### ➕ **5. Create a Category** (POST)

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3001/categories`
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_API_KEY` (⚠️ **ONLY needed if you set `API_KEY` in `.env`** - otherwise skip this header)
- **Body** (raw JSON):
```json
{
  "name": "Test Category",
  "description": "This is a test category"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": []
}
```

**What to check:**
- ✅ Status: `201 Created` or `200 OK`
- ✅ Success message returned
- ✅ Verify in Snowflake (see Part 2)

**Note**: 
- ✅ **If you DON'T have `API_KEY` in `.env`**: You don't need the `x-api-key` header at all!
- ⚠️ **If you DO have `API_KEY` in `.env`**: Add `x-api-key` header with the value from your `.env` file
- If you get `401 Unauthorized`, it means `API_KEY` is set in `.env` - either add the header or remove `API_KEY` from `.env`

---

#### ✏️ **6. Update a Category** (PUT)

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3001/categories/1` (replace `1` with actual category ID)
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_API_KEY` (if API_KEY is set)
- **Body** (raw JSON):
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": []
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ Success message
- ✅ Verify changes in Snowflake

---

#### 🗑️ **7. Delete a Category** (DELETE)

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3001/categories/1` (replace `1` with actual category ID)
- **Headers**: 
  - `x-api-key: YOUR_API_KEY` (if API_KEY is set)

**Expected Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": []
}
```

**What to check:**
- ✅ Status: `200 OK`
- ✅ Success message
- ✅ Verify deletion in Snowflake

---

#### ➕ **8. Create an Ingredient** (POST)

**Request:**
- **Method**: `POST`
- **URL**: `http://localhost:3001/ingredients`
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_API_KEY` (if API_KEY is set)
- **Body** (raw JSON):
```json
{
  "name": "Test Ingredient",
  "ingredient_type": "humectants",
  "description": "Test description"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Ingredient created successfully",
  "data": []
}
```

---

#### ✏️ **9. Update an Ingredient** (PUT)

**Request:**
- **Method**: `PUT`
- **URL**: `http://localhost:3001/ingredients/1` (replace `1` with actual ingredient ID)
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_API_KEY` (if API_KEY is set)
- **Body** (raw JSON):
```json
{
  "name": "Updated Ingredient Name",
  "ingredient_type": "emollients",
  "description": "Updated description"
}
```

---

#### 🗑️ **10. Delete an Ingredient** (DELETE)

**Request:**
- **Method**: `DELETE`
- **URL**: `http://localhost:3001/ingredients/1` (replace `1` with actual ingredient ID)
- **Headers**: 
  - `x-api-key: YOUR_API_KEY` (if API_KEY is set)

---

## Part 2: Testing Directly in Snowflake

### Step 1: Log into Snowflake Web UI

1. Go to: `https://NUVLZPL-IXB24790.snowflakecomputing.com`
2. Log in with your credentials

### Step 2: Open SQL Worksheet

1. Click **Worksheets** in the left sidebar
2. Click **+** to create a new worksheet
3. Select:
   - **Database**: `DAVID`
   - **Schema**: `PUBLIC`
   - **Warehouse**: `COMPUTE_WH`
   - **Role**: `SKINCARE_APP_ROLE` (or your role)

### Step 3: Run Test Queries

#### Check Current Session
```sql
SELECT CURRENT_USER(), CURRENT_ROLE(), CURRENT_DATABASE(), CURRENT_SCHEMA();
```

**Expected Output:**
```
CURRENT_USER() | CURRENT_ROLE()      | CURRENT_DATABASE() | CURRENT_SCHEMA()
SKINCARE_SERVICE | SKINCARE_APP_ROLE | DAVID              | PUBLIC
```

---

#### View All Tables
```sql
SHOW TABLES IN SCHEMA DAVID.PUBLIC;
```

**What to check:**
- ✅ Should see `SKINCARE_DESC` table
- ✅ Should see `INGREDIENTS_DESC` table

---

#### View All Categories
```sql
SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC LIMIT 10;
```

**What to check:**
- ✅ Returns category data
- ✅ Verify data matches what you see in Postman

---

#### View All Ingredients
```sql
SELECT * FROM DAVID.PUBLIC.INGREDIENTS_DESC LIMIT 10;
```

---

#### View Ingredients by Type
```sql
SELECT * FROM DAVID.PUBLIC.INGREDIENTS_DESC 
WHERE LOWER(ingredient_type) = 'humectants' 
LIMIT 10;
```

**Try different types:**
- `humectants`
- `emollients`
- `occlusives`
- `antioxidants`

---

#### Verify Data After POST Request

After creating a category via Postman, verify it in Snowflake:

```sql
SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC 
WHERE name = 'Test Category';
```

---

#### Verify Data After UPDATE Request

After updating a category via Postman:

```sql
SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC 
WHERE id = 1;  -- Replace with your category ID
```

---

#### Verify Data After DELETE Request

After deleting a category via Postman:

```sql
SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC 
WHERE id = 1;  -- Should return no rows
```

---

#### Count Records
```sql
-- Count total categories
SELECT COUNT(*) as total_categories FROM DAVID.PUBLIC.SKINCARE_DESC;

-- Count total ingredients
SELECT COUNT(*) as total_ingredients FROM DAVID.PUBLIC.INGREDIENTS_DESC;

-- Count ingredients by type
SELECT ingredient_type, COUNT(*) as count 
FROM DAVID.PUBLIC.INGREDIENTS_DESC 
GROUP BY ingredient_type;
```

---

## Troubleshooting

### Postman Issues

**Problem**: `ECONNREFUSED` or connection refused
- **Solution**: Make sure backend server is running (`npm run dev`)

**Problem**: `401 Unauthorized` on POST/PUT/DELETE
- **Solution**: 
  - Option 1: Add `x-api-key` header with your API key from `.env` (if `API_KEY` is set)
  - Option 2: Remove `API_KEY` from `.env` file if you don't want to use API keys (simpler for testing)

**Problem**: `500 Internal Server Error`
- **Solution**: Check backend console for error messages
- **Solution**: Verify Snowflake connection (test `/health` endpoint)

**Problem**: `404 Not Found`
- **Solution**: Check URL is correct: `http://localhost:3001/...`
- **Solution**: Verify endpoint path matches exactly

### Snowflake Issues

**Problem**: `Object does not exist`
- **Solution**: Verify database name is `DAVID` and schema is `PUBLIC`
- **Solution**: Check table names are correct: `SKINCARE_DESC`, `INGREDIENTS_DESC`

**Problem**: `Insufficient privileges` or `SQL access control error: Insufficient privileges to operate on table`
- **Solution**: Grant the necessary permissions to your role. Run these SQL commands in Snowflake (as ACCOUNTADMIN or a role with GRANT privileges):
  ```sql
  -- Grant SELECT permissions (for reading)
  GRANT SELECT ON ALL TABLES IN SCHEMA DAVID.PUBLIC TO ROLE SKINCARE_APP_ROLE;
  
  -- Grant INSERT, UPDATE, DELETE permissions (for write operations)
  GRANT INSERT, UPDATE, DELETE ON TABLE DAVID.PUBLIC.SKINCARE_DESC TO ROLE SKINCARE_APP_ROLE;
  GRANT INSERT, UPDATE, DELETE ON TABLE DAVID.PUBLIC.INGREDIENTS_DESC TO ROLE SKINCARE_APP_ROLE;
  ```
- **Solution**: Verify you're using the correct role: `SKINCARE_APP_ROLE`
- **Solution**: Make sure you have USAGE on warehouse, database, and schema:
  ```sql
  GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE SKINCARE_APP_ROLE;
  GRANT USAGE ON DATABASE DAVID TO ROLE SKINCARE_APP_ROLE;
  GRANT USAGE ON SCHEMA DAVID.PUBLIC TO ROLE SKINCARE_APP_ROLE;
  ```

**Problem**: `Warehouse not running`
- **Solution**: Make sure warehouse `COMPUTE_WH` is running
- **Solution**: Run: `ALTER WAREHOUSE COMPUTE_WH RESUME;`

---

## Quick Test Checklist

- [ ] Backend server running (`npm run dev`)
- [ ] Health check returns `200 OK` with correct user/role/database
- [ ] `/tables` endpoint returns table list
- [ ] `/categories` endpoint returns categories
- [ ] `/ingredients?type=humectants` returns filtered ingredients
- [ ] Can create category via POST
- [ ] Can update category via PUT
- [ ] Can delete category via DELETE
- [ ] Can create ingredient via POST
- [ ] Can update ingredient via PUT
- [ ] Can delete ingredient via DELETE
- [ ] Data changes visible in Snowflake SQL queries
- [ ] All operations work with API key (if configured)

---

## Postman Collection Export

Save this as a Postman collection JSON file:

1. In Postman, click **Export** on your collection
2. Save as `Shelf-Backend-API.postman_collection.json`
3. Share with your team

---

## Next Steps

1. Test all endpoints in Postman
2. Verify data in Snowflake after each operation
3. Test error cases (missing fields, invalid IDs, etc.)
4. Test with API key enabled/disabled
5. Test CORS from your Expo app

Happy testing! 🚀
