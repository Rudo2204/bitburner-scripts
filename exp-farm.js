import {getNetworkNodes, canHack} from "./utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ///** @param {NS} ns */
    //export async function main(ns) {
    //  while (true) {
    //      await ns.weaken(ns.args[0]);
    //  }
    //}
    //
    // either foodnstuff + weaken-farm-exp.js
    // or joesguns + grow

    const target = "joesguns"; // best server to hack exp farm
    //const target = "foodnstuff"; // best server to hack exp farm
    const script = "joesguns-grow-exp-farm.js";
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
		ns.print("Copying script to server: " + node);
		await ns.scp(script, node);
		ns.scriptKill(script, node);
		ns.exec(script, node, maxThreads, target);
    }
}
