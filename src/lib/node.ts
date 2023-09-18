import { KJUR } from 'jsrsasign';
import { JWKBackupTxnProps, JWKBackupTxnReturnProps } from '../types/node.js'
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';


// JWK backup transaction
export async function JWKBackupTxn(params: JWKBackupTxnProps): Promise<JWKBackupTxnReturnProps> {
    const payload = {
        iat: Math.floor(Date.now() / 1000),
        sub: params.sub,
        contract_id: params.contract_id,
        tags: params.tags,
        contract_input: {
            data: params.data,
            othentFunction: params.othentFunction
        }
    };
    const privateKey = params.privateKey
    const privatePem = jwkToPem(privateKey, { private: true });
    const header = { alg: 'RS256', typ: 'JWT', exp: Math.floor(Date.now() / 1000) + (60 * 60) };
    const JWK_signed_JWT = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privatePem);
    return await axios({
        method: 'POST',
        url: 'https://server.othent.io/JWK-backup-transaction',
        data: { JWK_signed_JWT, API_ID: params.API_ID }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.log(error.response.data);
        throw error;
    });
}
