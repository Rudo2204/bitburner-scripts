const homeServer = "home";

/** @param {NS} ns */
export function canHack(ns, host, cracks) {
	if (ns.hasRootAccess(host)) {
		return true;
	}

	const playerHackingLevel = ns.getHackingLevel();
	const serverHackRequiredLevel = ns.getServerRequiredHackingLevel(host);

	const requiredPorts = ns.getServerNumPortsRequired(host);
	var myCracksCount = 0;
	for (const file of Object.keys(cracks)) {
		if (ns.fileExists(file, homeServer)) {
			myCracksCount += 1;
		}
	}
	return (playerHackingLevel >= serverHackRequiredLevel && myCracksCount >= requiredPorts);
}

/** @param {NS} ns **/
export function penetrate(ns, host, cracks) {
	ns.print("Penetrating " + host);
	for (const file of Object.keys(cracks)) {
		if (ns.fileExists(file, homeServer)) {
			const runScript = cracks[file];
			runScript(host);
		}
	}
}

/** @param {NS} ns **/
export function getRootAccess(ns, host, cracks) {
	const requiredPorts = ns.getServerNumPortsRequired(host);
	if (requiredPorts > 0) {
		penetrate(ns, host, cracks);
	}
	ns.print("Gaining root access on " + host);
	ns.nuke(host);
}

/** @param {NS} ns **/
export function getNetworkNodes(ns) {
	var visited = {};
	var stack = [];
	const origin = ns.getHostname(homeServer);
	stack.push(origin);

	while (stack.length > 0) {
		const node = stack.pop();
		if (!visited[node]) {
			visited[node] = node;
			const neighbours = ns.scan(node);
			for (var i = 0; i < neighbours.length; i++) {
				const child = neighbours[i];
				if (visited[child]) {
					continue;
				}
				stack.push(child);
			}
		}
	}

	// we only want the keys, as the value is the as the key
	return Object.keys(visited);
}

/** @param {NS} ns **/
export async function copyAndRunHackScript(ns, host, hackScript, target, cracks) {
	const hackScriptRam = ns.getScriptRam(hackScript);
	if (!ns.isRunning(hackScript, host, target) && canHack(ns, host, cracks)) {
		const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(host) / hackScriptRam));
		if (maxThreads == 0) {
			ns.print(host, " has too little ram, skipping...");
			return;
		}
		ns.print("Copying hackScript to server: " + host);
		await ns.scp(hackScript, host);
		ns.scriptKill(hackScript, host);
		ns.exec(hackScript, host, maxThreads, target);
	}
}

/** @param {NS} ns **/
export function getThresholds(ns, node) {
	var moneyThresh = ns.getServerMaxMoney(node) * 0.75;
	var secThresh = ns.getServerMinSecurityLevel(node) + 5;
	return {
		moneyThresh,
		secThresh
	}
}

/** @param {NS} ns **/
export function hasRam(ns, server, scriptRam, useMax = false) {
	var maxRam = ns.getServerMaxRam(server);
	var usedRam = ns.getServerUsedRam(server);
	var ramAvail = useMax ? maxRam : maxRam - usedRam;
	return ramAvail > scriptRam;
}