import { parentEpml } from './connect.js';
import './streams/streams.js';

let config = {};
let haveRegisteredNodeManagement = false;

parentEpml.ready().then(() => {
	// pluginUrlsConf
	let pluginUrlsConf = [
		{
			url: 'minting',
			domain: 'core',
			page: 'minting/index.html',
			title: 'Minting Details',
			icon: 'vaadin:info-circle',
			menus: [],
			parent: false,
		},
		{
			url: 'become-minter',
			domain: 'core',
			page: 'become-minter/index.html',
			title: 'Become a Minter',
			icon: 'vaadin:info-circle',
			menus: [],
			parent: false,
		},
		{
			url: 'sponsorship-list',
			domain: 'core',
			page: 'sponsorship-list/index.html',
			title: 'Become a Minter',
			icon: 'vaadin:info-circle',
			menus: [],
			parent: false,
		},
		{
			url: 'wallet',
			domain: 'core',
			page: 'wallet/index.html',
			title: 'Wallet',
			icon: 'vaadin:wallet',
			menus: [],
			parent: false,
		},
		{
			url: 'trade-portal',
			domain: 'core',
			page: 'trade-portal/index.html',
			title: 'Trade Portal',
			icon: 'vaadin:bullets',
			menus: [],
			parent: false,
		},
		{
			url: 'trade-bot-portal',
			domain: 'core',
			page: 'trade-bot/index.html',
			title: 'Auto Buy',
			icon: 'vaadin:calc-book',
			menus: [],
			parent: false,
		},
		{
			url: 'reward-share',
			domain: 'core',
			page: 'reward-share/index.html',
			title: 'Reward Share',
			icon: 'vaadin:share-square',
			menus: [],
			parent: false,
		},
		{
			url: 'name-registration',
			domain: 'core',
			page: 'name-registration/index.html',
			title: 'Name Registration',
			icon: 'vaadin:user-check',
			menus: [],
			parent: false,
		},
		{
			url: 'names-market',
			domain: 'core',
			page: 'names-market/index.html',
			title: 'Names Market',
			icon: 'vaadin:user-check',
			menus: [],
			parent: false,
		},
		{
			url: 'websites',
			domain: 'core',
			page: 'qdn/index.html',
			title: 'Websites',
			icon: 'vaadin:desktop',
			menus: [],
			parent: false,
		},
		{
			url: 'data-management',
			domain: 'core',
			page: 'qdn/data-management/index.html',
			title: 'Data Management',
			icon: 'vaadin:database',
			menus: [],
			parent: false,
		},
		{
			url: 'q-chat',
			domain: 'core',
			page: 'messaging/q-chat/index.html',
			title: 'Q-Chat',
			icon: 'vaadin:chat',
			menus: [],
			parent: false,
		},
		{
			url: 'group-management',
			domain: 'core',
			page: 'group-management/index.html',
			title: 'Group Management',
			icon: 'vaadin:group',
			menus: [],
			parent: false,
		},
		{
			url: 'puzzles',
			domain: 'core',
			page: 'puzzles/index.html',
			title: 'Puzzles',
			icon: 'vaadin:puzzle-piece',
			menus: [],
			parent: false,
		},
	];

	const registerPlugins = (pluginInfo) => {
		parentEpml.request('registerUrl', pluginInfo);
	};

	const checkNode =
		window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
		];

	parentEpml.subscribe('config', (c) => {
		config = JSON.parse(c);

		// Only register node management if node management is enabled and it hasn't already been registered
		if (!haveRegisteredNodeManagement && checkNode.enableManagement) {
			haveRegisteredNodeManagement = true;

			let nodeManagementConf = {
				url: 'node-management',
				domain: 'core',
				page: 'node-management/index.html',
				title: 'Node Management',
				icon: 'vaadin:cloud',
				menus: [],
				parent: false,
			};

			let _pluginUrlsConf = [...pluginUrlsConf, nodeManagementConf];
			registerPlugins(_pluginUrlsConf);
		} else {
			registerPlugins(pluginUrlsConf);
		}
	});
});