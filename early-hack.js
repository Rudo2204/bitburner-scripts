/** @param {NS} ns */
export async function main(ns) {
	// you want to target the one which the most amount of money
	// which we can get from `find-rich-target.js`
	var target = ns.args[0];
	var moneyThreshold = ns.getServerMaxMoney(target) * 75 / 100;
	var securityThreshold = ns.getServerMinSecurityLevel(target) + 5;

	while(true) {
		if (ns.getServerSecurityLevel(target) > securityThreshold) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}