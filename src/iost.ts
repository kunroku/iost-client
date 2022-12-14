import { RPC } from './api';
import { KeyPairPermission } from './data/params';
import { Transaction, TransactionProps } from './transaction/transaction';
import {
  TransactionHandler,
  TransactionHandlerConfig,
} from './transaction/transaction-handler';
import { Wallet } from './wallet';

export type IOSTConfig = {
  host: string;
  chainId: number;
};

const defaultConfig: IOSTConfig = {
  host: 'http://localhost:30001',
  chainId: 1024,
};

export class IOST {
  readonly #config: IOSTConfig;
  #serverTimeDiff = 0;
  get config(): IOSTConfig {
    return { ...this.#config };
  }
  get serverTimeDiff() {
    return this.#serverTimeDiff;
  }
  constructor(config: Partial<IOSTConfig> = {}) {
    this.#config = { ...defaultConfig, ...config };
  }
  get rpc() {
    return new RPC(this.#config.host);
  }
  async setServerTimeDiff() {
    const requestStartTime = new Date().getTime() * 1e6;
    const nodeInfo = await this.rpc.getNodeInfo();
    const requestEndTime = new Date().getTime() * 1e6;
    if (requestEndTime - requestStartTime < 30 * 1e9) {
      this.#serverTimeDiff = Number(nodeInfo.server_time) - requestStartTime;
    }
    return this.serverTimeDiff;
  }
  async sign(
    wallet: Wallet,
    tx: Transaction,
    publisher: string,
    signers: { id: string; permission: KeyPairPermission }[],
  ) {
    for (const signer of signers) {
      tx.addSigner(signer.id, signer.permission);
    }
    for (const signer of signers) {
      const signatures = await wallet.sign(
        signer.id,
        signer.permission,
        tx.getBaseHash(),
      );
      tx.addSign(signatures);
    }
    if (publisher) {
      const signatures = await wallet.sign(
        publisher,
        'active',
        tx.getPublishHash(),
      );
      tx.setPublisher(publisher);
      tx.addPublishSign(signatures);
    }
  }
  createTransaction(props: TransactionProps) {
    const tx = new Transaction({ chainId: this.#config.chainId, ...props });
    return tx;
  }
  async exec(tx: Transaction) {
    return await this.rpc.execTx(tx);
  }
  send(tx: Transaction, config: Partial<TransactionHandlerConfig>) {
    const handler = new TransactionHandler(tx, this.#config.host, config);
    return handler.send();
  }
  async sendAsync(tx: Transaction, config: Partial<TransactionHandlerConfig>) {
    const handler = new TransactionHandler(tx, this.#config.host, config);
    return await handler.sendAsync();
  }
}
