# Othent.io Library
The Othent Library is a collection of functions that enable interaction with the Othent walletless protocol. These functions are designed to make it seamless for developers to integrate Othent into their applications.

## Installation
To use the library in your project, you can install it using npm:
```bash
npm i othent
```

## Usage
To use the library, you can import it into your project:
```javascript
import othent from 'othent';
```

## Functions
#### The following functions are available in the Othent Library:

ping(): Ping the Othent server.

logIn(): Log in a user and return their details.

logOut(): Log out the current user.

userDetails(): Retrieve the details of the current user.

readContract(): Read data from the current user's contract.

signTransaction(othentFunction, toContractId, toContractFunction, txnData): Sign a transaction with the current user's account.

sendTransaction(JWT): Send a signed transaction to Othent.

uploadData(file): Upload a file to Arweave and create a Othent users files hash.

initializeJWK(JWK_public_key_PEM): backup a Othent account with a JWK public key.

JWKBackupTxn(JWT): Send a transaction with the specified JWK.

## Examples
#### Here are some examples of using the Othent Library:

Log in a user and retrieve their contract details

``` javascript
async function logIn() {
  try {
    const userDetails = await othent.logIn();
    console.log(userDetails);
  } catch (error) {
    console.error(error);
  }
}
```

Upload a file to Arweave and create a Othent hash

```javascript
async function uploadFile(file) {
  try {
    const uploadResult = await othent.uploadData(file);
    console.log(uploadResult);
  } catch (error) {
    console.error(error);
  }
}
```

## Documentation
For more information on how to use the Othent Library, please see the official Othent documentation at https://docs.othent.io.

## Contact
If you have any questions or issues with the Othent Library, please contact us at hello@othent.io or open an issue in the GitHub repository.

## License
The Othent Library is licensed under the MIT License. Please see the LICENSE file for more information.