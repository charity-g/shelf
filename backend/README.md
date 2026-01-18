# Shelf Backend API

Express.js API server that connects to Snowflake using key-pair authentication.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Fill in your Snowflake credentials in `.env`:
   - `SNOWFLAKE_ACCOUNT`: Your Snowflake account identifier
   - `SNOWFLAKE_USER`: Set to `SKINCARE_SERVICE`
   - `SNOWFLAKE_PRIVATE_KEY`: Contents of your `snowflake_rsa_key.pem` file (include the full PEM format with headers)
   - `SNOWFLAKE_ROLE`: Set to `SKINCARE_APP_ROLE`
   - `SNOWFLAKE_WAREHOUSE`: Set to `COMPUTE_WH`
   - `SNOWFLAKE_DATABASE`: Set to `DAVID`
   - `SNOWFLAKE_SCHEMA`: Set to `PUBLIC`
   - `API_KEY` (optional): If set, all routes except `/health` will require `x-api-key` header

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default (or the port specified in `PORT` env var).

## API Endpoints

### GET /health
Returns connection status and current Snowflake session info.

**Response:**
```json
{
  "ok": true,
  "user": "SKINCARE_SERVICE",
  "role": "SKINCARE_APP_ROLE",
  "database": "DAVID",
  "schema": "PUBLIC"
}
```

### GET /tables
Lists all tables in the `DAVID.PUBLIC` schema.

**Response:**
```json
{
  "tables": [...]
}
```

### GET /categories
Returns up to 500 skincare categories from `DAVID.PUBLIC.SKINCARE_DESC`.

**Response:**
```json
{
  "categories": [...]
}
```

### GET /ingredients?type=humectants
Returns up to 500 ingredients filtered by type from `DAVID.PUBLIC.INGREDIENTS_DESC`.

**Query Parameters:**
- `type` (required): The ingredient type to filter by (e.g., "humectants")

**Response:**
```json
{
  "ingredients": [...]
}
```

### GET /user-products
Returns up to 500 user products from `DAVID.PUBLIC.USER_ID`.

**Query Parameters (all optional):**
- `user_id`: Filter by user ID
- `product_id`: Filter by product ID
- `category`: Filter by category
- `skin_type`: Filter by skin type

**Response:**
```json
{
  "user_products": [...]
}
```

### GET /user-products/:user_id
Returns all products for a specific user.

### POST /user-products
Creates a new user product record.

**Required Fields:**
- `USER_ID` (or `user_id`)
- `PRODUCT_ID` (or `product_id`)

**Optional Fields:**
- `PRODUCT_DESC`, `CATEGORY`, `TIME_OF_DAY`, `SKIN_TYPE`, `NAME`

### PUT /user-products/:user_id/:product_id
Updates a user product record (requires both user_id and product_id).

### DELETE /user-products/:user_id/:product_id
Deletes a user product record (requires both user_id and product_id).

## Security Features

- **SQL Safety**: Only `SELECT`, `SHOW`, `INSERT`, `UPDATE`, `DELETE` statements are allowed
- **Parameter Binding**: User input is safely bound using Snowflake's parameter binding to prevent SQL injection
- **Optional API Key**: Can require `x-api-key` header for POST, PUT, DELETE operations (GET requests work without it)
- **CORS Enabled**: Allows cross-origin requests from the Expo app
