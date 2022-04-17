//import { calculateDelays, calculateThreads } from "./batch-math.js";
import { calculateDelays, calculateThreads } from "./formulas/batch-math.js";
import {canHack, getRootAccess, prepHost} from "./utils.js";
/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    const reservedRam = 32;
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	const hackScript = "hack.js";
	const weakenScript = "weaken.js";
	const growScript = "grow.js";

	const target = ns.args[0];
	const host = ns.args[1]; // "home";
	const percentHack = ns.args[2];

    if (ns.args.length < 3) {
        ns.tprint("Not enough args. 0 -> target, 1 -> host, 2 -> percent");
        ns.exit();
    }

    if (!ns.hasRootAccess(target) && canHack(ns, target, cracks)) {
        getRootAccess(ns, host, cracks);
    }

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
	const sumRam = hackRam + weaken1Ram + growthRam + weaken2Ram;

	const safe_window = 1000;
    var availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam;
    var max_depth = Math.floor(availableRam/sumRam);
    var {
        period,
        hack_delay,
        weak_delay_1,
        grow_delay,
        weak_delay_2,
        depth
    } = calculateDelays(ns, target, max_depth);

    ns.print("Scheduling ", depth, " batches on on target: ", target);
    await prepHost(ns, host);
    var skip = depth * 0.1;
    var skip_ratio = Math.floor((depth-skip)/skip);
	for (var i = 1; i <= depth; i++) {
        if (i % skip_ratio) {
	    	ns.exec(hackScript, host, hackThreads, hack_delay + (safe_window + period)*i, target);
        }
	    ns.exec(weakenScript, host, weakenThreads_1, weak_delay_1 + (safe_window + period)*i, target);
	    ns.exec(growScript, host, growthThreads, grow_delay + (safe_window + period)*i, target);
	    ns.exec(weakenScript, host, weakenThreads_2, weak_delay_2 + (safe_window + period)*i, target);
	}
}