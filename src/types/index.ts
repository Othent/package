

// useOthent
export interface useOthentProps {
    API_ID: string
}
export interface useOthentReturnProps {
    getAPIID(): Promise<getAPIIDReturnProps>,
    queryWalletAddressTxns(params: queryWalletAddressTxnsProps): Promise<queryWalletAddressTxnsReturnProps>,
    ping(): Promise<PingReturnProps>,
    logIn(params: LogInProps): Promise<LogInReturnProps>,
    logOut(): Promise<LogOutReturnProps>,
    userDetails(): Promise<UserDetailsReturnProps>,
    readContract(params: ReadContractProps): Promise<ReadContractReturnProps>,
    viewCustomContract(params: viewCustomContractProps): Promise<viewCustomContractReturnProps>,
    signTransactionWarp(params: SignTransactionWarpProps): Promise<SignTransactionWarpReturnProps>,
    sendTransactionWarp(params: SendTransactionWarpProps): Promise<SendTransactionWarpReturnProps>,
    signTransactionArweave(params: SignTransactionArweaveProps): Promise<SignTransactionArweaveReturnProps>,
    sendTransactionArweave(params: SendTransactionArweaveProps): Promise<SendTransactionArweaveReturnProps>,
    signTransactionBundlr(params: SignTransactionBundlrProps): Promise<SignTransactionBundlrReturnProps>,
    sendTransactionBundlr(params: SendTransactionBundlrProps): Promise<SendTransactionBundlrReturnProps>,
    initializeJWK(params: InitializeJWKProps): Promise<InitializeJWKReturnProps>,
    readCustomContract(params: readCustomContractProps): Promise<readCustomContractReturnProps>,
    verifyArweaveData(params: verifyArweaveDataProps): Promise<verifyArweaveDataReturnProps>,
    verifyBundlrData(params: verifyBundlrDataProps): Promise<verifyBundlrDataReturnProps>,
    deployWarpContract(params: DeployWarpContractProps): Promise<DeployWarpContractReturnProps>,
    deployWarpContractFromTx(params: DeployWarpContractFromTxProps): Promise<DeployWarpContractFromTxReturnProps> 
}



// auth0
export interface CustomAuthParams {
    [key: string]: any;
}
  




// universal
export interface DecodedJWT {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    updated_at?: string,
    email: string,
    email_verified: string,
    iss?: string,
    aud?: string,
    iat?: number,
    exp?: number,
    sub: string,
    sid?: string,
    nonce?: string,
    test_net_contract_id?: string
}



// get API keys
export interface getAPIIDReturnProps {
    API_ID: string
}
export interface API_ID_JWT {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    updated_at?: string,
    email: string,
    email_verified: string,
    iss: string,
    aud: string,
    iat: number,
    exp: number,
    sub: string,
    sid: string,
    nonce: string,
    API_ID: string
}



// query a wallet addresses transactions
export interface queryWalletAddressTxnsProps {
    walletAddress: string
}
export interface queryWalletAddressTxnsReturnProps {
    success: boolean,
    transactions: []
}



// ping
export interface PingReturnProps {
    response: boolean;
}





// logIn
export interface LogInProps {
    testNet?: boolean
}
export interface LogInReturnProps {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    email: string,
    email_verified: string,
    sub: string,
    success?: string,
    message?: string
}



// log out
export interface LogOutReturnProps {
    response: string
}


// user details
export interface UserDetailsReturnProps {
    contract_id: string,
    given_name: string,
    family_name: string,
    nickname: string,
    name: string,
    picture: string,
    locale: string,
    email: string,
    email_verified: string,
    sub: string,
    test_net_contract_id?: string
}



// read contract
export interface ReadContractProps {
    customDREURL?: string;
}
export interface ReadContractReturnProps {
    state: object, 
    errors: object, 
    validity: object
}




// sign transaction Warp
export interface SignTransactionWarpProps {
    othentFunction: string,
    data: {
        toContractId: string,
        toContractFunction: string,
        txnData: object
    }
    tags?: {
        name: string;
        value: string;
    }[],
    testNet?: boolean
}
export interface SignTransactionWarpReturnProps {
    testNet: boolean,
    JWT: string, 
    tags?: {
        name: string;
        value: string;
    }[]
}
// send transaction - Warp
export interface SendTransactionWarpProps {
    testNet: boolean,
    JWT: string,
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SendTransactionWarpReturnProps {
    success: boolean,
    transactionId: string,
    bundlrId: string,
    errors: object,
    state: object
}


export type UploadDataType = string | Buffer | ArrayBuffer | SharedArrayBuffer | Uint8Array | File;


// sign transaction Arweave
export interface SignTransactionArweaveProps {
    othentFunction: string,
    data: UploadDataType;
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SignTransactionArweaveReturnProps {
    data: Buffer, 
    JWT: string
    tags?: {
        name: string;
        value: string;
    }[]
}
// send transaction - Arweave
export interface SendTransactionArweaveProps {
    data: Buffer, 
    JWT: string,
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SendTransactionArweaveReturnProps {
    success: boolean,
    transactionId: string,
}



// sign transaction - bundlr
export interface SignTransactionBundlrProps {
    othentFunction: string;
    data: UploadDataType;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  export interface SignTransactionBundlrReturnProps {
    data: Buffer;
    JWT: string;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  // send transaction - bundlr
  export interface SendTransactionBundlrProps {
    data: Buffer;
    JWT: string;
    tags?: {
      name: string;
      value: string;
    }[];
  }
  
  export interface SendTransactionBundlrReturnProps {
    success: boolean;
    transactionId: string;
  }



// Read custom contract
export interface readCustomContractProps {
    contract_id: string,
    testNet?: boolean,
    customDREURL?: string;
}
export interface readCustomContractReturnProps {
    state: object, 
    errors: object, 
    validity: object
}




// View custom contract
export interface viewCustomContractProps {
    function: string,
    tags: { name: string, value: string }[],
    contract_id: string,
    testNet?: boolean,
    customDREURL?: string;
}
export interface viewCustomContractReturnProps {
    success: boolean, 
    result: object
}




// Verify arweave data
export interface verifyArweaveDataProps {
    transactionId: string
}
export interface verifyArweaveDataReturnProps {
    validData: boolean,
    onChainHash: string,
    tagHash: string,
    contract_id?: string,
    iat?: number,
    userId?: string,
}



// Verify bundlr data
export interface verifyBundlrDataProps {
    transactionId: string
}
export interface verifyBundlrDataReturnProps {
    validData: boolean,
    onChainHash: string,
    tagHash: string,
    contract_id?: string,
    iat?: number,
    userId?: string,
}



// Encrypt data
export interface EncryptDataProps {
    data: string,
    key: string
}
export interface EncryptDataReturnProps {
    encryptedData: string
}


// Decrypted data
export interface DecryptDataProps {
    data: string,
    key: string
}
export interface DecryptDataReturnProps {
    decryptedData: string
}



// Deploy warp contract
export interface DeployWarpContractProps {
    contractSrc: string, 
    state: object, 
    tags?: { name: string, value: string }[],
    testNet?: boolean
}
export interface DeployWarpContractReturnProps {
    contractTxId: string;
    srcTxId?: string;
}



// Deploy warp contract from tx
export interface DeployWarpContractFromTxProps {
    srcTxId: string, 
    state: object, 
    tags?: { name: string, value: string }[],
    testNet?: boolean
}
export interface DeployWarpContractFromTxReturnProps {
    contractTxId: string;
    srcTxId?: string;
}



// Backup keyfile
export interface InitializeJWKProps {
    JWK_public_key_PEM: string
}
export interface InitializeJWKReturnProps {
    success: boolean,
    transactionId: string,
}







