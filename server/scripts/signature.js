// secp256k1 elliptic curve operations
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// utilities
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import {hashData} from "./hashData.js";

const RECIPIENT = "09ffdf9d9a21b727d50df199978097dbc9ced483";
const AMOUNT = "2"; // This could be a string to avoid precision issues in JavaScript

const privateKey = secp256k1.utils.randomPrivateKey();
// const privateKey = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
// const messageHash = new Uint8Array(32).fill(1); // message hash (not message) in ecdsa
// const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
const messageHash = hashData(RECIPIENT, AMOUNT);
const publicKey = secp256k1.getPublicKey(privateKey);
const signature = secp256k1.sign(messageHash, privateKey);
const publicKeyRecovered = signature.recoverPublicKey(messageHash).toRawBytes();
const isSigned = secp256k1.verify(signature, messageHash, publicKey);

console.log('pub:', toHex(publicKey));
console.log('recovered pub:', toHex(publicKeyRecovered)); // public key can be recovered from signature
console.log(toHex(publicKey) === toHex(publicKeyRecovered) ? 'Recovered public key is correct' : 'Recovered public key is incorrect');
console.log('sig:', signature.toCompactHex());
console.log('isSigned:', isSigned ? 'Signature is correct' : 'Signature is incorrect');