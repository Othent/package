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

signTransaction({ method, data, tags }): Sign a transaction with the current user's account.

sendTransaction(signedTransaction): Send a signed transaction to Othent.

initializeJWK(JWK_public_key_PEM): backup a Othent account with a JWK public key.

JWKBackupTxn(signedJWTByJWK): Send a transaction with the specified JWK.

## Examples
#### Please find examples at https://docs.othent.io/developers/sdk

## Documentation
For more information on how to use the Othent Library, please see the official Othent documentation at https://docs.othent.io/developers/sdk.

## Contact
If you have any questions or issues with the Othent Library, please contact us at hello@othent.io or open an issue in the GitHub repository.

## License
The Othent Library is licensed under the MIT License. Please see the LICENSE file for more information.