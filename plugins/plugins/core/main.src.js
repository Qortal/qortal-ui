import { parentEpml } from './connect'
import './streams/streams'

let config = {}
let haveRegisteredNodeManagement = false

parentEpml.ready().then(() => {
	// Urls for plugins
	let pluginUrlsConf = [
		{
			url: 'wallet',
			domain: 'core',
			page: 'wallet/index.html',
			title: 'Wallets',
			icon: 'vaadin:wallet',
			mwcicon: 'account_balance_wallet',
			pluginNumber: 'plugin-kyhKaCIAZH',
			menus: [],
			parent: false
		},
		{
			url: 'sponsorship-list',
			domain: 'core',
			page: 'sponsorship-list/index.html',
			title: 'Sponsorship List',
			icon: 'vaadin:list-ol',
			mwcicon: 'format_list_numbered',
			pluginNumber: 'plugin-YxcLlHkgBl',
			menus: [],
			parent: false
		},
		{
			url: 'trade-portal',
			domain: 'core',
			page: 'trade-portal/index.html',
			title: 'Trade Portal',
			icon: 'vaadin:bullets',
			mwcicon: 'format_list_bulleted',
			pluginNumber: 'plugin-zJoESuTpMG',
			menus: [],
			parent: false
		},
		{
			url: 'trade-bot-portal',
			domain: 'core',
			page: 'trade-bot/index.html',
			title: 'Auto Buy',
			icon: 'vaadin:calc-book',
			mwcicon: 'shop',
			pluginNumber: 'plugin-mwPkCdVHsb',
			menus: [],
			parent: false
		},
		{
			url: 'q-chat',
			domain: 'core',
			page: 'q-chat/index.html',
			title: 'Q-Chat',
			icon: 'vaadin:chat',
			mwcicon: 'forum',
			pluginNumber: 'plugin-qhsyOnpRhT',
			menus: [],
			parent: false
		},
		{
			url: 'name-registration',
			domain: 'core',
			page: 'name-registration/index.html',
			title: 'Name Registration',
			icon: 'vaadin:user-check',
			mwcicon: 'manage_accounts',
			pluginNumber: 'plugin-qCmtXAQmtu',
			menus: [],
			parent: false
		},
		{
			url: 'reward-share',
			domain: 'core',
			page: 'reward-share/index.html',
			title: 'Reward Share',
			icon: 'vaadin:share-square',
			mwcicon: 'ios_share',
			pluginNumber: 'plugin-PWZGtSxbPX',
			menus: [],
			parent: false
		},
		{
			url: 'group-management',
			domain: 'core',
			page: 'group-management/index.html',
			title: 'Group Management',
			icon: 'vaadin:group',
			mwcicon: 'group',
			pluginNumber: 'plugin-fJZNpyLGTl',
			menus: [],
			parent: false
		},
		{
			url: 'minting',
			domain: 'core',
			page: 'minting-info/index.html',
			title: 'Minting Details',
			icon: 'vaadin:info-circle',
			mwcicon: 'info_outline',
			pluginNumber: 'plugin-iqKYTJzlcM',
			menus: [],
			parent: false
		},
		{
			url: 'become-minter',
			domain: 'core',
			page: 'become-minter/index.html',
			title: 'Become a Minter',
			icon: 'vaadin:thumbs-up',
			mwcicon: 'thumb_up',
			pluginNumber: 'plugin-dVbRYnJNTs',
			menus: [],
			parent: false
		},
		{
			url: 'overview-page',
			domain: 'core',
			page: 'overview-page/index.html',
			title: 'Overview Page',
			icon: 'vaadin:info-circle',
			mwcicon: 'home',
			pluginNumber: 'plugin-OgcWeXBWBt',
			menus: [],
			parent: false
		},
		{
			url: 'qapps',
			domain: 'core',
			page: 'q-app/index.html',
			title: 'Q-Apps',
			icon: 'vaadin:external-browser',
			mwcicon: 'apps',
			pluginNumber: 'plugin-MpiMASnQsT',
			menus: [],
			parent: false
		},
		{
			url: 'websites',
			domain: 'core',
			page: 'q-website/index.html',
			title: 'Websites',
			icon: 'vaadin:desktop',
			mwcicon: 'desktop_mac',
			pluginNumber: 'plugin-shITeUVkLG',
			menus: [],
			parent: false
		},
		{
			url: 'lottery',
			domain: 'core',
			page: 'qortal-lottery/index.html',
			title: 'Qortal Lottery',
			icon: 'vaadin:ticket',
			mwcicon: 'token',
			pluginNumber: 'plugin-TgHRtXRxit',
			menus: [],
			parent: false
		},
		{
			url: 'data-management',
			domain: 'core',
			page: 'data-management/index.html',
			title: 'Data Management',
			icon: 'vaadin:database',
			mwcicon: 'storage',
			pluginNumber: 'plugin-QtaXNXHvRg',
			menus: [],
			parent: false
		},
		{
			url: 'names-market',
			domain: 'core',
			page: 'names-market/index.html',
			title: 'Names Market',
			icon: 'vaadin:shop',
			mwcicon: 'store',
			pluginNumber: 'plugin-VVPhpHMnKM',
			menus: [],
			parent: false
		},
		{
			url: 'puzzles',
			domain: 'core',
			page: 'puzzles/index.html',
			title: 'Puzzles',
			icon: 'vaadin:puzzle-piece',
			mwcicon: 'extension',
			pluginNumber: 'plugin-wCGRmXRxht',
			menus: [],
			parent: false
		}
	]

	const registerPlugins = (pluginInfo) => {
		parentEpml.request('registerUrl', pluginInfo)
	}

	const checkNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]

	parentEpml.subscribe('config', (c) => {
		config = JSON.parse(c)

		// Only register node management if node management is enabled and it hasn't already been registered
		if (!haveRegisteredNodeManagement && checkNode.enableManagement) {
			haveRegisteredNodeManagement = true

			let nodeManagementConf = {
				url: 'node-management',
				domain: 'core',
				page: 'node-management/index.html',
				title: 'Node Management',
				icon: 'vaadin:cloud',
				mwcicon: 'cloud',
				pluginNumber: 'plugin-TGAunWeWLU',
				menus: [],
				parent: false
			}

			let _pluginUrlsConf = [...pluginUrlsConf, nodeManagementConf]

			registerPlugins(_pluginUrlsConf)
		} else {
			registerPlugins(pluginUrlsConf)
		}
	})
})