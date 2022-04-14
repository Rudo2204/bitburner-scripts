import { calculateDelays, calculateThreads } from "./batch-math.js";
import {canHack, getRootAccess} from "./utils.js";
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
        period,
        hack_delay,
        weak_delay_1,
        grow_delay,
        weak_delay_2,
        depth
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
	const sumRam = hackRam + weaken1Ram + growthRam + weaken2Ram;

	const availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam;
	var no_batch = Math.min(availableRam/sumRam, depth);

	const safe_window = 250;

	var estimated_finish_time = safe_window + period * (no_batch - 1) - weak_delay_1;
	while (true) {
        ns.print("Scheduling ", no_batch, " batches on on target: ", target);
	    for (var i = 0; i < no_batch; i++) {
	        ns.exec(hackScript, host, hackThreads, hack_delay + safe_window + period*i, target);
	        ns.exec(weakenScript, host, weakenThreads_1, weak_delay_1 + safe_window + period*i, target);
	        ns.exec(growScript, host, growthThreads, grow_delay + safe_window + period*i, target);
	        ns.exec(weakenScript, host, weakenThreads_2, weak_delay_2 + safe_window + period*i, target);
	    }
	    await ns.asleep(estimated_finish_time);

	    // recalculate
        var {
            period,
            hack_delay,
            weak_delay_1,
            grow_delay,
            weak_delay_2,
            depth
        } = calculateDelays(ns, target);

        var no_batch = Math.min(availableRam/sumRam, depth);
	}

}