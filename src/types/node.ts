


// JWK transaction
export interface JWKBackupTxnProps {
    privateKey: {
        kty: "RSA";
        e: string;
        n: string;
        d?: string | undefined;
        p?: string | undefined;
        q?: string | undefined;
        dp?: string | undefined;
        dq?: string | undefined;
        qi?: string | undefined;
    },
    sub: string,
    contract_id: string,
    tags?: { name: string, value: string }[],
    data: object,
    othentFunction: string,
    API_ID: string
}
export interface JWKBackupTxnReturnProps {
    validity: boolean,
    transactionId: string,
}


