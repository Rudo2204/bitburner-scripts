import {getPrepStrategy} from "./lib-utils.js";
import {canHack, getRootAccess} from "./utils.js";

/** @param {NS} ns **/
export async function prep(ns, host, target) {
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

    const growScript = "grow.js";
    const weakenScript = "weaken.js";

    if (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)
        && ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
        ns.print("This target is already prepped!");
        return;
    }

    if (!ns.hasRootAccess(target) && canHack(ns, target, cracks)) {
        getRootAccess(ns, target, cracks);
    }

    var {
        grow_delay,
        growthThreads,
        weakenThreads
    } = getPrepStrategy(ns, host, target);

    if (growthThreads === Infinity) {
        ns.print(target, " has $0 so I am assigning one thread to grow it once first");
        ns.exec(growScript, host, 1, 0, target);
        await ns.asleep(ns.getGrowTime(target) + 1000);
        // recalculate
        var {
            grow_delay,
            growthThreads,
            weakenThreads
        } = getPrepStrategy(ns, host, target);
    }

    const reservedRam = 32;
    const availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam;

    // 1.75 is the RAM of growth/weaken script
    var ramAfterGrowth = availableRam - 1.75 * growthThreads;
    var ramAfterWeaken = ramAfterGrowth - 1.75 * weakenThreads;

    // we can afford this prep
    if (ramAfterWeaken > 0) {
        if (weakenThreads > 0) {
            ns.exec(weakenScript, host, weakenThreads, 0, target);
        }
        if (growthThreads > 0) {
            ns.exec(growScript, host, growthThreads, grow_delay, target);
        }
    } else {
        ns.print("We do not have enough RAM to do this manual prep");
    }
}


/** @param {NS} ns **/
export async function main(ns) {
    const host = ns.getHostname();
    const target = ns.args[0];
    if (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)
        && ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
        ns.tprint("This target is already prepped!");
        ns.exit();
    }
    await prep(ns, host, target);
}
