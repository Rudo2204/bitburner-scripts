import {getPrepStrategy} from "./lib-utils.js";
import {canHack, getRootAccess} from "./utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    const growScript = "grow.js";
    const weakenScript = "weaken.js";

    const host = "home";
    const target = ns.args[0];

    if (ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target)
        && ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
        ns.tprint("This target is already prepped!");
        ns.exit();
    }

    if (!ns.hasRootAccess(target) && canHack(ns, target, cracks)) {
        getRootAccess(ns, host, cracks);
    }

    var {
        grow_delay,
        growthThreads,
        weakenThreads
    } = getPrepStrategy(ns, host, target);

    const reservedRam = 16;
    const availableRam = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - reservedRam;

    // 1.75 is the RAM of growth/weaken script
    var ramAfterGrowth = availableRam - 1.75 * growthThreads;
    var ramAfterWeaken = ramAfterGrowth - 1.75 * weakenThreads;

    // we can afford this prep
    if (ramAfterWeaken > 0) {
        ns.exec(weakenScript, host, growthThreads, 0, target);
        ns.exec(growScript, host, growthThreads, grow_delay, target);
    } else {
        ns.tprint("We do not have enough RAM to do this manual prep");
    }
}
