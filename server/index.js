// secp256k1 elliptic curve operations
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// utilities
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import hashData from "./scripts/hashData.js";
import getAddress from "./scripts/getEthereumAddress.js";
import express from 'express';
const app = express();
import cors from 'cors';
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, signature, messageHash } = req.body;

  // Recreate the message hash from the recipient and amount
  const msgHashBytes = hashData(recipient, amount);

  // Verify the message hash
  if (toHex(msgHashBytes) !== messageHash) {
    res.status(400).send({ message: "Invalid message hash." });
    return;
  }

  try {
    const sigBytes = utils.hexToBytes(signature);

    // Recover the public key from the signature
    const publicKeyRecovered = secp256k1.recoverPublicKey(messageHash, sigBytes);
    const sender = utils.bytesToHex(publicKeyRecovered); // Convert public key to address or use as is

    // Verify the signature with the recovered public key
    if (secp256k1.verify(sigBytes, messageHash, publicKeyRecovered)) {
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    } else {
      res.status(401).send("Invalid signature.");
    }
  } catch (error) {
    res.status(500).send("Error processing the transaction.");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
