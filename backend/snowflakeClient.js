import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';
import snowflake from 'snowflake-sdk';

dotenv.config();

let connection = null;

/**
 * Connect to Snowflake using key-pair authentication
 */
export function connect() {
    return new Promise((resolve, reject) => {
        if (connection) {
            resolve(connection);
            return;
        }

        const account = process.env.SNOWFLAKE_ACCOUNT;
        const username = process.env.SNOWFLAKE_USER;
        const privateKeyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
        const privateKey = process.env.SNOWFLAKE_PRIVATE_KEY || (privateKeyPath ? fs.readFileSync(privateKeyPath, 'utf8') : null);
        const role = process.env.SNOWFLAKE_ROLE;
        const warehouse = process.env.SNOWFLAKE_WAREHOUSE;
        const database = process.env.SNOWFLAKE_DATABASE;
        const schema = process.env.SNOWFLAKE_SCHEMA;

        if (!account || !username || !privateKey || !role || !warehouse || !database || !schema) {
            reject(new Error('Missing required Snowflake environment variables. Need: SNOWFLAKE_ACCOUNT, SNOWFLAKE_USER, SNOWFLAKE_PRIVATE_KEY (or SNOWFLAKE_PRIVATE_KEY_PATH), SNOWFLAKE_ROLE, SNOWFLAKE_WAREHOUSE, SNOWFLAKE_DATABASE, SNOWFLAKE_SCHEMA'));
            return;
        }

        // Log connection attempt info
        console.log(`Attempting to connect to Snowflake account: ${account}`);
        console.log(`Using user: ${username}, role: ${role}, warehouse: ${warehouse}`);
        console.log(`Database: ${database}, Schema: ${schema}`);
        if (privateKeyPath) {
            console.log(`Using private key from file: ${privateKeyPath}`);
        } else {
            console.log('Using private key from environment variable');
        }

        // Warn if account doesn't include region (common issue)
        if (account && !account.includes('.') && !account.includes('-')) {
            console.warn('⚠️  Account format might need region. Try: SNOWFLAKE_ACCOUNT=IXB24790.us-east-1 (replace with your region)');
        }

        // Process private key: replace \n with actual newlines if present
        let processedKey = privateKey.replace(/\\n/g, '\n').trim();

        // Detect key format and handle accordingly
        const isRSAFormat = processedKey.includes('BEGIN RSA PRIVATE KEY');
        const isPKCS8Format = processedKey.includes('BEGIN PRIVATE KEY') && !isRSAFormat;
        const hasHeaders = processedKey.includes('BEGIN');

        let privateKeyForSnowflake;

        // If key has headers, try to convert RSA to PKCS8 (Snowflake prefers PKCS8)
        if (hasHeaders && isRSAFormat) {
            try {
                console.log('Detected RSA format key, converting to PKCS8...');
                const keyObject = crypto.createPrivateKey({
                    key: processedKey,
                    format: 'pem',
                });
                privateKeyForSnowflake = keyObject.export({
                    format: 'pem',
                    type: 'pkcs8'
                });
                console.log('Successfully converted RSA key to PKCS8 format');
            } catch (error) {
                console.warn('RSA to PKCS8 conversion failed, using original:', error.message);
                privateKeyForSnowflake = processedKey;
            }
        } else if (hasHeaders && isPKCS8Format) {
            // Already PKCS8, use as-is
            privateKeyForSnowflake = processedKey;
            console.log('Using PKCS8 format key as-is');
        } else if (!hasHeaders) {
            // No headers - assume it's base64 content, add PKCS8 headers
            privateKeyForSnowflake = `-----BEGIN PRIVATE KEY-----\n${processedKey}\n-----END PRIVATE KEY-----`;
            console.log('Added PKCS8 headers to base64 key');
        } else {
            // Unknown format, use as-is
            privateKeyForSnowflake = processedKey;
            console.log('Using key in original format');
        }

        // Debug: Log key format info (first 50 chars only for security)
        console.log(`Private key format: ${privateKeyForSnowflake.substring(0, 50)}...`);
        console.log(`Key length: ${privateKeyForSnowflake.length} characters`);

        // Try multiple connection approaches
        const tryConnection = (config, description) => {
            return new Promise((resolve, reject) => {
                // Remove undefined values from config
                const cleanConfig = Object.fromEntries(
                    Object.entries(config).filter(([_, v]) => v !== undefined)
                );

                const testConnection = snowflake.createConnection(cleanConfig);

                testConnection.connect((err, conn) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ conn, description });
                    }
                });
            });
        };

        // Base connection config
        // IMPORTANT: Must set authenticator to "SNOWFLAKE_JWT" for key-pair auth
        const baseConfig = {
            account,
            username,
            authenticator: 'SNOWFLAKE_JWT', // Required for key-pair authentication!
            role,
            warehouse,
            database,
            schema,
        };

        // Define function to try privateKey methods
        const tryPrivateKeyMethods = () => {
            // Try 2: Full PEM format with privateKey
            console.log('Trying connection with privateKey (PEM format)...');
            tryConnection(
                { ...baseConfig, privateKey: privateKeyForSnowflake },
                'PEM format with headers'
            )
                .then(({ conn, description }) => {
                    console.log(`✅ Successfully connected using ${description}`);
                    connection = conn;
                    resolve(conn);
                })
                .catch((err1) => {
                    if (err1.message && err1.message.includes('password')) {
                        // Try 3: Base64 without headers
                        console.log('PEM format failed, trying base64 format (no headers)...');
                        const base64Key = privateKeyForSnowflake
                            .replace(/-----BEGIN.*?-----/g, '')
                            .replace(/-----END.*?-----/g, '')
                            .replace(/\s/g, '');

                        tryConnection(
                            { ...baseConfig, privateKey: base64Key },
                            'Base64 format (no headers)'
                        )
                            .then(({ conn, description }) => {
                                console.log(`✅ Successfully connected using ${description}`);
                                connection = conn;
                                resolve(conn);
                            })
                            .catch((err2) => {
                                // Try 4: Base64 with proper line breaks (64 chars per line)
                                console.log('Base64 format failed, trying formatted base64...');
                                const formattedBase64 = base64Key.match(/.{1,64}/g)?.join('\n') || base64Key;
                                const formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedBase64}\n-----END PRIVATE KEY-----`;

                                tryConnection(
                                    { ...baseConfig, privateKey: formattedKey },
                                    'Formatted base64 with line breaks'
                                )
                                    .then(({ conn, description }) => {
                                        console.log(`✅ Successfully connected using ${description}`);
                                        connection = conn;
                                        resolve(conn);
                                    })
                                    .catch((err3) => {
                                        console.error('❌ All connection attempts failed:');
                                        console.error('Attempt 1 (privateKeyPath):', privateKeyPath ? 'Tried' : 'Not available');
                                        console.error('Attempt 2 (PEM):', err1.message);
                                        console.error('Attempt 3 (Base64):', err2.message);
                                        console.error('Attempt 4 (Formatted):', err3.message);
                                        console.error('\n💡 Troubleshooting tips:');
                                        console.error('1. Check account format - try adding region: SNOWFLAKE_ACCOUNT=IXB24790.us-east-1');
                                        console.error('2. Verify public key is set in Snowflake: DESC USER SKINCARE_SERVICE');
                                        console.error('3. Try using SNOWFLAKE_PRIVATE_KEY_PATH instead of SNOWFLAKE_PRIVATE_KEY');
                                        connection = null;
                                        reject(new Error(`Failed to connect: ${err3.message}. See console for troubleshooting tips.`));
                                    });
                            });
                    } else {
                        console.error('Snowflake connection error:', err1);
                        connection = null;
                        reject(err1);
                    }
                });
        };

        // Try 1: Use privateKeyPath if available (preferred method)
        if (privateKeyPath && fs.existsSync(privateKeyPath)) {
            console.log('Trying connection with privateKeyPath...');
            tryConnection(
                { ...baseConfig, privateKeyPath },
                'privateKeyPath (file)'
            )
                .then(({ conn, description }) => {
                    console.log(`✅ Successfully connected using ${description}`);
                    connection = conn;
                    resolve(conn);
                })
                .catch((err1) => {
                    console.log(`privateKeyPath failed: ${err1.message}`);
                    // Fall through to try privateKey methods
                    tryPrivateKeyMethods();
                });
        } else {
            tryPrivateKeyMethods();
        }
    });
}

/**
 * Execute SQL query with parameter binding
 * Allows SELECT, SHOW, INSERT, UPDATE, DELETE statements
 */
export function execSQL(sql, binds = []) {
    return new Promise(async (resolve, reject) => {
        // SQL safety check: allow SELECT, SHOW, INSERT, UPDATE, DELETE
        const trimmedSQL = sql.trim().toUpperCase();
        const allowedStatements = ['SELECT', 'SHOW', 'INSERT', 'UPDATE', 'DELETE'];
        const startsWithAllowed = allowedStatements.some(stmt => trimmedSQL.startsWith(stmt));

        if (!startsWithAllowed) {
            reject(new Error(`Only ${allowedStatements.join(', ')} statements are allowed`));
            return;
        }

        try {
            const conn = await connect();

            conn.execute({
                sqlText: sql,
                binds,
                complete: (err, stmt, rows) => {
                    if (err) {
                        console.error('SQL execution error:', err);
                        reject(err);
                    } else {
                        resolve(rows || []);
                    }
                },
            });
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Close the Snowflake connection
 */
export function close() {
    if (connection) {
        connection.destroy((err) => {
            if (err) {
                console.error('Error closing connection:', err);
            } else {
                console.log('Snowflake connection closed');
            }
        });
        connection = null;
    }
}
