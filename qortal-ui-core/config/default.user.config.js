const path = require('path')

const user = {
		// management can be enabled as explicit for public API servers when needed
	node: 0,
	knownNodes: [
		// Mainnet nodes
		{
			protocol: 'http',
			domain: '127.0.0.1',
			port: 12391,
			enableManagement: true,
		},
		{
			protocol: 'http',
			domain: 'node1.qortal.org',
			port: 12391,
			enableManagement: false,
		},
		{
			protocol: 'http',
			domain: 'node2.qortal.org',
			port: 12391,
			enableManagement: false,
		},
		// Testnet nodes
		{
			protocol: 'http',
			domain: '127.0.0.1',
			port: 62391,
			enableManagement: false,
		},
		{
			protocol: 'http',
			domain: 'node1.qortal.org',
			port: 62391,
			enableManagement: false,
		},
		{
			protocol: 'http',
			domain: 'node2.qortal.org',
			port: 62391,
			enableManagement: false,
		},
		
	],
	nodeSettings: {
		pingInterval: 10 * 1000, // (10 secs)
	},
	version: '1.6.2', // TODO: Set this dynamically...
	language: 'english', // default...english
	theme: 'light',
	server: {
		writeHosts: {
			enabled: true,
		},
		relativeTo: path.join(__dirname, '../'),
		primary: {
			domain: '0.0.0.0',
			address: '0.0.0.0',
			port: 12388,
			directory: './src/',
			page404: './src/404.html',
			host: '0.0.0.0',
		},
	},
	tls: {
		enabled: false,
		options: {
			key: '',
			cert: '',
		},
	},
	constants: {
		pollingInterval: 10000, // How long between checking for new unconfirmed transactions and new blocks (in milliseconds).
		workerURL: '/build/worker.js',
	},

	// Notification Settings (All defaults to true)
	notifications: {
		q_chat: {
			playSound: true,
			showNotification: true,
		},
		block: {
			playSound: true,
			showNotification: true,
		},
	},
}

module.exports = user
