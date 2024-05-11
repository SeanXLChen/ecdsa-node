import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

// Example data
const recipient = "0x1234567890abcdef1234567890abcdef12345678";
const amount = "100"; // This could be a string to avoid precision issues in JavaScript

function hashData(recipient, amount) {
    // Combine the recipient and amount into one string
    // You might choose to separate them in a way that avoids any possible ambiguity
    const data = `${recipient}:${amount}`;
    // Convert the data to bytes if necessary
    const dataBytes = utf8ToBytes(data);
    // Compute the keccak256 hash of the data
    const messageHashBytes = keccak256(dataBytes);
    return messageHashBytes;
}

console.log('Message Hash:', toHex(hashData(recipient, amount)));

export { hashData };