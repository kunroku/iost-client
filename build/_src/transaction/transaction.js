"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Transaction_amount_limit, _Transaction_chainId, _Transaction_gasLimit, _Transaction_gasRatio, _Transaction_actions, _Transaction_publisher, _Transaction_publisher_sigs, _Transaction_signers, _Transaction_signatures, _Transaction_reserved, _Transaction_time, _Transaction_expiration, _Transaction_delay;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const sha3_1 = require("sha3");
const codec_1 = require("../crypto/codec");
const defaultTransactionConfig = {
    chainId: 1024,
    gasLimit: 2000000,
    gasRatio: 1,
};
class Transaction {
    constructor(props) {
        _Transaction_amount_limit.set(this, []);
        _Transaction_chainId.set(this, void 0);
        _Transaction_gasLimit.set(this, void 0);
        _Transaction_gasRatio.set(this, void 0);
        _Transaction_actions.set(this, []);
        _Transaction_publisher.set(this, '');
        _Transaction_publisher_sigs.set(this, []);
        _Transaction_signers.set(this, []);
        _Transaction_signatures.set(this, []);
        _Transaction_reserved.set(this, null);
        _Transaction_time.set(this, new Date().getTime());
        _Transaction_expiration.set(this, new Date().getTime());
        _Transaction_delay.set(this, 0);
        const config = Object.assign(Object.assign({}, defaultTransactionConfig), props);
        __classPrivateFieldSet(this, _Transaction_chainId, config.chainId, "f");
        __classPrivateFieldSet(this, _Transaction_gasLimit, config.gasLimit, "f");
        __classPrivateFieldSet(this, _Transaction_gasRatio, config.gasRatio, "f");
    }
    addSigner(id, permission) {
        if (!__classPrivateFieldGet(this, _Transaction_signers, "f").includes(`${id}@${permission}`)) {
            __classPrivateFieldGet(this, _Transaction_signers, "f").push(`${id}@${permission}`);
        }
        return this;
    }
    addApprove(token, amount = 'unlimited') {
        let index = null;
        for (let i = 0; i < __classPrivateFieldGet(this, _Transaction_amount_limit, "f").length; i++) {
            if (__classPrivateFieldGet(this, _Transaction_amount_limit, "f")[i].token === token) {
                if (__classPrivateFieldGet(this, _Transaction_amount_limit, "f")[i].value === 'unlimited') {
                    return;
                }
                index = i;
                break;
            }
        }
        if (amount !== 'unlimited') {
            let _amount = Number(amount);
            if (Number.isNaN(amount)) {
                throw new Error('invalid amount');
            }
            if (index !== null) {
                _amount += Number(__classPrivateFieldGet(this, _Transaction_amount_limit, "f")[index].value);
            }
            amount = _amount.toFixed(8);
        }
        if (index === null) {
            __classPrivateFieldGet(this, _Transaction_amount_limit, "f").push({
                token: token,
                value: amount,
            });
        }
        else {
            __classPrivateFieldGet(this, _Transaction_amount_limit, "f")[index].value = amount;
        }
        return this;
    }
    getApproveList() {
        return __classPrivateFieldGet(this, _Transaction_amount_limit, "f");
    }
    addAction(contract, abi, args) {
        __classPrivateFieldGet(this, _Transaction_actions, "f").push({
            contract: contract,
            actionName: abi,
            data: JSON.stringify(args),
        });
    }
    setTime(expiration, delay, serverTimeDiff) {
        __classPrivateFieldSet(this, _Transaction_time, new Date().getTime() * 1e6 + serverTimeDiff, "f");
        __classPrivateFieldSet(this, _Transaction_expiration, __classPrivateFieldGet(this, _Transaction_time, "f") + expiration * 1e9, "f");
        __classPrivateFieldSet(this, _Transaction_delay, delay, "f");
    }
    getBaseHash() {
        const hash = new sha3_1.SHA3(256);
        hash.update(this.bytes(0));
        return hash.digest('binary');
    }
    getPublishHash() {
        const hash = new sha3_1.SHA3(256);
        hash.update(this.bytes(1));
        return hash.digest('binary');
    }
    addSign(signature) {
        __classPrivateFieldGet(this, _Transaction_signatures, "f").push(signature);
    }
    addPublishSign(id, signature) {
        __classPrivateFieldSet(this, _Transaction_publisher, id, "f");
        __classPrivateFieldGet(this, _Transaction_publisher_sigs, "f").push(signature);
    }
    bytes(n) {
        const c = new codec_1.Codec();
        c.pushInt64(__classPrivateFieldGet(this, _Transaction_time, "f"));
        c.pushInt64(__classPrivateFieldGet(this, _Transaction_expiration, "f"));
        c.pushInt64(__classPrivateFieldGet(this, _Transaction_gasRatio, "f") * 100);
        c.pushInt64(__classPrivateFieldGet(this, _Transaction_gasLimit, "f") * 100);
        c.pushInt64(__classPrivateFieldGet(this, _Transaction_delay, "f"));
        c.pushInt(__classPrivateFieldGet(this, _Transaction_chainId, "f"));
        if (!__classPrivateFieldGet(this, _Transaction_reserved, "f")) {
            c.pushInt(0);
        }
        c.pushInt(__classPrivateFieldGet(this, _Transaction_signers, "f").length);
        for (let i = 0; i < __classPrivateFieldGet(this, _Transaction_signers, "f").length; i++) {
            c.pushString(__classPrivateFieldGet(this, _Transaction_signers, "f")[i]);
        }
        c.pushInt(__classPrivateFieldGet(this, _Transaction_actions, "f").length);
        for (let i = 0; i < __classPrivateFieldGet(this, _Transaction_actions, "f").length; i++) {
            const c2 = new codec_1.Codec();
            c2.pushString(__classPrivateFieldGet(this, _Transaction_actions, "f")[i].contract);
            c2.pushString(__classPrivateFieldGet(this, _Transaction_actions, "f")[i].actionName);
            c2.pushString(__classPrivateFieldGet(this, _Transaction_actions, "f")[i].data);
            c.pushBytes(c2.buffer());
        }
        c.pushInt(__classPrivateFieldGet(this, _Transaction_amount_limit, "f").length);
        for (let i = 0; i < __classPrivateFieldGet(this, _Transaction_amount_limit, "f").length; i++) {
            const c2 = new codec_1.Codec();
            c2.pushString(__classPrivateFieldGet(this, _Transaction_amount_limit, "f")[i].token);
            c2.pushString(__classPrivateFieldGet(this, _Transaction_amount_limit, "f")[i].value + '');
            c.pushBytes(c2.buffer());
        }
        if (n > 0) {
            c.pushInt(__classPrivateFieldGet(this, _Transaction_signatures, "f").length);
            for (let i = 0; i < __classPrivateFieldGet(this, _Transaction_signatures, "f").length; i++) {
                c.pushBytes(__classPrivateFieldGet(this, _Transaction_signatures, "f")[i].buffer());
            }
        }
        return c.buffer();
    }
    toJSON() {
        return {
            amount_limit: JSON.parse(JSON.stringify(__classPrivateFieldGet(this, _Transaction_amount_limit, "f"))),
            chainId: __classPrivateFieldGet(this, _Transaction_chainId, "f"),
            gasLimit: __classPrivateFieldGet(this, _Transaction_gasLimit, "f"),
            gasRatio: __classPrivateFieldGet(this, _Transaction_gasRatio, "f"),
            actions: __classPrivateFieldGet(this, _Transaction_actions, "f"),
            publisher: __classPrivateFieldGet(this, _Transaction_publisher, "f"),
            publisher_sigs: __classPrivateFieldGet(this, _Transaction_publisher_sigs, "f"),
            signers: __classPrivateFieldGet(this, _Transaction_signers, "f"),
            signatures: __classPrivateFieldGet(this, _Transaction_signatures, "f"),
            reserved: __classPrivateFieldGet(this, _Transaction_reserved, "f"),
            time: __classPrivateFieldGet(this, _Transaction_time, "f"),
            expiration: __classPrivateFieldGet(this, _Transaction_expiration, "f"),
            delay: __classPrivateFieldGet(this, _Transaction_delay, "f"),
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.Transaction = Transaction;
_Transaction_amount_limit = new WeakMap(), _Transaction_chainId = new WeakMap(), _Transaction_gasLimit = new WeakMap(), _Transaction_gasRatio = new WeakMap(), _Transaction_actions = new WeakMap(), _Transaction_publisher = new WeakMap(), _Transaction_publisher_sigs = new WeakMap(), _Transaction_signers = new WeakMap(), _Transaction_signatures = new WeakMap(), _Transaction_reserved = new WeakMap(), _Transaction_time = new WeakMap(), _Transaction_expiration = new WeakMap(), _Transaction_delay = new WeakMap();
//# sourceMappingURL=transaction.js.map