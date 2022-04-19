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
    totalWaysToSumI,
    totalWaysToSumII,
    findLargestPrimeFactor,
    subarrayWithMaximumSum,
    spiralizeMatrix,
    mergeOverlappingIntervals,
    uniquePathsInAGridI,
    uniquePathsInAGridII,
    sanitizeParenthesesInExpression,
    generateAnswerFromDistanceArray,
    findValidMathExpressions,
    HCIntegerToEncodedBinary,
    HCEncodedBinaryToInteger,
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
    "Total Ways to Sum": totalWaysToSumI,
    "Total Ways to Sum II": totalWaysToSumII,
    "Find Largest Prime Factor": findLargestPrimeFactor,
    "Subarray with Maximum Sum": subarrayWithMaximumSum,
    "Spiralize Matrix": spiralizeMatrix,
    "Merge Overlapping Intervals": mergeOverlappingIntervals,
    "Unique Paths in a Grid I": uniquePathsInAGridI,
    "Unique Paths in a Grid II": uniquePathsInAGridII,
    "Sanitize Parentheses in Expression": sanitizeParenthesesInExpression,
    "Shortest Path in a Grid": generateAnswerFromDistanceArray,
    "Find All Valid Math Expressions": findValidMathExpressions,
    "HammingCodes: Integer to encoded Binary": HCIntegerToEncodedBinary,
    "HammingCodes: Integer to Encoded Binary": HCIntegerToEncodedBinary,
    "HammingCodes: Encoded Binary to Integer": HCEncodedBinaryToInteger,
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
                var contract_type = ns.codingcontract.getContractType(contract_name, node);
                var tries = ns.codingcontract.getNumTriesRemaining(contract_name, node);

                if (!solvers.hasOwnProperty(contract_type)) {
                    ns.tprint("Don't know how to solve ", contract_name, " on node ", node, " its type: ", contract_type, ". This contract has ", tries, " tries remaining");
                    continue;
                }

                const contract_data = ns.codingcontract.getData(contract_name, node);
                const solver = solvers[contract_type];
                const answer = solver(contract_data);
                const reward = ns.codingcontract.attempt(answer, contract_name, node, {returnReward: true});
                ns.tprint(reward);
            }
        }
    }
}
