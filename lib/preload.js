const { contextBridge, ipcRenderer, webFrame } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	setStartCore: () => ipcRenderer.send('set-start-core'),
	checkForUpdate: () => ipcRenderer.send('check-for-update'),
	showMyMenu: () => ipcRenderer.send('show-my-menu'),
	focusApp: () => ipcRenderer.send('focus-app'),
	clearMyCache: () => ipcRenderer.send('clear-all-cache'),
	clearCache() {
		webFrame.clearCache()
	},
})