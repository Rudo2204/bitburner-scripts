import {getNetworkNodes} from "./utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ///** @param {NS} ns */
    //export async function main(ns) {
    //  while (true) {
    //      await ns.weaken(ns.args[0]);
    //  }
    //}
    //
    // either target = foodnstuff + weaken-farm-exp.js
    // or target = joesguns + grow
    const target = "foodnstuff"; // best server to hack exp farm
    const script = "weaken-farm-exp.js";
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};
    var nodes = getNetworkNodes(ns);
    nodes = nodes.filter(node =>
        canHack(ns, target, cracks)
        && ns.getServerMaxRam(node) > 1.75
    );
    for (var i = 0; i < nodes.length; i++) {
        var serv = nodes[i];
		const maxThreads = parseInt(Math.floor(ns.getServerMaxRam(serv) / 1.75));
		ns.print("Copying script to server: " + host);
		await ns.scp(script, host);
		ns.scriptKill(script, host);
		ns.exec(script, host, maxThreads, target);
    }
}
