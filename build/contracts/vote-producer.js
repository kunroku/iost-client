"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteProducerContract = void 0;
const contract_interface_1 = require("./contract-interface");
class VoteProducerContract extends contract_interface_1.ContractInterface {
    get id() {
        return 'vote_producer.iost';
    }
    initProducer(proID, proPubkey) {
        this.call('initProducer', [proID, proPubkey]);
    }
    initAdmin(adminID) {
        this.call('initAdmin', [adminID]);
    }
    applyRegister(account, pubkey, loc, url, netId, isProducer) {
        this.call('applyRegister', [account, pubkey, loc, url, netId, isProducer]);
    }
    applyUnregister(account) {
        this.call('applyUnregister', [account]);
    }
    approveRegister(account) {
        this.call('approveRegister', [account]);
    }
    approveUnregister(account) {
        this.call('approveUnregister', [account]);
    }
    forceUnregister(account) {
        this.call('forceUnregister', [account]);
    }
    unregister(account) {
        this.call('unregister', [account]);
    }
    updateProducer(account, pubkey, loc, url, netId) {
        this.call('updateProducer', [account, pubkey, loc, url, netId]);
    }
    getProducer(account) {
        this.call('getProducer', [account]);
    }
    logInProducer(account) {
        this.call('logInProducer', [account]);
    }
    logOutProducer(account) {
        this.call('logOutProducer', [account]);
    }
    vote(voter, producer, amount) {
        this.call('vote', [voter, producer, amount]);
    }
    unvote(voter, producer, amount) {
        this.call('unvote', [voter, producer, amount]);
    }
    getVote(voter) {
        this.call('getVote', [voter]);
    }
    topupVoterBonus(account, amount, payer) {
        this.call('topupVoterBonus', [account, amount, payer]);
    }
    topupCandidateBonus(amount, payer) {
        this.call('topupCandidateBonus', [amount, payer]);
    }
    getVoterBonus(voter) {
        this.call('getVoterBonus', [voter]);
    }
    voterWithdraw(voter) {
        this.call('voterWithdraw', [voter]);
    }
    getCandidateBonus(account) {
        this.call('getCandidateBonus', [account]);
    }
    candidateWithdraw(account) {
        this.call('candidateWithdraw', [account]);
    }
    stat() {
        this.call('stat', []);
    }
}
exports.VoteProducerContract = VoteProducerContract;
//# sourceMappingURL=vote-producer.js.map