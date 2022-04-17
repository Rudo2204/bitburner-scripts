import { canHack, getRootAccess, getNetworkNodes, copyAndRunHackScript } from "./utils.js";

/** @param {NS} ns */
export async function main(ns) {
	const hackScript = "early-hack.js";
	const target = ns.args[0];

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
            if (ns.getServerMaxRam(host) > 0) {
                await copyAndRunHackScript(ns, host, hackScript, target, cracks);
            }
		}
		await ns.sleep(10000);
	}
}