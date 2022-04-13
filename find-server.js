/** @param {NS} ns */
export function main(ns) {
	// see 3.5 for this algo
	// https://www.baeldung.com/cs/dfs-vs-bfs-vs-dijkstra
	const target = ns.args[0];

	function find_path_to_target(ns, target) {
		const searched = [];
		const path = {}
		const queue = [];

		const origin = ns.getHostname();

		path[origin] = [origin];
		queue.push(origin);

		while (queue.length > 0) {
			const node = queue.pop();
			searched.push(node);

			const neighbours = ns.scan(node);
			for (var i = 0; i < neighbours.length; i++) {
				const child = neighbours[i];
				if (!searched.includes(child) && !queue.includes(child)) {
					// YOU HAVE TO DEEP COPY IT ELSE IT WILL MODIFY YOUR PATH
					// HOLY SHIT JAVASCRIPT MAN
					const path_to_child = JSON.parse(JSON.stringify(path[node]));
					path_to_child.push(child);
					path[child] = path_to_child;
					if (child == target) {
						return path[child];
					}
					queue.push(child);
				}
			}
		}
	}

	const path = find_path_to_target(ns, target);
	ns.tprint(path);
}