// Project euler 18, but minimum instead of maximum
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

// leetcode 93
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
// leetcode 188
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

// leet code 45
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

// easier version, see leetcode 45
export function arrayJumpingGameI(input) {
    const jump = arrayJumpingGameII(input);
    return jump > 1 ? 1 : 0;
}

// leetcode 39, but easier, since we fill the candidates with array generated from input
// https://www.geeksforgeeks.org/coin-change-dp-7/
function _getCombinationSum(target, candidates) {
    let table = new Array(target + 1);
    table.fill(0);

    table[0] = 1;

    for(let i = 0; i < candidates.length; i++)
        for(let j = candidates[i]; j <= target; j++)
            table[j] += table[j - candidates[i]];

    return table[target];
}


export const totalWaysToSumI = input => _getCombinationSum(input, Array.from({length: input-1}, (_, i) => i + 1));
export const totalWaysToSumII = input => _getCombinationSum(input[0], input[1]);

// project euler 3 (has an overview pdf on how to implement this)
export function findLargestPrimeFactor(input) {
    var n = input;
    let lastFactor;
    if (input % 2 == 0) {
        lastFactor = 2;
        n = Math.floor(n/2);
        while (n % 2 == 0) {
            n = Math.floor(n/2);
        }
    } else {
        lastFactor = 1;
    }
    var factor = 3;

    var maxFactor = Math.sqrt(n);
    while (n > 1 && factor <= maxFactor) {
        if (n % factor == 0) {
            n = Math.floor(n/factor);
            lastFactor = factor
            while (n % factor == 0) {
                n = Math.floor(n / factor);
            }
            maxFactor = Math.sqrt(n)
        }
        factor += 2;
    }
    if (n == 1) {
        return lastFactor;
    }
    return n;
}

// https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/
export function subarrayWithMaximumSum(input) {
   var max_so_far = Number.MIN_VALUE, max_ending_here = 0;

   for (var i = 0; i < input.length; i++) {
       max_ending_here += input[i];

       if (max_so_far < max_ending_here) {
           max_so_far = max_ending_here;
       }

       if (max_ending_here < 0) {
           max_ending_here = 0;
       }
   }
   return max_so_far;
}

// https://www.geeksforgeeks.org/print-a-given-matrix-in-spiral-form/
export function spiralizeMatrix(input) {
    let ans = [];

    if (input.length == 0)
        return ans;

    let R = input.length, C = input[0].length;
    let seen = new Array(R);
    for(let i=0;i<R;i++) {
        seen[i]=new Array(C);
        for(let j=0;j<C;j++)
        {
            seen[i][j]=false;
        }
    }

    let dr = [ 0, 1, 0, -1 ];
    let dc = [ 1, 0, -1, 0 ];
    let r = 0, c = 0, di = 0;

    // Iterate from 0 to R * C - 1
    for (let i = 0; i < R * C; i++) {
        ans.push(input[r][c]);
        seen[r][c] = true;
        let cr = r + dr[di];
        let cc = c + dc[di];

        if (0 <= cr && cr < R && 0 <= cc && cc < C
            && !seen[cr][cc]) {
            r = cr;
            c = cc;
        }
        else {
            di = (di + 1) % 4;
            r += dr[di];
            c += dc[di];
        }
    }
    return ans;
}

// leetcode 56
export function mergeOverlappingIntervals(input) {
    var intervals = input;
    if (!intervals.length) return intervals
    intervals.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1])
    var prev = intervals[0]
    var res = [prev]
    for (var curr of intervals) {
        if (curr[0] <= prev[1]) {
            prev[1] = Math.max(prev[1], curr[1])
        } else {
            res.push(curr)
            prev = curr
        }
    }
    return res
}

// leetcode 62
export function uniquePathsInAGridI(input) {
    const n = input[0];
    const m = input[1];
    const currentRow = [];
    currentRow.length = n;

    for (let i = 0; i < n; i++) {
        currentRow[i] = 1;
    }
    for (let row = 1; row < m; row++) {
        for (let i = 1; i < n; i++) {
            currentRow[i] += currentRow[i - 1];
        }
    }

    return currentRow[n-1];
}

// leetcode 63
export function uniquePathsInAGridII(input) {
     const obstacleGrid = [];
     obstacleGrid.length = input.length;
     for (let i = 0; i < obstacleGrid.length; ++i) {
       obstacleGrid[i] = input[i].slice();
     }

     for (let i = 0; i < obstacleGrid.length; i++) {
       for (let j = 0; j < obstacleGrid[0].length; j++) {
         if (obstacleGrid[i][j] == 1) {
           obstacleGrid[i][j] = 0;
         } else if (i == 0 && j == 0) {
           obstacleGrid[0][0] = 1;
         } else {
           obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
         }
       }
     }

     return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1];
}

function removeBracketsFromArrayString(str) {
  let strCpy = str;
  if (strCpy.startsWith("[")) {
    strCpy = strCpy.slice(1);
  }
  if (strCpy.endsWith("]")) {
    strCpy = strCpy.slice(0, -1);
  }

  return strCpy;
}

function removeQuotesFromString(str) {
  let strCpy = str;
  if (strCpy.startsWith('"') || strCpy.startsWith("'")) {
    strCpy = strCpy.slice(1);
  }
  if (strCpy.endsWith('"') || strCpy.endsWith("'")) {
    strCpy = strCpy.slice(0, -1);
  }

  return strCpy;
}

// leetcode 301
export function sanitizeParenthesesInExpression(input) {
    var data = input;
    let left = 0;
    let right = 0;
    const res = [];

    for (let i = 0; i < data.length; ++i) {
      if (data[i] === "(") {
        ++left;
      } else if (data[i] === ")") {
        left > 0 ? --left : ++right;
      }
    }

    function dfs(pair, index, left, right, s, solution, res) {
      if (s.length === index) {
        if (left === 0 && right === 0 && pair === 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i] === solution) {
              return;
            }
          }
          res.push(solution);
        }
        return;
      }

      if (s[index] === "(") {
        if (left > 0) {
          dfs(pair, index + 1, left - 1, right, s, solution, res);
        }
        dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
      } else if (s[index] === ")") {
        if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
        if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
      } else {
        dfs(pair, index + 1, left, right, s, solution + s[index], res);
      }
    }

    dfs(0, 0, left, right, data, "", res);
    console.log(res);
    return res;
}

class BinHeap {
    constructor() {
        this.data = [];
    }
    /** Get number of elements in the heap. */
    get size() {
        return this.data.length;
    }
    /** Add a new element to the heap. */
    push(value, weight) {
        const i = this.data.length;
        this.data[i] = [weight, value];
        this.heapifyUp(i);
    }
    /** Get the value of the root-most element of the heap, without changing the heap. */
    peek() {
        if (this.data.length == 0)
            return undefined;
        return this.data[0][1];
    }
    /** Remove the root-most element of the heap and return the removed element's value. */
    pop() {
        if (this.data.length == 0)
            return undefined;
        const value = this.data[0][1];
        this.data[0] = this.data[this.data.length - 1];
        this.data.length = this.data.length - 1;
        this.heapifyDown(0);
        return value;
    }
    /** Change the weight of an element in the heap. */
    changeWeight(predicate, weight) {
        // Find first element with matching value, if any
        const i = this.data.findIndex((e) => predicate(e[1]));
        if (i == -1)
            return;
        // Update that element's weight
        this.data[i][0] = weight;
        // And re-heapify if needed
        const p = Math.floor((i - 1) / 2);
        if (!this.heapOrderABeforeB(this.data[p][0], this.data[i][0]))
            // Needs to shift root-wards?
            this.heapifyUp(i);
        // Try shifting deeper
        else
            this.heapifyDown(i);
    }
    /** Restore heap condition, starting at index i and traveling towards root. */
    heapifyUp(i) {
        // Swap the new element up towards root until it reaches root position or
        // settles under under a suitable parent
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            // Reached heap-ordered state already?
            if (this.heapOrderABeforeB(this.data[p][0], this.data[i][0]))
                break;
            // Swap
            const tmp = this.data[p];
            this.data[p] = this.data[i];
            this.data[i] = tmp;
            // And repeat at parent index
            i = p;
        }
    }
    /** Restore heap condition, starting at index i and traveling away from root. */
    heapifyDown(i) {
        // Swap the shifted element down in the heap until it either reaches the
        // bottom layer or is in correct order relative to it's children
        while (i < this.data.length) {
            const l = i * 2 + 1;
            const r = i * 2 + 2;
            let toSwap = i;
            // Find which one of element i and it's children should be closest to root
            if (l < this.data.length && this.heapOrderABeforeB(this.data[l][0], this.data[toSwap][0]))
                toSwap = l;
            if (r < this.data.length && this.heapOrderABeforeB(this.data[r][0], this.data[toSwap][0]))
                toSwap = r;
            // Already in order?
            if (i == toSwap)
                break;
            // Not in order. Swap child that should be closest to root up to 'i' and repeat
            const tmp = this.data[toSwap];
            this.data[toSwap] = this.data[i];
            this.data[i] = tmp;
            i = toSwap;
        }
    }
}
class MinHeap extends BinHeap {
    heapOrderABeforeB(weightA, weightB) {
        return weightA < weightB;
    }
}

function generateAnswerFromDistanceArray(distanceArray, dstX, dstY) {
    var res = "";

    var ansX = 0;
    var ansY = 0;
    var val = distanceArray[ansY][ansX];
    var dst = distanceArray[dstY][dstX];
    while (val != dst) {
        val += 1;

        try {
        if (distanceArray[ansX][ansY + 1] == val) {
            res += "R";
            ansY = ansY + 1;
            continue;
        }} catch(err) {}

        try {
        if (distanceArray[ansX + 1][ansY] == val) {
            res += "D";
            ansX = ansX + 1;
            continue;
        }} catch(err) {}

        try {
        if (distanceArray[ansX - 1][ansY] == val) {
            res += "U";
            ansX = ansX - 1;
            continue;
        }} catch(err) {}

        try {
        if (distanceArray[ansX][ansY - 1] == val) {
            res += "L";
            ansY = ansY - 1;
            continue;
        }} catch(err) {}

        return "";
    }
    return res;
}

// leetcode 1293
export function shortestPathInAGrid(data) {
    const width = data[0].length;
    const height = data.length;
    const dstY = height - 1;
    const dstX = width - 1;
    const distance = new Array(height);

    const queue = new MinHeap();
    for (let y = 0; y < height; y++) {
        distance[y] = new Array(width).fill(Infinity);
    }

    function validPosition(y, x) {
        return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
    }
    // List in-bounds and passable neighbors
    function* neighbors(y, x) {
        if (validPosition(y - 1, x))
            yield [y - 1, x]; // Up
        if (validPosition(y + 1, x))
            yield [y + 1, x]; // Down
        if (validPosition(y, x - 1))
            yield [y, x - 1]; // Left
        if (validPosition(y, x + 1))
            yield [y, x + 1]; // Right
    }

    // Prepare starting point
    distance[0][0] = 0;
    queue.push([0, 0], 0);

    // Take next-nearest position and expand potential paths from there
    while (queue.size > 0) {
        const [y, x] = queue.pop();
        for (const [yN, xN] of neighbors(y, x)) {
            const d = distance[y][x] + 1;
            if (d < distance[yN][xN]) {
                if (distance[yN][xN] == Infinity)
                    // Not reached previously
                    queue.push([yN, xN], d);
                // Found a shorter path
                else
                    queue.changeWeight(([yQ, xQ]) => yQ == yN && xQ == xN, d);
                //prev[yN][xN] = [y, x];
                distance[yN][xN] = d;
            }
        }
    }
    return generateAnswerFromDistanceArray(distance, dstX, dstY);
}

// https://www.geeksforgeeks.org/print-all-possible-expressions-that-evaluate-to-a-target/
export function findValidMathExpressions(input) {
    const num = input[0];
    const target = input[1];
    function helper(res, path, num, target, pos, evaluated, multed) {
        if (pos === num.length) {
            if (target === evaluated) {
                res.push(path);
            }
            return;
        }
        for (let i = pos; i < num.length; ++i) {
            if (i != pos && num[pos] == "0") {
                break;
            }
            const cur = parseInt(num.substring(pos, i + 1));
            if (pos === 0) {
                helper(res, path + cur, num, target, i + 1, cur, cur);
            }
            else {
                helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
                helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
                helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
            }
        }
    }
    const result = [];
    helper(result, "", num, target, 0, 0, 0);
    return result;
}

function HammingEncode(value) {
    // encoding following Hammings rule
    function HammingSumOfParity(_lengthOfDBits) {
        // will calculate the needed amount of parityBits 'without' the "overall"-Parity (that math took me 4 Days to get it working)
        return _lengthOfDBits < 3 || _lengthOfDBits == 0 // oh and of course using ternary operators, it's a pretty neat function
            ? _lengthOfDBits == 0
                ? 0
                : _lengthOfDBits + 1
            : // the following math will only work, if the length is greater equal 3, otherwise it's "kind of" broken :D
                Math.ceil(Math.log2(_lengthOfDBits * 2)) <=
                    Math.ceil(Math.log2(1 + _lengthOfDBits + Math.ceil(Math.log2(_lengthOfDBits))))
                    ? Math.ceil(Math.log2(_lengthOfDBits) + 1)
                    : Math.ceil(Math.log2(_lengthOfDBits));
    }
    const _data = value.toString(2).split(""); // first, change into binary string, then create array with 1 bit per index
    const _sumParity = HammingSumOfParity(_data.length); // get the sum of needed parity bits (for later use in encoding)
    const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // function count for specific entries in the array, for later use
    const _build = ["x", "x", ..._data.splice(0, 1)]; // init the "pre-build"
    for (let i = 2; i < _sumParity; i++) {
        // add new paritybits and the corresponding data bits (pre-building array)
        _build.push("x", ..._data.splice(0, Math.pow(2, i) - 1));
    }
    // now the "calculation"... get the paritybits ('x') working
    for (const index of _build.reduce(function (a, e, i) {
        if (e == "x")
            a.push(i);
        return a;
    }, [])) {
        // that reduce will result in an array of index numbers where the "x" is placed
        const _tempcount = index + 1; // set the "stepsize" for the parityBit
        const _temparray = []; // temporary array to store the extracted bits
        const _tempdata = [..._build]; // only work with a copy of the _build
        while (_tempdata[index] !== undefined) {
            // as long as there are bits on the starting index, do "cut"
            const _temp = _tempdata.splice(index, _tempcount * 2); // cut stepsize*2 bits, then...
            _temparray.push(..._temp.splice(0, _tempcount)); // ... cut the result again and keep the first half
        }
        _temparray.splice(0, 1); // remove first bit, which is the parity one
        _build[index] = (count(_temparray, "1") % 2).toString(); // count with remainder of 2 and"toString" to store the parityBit
    } // parity done, now the "overall"-parity is set
    _build.unshift((count(_build, "1") % 2).toString()); // has to be done as last element
    return _build.join(""); // return the _build as string
}
function HammingDecode(_data) {
    //check for altered bit and decode
    const _build = _data.split(""); // ye, an array for working, again
    const _testArray = []; //for the "truthtable". if any is false, the data has an altered bit, will check for and fix it
    const _sumParity = Math.ceil(Math.log2(_data.length)); // sum of parity for later use
    const count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    // the count.... again ;)
    let _overallParity = _build.splice(0, 1).join(""); // store first index, for checking in next step and fix the _build properly later on
    _testArray.push(_overallParity == (count(_build, "1") % 2).toString() ? true : false); // first check with the overall parity bit
    for (let i = 0; i < _sumParity; i++) {
        // for the rest of the remaining parity bits we also "check"
        const _tempIndex = Math.pow(2, i) - 1; // get the parityBits Index
        const _tempStep = _tempIndex + 1; // set the stepsize
        const _tempData = [..._build]; // get a "copy" of the build-data for working
        const _tempArray = []; // init empty array for "testing"
        while (_tempData[_tempIndex] != undefined) {
            // extract from the copied data until the "starting" index is undefined
            const _temp = [..._tempData.splice(_tempIndex, _tempStep * 2)]; // extract 2*stepsize
            _tempArray.push(..._temp.splice(0, _tempStep)); // and cut again for keeping first half
        }
        const _tempParity = _tempArray.shift(); // and again save the first index separated for checking with the rest of the data
        _testArray.push(_tempParity == (count(_tempArray, "1") % 2).toString() ? true : false);
        // is the _tempParity the calculated data? push answer into the 'truthtable'
    }
    let _fixIndex = 0; // init the "fixing" index and start with 0
    for (let i = 1; i < _sumParity + 1; i++) {
        // simple binary adding for every boolean in the _testArray, starting from 2nd index of it
        _fixIndex += _testArray[i] ? 0 : Math.pow(2, i) / 2;
    }
    _build.unshift(_overallParity); // now we need the "overall" parity back in it's place
    // try fix the actual encoded binary string if there is an error
    if (_fixIndex > 0 && _testArray[0] == false) {
        // if the overall is false and the sum of calculated values is greater equal 0, fix the corresponding hamming-bit
        _build[_fixIndex] = _build[_fixIndex] == "0" ? "1" : "0";
    }
    else if (_testArray[0] == false) {
        // otherwise, if the the overall_parity is the only wrong, fix that one
        _overallParity = _overallParity == "0" ? "1" : "0";
    }
    else if (_testArray[0] == true && _testArray.some((truth) => truth == false)) {
        return 0; // uhm, there's some strange going on... 2 bits are altered? How? This should not happen 👀
    }
    // oof.. halfway through... we fixed an possible altered bit, now "extract" the parity-bits from the _build
    for (let i = _sumParity; i >= 0; i--) {
        // start from the last parity down the 2nd index one
        _build.splice(Math.pow(2, i), 1);
    }
    _build.splice(0, 1); // remove the overall parity bit and we have our binary value
    return parseInt(_build.join(""), 2); // parse the integer with redux 2 and we're done!
}

export function hcIntegerToEncodedBinary(input) {
    return HammingEncode(input);
}

export function hcEncodedBinaryToInteger(input) {
    return HammingDecode(input);
}
