// secp256k1 elliptic curve operations
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// import getAddress function
import { getAddress } from './getEthereumAddress.js'
// utilities
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const EXPECTED_ADDRESS = "16bB6031CBF3a12B899aB99D96B64b7bbD719705";

// const privateKey = secp256k1.utils.randomPrivateKey();
const privateKey = hexToBytes(PRIVATE_KEY);

// generate uncompressed public key (starts with 0x04)
const uncompressedPublicKey = secp256k1.getPublicKey(privateKey, false);

// generate compressed public key (starts with 0x02 or 0x03)
const compressedPublicKey = secp256k1.getPublicKey(privateKey, true);

// generate ethereum address
const uncompressedAddress = getAddress(uncompressedPublicKey);

const ethereumAddress = getAddress(uncompressedPublicKey); // 在生成以太坊地址时，必须使用未压缩的公钥以确保地址的正确生成。对于其他操作，如签名和验证，压缩与否通常不影响操作的正确性

console.log("Private Key (hex):", toHex(privateKey));
console.log("Uncompressed Public Key (hex):", toHex(uncompressedPublicKey));
console.log("Compressed Public Key (hex):", toHex(compressedPublicKey));
console.log("Address:", toHex(ethereumAddress));