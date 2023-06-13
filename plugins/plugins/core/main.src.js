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
			mwcicon: 'info_outline',
			menus: [],
			parent: false,
		},
		{
			url: 'become-minter',
			domain: 'core',
			page: 'become-minter/index.html',
			title: 'Become a Minter',
			icon: 'vaadin:thumbs-up',
			mwcicon: 'thumb_up',
			menus: [],
			parent: false,
		},
		{
			url: 'sponsorship-list',
			domain: 'core',
			page: 'sponsorship-list/index.html',
			title: 'Sponsorship List',
			icon: 'vaadin:list-ol',
			mwcicon: 'format_list_numbered',
			menus: [],
			parent: false,
		},
		{
			url: 'wallet',
			domain: 'core',
			page: 'wallet/index.html',
			title: 'Wallets',
			icon: 'vaadin:wallet',
			mwcicon: 'account_balance_wallet',
			menus: [],
			parent: false,
		},
		{
			url: 'trade-portal',
			domain: 'core',
			page: 'trade-portal/index.html',
			title: 'Trade Portal',
			icon: 'vaadin:bullets',
			mwcicon: 'format_list_bulleted',
			menus: [],
			parent: false,
		},
		{
			url: 'trade-bot-portal',
			domain: 'core',
			page: 'trade-bot/index.html',
			title: 'Auto Buy',
			icon: 'vaadin:calc-book',
			mwcicon: 'shop',
			menus: [],
			parent: false,
		},
		{
			url: 'reward-share',
			domain: 'core',
			page: 'reward-share/index.html',
			title: 'Reward Share',
			icon: 'vaadin:share-square',
			mwcicon: 'ios_share',
			menus: [],
			parent: false,
		},
		{
			url: 'q-chat',
			domain: 'core',
			page: 'messaging/q-chat/index.html',
			title: 'Q-Chat',
			icon: 'vaadin:chat',
			mwcicon: 'forum',
			menus: [],
			parent: false,
		},
		{
			url: 'name-registration',
			domain: 'core',
			page: 'name-registration/index.html',
			title: 'Name Registration',
			icon: 'vaadin:user-check',
			mwcicon: 'manage_accounts',
			menus: [],
			parent: false,
		},
		{
			url: 'names-market',
			domain: 'core',
			page: 'names-market/index.html',
			title: 'Names Market',
			icon: 'vaadin:shop',
			mwcicon: 'store',
			menus: [],
			parent: false,
		},
		{
			url: 'websites',
			domain: 'core',
			page: 'qdn/index.html',
			title: 'Websites',
			icon: 'vaadin:desktop',
			mwcicon: 'desktop_mac',
			menus: [],
			parent: false,
		},
		{
			url: 'qapps',
			domain: 'core',
			page: 'q-app/index.html',
			title: 'Q-Apps',
			icon: 'vaadin:external-browser',
			mwcicon: 'open_in_browser',
			menus: [],
			parent: false,
		},
		{
			url: 'group-management',
			domain: 'core',
			page: 'group-management/index.html',
			title: 'Group Management',
			icon: 'vaadin:group',
			mwcicon: 'group',
			menus: [],
			parent: false,
		},
		{
			url: 'data-management',
			domain: 'core',
			page: 'qdn/data-management/index.html',
			title: 'Data Management',
			icon: 'vaadin:database',
			mwcicon: 'storage',
			menus: [],
			parent: false,
		},
		{
			url: 'puzzles',
			domain: 'core',
			page: 'puzzles/index.html',
			title: 'Puzzles',
			icon: 'vaadin:puzzle-piece',
			mwcicon: 'extension',
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
				mwcicon: 'cloud',
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