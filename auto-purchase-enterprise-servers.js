/** @param {NS} ns */
export async function main(ns) {
	var serverPrefix = "pserv-";
	ns.disableLog("ALL");

	const homeServer = "home";
	var amountRamToBuy = Math.pow(2, 3); // starts with 8 GB then scale up * 2 in main
	const maxRam = ns.getPurchasedServerMaxRam(); // 2*20

	const serverLimit = ns.getPurchasedServerLimit();

	function canBuyServer() {
		return ns.getServerMoneyAvailable(homeServer) >= ns.getPurchasedServerCost(amountRamToBuy);
	}

	function shutdownServer(server) {
		ns.killall(server);
		ns.deleteServer(server);
	}

	async function buyServer(server_name) {
		while (!canBuyServer()) {
			await ns.sleep(10000);
		}
		ns.purchaseServer(server_name, amountRamToBuy);
	}

	async function upgradeServer(server) {
		const serverMaxRam = ns.getServerMaxRam(server); // the amount of RAM on the server
		if (serverMaxRam < amountRamToBuy) {
			while (!canBuyServer()){
				await ns.sleep(10000);
			}
			shutdownServer(server);
			await buyServer(server);
		}
	}

	async function autoUpgradeServer() {
		var i = 0;
		while (i < serverLimit) {
			var server = serverPrefix + i;
			if (ns.serverExists(server)) {
				ns.print("Upgrading server ", server, " to ", amountRamToBuy, " GB RAM");
				await upgradeServer(server);
				i += 1;
			} else {
				ns.print("Buying server ", server, " with ", amountRamToBuy, " GB RAM");
				await buyServer(server);
				i += 1;
			}
		}
	}

	while(true) {
		await autoUpgradeServer();
		if (amountRamToBuy == maxRam) {
			break;
		}
		// move up next ram tier
		var newAmountRamToBuy = amountRamToBuy * 2;
		if (newAmountRamToBuy > maxRam) {
			newAmountRamToBuy = maxRam;
		} else {
			amountRamToBuy = newAmountRamToBuy;
		}
	}
}