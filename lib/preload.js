const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	setStartCore: () => ipcRenderer.send('set-start-core'),
	checkForUpdate: () => ipcRenderer.send('check-for-update'),
	showMyMenu: () => ipcRenderer.send('show-my-menu')
})