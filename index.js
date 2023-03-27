import axios from 'axios';


// ping server
export async function ping() {
    return axios({
      method: 'GET',
      url: 'https://server.othent.io/',
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


// create user
export async function createUser(JWT) {
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
export function logIn(string) {
    return string === 'WDS'
}

// log out
export function logOut(string) {
    return string === 'WDS'
}

// sign transaction
export function signTransaction(string) {
    return string === 'WDS'
}




// send transaction
export async function sendTransaction(JWT) {
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
export async function uploadData(file, fileName, fileType) {
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
export async function queryUser(unique_id) {
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
export async function backupKeyfile(PEM_public_key) {
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