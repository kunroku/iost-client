"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GASContract = void 0;
const contract_interface_1 = require("./contract-interface");
class GASContract extends contract_interface_1.ContractInterface {
    get id() {
        return 'gas.iost';
    }
    pledge(pledger, to, amount) {
        this.call('pledge', [pledger, to, amount]);
    }
    unpledge(pledger, from, amount) {
        this.call('unpledge', [pledger, from, amount]);
    }
}
exports.GASContract = GASContract;
//# sourceMappingURL=gas.js.map