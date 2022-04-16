import {copyAndRunScript} from "./utils.js";
/** @param {NS} ns **/
export async function main(ns) {
    const shareScript = "share.js";
    const shareScriptRam = 4;
	const cracks = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};

    const pservs = ns.getPurchasedServers();
    for (var i = 0; i < pservs.length; i++) {
        var serv = pservs[i];
        await copyAndRunScript(ns, serv, shareScript, "", cracks);
    }
}
