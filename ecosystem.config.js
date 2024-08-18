module.exports = {
	apps: [
		{
			name: "strapi",
			script: "npm",
			args: "start",
			cwd: "./api", // Path to the Strapi application
			instances: "max", // Number of instances to run
			exec_mode: "cluster", // Run in cluster mode
			env: {
				NODE_ENV: "production",
				PORT: 1337,
				// Add other environment variables if needed
			},
			log_file: "./logs/strapi-combined.log", // Path to log file
			out_file: "./logs/strapi-out.log", // Path to standard output log
			error_file: "./logs/strapi-error.log", // Path to error log
			merge_logs: true, // Merge all logs into one
		},
		{
			name: "astro",
			script: "npm",
			args: "start",
			cwd: "./client", // Path to the Astro application
			instances: "max", // Number of instances to run
			exec_mode: "cluster", // Run in cluster mode
			env: {
				NODE_ENV: "production",
				PORT: 4321,
				// Add other environment variables if needed
			},
			log_file: "./logs/astro-combined.log", // Path to log file
			out_file: "./logs/astro-out.log", // Path to standard output log
			error_file: "./logs/astro-error.log", // Path to error log
			merge_logs: true, // Merge all logs into one
		},
	],
};
