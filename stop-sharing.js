import { getNetworkNodes } from "./utils.js";

/** @param {NS} ns */
export async function main(ns) {
	const hackScript = "share-computer.js";

	const hosts = getNetworkNodes(ns);
	const length = hosts.length;
	for (var i = 0; i < length; i++) {
		const host = hosts[i];
		if (host.includes("pserv") || host.includes("home")) {
			if (ns.isRunning(hackScript, host)) {
				ns.scriptKill(hackScript, host);
			}
		}
	}

}