import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { execSQL } from './snowflakeClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API key middleware (optional)
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = process.env.API_KEY;

    // Skip API key check if not configured, health endpoint, or GET requests
    if (!apiKey || req.path === '/health' || req.method === 'GET') {
        return next();
    }

    // Require API key for POST, PUT, DELETE operations
    const providedKey = req.headers['x-api-key'];

    if (!providedKey || providedKey !== apiKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
    }

    next();
};

app.use(apiKeyMiddleware);

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const [userResult, roleResult, dbResult, schemaResult] = await Promise.all([
            execSQL('SELECT CURRENT_USER() as user'),
            execSQL('SELECT CURRENT_ROLE() as role'),
            execSQL('SELECT CURRENT_DATABASE() as database'),
            execSQL('SELECT CURRENT_SCHEMA() as schema'),
        ]);

        res.json({
            ok: true,
            user: userResult[0]?.USER || null,
            role: roleResult[0]?.ROLE || null,
            database: dbResult[0]?.DATABASE || null,
            schema: schemaResult[0]?.SCHEMA || null,
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
});

// Get tables in schema
app.get('/tables', async (req, res) => {
    try {
        const rows = await execSQL('SHOW TABLES IN SCHEMA DAVID.PUBLIC');
        res.json({ tables: rows });
    } catch (error) {
        console.error('Tables endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get categories
app.get('/categories', async (req, res) => {
    try {
        const rows = await execSQL('SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC LIMIT 500');
        res.json({ categories: rows });
    } catch (error) {
        console.error('Categories endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get ingredients by type
app.get('/ingredients', async (req, res) => {
    try {
        const type = req.query.type;

        if (!type) {
            return res.status(400).json({ error: 'Missing required query parameter: type' });
        }

        // Use parameter binding for safety
        const rows = await execSQL(
            'SELECT * FROM DAVID.PUBLIC.INGREDIENTS_DESC WHERE LOWER(ingredient_type) = LOWER(?) LIMIT 500',
            [type]
        );

        res.json({ ingredients: rows });
    } catch (error) {
        console.error('Ingredients endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Insert a new category
app.post('/categories', async (req, res) => {
    try {
        // Handle both uppercase and lowercase field names
        const ingredientTypeValue = req.body.INGREDIENT_TYPE || req.body.ingredient_type || req.body.name || req.body.NAME;
        const descriptionValue = req.body.DESCRIPTION || req.body.description;

        if (!ingredientTypeValue) {
            return res.status(400).json({ error: 'Missing required field: INGREDIENT_TYPE, ingredient_type, name, or NAME' });
        }

        const rows = await execSQL(
            'INSERT INTO DAVID.PUBLIC.SKINCARE_DESC ("INGREDIENT_TYPE", "DESCRIPTION") VALUES (?, ?)',
            [ingredientTypeValue, descriptionValue || null]
        );

        res.json({
            success: true,
            message: 'Category created successfully',
            data: rows
        });
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a category
app.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing category ID' });
        }

        // Build update query dynamically based on provided fields
        const updates = [];
        const binds = [];

        // Handle both uppercase and lowercase field names
        const ingredientTypeValue = req.body.INGREDIENT_TYPE !== undefined ? req.body.INGREDIENT_TYPE :
            req.body.ingredient_type !== undefined ? req.body.ingredient_type :
                req.body.name !== undefined ? req.body.name :
                    req.body.NAME !== undefined ? req.body.NAME : undefined;

        const descriptionValue = req.body.DESCRIPTION !== undefined ? req.body.DESCRIPTION :
            req.body.description !== undefined ? req.body.description : undefined;

        if (ingredientTypeValue !== undefined) {
            updates.push('"INGREDIENT_TYPE" = ?');
            binds.push(ingredientTypeValue);
        }
        if (descriptionValue !== undefined) {
            updates.push('"DESCRIPTION" = ?');
            binds.push(descriptionValue);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        binds.push(id); // Add ID for WHERE clause

        const rows = await execSQL(
            `UPDATE DAVID.PUBLIC.SKINCARE_DESC SET ${updates.join(', ')} WHERE "ID" = ?`,
            binds
        );

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: rows
        });
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a category
app.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing category ID' });
        }

        const rows = await execSQL(
            'DELETE FROM DAVID.PUBLIC.SKINCARE_DESC WHERE "ID" = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Category deleted successfully',
            data: rows
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Insert a new ingredient
app.post('/ingredients', async (req, res) => {
    try {
        const { name, ingredient_type, description } = req.body;

        if (!name || !ingredient_type) {
            return res.status(400).json({
                error: 'Missing required fields: name, ingredient_type'
            });
        }

        const rows = await execSQL(
            'INSERT INTO DAVID.PUBLIC.INGREDIENTS_DESC ("name", "ingredient_type", "description") VALUES (?, ?, ?)',
            [name, ingredient_type, description || null]
        );

        res.json({
            success: true,
            message: 'Ingredient created successfully',
            data: rows
        });
    } catch (error) {
        console.error('Create ingredient error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update an ingredient
app.put('/ingredients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, ingredient_type, description } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing ingredient ID' });
        }

        const updates = [];
        const binds = [];

        if (name !== undefined) {
            updates.push('"name" = ?');
            binds.push(name);
        }
        if (ingredient_type !== undefined) {
            updates.push('"ingredient_type" = ?');
            binds.push(ingredient_type);
        }
        if (description !== undefined) {
            updates.push('"description" = ?');
            binds.push(description);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        binds.push(id);

        const rows = await execSQL(
            `UPDATE DAVID.PUBLIC.INGREDIENTS_DESC SET ${updates.join(', ')} WHERE "id" = ?`,
            binds
        );

        res.json({
            success: true,
            message: 'Ingredient updated successfully',
            data: rows
        });
    } catch (error) {
        console.error('Update ingredient error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete an ingredient
app.delete('/ingredients/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Missing ingredient ID' });
        }

        const rows = await execSQL(
            'DELETE FROM DAVID.PUBLIC.INGREDIENTS_DESC WHERE "id" = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Ingredient deleted successfully',
            data: rows
        });
    } catch (error) {
        console.error('Delete ingredient error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// USER_ID / User Products Endpoints
// ============================================

// Get all user products (with optional filters)
app.get('/user-products', async (req, res) => {
    try {
        const { user_id, product_id, category, skin_type } = req.query;

        let sql = 'SELECT * FROM DAVID.PUBLIC.USER_ID WHERE 1=1';
        const binds = [];

        if (user_id) {
            sql += ' AND "USER_ID" = ?';
            binds.push(user_id);
        }
        if (product_id) {
            sql += ' AND "PRODUCT_ID" = ?';
            binds.push(product_id);
        }
        if (category) {
            sql += ' AND LOWER("CATEGORY") = LOWER(?)';
            binds.push(category);
        }
        if (skin_type) {
            sql += ' AND LOWER("SKIN_TYPE") = LOWER(?)';
            binds.push(skin_type);
        }

        sql += ' LIMIT 500';

        const rows = await execSQL(sql, binds);
        res.json({ user_products: rows });
    } catch (error) {
        console.error('Get user products error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user products by user_id
app.get('/user-products/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        const rows = await execSQL(
            'SELECT * FROM DAVID.PUBLIC.USER_ID WHERE "USER_ID" = ? LIMIT 500',
            [user_id]
        );

        res.json({ user_products: rows });
    } catch (error) {
        console.error('Get user products by user_id error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Insert a new user product
app.post('/user-products', async (req, res) => {
    try {
        // Handle both uppercase and lowercase field names
        const userId = req.body.USER_ID || req.body.user_id || req.body.USERID;
        const productId = req.body.PRODUCT_ID || req.body.product_id || req.body.PRODUCTID;
        const productDesc = req.body.PRODUCT_DESC || req.body.product_desc || req.body.PRODUCTDESC;
        const category = req.body.CATEGORY || req.body.category;
        const timeOfDay = req.body.TIME_OF_DAY || req.body.time_of_day || req.body.TIMEOFDAY;
        const skinType = req.body.SKIN_TYPE || req.body.skin_type || req.body.SKINTYPE;
        const name = req.body.NAME || req.body.name;

        if (!userId) {
            return res.status(400).json({ error: 'Missing required field: USER_ID' });
        }
        if (!productId) {
            return res.status(400).json({ error: 'Missing required field: PRODUCT_ID' });
        }

        const rows = await execSQL(
            'INSERT INTO DAVID.PUBLIC.USER_ID ("USER_ID", "PRODUCT_ID", "PRODUCT_DESC", "CATEGORY", "TIME_OF_DAY", "SKIN_TYPE", "NAME") VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, productId, productDesc || null, category || null, timeOfDay || null, skinType || null, name || null]
        );

        res.json({
            success: true,
            message: 'User product created successfully',
            data: rows
        });
    } catch (error) {
        console.error('Create user product error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update a user product (requires both user_id and product_id)
app.put('/user-products/:user_id/:product_id', async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        if (!user_id || !product_id) {
            return res.status(400).json({ error: 'Missing user_id or product_id' });
        }

        // Build update query dynamically based on provided fields
        const updates = [];
        const binds = [];

        // Handle both uppercase and lowercase field names
        const productDesc = req.body.PRODUCT_DESC !== undefined ? req.body.PRODUCT_DESC :
            req.body.product_desc !== undefined ? req.body.product_desc :
                req.body.PRODUCTDESC !== undefined ? req.body.PRODUCTDESC : undefined;

        const category = req.body.CATEGORY !== undefined ? req.body.CATEGORY :
            req.body.category !== undefined ? req.body.category : undefined;

        const timeOfDay = req.body.TIME_OF_DAY !== undefined ? req.body.TIME_OF_DAY :
            req.body.time_of_day !== undefined ? req.body.time_of_day :
                req.body.TIMEOFDAY !== undefined ? req.body.TIMEOFDAY : undefined;

        const skinType = req.body.SKIN_TYPE !== undefined ? req.body.SKIN_TYPE :
            req.body.skin_type !== undefined ? req.body.skin_type :
                req.body.SKINTYPE !== undefined ? req.body.SKINTYPE : undefined;

        const name = req.body.NAME !== undefined ? req.body.NAME :
            req.body.name !== undefined ? req.body.name : undefined;

        if (productDesc !== undefined) {
            updates.push('"PRODUCT_DESC" = ?');
            binds.push(productDesc);
        }
        if (category !== undefined) {
            updates.push('"CATEGORY" = ?');
            binds.push(category);
        }
        if (timeOfDay !== undefined) {
            updates.push('"TIME_OF_DAY" = ?');
            binds.push(timeOfDay);
        }
        if (skinType !== undefined) {
            updates.push('"SKIN_TYPE" = ?');
            binds.push(skinType);
        }
        if (name !== undefined) {
            updates.push('"NAME" = ?');
            binds.push(name);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        binds.push(user_id, product_id); // Add for WHERE clause

        const rows = await execSQL(
            `UPDATE DAVID.PUBLIC.USER_ID SET ${updates.join(', ')} WHERE "USER_ID" = ? AND "PRODUCT_ID" = ?`,
            binds
        );

        res.json({
            success: true,
            message: 'User product updated successfully',
            data: rows
        });
    } catch (error) {
        console.error('Update user product error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a user product (requires both user_id and product_id)
app.delete('/user-products/:user_id/:product_id', async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        if (!user_id || !product_id) {
            return res.status(400).json({ error: 'Missing user_id or product_id' });
        }

        const rows = await execSQL(
            'DELETE FROM DAVID.PUBLIC.USER_ID WHERE "USER_ID" = ? AND "PRODUCT_ID" = ?',
            [user_id, product_id]
        );

        res.json({
            success: true,
            message: 'User product deleted successfully',
            data: rows
        });
    } catch (error) {
        console.error('Delete user product error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
