import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import { sha256 } from 'crypto-hash';
import * as Types from '../types/index';



// ping server
export async function ping(): Promise<Types.PingReturnProps> {
    return await axios({
      method: 'GET',
      url: 'https://server.othent.io/',
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}





// log in
export async function logIn(): Promise<Types.LogInReturnProps> {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
    });

    const isAuthenticated = await auth0Client.isAuthenticated(); 
    if (isAuthenticated) {
        return await userDetails()
    } else {
        const options = {
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: "idToken", 
                }),
                redirect_uri: window.location.origin
            }
        };
        await auth0Client.loginWithPopup(options);
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true
        });
        const JWT = accessToken.id_token;
        let decoded_JWT: Types.DecodedJWT = jwt_decode(JWT)

        if (decoded_JWT.contract_id) {

            delete decoded_JWT.nonce
            delete decoded_JWT.sid
            delete decoded_JWT.aud
            delete decoded_JWT.iss
            delete decoded_JWT.iat
            delete decoded_JWT.exp
            delete decoded_JWT.updated_at
            return decoded_JWT
            
        } else {

            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/create-user',
                data: { JWT }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }

    }

}



// log out
export async function logOut(): Promise<Types.LogOutReturnProps> {
    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    await auth0Client.logout({
        logoutParams: {
            returnTo: window.location.origin
          }
      });
    return {'response': 'user logged out'}
}




// user details
export async function userDetails(): Promise<Types.UserDetailsReturnProps> {
    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: "idToken", 
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    let decoded_JWT: Types.DecodedJWT = jwt_decode(accessToken.id_token)
    delete decoded_JWT.nonce
    delete decoded_JWT.sid
    delete decoded_JWT.aud
    delete decoded_JWT.iss
    delete decoded_JWT.iat
    delete decoded_JWT.exp
    delete decoded_JWT.updated_at
    return decoded_JWT
}




// read contract
export async function readContract(): Promise<Types.ReadContractReturnProps> {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: "idToken", 
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    const JWT = accessToken.id_token;

    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/read-contract',
        data: { JWT }
      })
      .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}





// sign transaction warp
export async function signTransactionWarp(params: Types.SignTransactionWarpProps) : Promise<Types.SignTransactionWarpReturnProps> {

    params.tags ??= []

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const warpData = {
        function: params.othentFunction, 
        data: {
            toContractId: params.data.toContractId,
            toContractFunction: params.data.toContractFunction,
            txnData: params.data.txnData
        }
    }

    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: params.othentFunction,
                warpData: warpData,
                tags: params.tags
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });

    return {JWT: accessToken.id_token, method: 'warp'}

}


// sign transaction arweave
export async function signTransactionArweave(params: Types.SignTransactionArweaveProps) : Promise<Types.SignTransactionArweaveReturnProps> {

    params.tags ??= []

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const data = params.data
    let uint8Array;

    if (typeof data === 'string') {
        const encoder = new TextEncoder();
        uint8Array = encoder.encode(data);
    } else if (data instanceof Uint8Array) {
        uint8Array = data;
    } else if (data instanceof ArrayBuffer) {
        uint8Array = new Uint8Array(data);
    } else {
        throw new TypeError('Unsupported data type');
    }

    const file_hash = await sha256(uint8Array)
    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: params.othentFunction,
                file_hash: file_hash,
                tags: params.tags
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    return { data: data, JWT: accessToken.id_token, method: 'arweave' };

}



// send transaction
export async function sendTransaction(params: Types.SendTransactionProps) : Promise<Types.SendTransactionReturnProps> {

    if (params.signedTransaction.method === 'warp') {
        const JWT = params.signedTransaction.JWT
        return await axios({
            method: 'POST',
            url: 'https://server.othent.io/send-transaction',
            data: { JWT }
          })
          .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error.response.data);
            throw error;
        });

    } 
    else if (params.signedTransaction.method === 'arweave') {

        return await fetch('https://server.othent.io/upload-data', {
            method: 'POST',
            body: JSON.stringify({ data: params.signedTransaction.data, dataHashJWT: params.signedTransaction.JWT})
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
            throw error;
        });

    } 
    else { throw new Error ('no method detected') }
    
}




// backup keyfile
export async function initializeJWK(params: Types.InitializeJWKProps) : Promise<Types.InitializeJWKReturnProps> {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key: params.JWKPublicKeyPEM } },
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    const PEM_key_JWT = accessToken.id_token;

    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/initialize-JWK',
        data: { PEM_key_JWT }
      })
      .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}



// JWK backup transaction
export async function JWKBackupTxn(params: Types.JWKBackupTxnProps) : Promise<Types.JWKBackupTxnReturnProps> {
    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/JWK-backup-transaction',
        data: { JWT: params.JWT }
      })
      .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}
