import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';

// config all of this auth0 provider


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
async function createUser(JWT) {
    return axios({
      method: 'POST',
      url: 'https://server.othent.io/create-user',
      data: { JWT }
    })
    .then(response => {
        console.log(response);
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
    await auth0Client.loginWithPopup();
    return {'response': 'User logged in'}
}



// log out
async function logOut() {
    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });
    await auth0Client.logout();
    return {'response': 'User logged out'}
}



// sign transaction, sort this one out
async function signTransaction(othentFunction, ) {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
      });
    
    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({

            // // create user for warp
            // othentFunction: "initializeContract", 
            // warpData: {function: 'initializeContract', data: null},

            // send txn for warp
            othentFunction: "broadcastTxn",
            warpData: {
            function: 'broadcastTxn', 
            data: {
                toContractId: 'XL_AtkccUxD45_Be76Qe_lSt8q9amgEO9OQnhIo-2xI',
                toContractFunction: 'createPost',
                txnData: {blog_post_1: 'Hello World!'}
            }},

            // arweave TXN JWT
            // here
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
          console.log(response);
          return response.data;
      })
      .catch(error => {
          console.log(error.response.data);
          throw error;
      });
}



// upload data to arweave
async function uploadData(file, fileName, fileType) {
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/upload-data',
        data: { file, fileName, fileType }
      })
      .then(response => {
          console.log(response);
          return response.data;
      })
      .catch(error => {
          console.log(error.response.data);
          throw error;
        });
}




// query user address, GET
async function queryUser(unique_id) {
    return axios({
        method: 'GET',
        url: 'https://server.othent.io/query-user',
        data: { unique_id }
      })
      .then(response => {
          console.log(response);
          return response.data;
      })
      .catch(error => {
          console.log(error.response.data);
          throw error;
        });
}




// backup keyfile
async function backupKeyfile(PEM_public_key) {
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/backup-keyfile',
        data: { PEM_public_key }
      })
      .then(response => {
          console.log(response);
          return response.data;
      })
      .catch(error => {
          console.log(error.response.data);
          throw error;
        });
}






export default { ping, createUser, logIn, logOut, signTransaction, sendTransaction, uploadData, queryUser, backupKeyfile };
