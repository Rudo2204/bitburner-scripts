import { getServersToHack } from "./lib-utils.js";
/** @param {NS} ns */
export async function main(ns) {
	// https://en.wikipedia.org/wiki/Standard_deviation
	function getAverageArray(array) {
		const sum = array.reduce((acc, cur) => acc + cur);
		const average = sum / array.length;
		return average;
	}

	// https://en.wikipedia.org/wiki/Standard_deviation
	function getVarianceArray(array) {
		const avg = getAverageArray(array);
		// for whatever reason I can't figure out how to make reduce work so whatever
		var sumPow = 0;
		for (var i = 0; i < array.length; i++) {
			const cur = array[i];
			sumPow = sumPow + Math.pow(cur - avg, 2);
		}
		const variance = sumPow / array.length;
		return variance;
	}

	// https://en.wikipedia.org/wiki/Standard_deviation
	function getStdDeviationArray(array) {
		return Math.sqrt(getVarianceArray(array));
	}

	// we want the standard score because the population is normally distributed
	// https://en.wikipedia.org/wiki/Standard_score
	function getNormalizedScore(score, array) {
		const avg = getAverageArray(array);
		const stdDeviation = getStdDeviationArray(array);
		const normalizedScore = (score - avg) / stdDeviation;
		return normalizedScore;
	}

	// https://en.wikipedia.org/wiki/Feature_scaling
	function minMaxRescalingArray(score, array) {
		const avg = getAverageArray(array);
		const a = Math.min(...array);
		const b = Math.max(...array);
		const normalizedScore = a + (score - avg) / (b - a);
		return normalizedScore;
	}

	// https://en.wikipedia.org/wiki/Feature_scaling
	function getMeanNormalizedScore(score, array) {
		const avg = getAverageArray(array);
		const a = Math.min(...array);
		const b = Math.max(...array);
		const normalizedScore = (score - avg) / (b - a);
		return normalizedScore;
	}

	// Returns an array of the scores of a trait of the servers we can hack
	function getServersScore(ns, serverArrays, scoreFunction) {
		// don't know why `map` doesn't work
		var scores = [];
		for (var i = 0; i < serverArrays.length; i++) {
			const server = serverArrays[i];
			const score = scoreFunction(server);
			scores.push(score);
		}
		return scores;
	}

	// Returns an array of the scores of a trait of the servers we can hack
	// this function uses threads to calculate instead of server name
	function getServersScoreUsingThreads(ns, serverArrays, scoreFunction, numThreads) {
		var scores = [];
		for (var i = 0; i < serverArrays.length; i++) {
			const server = serverArrays[i];
			const score = scoreFunction(server);
			scores.push(score);
		}
		return scores;
	}


	function getNormalizedServerScoreArray(ns, serverArrays, scoreFunction, normalizerFunction) {
		const scoreArray = getServersScore(ns, serverArrays, scoreFunction);
		var normalizedScoreArray = []
		for (var i = 0; i < scoreArray.length; i++) {
			const score = scoreArray[i];
			const normalizedScore = normalizerFunction(score, scoreArray);
			normalizedScoreArray.push(normalizedScore);
		}
		return normalizedScoreArray;
	}

	function getFinalServersScore(ns,
		hackableServers,
		meanCorrection = true,
		cashFactorMultiplier = 1,
		hackingChanceFactorMultiplier = 1,
		hackingTimeFactorMultiplier = 1,
		growthFactorMultiplier = 1,
		growthTimeFactorMultiplier = 1,
		weakenTimeFactorMultiplier = 1) {

		const normalizerFunction = meanCorrection ? getMeanNormalizedScore : getNormalizedScore;

		const hackingChanceScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.hackAnalyzeChance, normalizerFunction);
		const cashScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.getServerMaxMoney, normalizerFunction);
		const growthScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.getServerGrowth, normalizerFunction);

		const hackingTimeScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.getHackTime, normalizerFunction);
		const growthTimeScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.getGrowTime, normalizerFunction);
		const weakenTimeScoreNormalizedArray = getNormalizedServerScoreArray(ns, hackableServers, ns.getWeakenTime, normalizerFunction);

		var finalScoreArray = [];
		for (var i = 0; i < hackableServers.length; i++) {
			var finalScore = 0;
			finalScore += hackingChanceFactorMultiplier * hackingChanceScoreNormalizedArray[i];
			finalScore += cashFactorMultiplier * cashScoreNormalizedArray[i];
			finalScore += growthFactorMultiplier * growthScoreNormalizedArray[i];

			finalScore -= hackingTimeFactorMultiplier * hackingTimeScoreNormalizedArray[i];
			finalScore -= growthTimeFactorMultiplier * growthTimeScoreNormalizedArray[i];
			finalScore -= weakenTimeFactorMultiplier * weakenTimeScoreNormalizedArray[i];
			
			finalScoreArray.push(finalScore);
		}

		return finalScoreArray;
	}

	const hackableServers = getServersToHack(ns);

	// tweaks the values: money, hack chance, hack time, how fast server growth, grow time, weaken time
	const scoreArray = getFinalServersScore(ns, hackableServers, true, 2000, 0, 1, 5, 5, 20);
	const maxScore = Math.max(...scoreArray);
	const index = scoreArray.indexOf(maxScore);

	for (var i = 0; i < hackableServers.length; i++) {
		ns.tprint(hackableServers[i], " has score ", scoreArray[i]);
	}

	ns.tprint("---------------");
	ns.tprint(hackableServers[index], " is the best to hack at rate ", scoreArray[index]);

	const target = "silver-helix";
	const indexTarget = hackableServers.indexOf(target);
	ns.tprint(target, " has score ", scoreArray[indexTarget]);
}