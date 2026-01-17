# Snowflake Connection Troubleshooting Guide

## Common Issues and Fixes

### Issue: "A password must be specified" Error

This error means the Snowflake SDK isn't recognizing key-pair authentication. Try these fixes:

#### Fix 1: Add Region to Account (Most Common Fix)

Your account identifier might need to include the region. Update your `.env`:

```env
# Instead of:
SNOWFLAKE_ACCOUNT=IXB24790

# Try:
SNOWFLAKE_ACCOUNT=IXB24790.us-east-1
# OR
SNOWFLAKE_ACCOUNT=IXB24790.us-east-1.aws
# OR
SNOWFLAKE_ACCOUNT=IXB24790.us-east-1.azure
```

**How to find your region:**
- Check your Snowflake URL (e.g., `https://IXB24790.us-east-1.snowflakecomputing.com`)
- The region is the part after the account (e.g., `us-east-1`)

#### Fix 2: Verify Public Key is Set in Snowflake

The public key must be set in your Snowflake user account. Check it:

```sql
DESC USER SKINCARE_SERVICE;
```

Look for `RSA_PUBLIC_KEY` - it should be set. If it's NULL or empty, you need to set it:

```sql
-- First, get your public key from your private key file:
-- On Mac/Linux: openssl rsa -in snowflake_rsa_key.pem -pubout

-- Then set it in Snowflake:
ALTER USER SKINCARE_SERVICE SET RSA_PUBLIC_KEY='MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...';
```

#### Fix 3: Use privateKeyPath Instead of privateKey

Sometimes the SDK works better with a file path. Create a key file:

1. **Save your key to a file** (make sure it's NOT in git!):
   ```bash
   # Copy your private key to backend/snowflake_rsa_key.pem
   # Make sure backend/.gitignore includes: snowflake_rsa_key.pem
   ```

2. **Update your `.env`**:
   ```env
   # Remove or comment out:
   # SNOWFLAKE_PRIVATE_KEY="..."
   
   # Add instead:
   SNOWFLAKE_PRIVATE_KEY_PATH=./snowflake_rsa_key.pem
   ```

3. **Make sure the file is readable**:
   ```bash
   chmod 600 backend/snowflake_rsa_key.pem
   ```

#### Fix 4: Check Snowflake User Permissions

Make sure your user has the correct permissions:

```sql
-- Check role assignments
SHOW GRANTS TO USER SKINCARE_SERVICE;

-- Check role permissions
SHOW GRANTS TO ROLE SKINCARE_APP_ROLE;

-- Make sure role has access to warehouse, database, schema
GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE SKINCARE_APP_ROLE;
GRANT USAGE ON DATABASE DAVID TO ROLE SKINCARE_APP_ROLE;
GRANT USAGE ON SCHEMA DAVID.PUBLIC TO ROLE SKINCARE_APP_ROLE;
GRANT SELECT ON ALL TABLES IN SCHEMA DAVID.PUBLIC TO ROLE SKINCARE_APP_ROLE;
```

## Testing Your Connection

### Step 1: Test Key Format

```bash
cd backend
node check-key-format.js
```

This will verify your key is formatted correctly.

### Step 2: Test Backend Connection

```bash
cd backend
npm run dev
```

Watch the console for connection attempts and errors.

### Step 3: Test with Postman

1. **Health Check** (should work if connected):
   ```
   GET http://localhost:3001/health
   ```

2. **Get Categories**:
   ```
   GET http://localhost:3001/categories
   ```

## Still Not Working?

1. **Check Snowflake SDK version**:
   ```bash
   cd backend
   npm list snowflake-sdk
   ```

2. **Try updating the SDK**:
   ```bash
   npm install snowflake-sdk@latest
   ```

3. **Check Snowflake service status**: Make sure Snowflake is accessible from your network

4. **Review backend logs**: Check `backend/snowflake.log` for detailed error messages

5. **Test connection from Snowflake UI**: Try connecting with the same credentials using Snowflake's web interface to verify they work

## Account Format Examples

- **AWS**: `ACCOUNT.us-east-1` or `ACCOUNT.us-east-1.aws`
- **Azure**: `ACCOUNT.east-us-2.azure`
- **GCP**: `ACCOUNT.us-central1.gcp`

Check your Snowflake URL to determine the correct format.
