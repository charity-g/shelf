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

## Security Features

- **SQL Safety**: Only `SELECT` and `SHOW` statements are allowed
- **Parameter Binding**: User input is safely bound using Snowflake's parameter binding
- **Optional API Key**: Can require `x-api-key` header for all routes except `/health`
- **CORS Enabled**: Allows cross-origin requests from the Expo app
