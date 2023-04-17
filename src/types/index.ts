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
    nonce?: string
}





// ping
export interface PingReturnProps {
    response: boolean;
}




// logIn
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
}



// read contract
export interface ReadContractReturnProps {
    state: {
        App: string,
        user_id: string,
        last_nonce: number,
        Description: string,
        JWK_public_key: string,
        contract_address: string
    },
    errors: object
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
    }[]
}
export interface SignTransactionWarpReturnProps {
    JWT: string, 
    method: "warp",
}


// sign transaction Arweave
export interface SignTransactionArweaveProps {
    othentFunction: string,
    data: string | Uint8Array | ArrayBuffer,
    tags?: {
        name: string;
        value: string;
    }[]
}
export interface SignTransactionArweaveReturnProps {
    data: string | Uint8Array | ArrayBuffer, 
    JWT: string, 
    method: "arweave"
}





// send transaction
export interface SendTransactionProps {
    signedTransaction: SignTransactionArweaveReturnProps | SignTransactionWarpReturnProps
}
export interface SendTransactionReturnProps {
    success: boolean,
    transactionId: string,
}



// backup keyfile
export interface InitializeJWKProps {
    JWKPublicKeyPEM: string
}
export interface InitializeJWKReturnProps {
    success: boolean,
    transactionId: string,
}



// JWK transaction
export interface JWKBackupTxnProps {
    JWT: string
}
export interface JWKBackupTxnReturnProps {
    success: boolean,
    transactionId: string,
}








