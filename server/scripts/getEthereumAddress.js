
import { keccak256 } from 'ethereum-cryptography/keccak.js';

function getAddress(publicKey) {
    // take first byte off
    const publicKeyBytes = publicKey.slice(1);
    // hash the public key
    const publicKeyHash = keccak256(publicKeyBytes);
    // take last 20 bytes
    const address = publicKeyHash.slice(-20);
    return address
}

export { getAddress };