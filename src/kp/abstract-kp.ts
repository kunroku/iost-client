import { Signature } from '../crypto';
import { Bs58 } from '../utils/bs58';

export enum AlgorithmType {
  SECP256K1 = 1,
  ED25519 = 2,
}
export type KeyPairJSON = {
  type: AlgorithmType;
  pubkey: string;
  seckey: string | null;
};

export abstract class AbstractKeyPair {
  readonly #type: AlgorithmType;
  readonly #name: string;
  readonly #pubkey: string;
  readonly #seckey: string | null;
  get type() {
    return this.#type;
  }
  get name() {
    return this.#name;
  }
  get pubkey() {
    return Bs58.decode(this.#pubkey);
  }
  get seckey() {
    return this.#seckey ? Bs58.decode(this.#seckey) : null;
  }
  constructor(type: number, pubkey: Buffer, seckey: Buffer | null) {
    this.#type = type;
    this.#name = AlgorithmType[type];
    this.#pubkey = Bs58.encode(pubkey);
    this.#seckey = seckey && Bs58.encode(seckey);
  }
  abstract sign(data: Buffer): Signature;
  abstract verify(data: Buffer, signature: Buffer): boolean;
  toJSON(): KeyPairJSON {
    return {
      type: this.type,
      pubkey: this.#pubkey,
      seckey: this.#seckey,
    };
  }
  toString() {
    return JSON.stringify(this.toJSON());
  }
}
