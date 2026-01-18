-- Check the actual column names in your tables
-- Run these queries in Snowflake to see the table structure

-- Check SKINCARE_DESC table structure
DESC TABLE DAVID.PUBLIC.SKINCARE_DESC;

-- Check INGREDIENTS_DESC table structure  
DESC TABLE DAVID.PUBLIC.INGREDIENTS_DESC;

-- Alternative: Show columns
SHOW COLUMNS IN TABLE DAVID.PUBLIC.SKINCARE_DESC;
SHOW COLUMNS IN TABLE DAVID.PUBLIC.INGREDIENTS_DESC;

-- View sample data to see column names
SELECT * FROM DAVID.PUBLIC.SKINCARE_DESC LIMIT 1;
SELECT * FROM DAVID.PUBLIC.INGREDIENTS_DESC LIMIT 1;
