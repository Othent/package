import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';


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


// create user
async function createUser() {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    
    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: "initializeContract", 
                warpData: {function: 'initializeContract', data: null}
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

        const checkDB = await axios({
            method: 'POST',
            url: 'https://server.othent.io/query-user',
            data: { JWT }
        })
        const checkDB_res = checkDB.data

        return checkDB_res

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

    console.log(decoded_JWT)
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
async function signTransaction(othentFunction, toContractId, toContractFunction, txnData) {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

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
            })
        }
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
        detailedResponse: true
    });
    const idToken = accessToken.id_token;
    return idToken
}






// send transaction
async function sendTransaction(JWT) {
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



// upload file to arweave
async function uploadData(file) {

    const formData = new FormData();
    formData.append("file", file);

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




// query user address, GET
async function queryUser() {

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
        url: 'https://server.othent.io/query-user',
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






export default { ping, createUser, logIn, logOut, userDetails, readContract, signTransaction, sendTransaction, uploadData, queryUser, initializeJWK, JWKBackupTxn };
