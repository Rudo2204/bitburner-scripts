import { getNetworkNodes, canHack, getAvailableRam } from "./utils.js";

/** @param {NS} ns */
export function getServersToHack(ns) {
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};
	var nodes = getNetworkNodes(ns);
	nodes = nodes.filter(node =>
		node == "home"
		&& !node.includes("myserv")
		&& canHack(ns, node, cracks)
	);
	return nodes;
}

/** @param {NS} ns */
export function getScriptableServersSorted(ns, sortByMaxRam = true) {
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};
	var nodes = getNetworkNodes(ns);
	nodes = nodes.filter(node =>
		canHack(ns, node, cracks)
		&& ns.getServerMaxRam(node) >= 1.5
	);

	if (sortByMaxRam) {
		nodes = nodes.sort(function (a, b) { return ns.getServerMaxRam(b) - ns.getServerMaxRam(a) });
	} else {
		nodes = nodes.sort(function (a, b) { return getAvailableRam(ns, b) - getAvailableRam(ns, a) });
	}

	return nodes;
}

/** @param {NS} ns **/
export function getAvailableThreads(ns, isHackScript) {
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	const ramScript = isHackScript ? 1.6 : 1.75;
	var nodes = getNetworkNodes(ns);
	nodes = nodes.filter(node => ns.getServerMaxRam(node) > 0 && canHack(ns, node, cracks));

	var threadCount = 0;

	for (var i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(node) / ramScript));

		threadCount += maxThreads;
	}

	return threadCount;
}

/** @param {NS} ns **/
export function getPrepStrategy(ns, host, target) {
	const securityDifference = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
	const growthMoneyMultiplier = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
	if (securityDifference == 0 && growthMoneyMultiplier == 1) {
		ns.tprint(target, " is prepped!")
	}
	const coreCounts = ns.getServer(host).cpuCores;

	const growthThreads = Math.ceil(ns.growthAnalyze(target, growthMoneyMultiplier, coreCounts));
	const securityAfterGrowth = growthThreads * 0.004 + ns.getServerSecurityLevel(target);
	const weakenThreads = Math.ceil((securityAfterGrowth - ns.getServerMinSecurityLevel(target)) / 0.05);

	const t0 = 150; // 150ms delay between G and W
	const grow_time = ns.getGrowTime(target);
	const weaken_time = ns.getWeakenTime(target);
	const grow_delay = weaken_time - grow_time - t0;
	return {
		grow_delay,
		growthThreads,
		weakenThreads,
	}
}