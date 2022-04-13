/** @param {NS} ns */
export function calculateThreads(ns, host, target, percentHack) {
	var player = ns.getPlayer();
	player.hacking = 9999; // assume we can hack everything
	var serv = ns.getServer(target);
	// assume min security
	serv.hackDifficulty = serv.minDifficulty;

	const coreCounts = host == "home" ? 5 : ns.getServer(host).cpuCores;

	const t = ns.formulas.hacking.hackPercent(serv, player);
	const hackThreads = Math.floor(percentHack /t);
	const weakenThreads_1 = Math.ceil(hackThreads/25);


	var growthThreads = 0;
	var growPerc = ns.formulas.hacking.growPercent(serv, growthThreads, player, coreCounts);
	while (growPerc < 1/(1-t*hackThreads)) {
		growthThreads += 1;
		growPerc = ns.formulas.hacking.growPercent(serv, growthThreads, player, coreCounts);
	}
	const weakenThreads_2 = Math.ceil(growthThreads/12.5);

	return {
		hackThreads,
		weakenThreads_1,
		growthThreads,
		weakenThreads_2
	}

}

/** @param {NS} ns */
export function calculateDelaysNoFormulas(ns, target) {
	const t0 = 150;

	const hack_time = ns.getHackTime(target);
	const grow_time = ns.getGrowTime(target);
	const weak_time = ns.getWeakenTime(target);

	let period, depth;
	const max_depth = 10;
	const kW_max = Math.min(Math.floor(1 + (weak_time - 4 * t0) / (8 * t0)), max_depth);
	//const kW_max = Math . floor (1 + ( weak_time - 4 * t0 ) / (8 * t0 ));
	schedule: for (let kW = kW_max; kW >= 1; --kW) {
		const t_min_W = (weak_time + 4 * t0) / kW;
		const t_max_W = (weak_time - 4 * t0) / (kW - 1);
		const kG_min = Math.ceil(Math.max((kW - 1) * 0.8, 1));
		const kG_max = Math.floor(1 + kW * 0.8);
		for (let kG = kG_max; kG >= kG_min; --kG) {
			const t_min_G = (grow_time + 3 * t0) / kG
			const t_max_G = (grow_time - 3 * t0) / (kG - 1);
			const kH_min = Math.ceil(Math.max((kW - 1) * 0.25, (kG - 1) * 0.3125, 1));
			const kH_max = Math.floor(Math.min(1 + kW * 0.25, 1 + kG * 0.3125));
			for (let kH = kH_max; kH >= kH_min; --kH) {
				const t_min_H = (hack_time + 5 * t0) / kH;
				const t_max_H = (hack_time - 1 * t0) / (kH - 1);
				const t_min = Math.max(t_min_H, t_min_G, t_min_W);
				const t_max = Math.min(t_max_H, t_max_G, t_max_W);
				if (t_min <= t_max) {
					period = t_min;
					depth = kW;
					break schedule;
				}
			}
		}
	}

	const hack_delay = depth * period - 4 * t0 - hack_time;
	const weak_delay_1 = depth * period - 3 * t0 - weak_time;
	const grow_delay = depth * period - 2 * t0 - grow_time;
	const weak_delay_2 = depth * period - 1 * t0 - weak_time;

	return {
		period,
		hack_delay,
		weak_delay_1,
		grow_delay,
		weak_delay_2
	};
}

/** @param {NS} ns */
export function calculateDelaysFormulas(ns, target, max_level) {
	const t0 = 150;
	var serv = ns.getServer(target);
	serv.hackDifficulty = serv.minDifficulty;

	var player = ns.getPlayer();
	const hack_time_min = ns.formulas.hacking.hackTime(serv, player);
	const grow_time_min = ns.formulas.hacking.growTime(serv, player);
	const weak_time_min = ns.formulas.hacking.weakenTime(serv, player);

	player.hacking = max_level;
	const hack_time_max = ns.formulas.hacking.hackTime(serv, player);
	const grow_time_max = ns.formulas.hacking.growTime(serv, player);
	const weak_time_max = ns.formulas.hacking.weakenTime(serv, player);

	let period, depth;
	const max_depth = 10;
	const kW_max = Math.min(Math.floor(1 + (weak_time - 4 * t0) / (8 * t0)), max_depth);
	//const kW_max = Math . floor (1 + ( weak_time - 4 * t0 ) / (8 * t0 ));
	schedule: for (let kW = kW_max; kW >= 1; --kW) {
		const t_min_W = (weak_time_min + 4 * t0) / kW;
		const t_max_W = (weak_time_max - 4 * t0) / (kW - 1);
		const kG_min = Math.ceil(Math.max((kW - 1) * 0.8, 1));
		const kG_max = Math.floor(1 + kW * 0.8);
		for (let kG = kG_max; kG >= kG_min; --kG) {
			const t_min_G = (grow_time_min + 3 * t0) / kG
			const t_max_G = (grow_time_max - 3 * t0) / (kG - 1);
			const kH_min = Math.ceil(Math.max((kW - 1) * 0.25, (kG - 1) * 0.3125, 1));
			const kH_max = Math.floor(Math.min(1 + kW * 0.25, 1 + kG * 0.3125));
			for (let kH = kH_max; kH >= kH_min; --kH) {
				const t_min_H = (hack_time_min + 5 * t0) / kH;
				const t_max_H = (hack_time_max - 1 * t0) / (kH - 1);
				const t_min = Math.max(t_min_H, t_min_G, t_min_W);
				const t_max = Math.min(t_max_H, t_max_G, t_max_W);
				if (t_min <= t_max) {
					period = t_min;
					depth = kW;
					break schedule;
				}
			}
		}
	}

	const hack_delay = depth * period - 4 * t0 - hack_time;
	const weak_delay_1 = depth * period - 3 * t0 - weak_time;
	const grow_delay = depth * period - 2 * t0 - grow_time;
	const weak_delay_2 = depth * period - 1 * t0 - weak_time;

	return {
		period,
		hack_delay,
		weak_delay_1,
		grow_delay,
		weak_delay_2
	};
}