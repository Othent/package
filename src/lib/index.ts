import axios from 'axios';
import { createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import { sha256 } from 'crypto-hash';
import jwkToPem from 'jwk-to-pem';
import { KJUR } from 'jsrsasign';
import {
    API_ID_JWT,
    DecodedJWT,
    InitializeJWKProps,
    InitializeJWKReturnProps,
    JWKBackupTxnProps,
    JWKBackupTxnReturnProps,
    LogInReturnProps,
    LogOutReturnProps,
    PingReturnProps,
    ReadContractReturnProps,
    SendTransactionArweaveProps,
    SendTransactionArweaveReturnProps,
    SendTransactionBundlrProps,
    SendTransactionBundlrReturnProps,
    SendTransactionWarpProps,
    SendTransactionWarpReturnProps,
    SignTransactionArweaveProps,
    SignTransactionArweaveReturnProps,
    SignTransactionBundlrProps,
    SignTransactionBundlrReturnProps,
    SignTransactionWarpProps,
    SignTransactionWarpReturnProps,
    UserDetailsReturnProps,
    addCallbackURLProps,
    addCallbackURLReturnProps,
    getAPIIDReturnProps,
    readCustomContractProps,
    readCustomContractReturnProps,
    useOthentProps,
    useOthentReturnProps,
  } from "../types/index.js";



// Othent
export async function Othent(params: useOthentProps): Promise<useOthentReturnProps> {
    const API_ID = params.API_ID;
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/use-othent',
        data: { API_ID }
    })
    .then((API_valid) => {
        if (API_valid.data.success === false) {
            throw new Error('Please specify an API ID (you can get one from Othent.io)');
        }


    // get API keys
    async function getAPIID(): Promise<getAPIIDReturnProps> {
        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
        });

        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: "API_ID",
                })
            }
        });
        const JWT = accessToken.id_token
        const decoded_JWT: API_ID_JWT = jwt_decode(JWT)

        if (decoded_JWT.contract_id) {
            return { API_ID: decoded_JWT.API_ID }
        } else {
            throw new Error(`{success: false, message:"Please create a Othent account"}`)
        }
    }



    // add callback url
    async function addCallbackURL(params: addCallbackURLProps): Promise<addCallbackURLReturnProps> {
        
        return await axios({
            method: 'POST',
            url: 'https://server.othent.io/add-callback-url',
            data: {callbackURL: params.callbackURL}
        })
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        });

    }     




    // ping server
    async function ping(): Promise<PingReturnProps> {
        return await axios({
            method: 'GET',
            url: 'https://server.othent.io/',
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }



    // log in
    async function logIn(): Promise<LogInReturnProps> {

        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
        });

        const isAuthenticated = await auth0Client.isAuthenticated();
        if (isAuthenticated) {
            return await userDetails() as UserDetailsReturnProps
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
            let decoded_JWT: DecodedJWT = jwt_decode(JWT)

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
                    data: { JWT, API_ID }
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
    async function logOut(): Promise<LogOutReturnProps> {
        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
        });
        await auth0Client.logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
        return { response: 'user logged out' }
    }




    async function userDetails(): Promise<UserDetailsReturnProps> {
        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
        });
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: "idToken",
                })
            }
        });
        const JWT = accessToken.id_token
        const decoded_JWT: DecodedJWT = jwt_decode(JWT)
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
            throw new Error(`{success: false, message:"Please create a Othent account"}`)
        }
    }





    // read contract
    async function readContract(): Promise<ReadContractReturnProps> {

        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
        });
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: "idToken",
                })
            }
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
    async function signTransactionWarp(params: SignTransactionWarpProps): Promise<SignTransactionWarpReturnProps> {

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

        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: params.othentFunction,
                    warpData: warpData,
                })
            }
        });

        const JWT = accessToken.id_token
        const decoded_JWT: DecodedJWT = jwt_decode(JWT)

        if (!decoded_JWT.contract_id) {
            throw new Error(`{success: false, message:"Please create a Othent account"}`)
        }
        return { JWT: accessToken.id_token, tags: params.tags };

    }




    // send transaction - Warp
    async function sendTransactionWarp(params: SendTransactionWarpProps): Promise<SendTransactionWarpReturnProps> {

        const JWT = params.JWT
        const tags = params.tags
        return await axios({
            method: 'POST',
            url: 'https://server.othent.io/send-transaction',
            data: { JWT, tags, API_ID }
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });

    }






    // sign transaction arweave
    async function signTransactionArweave(params: SignTransactionArweaveProps): Promise<SignTransactionArweaveReturnProps> {

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
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: params.othentFunction,
                    file_hash: file_hash,
                }),
            }
        });
        const JWT = accessToken.id_token
        const decoded_JWT: DecodedJWT = jwt_decode(JWT)

        if (!decoded_JWT.contract_id) {
            throw new Error(`{success: false, message:"Please create a Othent account"}`)
        }
        return { data: params.data, JWT: accessToken.id_token, tags: params.tags };

    }




    // send transaction - Arweave
    async function sendTransactionArweave(params: SendTransactionArweaveProps): Promise<SendTransactionArweaveReturnProps> {

        const data = params.data;

        const blob = new Blob([data])

        const formData = new FormData();

        formData.append('file', blob);
        formData.append('dataHashJWT', params.JWT);
        formData.append('API_ID', API_ID);
        formData.append('tags', JSON.stringify(params.tags));

        return await fetch('https://server.othent.io/upload-data-arweave', {
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








    // sign transaction - bundlr
    async function signTransactionBundlr(params: SignTransactionBundlrProps): Promise<SignTransactionBundlrReturnProps> {

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
        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                    othentFunction: params.othentFunction,
                    file_hash: file_hash,
                }),
            }
        });
        const JWT = accessToken.id_token
        const decoded_JWT: DecodedJWT = jwt_decode(JWT)

        if (!decoded_JWT.contract_id) {
            throw new Error(`{success: false, message:"Please create a Othent account"}`)
        }
        return { data: params.data, JWT: accessToken.id_token, tags: params.tags };

    }




    // send transaction - bundlr
    async function sendTransactionBundlr(params: SendTransactionBundlrProps): Promise<SendTransactionBundlrReturnProps> {

        const data = params.data;

        const blob = new Blob([data]);

        const formData = new FormData();

        formData.append("file", blob);
        formData.append("dataHashJWT", params.JWT);
        formData.append("API_ID", API_ID);
        formData.append("tags", JSON.stringify(params.tags));

        return await fetch("https://server.othent.io/upload-data-bundlr", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    }








    // backup keyfile
    async function initializeJWK(params: InitializeJWKProps): Promise<InitializeJWKReturnProps> {
      
        const privateKey = params.privateKey
        const key = JSON.stringify(privateKey)
        const key1 = JSON.parse(key)

        const JWK_public_key = null
        const JWK_public_key_PEM = jwkToPem(key1);

        const auth0Client = await createAuth0Client({
            domain: "othent.us.auth0.com",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
        });

        const accessToken = await auth0Client.getTokenSilently({
            detailedResponse: true,
            cacheMode: 'off',
            authorizationParams: {
                transaction_input: JSON.stringify({
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key_PEM, JWK_public_key } },
                })
            }
        });
        const PEM_key_JWT = accessToken.id_token;
    
        return axios({
            method: 'POST',
            url: 'https://server.othent.io/initialize-JWK',
            data: { PEM_key_JWT, API_ID }
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
    async function JWKBackupTxn(params: JWKBackupTxnProps): Promise<JWKBackupTxnReturnProps> {

        const payload = {
            iat: Math.floor(Date.now() / 1000),
            sub: params.sub,
            contract_id: params.contract_id,
            tags: params.tags,
            contract_input: {
                data: params.data,
                othentFunction: params.othentFunction
                },
        };

        const privateKey = params.privateKey
        const privatePem = jwkToPem(privateKey, { private: true });


        const header = { alg: 'RS256', typ: 'JWT', exp: Math.floor(Date.now() / 1000) + (60 * 60) };
        const JWK_signed_JWT = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privatePem);

        return await axios({
            method: 'POST',
            url: 'https://server.othent.io/JWK-backup-transaction',
            data: { JWK_signed_JWT, API_ID }
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
    async function readCustomContract(params: readCustomContractProps): Promise<readCustomContractReturnProps> {
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







    return {
        getAPIID,
        addCallbackURL,
        ping,
        logIn,
        logOut,
        userDetails,
        readContract,
        signTransactionWarp,
        sendTransactionWarp,
        signTransactionArweave,
        sendTransactionArweave,
        signTransactionBundlr,
        sendTransactionBundlr,
        initializeJWK,
        JWKBackupTxn,
        readCustomContract
    };

})
    
    .catch((error) => {
        console.error('An error occurred:', error);
        throw error;
    });


}


export default { Othent };