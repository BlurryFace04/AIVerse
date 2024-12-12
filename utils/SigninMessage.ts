import bs58 from "bs58";
import nacl from "tweetnacl";

type SignMessage = {
  domain: string;
  publicKey: string;
  nonce: string;
  statement: string;
  username?: string;
};

export class SigninMessage {
  domain: any;
  publicKey: any;
  nonce: any;
  statement: any;
  username?: any;

  constructor({ domain, publicKey, nonce, statement, username }: SignMessage) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.nonce = nonce;
    this.statement = statement;
    if (username) {
      this.username = username;
    }
  }

  prepare() {
    return `${this.statement}${this.nonce}${this.username || ''}`;
  }

  async validate(signature: string) {
    const msg = this.prepare();
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(msg);
    const pubKeyUint8 = bs58.decode(this.publicKey);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
  }
}
