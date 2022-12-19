const { app, BrowserWindow, ipcMain, Menu, Notification, Tray, nativeImage, dialog, webContents, nativeTheme } = require('electron')
const { autoUpdater } = require('electron-updater')
const server = require('./server.js')
const log = require('electron-log')
const path = require('path')
const i18n = require("./lib/i18n.js")

app.disableHardwareAcceleration()
app.enableSandbox()

process.env['APP_PATH'] = app.getAppPath()

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

const editMenu = Menu.buildFromTemplate([
	{
		label: "Qortal", 
		submenu: [{
			label: "Quit", 
			click() {
				app.quit()
			}
		}]
	},
	{
		label: "Edit",
		submenu: [
			{label: "Undo", accelerator: "CommandOrControl+Z", selector: "undo:"},
			{label: "Redo", accelerator: "CommandOrControl+Shift+Z", selector: "redo:"},
			{type: "separator"},
			{label: "Cut", accelerator: "CommandOrControl+X", selector: "cut:"},
			{label: "Copy", accelerator: "CommandOrControl+C", selector: "copy:"},
			{label: "Paste", accelerator: "CommandOrControl+V", selector: "paste:"},
			{label: "Select All", accelerator: "CommandOrControl+A", selector: "selectAll:"}
		]
	}
])

Menu.setApplicationMenu(editMenu)

function createWindow() {
	myWindow = new BrowserWindow({
		backgroundColor: '#eee',
		width: 1280,
		height: 720,
		minWidth: 700,
		minHeight: 640,
		icon: path.join(__dirname + '/img/icons/png/256x256.png'),
		title: "Qortal UI",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			nodeIntegrationInWorker: true,
			partition: 'persist:webviewsession',
			enableRemoteModule: false
		},
		show: false
	})
	myWindow.maximize()
	myWindow.show()
	myWindow.loadURL('http://localhost:12388/app/wallet')
	myWindow.on('closed', function () {
		myWindow = null
	})
	myWindow.on('minimize', function (event) {
		event.preventDefault()
		myWindow.hide()
	})
	ipcMain.handle('dark-mode:toggle', () => {
		if (nativeTheme.shouldUseDarkColors) {
			nativeTheme.themeSource = 'light'
		} else {
			nativeTheme.themeSource = 'dark'
		}
		return nativeTheme.shouldUseDarkColors
	})

	ipcMain.handle('dark-mode:system', () => {
		nativeTheme.themeSource = 'system'
	})
}

const createTray = () => {
	let myTray = new Tray(path.join(__dirname + '/img/icons/png/tray/tray.png'))
	const contextMenu = Menu.buildFromTemplate([
		{
			label: `Qortal UI v${app.getVersion()}`,
			enabled: false,
        	},
		{
			type: 'separator',
		},
		{
			label: i18n.__("electron_translate_1"),
			click: function () {
				myWindow.maximize()
				myWindow.show()
			},
		},
		{
			label: i18n.__("electron_translate_2"),
			click: function () {
				myTray.destroy()
				app.quit()
			},
		},
	])
	myTray.setTitle("QORTAL UI")
	myTray.setToolTip(`Qortal UI v${app.getVersion()}`)
	myTray.setContextMenu(contextMenu)
	myTray.on("double-click", () => myWindow.maximize() , myWindow.show())
}

const isLock = app.requestSingleInstanceLock()

if (!isLock) {
	app.quit()
} else {
	app.whenReady().then(() => {
		createWindow();
		createTray();
		if (process.platform === 'win32') {
			app.setAppUserModelId("org.qortal.QortalUI")
		}
		autoUpdater.checkForUpdatesAndNotify()
		setInterval(() => {
			autoUpdater.checkForUpdatesAndNotify()
		}, 1000 * 60 * 720)
		app.on('activate', function () {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow()
				createTray()
			}
		})
	})
	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	})
	ipcMain.on('app_version', (event) => {
		log.info(app.getVersion());
		mainWindow.webContents.send('app_version', { version: app.getVersion() })
	})
	autoUpdater.on('update-available', (event) => {
		const downloadOpts = {
			type: 'info',
			buttons: ['YES', 'NO'],
			title: i18n.__("electron_translate_3"),
			detail: i18n.__("electron_translate_4")
		}
		dialog.showMessageBox(downloadOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				autoUpdater.downloadUpdate()
				const dl = new Notification({
					title: i18n.__("electron_translate_11"),
					body: i18n.__("electron_translate_12")
				})
				dl.show()
			} else {
				return
			}
		})
	})
	autoUpdater.on('download-progress', (progressObj) => {
		myWindow.webContents.send('downloadProgress', progressObj)
	})
	autoUpdater.on('update-downloaded', (event) => {
		const dialogOpts = {
			type: 'info',
			buttons: [i18n.__("electron_translate_5"), i18n.__("electron_translate_6")],
			title: i18n.__("electron_translate_7"),
			message: i18n.__("electron_translate_8"),
			detail: i18n.__("electron_translate_9")
		}
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				autoUpdater.quitAndInstall()
			} else {
				return
			}
		})
	})
	autoUpdater.on('error', (err) => {
		const n = new Notification({
			title: i18n.__("electron_translate_10"),
			body: err
		})
		n.show()
	})
	process.on('uncaughtException', function (err) {
		log.info("***WHOOPS TIME****"+err)
	})
}
