import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

// Example data
const RECIPIENT = "3a536a8e6f960ae56095820669a58fe77d423856ba2cff925568a7f3be1e458651d771e4fd8e6cf9885fae5fd5b178b999912df2d65c90f640be2e0a55a54d46";
const AMOUNT = "2"; // This could be a string to avoid precision issues in JavaScript

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

// console.log('Message Hash:', toHex(hashData(recipient, amount)));

export { hashData };