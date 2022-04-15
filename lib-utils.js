import { getNetworkNodes, canHack, getThresholds } from "./utils.js";

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
		!node.includes("home")
		&& !node.includes("pserv")
		&& canHack(ns, node, cracks)
	);
	return nodes;
}

/** @param {NS} ns **/
export function getAvailableThreads(ns) {
	const hackScript = "hack.js";
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	var nodes = getNetworkNodes(ns);
	nodes = nodes.filter(node => ns.getServerMaxRam(node) > 0 && canHack(ns, node, cracks));

	var threadCount = 0;

	for (var i = 0; i < nodes.length; i++) {
		const node = nodes[i];
		const hackScriptRam = ns.getScriptRam(hackScript, node);
		const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(node) / hackScriptRam));

		threadCount += maxThreads;
	}

	return threadCount;
}

/** @param {NS} ns **/
export function getStrategy(ns, node) {
	var { moneyThresh, secThresh } = getThresholds(ns, node);
	var type = ''; // strategy name (for logging)
	var seq = []; // action sequence
	var allocation = []; // recommended allocation
	if (ns.getServerSecurityLevel(node) > secThresh) {
		type = 'flog';
		seq = ['g', 'w'];
		allocation = [0.3, 0.7];
	} else if (ns.getServerMoneyAvailable(node) < moneyThresh) {
		type = 'nourish';
		seq = ['g', 'w'];
		allocation = [0.6, 0.4];
	} else {
		type = 'plunder';
		seq = ['h', 'w', 'g', 'w'];
		allocation = [0.25, 0.25, 0.25, 0.25];
	}
	return {
		type,
		seq,
		allocation
	};
}