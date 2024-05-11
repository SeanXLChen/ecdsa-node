import { useEffect, useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

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

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [messageHash, setMessageHash] = useState("");
  const [signature, setSignature] = useState("");
  const [bit, setBit] = useState("");

  useEffect(() => {
    const hash = hashData(recipient, sendAmount);
    const hexHash = toHex(hash);
    setMessageHash(hexHash);
  }, [recipient, sendAmount]);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        recipient,
        amount: parseInt(sendAmount),
        messageHash,
        sigHex: signature,
        bit: parseInt(bit),
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Message Hash
        <input
          placeholder="Message Hash in Hexadecimal"
          value={messageHash}
          disabled
        ></input>
      </label>

      <label>
        Signature (Hex)
        <input
          placeholder="Sign the message hash with your private key"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Recovery Bit
        <input
          placeholder="Recovery Bit of the signature"
          value={bit}
          onChange={setValue(setBit)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
