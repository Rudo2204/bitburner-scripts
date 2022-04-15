import { getAvailableThreads } from "./lib-utils.js";
/** @param {NS} ns */
export function main(ns) {
	const h = ns.hackAnalyzeSecurity(1);
	const g = ns.growthAnalyzeSecurity(1);
	const w = ns.weakenAnalyze(1);
	ns.tprint(h);
	ns.tprint(g);
	ns.tprint(w);

		const target = "n00dles"; //ns.args[0];
	const t0 = 50 // ns.args[1];
	const ht = ns.formulas.hacking.hackTime(ns.getServer(target), ns.getPlayer());
	const gt = ns.formulas.hacking.growTime(ns.getServer(target), ns.getPlayer());
	const wt = ns.formulas.hacking.weakenTime(ns.getServer(target), ns.getPlayer());
	////const a = ns.getServerMaxRam("computek");
	ns.tprint(gt / ht);
	ns.tprint(wt / ht);

}