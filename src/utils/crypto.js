/**
 * Encrypts a JSON payload using the browser's native Web Crypto API (AES-256-CBC).
 * 
 * @param {Object} data - The JSON object to encrypt.
 * @param {string} secretKey - The 32-character encryption key.
 * @returns {Promise<{iv: string, encryptedData: string}>} - The IV and encrypted ciphertext in hex format.
 */
export async function encryptPayload(data, secretKey) {
  if (!secretKey) {
    throw new Error('Encryption secret key is missing.');
  }
  
  const encoder = new TextEncoder();
  const rawData = encoder.encode(JSON.stringify(data));
  
  // Import the raw 32-byte key buffer for AES-CBC operations
  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );
  
  // Generate a random 16-byte initialization vector (IV)
  const iv = window.crypto.getRandomValues(new Uint8Array(16));
  
  // Encrypt the payload buffer
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: iv },
    key,
    rawData
  );
  
  // Convert the ciphertext and IV buffers to hex strings
  const encryptedHex = Array.from(new Uint8Array(encryptedBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  const ivHex = Array.from(iv)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
    
  return {
    iv: ivHex,
    encryptedData: encryptedHex
  };
}
