const process = require("process");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
const Tomcat = require("tomcat-deploy");
const path = require("path");
const { resolve } = path;
const config = require(path.join(process.cwd(), "config.json"));

// ----- CONFIG ----

const profileSelect = config.profileSelect;
const contextName = config.contextName;
const folder = config.folder;
const runningMode = config.runningMode;

// ------- PROFILES --------

const profiles = config.profiles;

// --------------------

const configs = { ...profiles[profileSelect] };

const deployPath = `/${contextName}`;
const file = resolve(`${folder}`, `${contextName}.war`);

const processer = async config => {
	await Tomcat.query(config)
		.then(async running => {
			if (running) {
				console.log(
					`Found TomcatServer @ ${config.hostname}:${
						config.port
					} and Deploying ..`
				);
				await Tomcat.redeploy(file, { ...config, path: deployPath }).then(
					success => {
						if (success) {
							console.log(
								`[${contextName}] PORT ${
									config.port
								} has Deployed See result @ http://${config.hostname}:${
									config.port
								}/${deployPath}`
							);
						}
					}
				);
			}
		})
		.catch(err => {
			console.log(
				`Not Found ! TomcatServer @ ${config.hostname}:${config.port}`
			);
		});
};

console.log(`\nDeployment [${contextName}] Starting .. `);

Promise.all([
	(() => {
		if (runningMode == "queue") {
			let runningNumber = 0;
			const running = async (port = configs.ports[runningNumber]) => {
				if (port === undefined) return false;
				await processer({ ...configs, port });
				runningNumber++;
				await running();
				return Promise.resolve();
			};
			return running();
		} else {
			return new Promise(resolve => {
				Promise.all(
					[].concat(configs.ports).map(async port => {
						return Promise.resolve(processer({ ...configs, port }));
					})
				).then(() => {
					return resolve();
				});
			});
		}
	})()
]).then(() => {
	console.log("--- Finished --- \nPress any key for exit");
	rl.question("", () => {
		rl.close();
	});
});
