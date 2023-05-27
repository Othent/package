import axios from 'axios';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
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
    CustomAuthParams,
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
    }).then((API_valid) => {

        if (API_valid.data.success === false) {
            throw new Error('Please specify an API ID (you can get one from Othent.io)');
        }


    // helpers
    const getAuth0Client = () => createAuth0Client({
        domain: "othent.us.auth0.com",
        clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C"
    });

    function getTokenSilently(auth0: Auth0Client, authParams: CustomAuthParams) {
        return auth0.getTokenSilently({
            detailedResponse: true,
            cacheMode: "off", 
            authorizationParams: authParams
        })
    }

    function filterDecodedJWTProps(jwt: DecodedJWT) {
        delete jwt.nonce
        delete jwt.sid
        delete jwt.aud
        delete jwt.iss
        delete jwt.iat
        delete jwt.exp
        delete jwt.updated_at
        return jwt
    }


    // get API keys
    async function getAPIID(): Promise<getAPIIDReturnProps> {
        const auth0 = await getAuth0Client()

        const authParams = { transaction_input: JSON.stringify({ othentFunction: "API_ID" }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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
    async function logIn(): Promise<void | LogInReturnProps> {
        const auth0 = await getAuth0Client()
        let isAuthenticated = false
        try {
            isAuthenticated = await auth0.isAuthenticated();
        } catch (err) {
            console.log(err);
        }

        if (isAuthenticated) {
            return await userDetails() as UserDetailsReturnProps
        } else {
            const options = {
                authorizationParams: {
                    transaction_input: JSON.stringify({
                        othentFunction: "idToken",
                    }),
                    redirect_uri: window.location.origin,
                }
            };
            return await auth0.loginWithRedirect(options);
        }
    }

    // check if we were redirected from a login
    const redirectedFromLogin =
        location.search.includes("state=")
        && (location.search.includes("code=") || location.search.includes("error="))

    // if we were redirected from login, handle it
    if (redirectedFromLogin)
        handleLoginWithRedirect()
            .then( res => {} ) // We don't return userDetails, because redirect breaks js flow
            .catch( err => console.log(err) )

    async function handleLoginWithRedirect() {
        const auth0 = await getAuth0Client()

        try {
            await auth0.handleRedirectCallback();
        } catch (err) {
            // we just console.log the error because auth0 sometimes
            // throws invalid state or invalid code for no reason
            console.log(err)
        }
        window.history.replaceState({}, document.title, "/");

        // get user to check if we need to create an account
        const accessToken = await auth0.getTokenSilently({
            detailedResponse: true
        });

        const JWT = accessToken.id_token;
        let decoded_JWT: DecodedJWT = jwt_decode(JWT)

        if (!decoded_JWT.contract_id) {
            // we only create a user if we need to
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/create-user',
                data: { JWT, API_ID }
            })
                .then( response => response.data )
                .catch( error => {
                    console.log(error.response.data);
                    throw error;
                });
        }
    }



    // log out
    async function logOut(): Promise<LogOutReturnProps> {
        const auth0 = await getAuth0Client()
        await auth0.logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
        return { response: 'user logged out' }
    }




    async function userDetails(): Promise<UserDetailsReturnProps> {
        const auth0 = await getAuth0Client()

        const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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
            throw new Error(`{success: false, message: "Please create a Othent account"}`)
        }
    }





    // read contract
    async function readContract(): Promise<ReadContractReturnProps> {
        const auth0 = await getAuth0Client()

        const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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

        const auth0 = await getAuth0Client()

        const warpData = { function: params.othentFunction, data: {
            toContractId: params.data.toContractId,
            toContractFunction: params.data.toContractFunction,
            txnData: params.data.txnData
        } }

        const authParams = { transaction_input: JSON.stringify({
            othentFunction: params.othentFunction,
            warpData: warpData,
        }) }

        const accessToken = await getTokenSilently(auth0, authParams)

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

        const auth0 = await getAuth0Client()

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

        const authParams = { transaction_input: JSON.stringify({
            othentFunction: params.othentFunction,
            file_hash: file_hash,
        }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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

        const auth0 = await getAuth0Client()

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

        const authParams = { transaction_input: JSON.stringify({
            othentFunction: params.othentFunction,
            file_hash: file_hash,
        }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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

        const auth0 = await getAuth0Client()

        const authParams = { transaction_input: JSON.stringify({
            othentFunction: 'initializeJWK',
            warpData: { function: 'initializeJWK', data: { JWK_public_key_PEM, JWK_public_key } }
        }) }
        const accessToken = await getTokenSilently(auth0, authParams)

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