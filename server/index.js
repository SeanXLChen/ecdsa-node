// secp256k1 elliptic curve operations
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
// utilities
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { hashData } from "./scripts/hashData.js";
import { getAddress } from "./scripts/getEthereumAddress.js";

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
  "03385c3a6ec0b9d57a4330dbd6284989be5bd00e41c535f9ca39b6ae7c521b81cd": 1000,
  "03d75ed19d5d5d0df49c74b7aa299a2fc25a6f455512bf6e4ca38ce0afbf1df0e4": 88,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, sigHex, bit, messageHash } = req.body;
  const recoveryBit = parseInt(bit);

  console.log('recoveryBit:', recoveryBit);

  try {
    // Recreate the message hash from the recipient and amount
    const msgHashBytes = hashData(recipient, amount);

    // Verify the message hash
    if (toHex(msgHashBytes) !== messageHash) {
      res.status(400).send({ message: "Invalid message hash." });
      return;
    }

    let signature = secp256k1.Signature.fromCompact(sigHex);
    signature = signature.addRecoveryBit(recoveryBit); // bit is not serialized into compact / der format

    console.log('signature:', signature);

    // Recover the (compressed) public key from the signature
    const publicKeyRecovered = signature.recoverPublicKey(messageHash, signature).toRawBytes();
    const sender = toHex(publicKeyRecovered);
    console.log('publicKeyRecovered:', toHex(publicKeyRecovered));

    // Verify the signature with the recovered public key
    if (secp256k1.verify(signature, messageHash, publicKeyRecovered)) {
      setInitialBalance(sender);
      setInitialBalance(recipient);

      if (balances[sender] < amount) {
        console.log('balances[sender]:', balances[sender])
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
