// universal
export interface DecodedJWT {
  contract_id: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at?: string;
  email: string;
  email_verified: string;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  sub: string;
  sid?: string;
  nonce?: string;
}

// ping
export interface PingReturnProps {
  response: boolean;
}

// logIn
export interface LogInReturnProps {
  contract_id: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  email: string;
  email_verified: string;
  sub: string;
  success?: string;
  message?: string;
}

// log out
export interface LogOutReturnProps {
  response: string;
}

// user details
export interface UserDetailsReturnProps {
  contract_id: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  email: string;
  email_verified: string;
  sub: string;
}

// read contract
export interface ReadContractReturnProps {
  state: {
    App: string;
    user_id: string;
    last_nonce: number;
    Description: string;
    JWK_public_key: string;
    contract_address: string;
  };
  errors: object;
}

// sign transaction Warp
export interface SignTransactionWarpProps {
  othentFunction: string;
  data: {
    toContractId: string;
    toContractFunction: string;
    txnData: object;
  };
  tags?: {
    name: string;
    value: string;
  }[];
}
export interface SignTransactionWarpReturnProps {
  JWT: string;
}
// send transaction - Warp
export interface SendTransactionWarpProps {
  JWT: string;
}
export interface SendTransactionWarpReturnProps {
  success: boolean;
  transactionId: string;
}

// sign transaction Arweave
export interface SignTransactionArweaveProps {
  othentFunction: string;
  data: File;
  tags?: {
    name: string;
    value: string;
  }[];
}
export interface SignTransactionArweaveReturnProps {
  data: File;
  JWT: string;
}
// send transaction - Arweave
export interface SendTransactionArweaveProps {
  data: File;
  JWT: string;
}
export interface SendTransactionArweaveReturnProps {
  success: boolean;
  transactionId: string;
}

// backup keyfile
export interface InitializeJWKProps {
  JWK_public_key: string;
}
export interface InitializeJWKReturnProps {
  success: boolean;
  transactionId: string;
}

// JWK transaction
export interface JWKBackupTxnProps {
  JWK_signed_JWT: string;
}
export interface JWKBackupTxnReturnProps {
  success: boolean;
  transactionId: string;
}
