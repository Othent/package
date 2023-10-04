import axios from 'axios';
import { AxiosResponse } from 'axios';
import { Auth0Client, createAuth0Client } from '@auth0/auth0-spa-js';
import jwt_decode from 'jwt-decode';
import CryptoJS from 'crypto-js';
import {
    API_ID_JWT,
    DecodedJWT,
    InitializeJWKProps,
    InitializeJWKReturnProps,
    LogInProps,
    LogInReturnProps,
    LogOutReturnProps,
    PingReturnProps,
    ReadContractProps,
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
    getAPIIDReturnProps,
    readCustomContractProps,
    readCustomContractReturnProps,
    useOthentProps,
    useOthentReturnProps,
    verifyArweaveDataProps,
    verifyArweaveDataReturnProps,
    verifyBundlrDataProps,
    verifyBundlrDataReturnProps,
    CustomAuthParams,
    queryWalletAddressTxnsProps,
    queryWalletAddressTxnsReturnProps,
    UploadDataType,
    EncryptDataProps,
    EncryptDataReturnProps,
    DecryptDataProps,
    DecryptDataReturnProps,
    DeployWarpContractProps,
    DeployWarpContractReturnProps,
    DeployWarpContractFromTxProps,
    DeployWarpContractFromTxReturnProps,
    viewCustomContractProps,
    viewCustomContractReturnProps
  } from "../types/index.js";




// sha256
async function sha256(message: string | BufferSource) {
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        typeof message != "string" ? message : new TextEncoder().encode(message)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""); // convert bytes to hex string
    return hashHex;
}



// Othent
export async function Othent(params: useOthentProps): Promise<useOthentReturnProps> {
    const API_ID = params.API_ID;
    const callbackURL = window.location.href
    return axios({
        method: 'POST',
        url: 'https://server.othent.io/use-othent',
        data: { API_ID, callbackURL }
    })
    .then((API_valid) => {
        if (API_valid.data.success === false) {
            throw new Error('Please specify an API ID (you can get one from Othent.io)');
        }


        // auth0
        const getAuth0Client = () => createAuth0Client({
            domain: "auth.othent.io",
            clientId: "dyegx4dZj5yOv0v0RkoUsc48CIqaNS6C",
            authorizationParams: {
                redirect_uri: window.location.origin
            }
        });

        function getTokenSilently(auth0: Auth0Client, authParams: CustomAuthParams) {
            return auth0.getTokenSilently({
                detailedResponse: true,
                authorizationParams: authParams,
                cacheMode: 'off'
            })
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
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
        }


        // process data
        async function processData(data: UploadDataType): Promise<Buffer> {
            let dataBuffer: Buffer;
            if (data instanceof File) {
                dataBuffer = await readFileData(data);
            } else if (typeof data === 'string') {
                dataBuffer = Buffer.from(data, 'utf8');
            } else if (Buffer.isBuffer(data)) {
                dataBuffer = data;
            } else if (data instanceof ArrayBuffer || (typeof SharedArrayBuffer !== 'undefined' && data instanceof SharedArrayBuffer)) {
                dataBuffer = Buffer.from(data);
            } else if (data instanceof Uint8Array) {
                dataBuffer = Buffer.from(data.buffer);
            } else {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            return dataBuffer
        }


        // query a wallet addresses transactions
        async function queryWalletAddressTxns(params: queryWalletAddressTxnsProps): Promise<queryWalletAddressTxnsReturnProps> {
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/query-wallet-address-txns',
                data: { walletAddress: params.walletAddress }
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


        

        async function userDetails(): Promise<UserDetailsReturnProps> {
            const auth0 = await getAuth0Client();
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
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
        }







        // log in
        async function logIn(params: LogInProps = {}): Promise<LogInReturnProps> {
            params.testNet ??= false
            const auth0 = await getAuth0Client();
            const isAuthenticated = await auth0.isAuthenticated();

            const baseOptions = {
                authorizationParams: {
                    transaction_input: JSON.stringify({
                        othentFunction: "idToken",
                        testNet: params.testNet
                    }),
                    redirect_uri: window.location.origin
                }
            };

            function isDecodedJWT(obj: any): obj is DecodedJWT {
                return obj && typeof obj.contract_id === 'string';
            }

            const loginAndGetDecodedJWT = async (options: any): Promise<{ encoded: string, decoded: DecodedJWT }> => {
                await auth0.loginWithPopup(options);
                const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) };
                const accessToken = await getTokenSilently(auth0, authParams);
                const jwtObj = jwt_decode(accessToken.id_token) as DecodedJWT;

                if (isDecodedJWT(jwtObj)) {
                    return { encoded: accessToken.id_token, decoded: jwtObj };
                } else {
                    throw new Error('Invalid JWT structure received.');
                }
            };

            const processDecodedJWT = async (encoded_JWT: string, decoded_JWT: DecodedJWT, isTestNet?: boolean): Promise<LogInReturnProps> => {
                if (isTestNet ? decoded_JWT.test_net_contract_id : decoded_JWT.contract_id) {
                    const fieldsToDelete = ['nonce', 'sid', 'aud', 'iss', 'iat', 'exp', 'updated_at'];
                    fieldsToDelete.forEach(field => delete decoded_JWT[field as keyof DecodedJWT]);
                    return decoded_JWT;
                }
                return await createUserOnServer(encoded_JWT, isTestNet ? 'testNet' : ''); // send encoded JWT
            };

            const createUserOnServer = async (encoded_JWT: string, network: string = '') => {
                const response = await axios({
                    method: 'POST',
                    url: 'https://server.othent.io/create-user',
                    data: { JWT: encoded_JWT, API_ID, network } 
                });
                return response.data;
            };

            if (isAuthenticated) {
                const { encoded, decoded } = await loginAndGetDecodedJWT(baseOptions);
                return processDecodedJWT(encoded, decoded, params.testNet);
            } else {
                try {
                    const { encoded, decoded } = await loginAndGetDecodedJWT(baseOptions);
                    return processDecodedJWT(encoded, decoded, params.testNet);
                } catch (error) {
                    throw new Error('Your browser is blocking us! Please turn off your shields or allow cross site cookies! :)');
                }
            }
        }

        
        




        // log out
        async function logOut(): Promise<LogOutReturnProps> {
            const auth0 = await getAuth0Client();
            await auth0.logout({
                logoutParams: {
                    returnTo: window.location.origin
                }
            });
            return { response: 'User logged out' }
        }





        // read contract
        async function readContract(params: ReadContractProps): Promise<ReadContractReturnProps> {
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ othentFunction: "idToken" }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token;
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/read-contract',
                data: { JWT, customDREURL: params.customDREURL }
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
            params.testNet ??= false
            const warpData = {
                function: params.othentFunction,
                data: {
                    toContractId: params.data.toContractId,
                    toContractFunction: params.data.toContractFunction,
                    txnData: params.data.txnData
                }
            }
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                warpData: warpData,
                testNet: params.testNet
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{success: false, message:"Please create a Othent account"}`)
            }
            if (params.testNet === true && !decoded_JWT.test_net_contract_id) {
                throw new Error(`{success: false, message:"Please create a Othent test net account"}`)
            }
            return { JWT: accessToken.id_token, tags: params.tags, testNet: params.testNet };

        }




        // send transaction - Warp
        async function sendTransactionWarp(params: SendTransactionWarpProps): Promise<SendTransactionWarpReturnProps> {
            const JWT = params.JWT
            const tags = params.tags
            let networkType
            if (params.testNet === true) {
                networkType = 'testNet'
            } else {
                networkType = 'mainNet'
            }
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/send-transaction',
                data: { JWT, tags, API_ID, network: networkType }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });

        }




        // sign functions (AR+Bndlr) readFileData
        async function readFileData(file: File): Promise<Buffer> {
            return new Promise<Buffer>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileData = reader.result as ArrayBuffer;
                    const buffer = Buffer.from(fileData);
                    resolve(buffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        }



        // sign transaction arweave
        async function signTransactionArweave(params: SignTransactionArweaveProps): Promise<SignTransactionArweaveReturnProps> {
            params.tags ??= [];
            const dataBuffer = await processData(params.data)
            if (!dataBuffer) {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            const file_hash = await sha256(dataBuffer);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
            return { data: dataBuffer, JWT: accessToken.id_token, tags: params.tags };

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
            const dataBuffer = await processData(params.data)
            if (!dataBuffer) {
                throw new Error('Invalid data, we accept: string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File');
            }
            const file_hash = await sha256(dataBuffer);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: params.othentFunction,
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            const decoded_JWT: DecodedJWT = jwt_decode(JWT)
            if (!decoded_JWT.contract_id) {
                throw new Error(`{ success: false, message: "Please create a Othent account" }`)
            }
            return { data: dataBuffer, JWT: accessToken.id_token, tags: params.tags };
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
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: 'initializeJWK',
                warpData: { function: 'initializeJWK', data: { JWK_public_key_PEM: params.JWK_public_key_PEM, JWK_public_key: null } }
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
        



        // Read custom contract
        async function readCustomContract(params: readCustomContractProps): Promise<readCustomContractReturnProps> {
            params.testNet ??= false
            let networkType
            if (params.testNet === true) {
                networkType = 'testNet'
            } else {
                networkType = 'mainNet'
            }
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/read-custom-contract',
                data: { contract_id: params.contract_id, network: networkType, customDREURL: params.customDREURL }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }



        // View custom contract
        async function viewCustomContract(params: viewCustomContractProps): Promise<viewCustomContractReturnProps> {
            params.tags ??= []
            params.testNet ??= false
            let networkType
            if (params.testNet === true) {
                networkType = 'testNet'
            } else {
                networkType = 'mainNet'
            }
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/view-custom-contract-state',
                data: { contract_id: params.contract_id, func: params.function, data: params.tags, network: networkType, customDREURL: params.customDREURL }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }






        async function verifyArweaveData(params: verifyArweaveDataProps): Promise<verifyArweaveDataReturnProps> {
            let getTagHash = await fetch(`https://arweave.net/tx/${params.transactionId}`, {
                headers: {
                    responseType: 'arraybuffer' 
                } 
            });
            let decodedVerifyJWT: any;
            const getTagHashJson = await getTagHash.json()
            getTagHashJson.tags.map((tag: { name: string, value: string }) => {
                if (atob(tag.name) === 'File-Hash-JWT') {
                    decodedVerifyJWT = jwt_decode(atob(tag.value))
                }
            });
            const tagHash = decodedVerifyJWT.file_hash;
            let axiosResponse: AxiosResponse<ArrayBuffer> = await axios.get(`https://arweave.net/${params.transactionId}`, { 
                responseType: 'arraybuffer'
            });
            let getOnChainData = axiosResponse.data;
            const onChainHash = await sha256(getOnChainData);
            if (tagHash === onChainHash) {
                return {
                    validData: true,
                    contract_id: decodedVerifyJWT.contract_id,
                    onChainHash: onChainHash,
                    tagHash: tagHash,
                    iat: decodedVerifyJWT.iat,
                    userId: decodedVerifyJWT.sub
                }
            } else {
                return {
                    validData: false,
                    onChainHash: onChainHash,
                    tagHash: tagHash
                }
            }
        }








        // Verify bundlr data
        async function verifyBundlrData(params: verifyBundlrDataProps): Promise<verifyBundlrDataReturnProps> {
            let getTagHash = await fetch(`https://gateway.bundlr.network/tx/${params.transactionId}`, {
                headers: {
                    responseType: 'arraybuffer' 
                } 
            });
            let decodedVerifyJWT: any;
            const getTagHashJson = await getTagHash.json()
            getTagHashJson.tags.map((tag: { name: string, value: string }) => {
                if (tag.name === 'File-Hash-JWT') {
                    decodedVerifyJWT = jwt_decode(tag.value);
                }
            });
            const tagHash = decodedVerifyJWT.file_hash;
            let axiosResponse: AxiosResponse<ArrayBuffer> = await axios.get(`https://arweave.net/${params.transactionId}`, { 
                responseType: 'arraybuffer'
            });
            let getOnChainData = axiosResponse.data;
            const onChainHash = await sha256(getOnChainData);
            if (tagHash === onChainHash) {
                return {
                    validData: true,
                    contract_id: decodedVerifyJWT.contract_id,
                    onChainHash: onChainHash,
                    tagHash: tagHash,
                    iat: decodedVerifyJWT.iat,
                    userId: decodedVerifyJWT.sub
                }
            } else {
                return {
                    validData: false,
                    onChainHash: onChainHash,
                    tagHash: tagHash
                }
            }
        }



        // encrypt data
        async function encryptData(params: EncryptDataProps): Promise<EncryptDataReturnProps> {
            const data = params.data;
            const key = params.key;
            const encryptedData = CryptoJS.AES.encrypt(data, key).toString();
            return { encryptedData: encryptedData };
        }
        
        
        // decrypt data
        async function decryptData(params: DecryptDataProps): Promise<DecryptDataReturnProps> {
            const data = params.data;
            const key = params.key;
            const bytes = CryptoJS.AES.decrypt(data, key);
            const decryptedData = CryptoJS.enc.Utf8.stringify(bytes);
            return { decryptedData: decryptedData };
        }



        // Deploy a Warp contract
        async function deployWarpContract(params: DeployWarpContractProps): Promise<DeployWarpContractReturnProps> {
            params.tags ??= []
            params.testNet ??= false
            let networkType
            if (params.testNet === true) {
                networkType = 'testNet'
            } else {
                networkType = 'mainNet'
            }
            const file_hash = await sha256(params.contractSrc);
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: 'uploadData',
                file_hash: file_hash
            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/deploy-warp-contract',
                data: { 
                    contractSrc: params.contractSrc, 
                    contractState: params.state, 
                    JWT: JWT, 
                    tags: params.tags,
                    network: networkType
                }
            })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.log(error.response.data);
                throw error;
            });
        }



        // Deploy a Warp contract from transaction
        async function deployWarpContractFromTx(params: DeployWarpContractFromTxProps): Promise<DeployWarpContractFromTxReturnProps> {
            params.tags ??= []
            params.testNet ??= false
            let networkType
            if (params.testNet === true) {
                networkType = 'testNet'
            } else {
                networkType = 'mainNet'
            }
            const auth0 = await getAuth0Client();
            const authParams = { transaction_input: JSON.stringify({ 
                othentFunction: 'deployWarpContractFromTx',
                srcTxId: params.srcTxId,

            }) }
            const accessToken = await getTokenSilently(auth0, authParams)
            const JWT = accessToken.id_token
            return await axios({
                method: 'POST',
                url: 'https://server.othent.io/deploy-warp-contract-from-tx',
                data: { 
                    srcTxId: params.srcTxId, 
                    contractState: params.state, 
                    JWT: JWT, 
                    tags: params.tags,
                    network: networkType
                }
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
            queryWalletAddressTxns,
            ping,
            logIn,
            logOut,
            userDetails,
            readContract,
            viewCustomContract,
            signTransactionWarp,
            sendTransactionWarp,
            signTransactionArweave,
            sendTransactionArweave,
            signTransactionBundlr,
            sendTransactionBundlr,
            initializeJWK,
            readCustomContract,
            verifyArweaveData,
            verifyBundlrData,
            encryptData,
            decryptData,
            deployWarpContract,
            deployWarpContractFromTx
        };
    })
    .catch((error) => {
        console.error('An error occurred:', error);
        throw error;
    });
}
export default { Othent };