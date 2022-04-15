import { canHack, getRootAccess, getNetworkNodes } from "./utils.js";

/** @param {NS} ns */
export async function main(ns) {
	// you want to target the one which the most amount of money
	// which we can get from `find-rich-target.js`
	// then we can pass into this script, from here it will deploy to the hack script
	// to every reachable host, and all of them will hack the target
	const hackScript = "share-computer.js";

	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

	const hackScriptRam = ns.getScriptRam(hackScript);
	while (true) {
		const hosts = getNetworkNodes(ns);
		const length = hosts.length;
		for (var i = 0; i < length; i++) {
			const host = hosts[i];
			const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(host) / hackScriptRam));
			if (host.includes("pserv")) {
				if (!ns.isRunning(hackScript, host)) {
					await ns.scp(hackScript, host);
					ns.scriptKill(hackScript, host);
					ns.exec(hackScript, host, maxThreads);
				}
			}
		}
		await ns.sleep(10000);
	}
}