import { canHack, getRootAccess, getNetworkNodes } from "./utils.js";

/** @param {NS} ns */
export async function main(ns) {
	// you want to target the one which the most amount of money
	// which we can get from `find-rich-target.js`
	// then we can pass into this script, from here it will deploy to the hack script
	// to every reachable host, and all of them will hack the target

	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	while (true) {
		const hosts = getNetworkNodes(ns);
		const length = hosts.length;
		for (var i = 0; i < length; i++) {
			const host = hosts[i];
			if (!ns.hasRootAccess(host) && canHack(ns, host, cracks)) {
				getRootAccess(ns, host, cracks);
			}
		}
		await ns.sleep(1000);
	}
}