import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import { sha256 } from 'crypto-hash';
import * as Types from '../types/index';



// ping server
async function ping(): Promise<Types.PingReturnProps> {
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
async function logIn(): Promise<Types.LogInReturnProps> {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
    });

    const isAuthenticated = await auth0Client.isAuthenticated(); 
    if (isAuthenticated) {
        return await userDetails() as Types.UserDetailsReturnProps
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
                const new_user_details = response.data
                
                return {
                    contract_id: new_user_details.contract_id,
                    given_name: new_user_details.given_name,
                    family_name: new_user_details.family_name,
                    nickname: new_user_details.nickname,
                    name: new_user_details.name,
                    picture: new_user_details.picture,
                    locale: new_user_details.locale,
                    email: new_user_details.email,
                    email_verified: new_user_details.email_verified,
                    sub: new_user_details.sub,
                    success: new_user_details.success,
                    message: new_user_details.message
                }

            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });



        
        }

    }

}



// log out
async function logOut(): Promise<Types.LogOutReturnProps> {
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




async function userDetails(): Promise<Types.UserDetailsReturnProps | Types.UserDetailsErrorReturnProps> {
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
    const JWT = accessToken.id_token
    const decoded_JWT: Types.DecodedJWT = jwt_decode(JWT)
    if (decoded_JWT.contract_id) {
        delete decoded_JWT.nonce
        delete decoded_JWT.sid
        delete decoded_JWT.aud
        delete decoded_JWT.iss
        delete decoded_JWT.iat
        delete decoded_JWT.exp
        delete decoded_JWT.updated_at
        return decoded_JWT;
    } else {
        return { 
            success: false, 
            message: 'Please create a Othent account',
            contract_id: 'false',
            given_name: 'false',
            family_name: 'false',
            nickname: 'false',
            name: 'false',
            picture: 'false',
            locale: 'false',
            email: 'false',
            email_verified: 'false',
            sub: 'false',
        };
    }
}





// read contract
async function readContract(): Promise<Types.ReadContractReturnProps> {

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
async function signTransactionWarp(params: Types.SignTransactionWarpProps) : Promise<Types.SignTransactionWarpReturnProps> {

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

    const JWT = accessToken.id_token
    const decoded_JWT: Types.DecodedJWT = jwt_decode(JWT)

    if (decoded_JWT.contract_id) {
        return {JWT: accessToken.id_token}
    } else {
        return {success: false, message:"Please create a Othent account"}
    }

}


// sign transaction arweave
async function signTransactionArweave(params: Types.SignTransactionArweaveProps): Promise<Types.SignTransactionArweaveReturnProps> {

    params.tags ??= [];
  
    const auth0Client = await createAuth0Client({
      domain: "othent.us.auth0.com",
      clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
    });
  
    let uint8Array;
  
    if (typeof params.data === "string") {
      const encoder = new TextEncoder();
      uint8Array = encoder.encode(params.data);
    } else if (params.data instanceof Uint8Array) {
      uint8Array = params.data;
    } else if (params.data instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(params.data);
    } else if (typeof params.data === "object") {
      uint8Array = new TextEncoder().encode(JSON.stringify(params.data));
    } else {
      throw new TypeError("Unsupported data type");
    }
  
    const file_hash = await sha256(uint8Array);
    const options = {
      authorizationParams: {
        transaction_input: JSON.stringify({
          othentFunction: params.othentFunction,
          file_hash: file_hash,
          tags: params.tags,
        }),
      },
    };
    await auth0Client.loginWithPopup(options);
    const accessToken = await auth0Client.getTokenSilently({
      detailedResponse: true,
    });
    const JWT = accessToken.id_token
    const decoded_JWT: Types.DecodedJWT = jwt_decode(JWT)

    if (decoded_JWT.contract_id) {
        return { data: params.data, JWT: accessToken.id_token};
    } else {
        return {success: false, message:"Please create a Othent account"}
    }

  }
  



// send transaction - Arweave
async function sendTransactionArweave(params: Types.SendTransactionArweaveProps) : Promise<Types.SendTransactionArweaveReturnProps> { 
    
    const data = params.data;

    const blob = new Blob([data])

    console.log(blob)

    const formData = new FormData();

    formData.append('file', blob);
    formData.append('dataHashJWT', params.JWT);

    return await fetch('https://server.othent.io/upload-data', {
        method: 'POST',
        body: formData
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



// send transaction - Warp
async function sendTransactionWarp(params: Types.SendTransactionWarpProps) : Promise<Types.SendTransactionWarpReturnProps> {

    const JWT = params.JWT
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




// backup keyfile
async function initializeJWK(params: Types.InitializeJWKProps) : Promise<Types.InitializeJWKReturnProps> {

    const auth0Client = await createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    const options = {
        authorizationParams: {
            transaction_input: JSON.stringify({
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key: params.JWK_public_key } },
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
async function JWKBackupTxn(params: Types.JWKBackupTxnProps) : Promise<Types.JWKBackupTxnReturnProps> {
    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/JWK-backup-transaction',
        data: { JWK_signed_JWT: params.JWK_signed_JWT }
      })
      .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}



// Read custom contract
export async function readCustomContract(params: Types.readCustomContractProps) : Promise<Types.readCustomContractReturnProps> {
    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/read-custom-contract',
        data: { contract_id: params.contract_id }
      })
      .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}





export default { ping, logIn, logOut, userDetails, readContract, signTransactionWarp, signTransactionArweave, sendTransactionWarp, sendTransactionArweave, initializeJWK, JWKBackupTxn, readCustomContract }

