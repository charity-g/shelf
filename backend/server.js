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
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Missing required field: name' });
        }

        const rows = await execSQL(
            'INSERT INTO DAVID.PUBLIC.SKINCARE_DESC (name, description) VALUES (?, ?)',
            [name, description || null]
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
        const { name, description } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing category ID' });
        }

        // Build update query dynamically based on provided fields
        const updates = [];
        const binds = [];

        if (name !== undefined) {
            updates.push('name = ?');
            binds.push(name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            binds.push(description);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        binds.push(id); // Add ID for WHERE clause

        const rows = await execSQL(
            `UPDATE DAVID.PUBLIC.SKINCARE_DESC SET ${updates.join(', ')} WHERE id = ?`,
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
            'DELETE FROM DAVID.PUBLIC.SKINCARE_DESC WHERE id = ?',
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
            'INSERT INTO DAVID.PUBLIC.INGREDIENTS_DESC (name, ingredient_type, description) VALUES (?, ?, ?)',
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
            updates.push('name = ?');
            binds.push(name);
        }
        if (ingredient_type !== undefined) {
            updates.push('ingredient_type = ?');
            binds.push(ingredient_type);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            binds.push(description);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        binds.push(id);

        const rows = await execSQL(
            `UPDATE DAVID.PUBLIC.INGREDIENTS_DESC SET ${updates.join(', ')} WHERE id = ?`,
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
            'DELETE FROM DAVID.PUBLIC.INGREDIENTS_DESC WHERE id = ?',
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
    console.log(`Backend server running on http://localhost:${PORT}`);
});
