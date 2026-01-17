import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config();

console.log('=== Private Key Format Checker ===\n');

// Check if using file path or env var
const privateKeyPath = process.env.SNOWFLAKE_PRIVATE_KEY_PATH;
const privateKeyEnv = process.env.SNOWFLAKE_PRIVATE_KEY;

let privateKey;
let source;

if (privateKeyPath && fs.existsSync(privateKeyPath)) {
    privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    source = `File: ${privateKeyPath}`;
} else if (privateKeyEnv) {
    privateKey = privateKeyEnv;
    source = 'Environment variable: SNOWFLAKE_PRIVATE_KEY';
} else {
    console.error('❌ ERROR: No private key found!');
    console.log('\nOptions:');
    console.log('1. Set SNOWFLAKE_PRIVATE_KEY in .env file');
    console.log('2. Set SNOWFLAKE_PRIVATE_KEY_PATH to point to your key file');
    process.exit(1);
}

console.log(`Source: ${source}\n`);

// Basic info
console.log('📊 Key Information:');
console.log(`   Length: ${privateKey.length} characters`);
console.log(`   First 80 chars: ${privateKey.substring(0, 80)}...`);
console.log(`   Last 40 chars: ...${privateKey.substring(privateKey.length - 40)}\n`);

// Format detection
console.log('🔍 Format Detection:');
const hasBegin = privateKey.includes('BEGIN');
const hasEnd = privateKey.includes('END');
const hasRSA = privateKey.includes('BEGIN RSA PRIVATE KEY');
const hasPKCS8 = privateKey.includes('BEGIN PRIVATE KEY') && !hasRSA;
const hasNewlines = privateKey.includes('\n');
const hasEscapedNewlines = privateKey.includes('\\n');
const hasActualNewlines = privateKey.match(/\n/g)?.length || 0;

console.log(`   Has BEGIN header: ${hasBegin ? '✅' : '❌'}`);
console.log(`   Has END footer: ${hasEnd ? '✅' : '❌'}`);
console.log(`   Format: ${hasRSA ? 'RSA' : hasPKCS8 ? 'PKCS8' : hasBegin ? 'Unknown PEM' : 'Raw/Base64'}`);
console.log(`   Has actual newlines (\\n): ${hasActualNewlines} occurrences`);
console.log(`   Has escaped newlines (\\\\n): ${hasEscapedNewlines ? '✅' : '❌'}\n`);

// Validation
console.log('✅ Validation:');
let isValid = true;
let issues = [];

if (!hasBegin || !hasEnd) {
    isValid = false;
    issues.push('Missing PEM headers/footers');
}

if (hasEscapedNewlines && !hasActualNewlines) {
    issues.push('Has escaped \\n but no actual newlines (will be converted)');
}

// Try to parse the key
let parseResult = { success: false, error: null, format: null };

try {
    // Process escaped newlines
    let processedKey = privateKey.replace(/\\n/g, '\n').trim();
    
    // Ensure headers
    if (!processedKey.includes('BEGIN')) {
        processedKey = `-----BEGIN PRIVATE KEY-----\n${processedKey}\n-----END PRIVATE KEY-----`;
    }
    
    // Try parsing
    const keyObject = crypto.createPrivateKey({
        key: processedKey,
        format: 'pem',
    });
    
    parseResult.success = true;
    parseResult.format = keyObject.asymmetricKeyType || 'unknown';
    console.log(`   ✅ Key can be parsed successfully`);
    console.log(`   ✅ Key type: ${parseResult.format}`);
    
    // Try exporting as PKCS8 (Snowflake's preferred format)
    try {
        const pkcs8 = keyObject.export({
            format: 'pem',
            type: 'pkcs8'
        });
        console.log(`   ✅ Can convert to PKCS8 format`);
    } catch (e) {
        console.log(`   ⚠️  Cannot convert to PKCS8: ${e.message}`);
    }
    
} catch (error) {
    isValid = false;
    parseResult.error = error.message;
    console.log(`   ❌ Cannot parse key: ${error.message}`);
    issues.push(`Parse error: ${error.message}`);
}

console.log('\n📝 Recommendations:');

if (!hasBegin || !hasEnd) {
    console.log('   1. Add PEM headers/footers to your key');
    console.log('      Format: -----BEGIN PRIVATE KEY-----\\n[base64 content]\\n-----END PRIVATE KEY-----');
}

if (hasEscapedNewlines && !hasActualNewlines) {
    console.log('   2. Your key uses \\\\n - this will be converted automatically');
}

if (hasRSA) {
    console.log('   3. Your key is in RSA format - will be converted to PKCS8 automatically');
}

if (!parseResult.success) {
    console.log('   4. ⚠️  Key parsing failed - check the error above');
    console.log('   5. Make sure your key is a valid PEM format private key');
} else {
    console.log('   ✅ Your key format looks good!');
}

console.log('\n💡 Example .env format:');
console.log('   SNOWFLAKE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\\n-----END PRIVATE KEY-----"');

if (issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    process.exit(1);
} else {
    console.log('\n✅ All checks passed!');
}
