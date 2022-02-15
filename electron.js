const { app, BrowserWindow, ipcMain, Menu, Notification, Tray, nativeImage, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const server = require('./server.js');
const log = require('electron-log');
const path = require('path');

// THOUGHTS: Make this APP more modularize and platform agnostic...

process.env['APP_PATH'] = app.getAppPath();

autoUpdater.logger = log;
log.info('App starting...');

const editMenu = Menu.buildFromTemplate([
	{
		label: "Qortal", 
		submenu: [{
			label: "Quit", 
			click() {
				app.quit();
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
]);

Menu.setApplicationMenu(editMenu);

let myWindow = null;

// TODO: Move the Tray function into another file (maybe Tray.js) -_-
// const tray = new Tray(nativeImage.createEmpty());

const APP_ICON = path.join(__dirname, 'img', 'icons');

const iconPath = () => {
	return APP_ICON + (process.platform === 'win32' ? '/ico/256x256.ico' : '/png/256x256.png');
};

function createWindow() {
	myWindow = new BrowserWindow({
		backgroundColor: '#eee',
		width: 1280,
		height: 720,
		minWidth: 700,
		minHeight: 640,
		icon: iconPath(),
		title: "Qortal",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			partition: 'persist:webviewsession',
			enableRemoteModule: false,
			sandbox: true
		},
		show: false
	})
	myWindow.maximize();
	myWindow.show();
	myWindow.loadURL('http://localhost:12388/app/wallet')
	myWindow.on('closed', function () {
		myWindow = null
	})
}

const createTray = () => {
	let myTray = new Tray(path.join(__dirname, 'img', 'icons', 'png', '32x32.png'))
	const contextMenu = Menu.buildFromTemplate([{
		label: "Quit", click() {
			myTray.destroy();
			app.quit();
		},
	}])
	myTray.setTitle("QORTAL UI")
	myTray.setToolTip("QORTAL UI")
	myTray.setContextMenu(contextMenu)
}

const isLock = app.requestSingleInstanceLock();

if (!isLock) {
	app.quit()
} else {
	app.on('second-instance', (event, cmd, dir) => {
		if (myWindow) {
			if (myWindow.isMinimized()) myWindow.restore()
			myWindow.focus()
		}
	})
	app.allowRendererProcessReuse = true
	app.on('ready', () => {
		createWindow();
		createTray();
		if (process.platform === 'win32') {
			app.setAppUserModelId("org.qortal.QortalUI");
		}
		autoUpdater.checkForUpdatesAndNotify();
	})
	app.on('window-all-closed', function () {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	})
	app.on('activate', function () {
		if (myWindow === null) {
			createWindow();
			createTray();
		}
	})
	ipcMain.on('app_version', (event) => {
		log.info(app.getVersion());
		mainWindow.webContents.send('app_version', { version: app.getVersion() });
	});
	autoUpdater.on('update-available', () => {
		const n = new Notification({
			title: 'Update Available!',
			body: 'It will be downloaded ⌛️ in the background!'
		})
        	n.show();
	})
	autoUpdater.on('update-downloaded', (event) => {
		const dialogOpts = {
			type: 'info',
			buttons: ['Restart now', 'Install after next restart'],
			title: 'Update available',
			detail: 'A new Qortal UI version has been downloaded. Click RESTART NOW to apply update, or INSTALL AFTER NEXT RESTART to install after next start.'
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
			title: 'Error while Updating...',
			body: err
		})
		n.show();
	})
}
