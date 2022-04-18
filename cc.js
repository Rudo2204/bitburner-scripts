export function minimumPathSumInATriangle(input) {
    // array1 is the smaller one
    function build_bottom_array(array1, array2) {
        var result = [];
        for (var i = 0; i < array1.length; i++) {
            result.push(Math.min(array1[i] + array2[i], array1[i] + array2[i+1]));
        }
        return result;
    }
    var current_array = input[input.length-1];

    for (var i = input.length - 2; i >= 0; i--) {
        var next_array = input[i];
        current_array = build_bottom_array(next_array, current_array);
    }
    return current_array[0];
}

export function generateIpAddresses(input) {
    function valid(integer) {
        if (!integer.length || integer > 255) {
            return false;
        }
        if (integer[0] === "0" && integer.length > 1) {
            return false;
        }
        return true;
    }

    function backtrack(ip, arr) {
        if (arr.length === 4) {
            return;
        }
        var len = ip.length < 3 ? ip.length : 3;
        for (var i = len; i > 0; i--) {
            var integer = ip.toString().slice(0, i);
            if (!valid(integer)) {
                continue;
            }
            arr.push(integer);
            if (arr.length === 4 && !ip.toString().slice(i).length) {
                res.push(arr.join("."));
            } else {
                backtrack(ip.toString().slice(i), arr);
            }
            arr.pop();
        }
    }

    var res = [];
    backtrack(input, []);
    return res;
}

export const algorithmicStockTraderI = input => _getMaxProfit(1, input);
export const algorithmicStockTraderII = input => _getMaxProfit(input.length, input);
export const algorithmicStockTraderIII = input => _getMaxProfit(2, input);
export const algorithmicStockTraderIV = input => _getMaxProfit(input[0], input[1]);

// https://www.youtube.com/watch?v=lJxuwClVN2w
function _getMaxProfit(number_of_transactions, input) {
    var length_input = input.length;
    // dp is created to keep track of "local" profit of each transaction
    // initialize array filled with 0 (https://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array)
    var dp = new Array(length_input); for (let i=0; i<length_input; ++i) dp[i] = 0;
    for (var t = 0; t < number_of_transactions; t++) {
        var pos = - input[0];
        var profit = 0;
        // skip the first one
        for (var i = 1; i < length_input; i++) {
            pos = Math.max(pos, dp[i] - input[i]);
            profit = Math.max(profit, pos + input[i]);
            dp[i] = profit;
        }

    }
    return dp[dp.length-1];
}

//function arrayJumpingGameII(input) {
//    var length_input = input.length;
//    var dp = new Array(length_input); for (let i=0; i<length_input; ++i) dp[i] = Infinity;
//    dp[0] = 0;
//
//    for (var i = 0; i < length_input; i++) {
//        for(var j = 1; j < input[i]+1; j++) {
//            if (i+j < length_input) {
//                dp[i+j] = Math.min(dp[i+j], dp[i]+1);
//            }
//        }
//    }
//    return dp[length_input-1];
//}
// https://www.youtube.com/watch?v=HKxvkbbAJh0
export function arrayJumpingGameII(input) {
    var length_input = input.length;
    var [i, jump, lastPos, maxPos] = [0,0,0,0];

    while (i < length_input - 1) {
        maxPos = Math.max(maxPos, i + input[i]);
        if (i == lastPos) {
            lastPos = maxPos;
            jump += 1;
        }
        i += 1;
    }

    return jump;
}

export function arrayJumpingGameI(input) {
    const jump = arrayJumpingGameII(input);
    return jump > 1 ? 1 : 0;
}
