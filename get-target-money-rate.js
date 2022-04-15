import { getNetworkNodes, canHack } from "./utils.js";
import {getServersToHack, getAvailableThreads} from "./lib-utils.js"

/** @param {NS} ns */
export async function main(ns) {
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	const threshold = 75;
	var nodes = getServersToHack(ns);

	const threadCount = getAvailableThreads(ns);
	ns.tprint(threadCount);
	var bestMoneyNode = "";
	var bestMoney = 0;
	var bestMoneyRate = 0;

	var bestRateNode = "";
	var bestRate = 0;
	var bestRateMoney = 0;

	for (var i = 0; i < nodes.length; i++) {
		const node = nodes[i];

		if (canHack(ns, node, cracks)) {
			const serverMaxMoney = ns.getServerMaxMoney(node);
			const serverMoney = ns.getServerMoneyAvailable(node);

			const money = ns.hackAnalyze(node);
			const chance = ns.hackAnalyzeChance(node);
			// we divide by the chance to get the actual time
			const time = ns.getHackTime(node) / chance;

			const profitPerSec = serverMoney * threadCount * money / (time / 1000);
			const moneyToHack = serverMaxMoney * threshold / 100;

			ns.tprint(node, " has ", moneyToHack / 1e6, "M available to hack. Rate = ", profitPerSec, "$/s");

			if (moneyToHack > bestMoney) {
				bestMoneyNode = node;
				bestMoney = moneyToHack;
				bestMoneyRate = profitPerSec;
			}
			if (profitPerSec > bestRate) {
				bestRateNode = node;
				bestRate = profitPerSec;
				bestRateMoney = moneyToHack;
			}
		}
	}
	ns.tprint("----");
	ns.tprint(bestMoneyNode, " has ", bestMoney / 1e6, "M available to hack (best). Rate = ", bestMoneyRate, "$/s");
	ns.tprint(bestRateNode, " has ", bestRateMoney / 1e6, "M available to hack. Rate = ", bestRate, "$/s (best)");
}