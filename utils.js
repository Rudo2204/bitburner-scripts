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
export async function copyAndRunScript(ns, host, script, target, cracks) {
	const scriptRam = ns.getScriptRam(script);
	if (!ns.isRunning(script, host, target) && canHack(ns, host, cracks)) {
		const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(host) / scriptRam));
		if (maxThreads == 0) {
			ns.print(host, " has too little ram, skipping...");
			return;
		}
		ns.print("Copying script to server: " + host);
		await ns.scp(script, host);
		ns.scriptKill(script, host);
		ns.exec(script, host, maxThreads, target);
	}
}

/** @param {NS} ns **/
export function getAvailableRam(ns, server) {
	return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
}