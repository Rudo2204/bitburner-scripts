import { calculateDelays, calculateThreads } from "./batch-math.js";
/** @param {NS} ns */
export async function main(ns) {
	const hackScript = "hack-target.js";
	const weakenScript = "weaken-target.js";
	const growScript = "grow-target.js";

	const target = ns.args[0];
	//const target = "phantasy";
	const host = ns.args[1]; // "home";
	const percentHack = ns.args[2];

	var {
		period,
		hack_delay,
		weak_delay_1,
		grow_delay,
		weak_delay_2
	} = calculateDelays(ns, target);

	var {
		hackThreads,
		weakenThreads_1,
		growthThreads,
		weakenThreads_2
	} = calculateThreads(ns, host, target, percentHack);

	const hackRam = hackThreads * ns.getScriptRam(hackScript);
	const weaken1Ram = weakenThreads_1 * ns.getScriptRam(weakenScript);
	const growthRam = growthThreads * ns.getScriptRam(growScript);
	const weaken2Ram = weakenThreads_2 * ns.getScriptRam(weakenScript);

	ns.tprint("target: ", target, ", host: ", host);
	const profitPerBatch = ns.getServerMaxMoney(target) * percentHack;
	ns.tprint("profit/batch = ", profitPerBatch, ". Rate = ", profitPerBatch/(5*50/1000));
	ns.tprint(hackRam);
	ns.tprint(weaken1Ram);
	ns.tprint(growthRam);
	ns.tprint(weaken2Ram);

	const sumRam = hackRam + weaken1Ram + growthRam + weaken2Ram;
	ns.tprint("sum = ", sumRam);

	const batch_count = 10;
	const safe_window = 250;

	//for (var i = 0; i < batch_count; i++) {
	//	ns.exec(hackScript, serv, hackThreads, hack_delay + safe_window + period*i, target);
	//	ns.exec(weakenScript, serv, weakenThreads_1, weak_delay_1 + safe_window + period*i, target);
	//	ns.exec(growScript, serv, growthThreads, grow_delay + safe_window + period*i, target);
	//	ns.exec(weakenScript, serv, weakenThreads_2, weak_delay_2 + safe_window + period*i, target);
	//}
	//while (true) {
	//	await ns.asleep(1000);
	//}
}