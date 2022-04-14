/** @param {NS} ns */
export async function main(ns) {
	const delay = ns.args[0];
	const target = ns.args[1];
	if (delay && delay > 0) {
		await ns.sleep(delay);
	}

	await ns.hack(target);
	ns.exit()
}