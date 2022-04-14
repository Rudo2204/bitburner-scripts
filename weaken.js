/** @param {NS} ns */
export async function main(ns) {
	const delay = ns.args[0];
	const target = ns.args[1];
	const threads = ns.args[2];
	if (delay && delay > 0) {
		await ns.sleep(delay);
	}

	await ns.weaken(target, { threads, stock: false });
	ns.exit()
}