## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.


### Implementation
Was originally planning to use ETH address using the `getAddress()` defined in `scripts/getEthereumAddress.js` 
However eventually switched to just use compressed Public Key for more straightforward implementation.

Now User can check their balance by input their public key only (improved security)

Trail and verify my implementation using this sample wallet info:

```
PrivateKey: 6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e

Uncompressed PublicKey: 04385c3a6ec0b9d57a4330dbd6284989be5bd00e41c535f9ca39b6ae7c521b81cd2443fef29e7f34aa8c8002eceaff422cd1f622bb4830714110e736044d8f084f

Compressed PublicKey: 03385c3a6ec0b9d57a4330dbd6284989be5bd00e41c535f9ca39b6ae7c521b81cd
```

And by sending this sample transaciton info

```
recipient PublicKey: 03d75ed19d5d5d0df49c74b7aa299a2fc25a6f455512bf6e4ca38ce0afbf1df0e4
amount send: 2
Message Hash: 298210ad2ec851ebf1fb3a9a43ca47e5f95775b7b33d76afa5c29798c5f74059
Signature: 3a536a8e6f960ae56095820669a58fe77d423856ba2cff925568a7f3be1e458651d771e4fd8e6cf9885fae5fd5b178b999912df2d65c90f640be2e0a55a54d46
Recovery Bit: 0
```

Because I didn't add the nonce inside the message, the same transaction can be replayed multiple times. (a bad security practice but good enough for this project)

All infos are verifiable by runing these 2 scripts inside `/server/scripts`
```
// this generate public key from private key
node generate.js 

// this sign the transaction message of sending 2 coins to the sample recipient address (publicKey)
node signature.js
```