import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import { sha256 } from 'crypto-hash';



// ping server
async function ping() {
    return axios({
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
async function logIn() {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const isAuthenticated = await auth0Client.isAuthenticated(); 
    if (isAuthenticated) {
        return {'response': 'User is already logged in'}
    } else if (isAuthenticated === false) {
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
        let decoded_JWT = jwt_decode(JWT)

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

            return axios({
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
async function logOut() {
    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    await auth0Client.logout();
    return {'response': 'user logged out'}
}




// user details
async function userDetails() {
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
    let decoded_JWT = jwt_decode(accessToken.id_token)
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
async function readContract() {

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

    return axios({
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





// sign transaction
async function signTransaction({ method, data, tags }) {

    tags ??= []

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    if (method === 'warp') {
        const othentFunction = data.othentFunction
        const toContractId = data.toContractId
        const toContractFunction = data.toContractFunction
        const txnData = data.txnData
        const warpData = {
            function: othentFunction, 
            data: {
                toContractId: toContractId,
                toContractFunction: toContractFunction,
                txnData: txnData
            }
        }
    
        const options = {
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: othentFunction,
                    warpData: warpData,
                    tags: tags
                })
            }
        };
        await auth0Client.loginWithPopup(options);
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true
        });
        return {JWT: accessToken.id_token, method: 'warp'}
    }
    if (method === 'arweave') {
        const file = data.file
        const fileBuffer =  new Uint8Array((await file.arrayBuffer()));
        const file_hash = await sha256(fileBuffer)
        const options = {
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: 'uploadData',
                    file_hash: file_hash,
                    tags: tags
                })
            }
        };
        await auth0Client.loginWithPopup(options);
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true
        });
        return { file: file, JWT: accessToken.id_token, method: 'arweave' };
    }
    else { return {'response': 'no method detected'} }

}






// send transaction
async function sendTransaction(signedTransaction) {

    if (signedTransaction.method === 'warp') {
        const JWT = data.JWT
        return axios({
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
    if (signedTransaction.method === 'arweave') {

        const file = data.file
        const fileHashJWT = data.JWT

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileHashJWT", fileHashJWT)

        return await fetch('https://server.othent.io/upload-data', {
        method: 'POST',
        body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            return data
        })
        .catch(error => {
            console.log(error.response.data);
            throw error;
        });
    } 
    else { return {'response': 'no method detected', 'signedTransaction': signedTransaction} }
    
}



// backup keyfile
async function initializeJWK(JWK_public_key_PEM) {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key: JWK_public_key_PEM } },
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    const PEM_key_JWT = accessToken.id_token;

    return axios({
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
async function JWKBackupTxn(JWT) {
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/JWK-backup-transaction',
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






export default { ping, logIn, logOut, userDetails, readContract, signTransaction, sendTransaction, initializeJWK, JWKBackupTxn };

