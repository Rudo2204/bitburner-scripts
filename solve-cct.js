import {getNetworkNodes} from "./utils.js";
import {
    minimumPathSumInATriangle,
    generateIpAddresses,
    algorithmicStockTraderI,
    algorithmicStockTraderII,
    algorithmicStockTraderIII,
    algorithmicStockTraderIV,
    arrayJumpingGameI,
    arrayJumpingGameII,
} from "./cc.js"

const solvers = {
    "Minimum Path Sum in a Triangle": minimumPathSumInATriangle,
    "Generate IP Addresses": generateIpAddresses,
    "Algorithmic Stock Trader I": algorithmicStockTraderI,
    "Algorithmic Stock Trader II": algorithmicStockTraderII,
    "Algorithmic Stock Trader III": algorithmicStockTraderIII,
    "Algorithmic Stock Trader IV": algorithmicStockTraderIV,
    "Array Jumping Game": arrayJumpingGameI,
    "Array Jumping Game II": arrayJumpingGameII,
};

/** @param {NS} ns **/
export async function main(ns) {
    var nodes = getNetworkNodes(ns);
    nodes = nodes.filter(node =>
        node != "home"
        && !node.includes("pserv")
    );
    for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
        var contracts = ns.ls(node, "contract");
        if (contracts.length > 0) {
            for (var j = 0; j < contracts.length; j++) {
                var contract_name = contracts[j];
                var contract_type = ns.CodingContract.getContractType(contract_name, node);
                var tries = ns.CodingContract.getNumTriesRemaining(contract_name, node);

                if (!solvers.hasOwnProperty(contract_type)) {
                    ns.tprint(contract_name, " in host ", node, " is type: ", contract_type, ". I cannot solve this. This contract has ", tries, " remaining");
                    continue;
                }

                const contract_data = ns.CodingContract.getData(contract_name, node);
                const solver = solvers[contract_type];
                const answer = solver(contract_data);
                const reward = ns.codingcontract.attempt(answer, cct_name, host, {returnReward: true});
                ns.tprint(reward);
            }
        }
    }
}
