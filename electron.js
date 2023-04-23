const { app, BrowserWindow, ipcMain, ipcRenderer, Menu, Notification, Tray, nativeImage, dialog, webContents, nativeTheme } = require('electron')
const { autoUpdater } = require('electron-updater')
const server = require('./server.js')
const log = require('electron-log')
const path = require('path')
const i18n = require('./lib/i18n.js')
const fs = require('fs')
const electronDl = require('electron-dl')
const extract = require('extract-zip')
const fetch = require('node-fetch')
const child = require('child_process').execFile
const exec = require('child_process').exec
const spawn = require('child_process').spawn

app.disableHardwareAcceleration()
app.enableSandbox()
electronDl()

process.env['APP_PATH'] = app.getAppPath()

const homePath = app.getPath('home')

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

log.info('App starting...')
log.info('App Platform is', process.platform)
log.info('Platform arch is', process.arch)

const winjar = String.raw`C:\Program Files\Qortal\qortal.jar`
const windir = String.raw`C:\Qortal`
const winurl = "https://github.com/Qortal/qortal/releases/latest/download/qortal.exe"
const winexe = "C:\\Qortal\\qortal.exe"
const startWinCore = "C:\\Program Files\\Qortal\\qortal.exe"

const zipdir = homePath
const zipfile = homePath + "/qortal.zip"
const zipurl = "https://github.com/Qortal/qortal/releases/latest/download/qortal.zip"

const qortaldir = homePath + "/qortal/"
const qortaljar = homePath + "/qortal/qortal.jar"
const qortalsettings = homePath + "/qortal/settings.json"

const javadir = homePath + "/jdk-17.0.2/"

const linjavax64url = "https://download.qortal.online/openjdk-17.0.2_linux-x64_bin.zip"
const linjavax64file = homePath + "/openjdk-17.0.2_linux-x64_bin.zip"
const linjavax64bindir = homePath + "/jdk-17.0.2/bin"
const linjavax64binfile = homePath + "/jdk-17.0.2/bin/java"

const linjavaarmurl = "https://download.qortal.online/openjdk-17.0.2_linux-arm_bin.zip"
const linjavaarmfile = homePath + "/openjdk-17.0.2_linux-arm_bin.zip"
const linjavaarmbindir = homePath + "/jdk-17.0.2/bin"
const linjavaarmbinfile = homePath + "/jdk-17.0.2/bin/java"

const linjavaarm64url = "https://download.qortal.online/openjdk-17.0.2_linux-arm64_bin.zip"
const linjavaarm64file = homePath + "/openjdk-17.0.2_linux-arm64_bin.zip"
const linjavaarm64bindir = homePath + "/jdk-17.0.2/bin"
const linjavaarm64binfile = homePath + "/jdk-17.0.2/bin/java"

const macjavax64url = "https://download.qortal.online/openjdk-17.0.2_macos-x64_bin.zip"
const macjavax64file = homePath + "/openjdk-17.0.2_macos-x64_bin.zip"
const macjavax64bindir = homePath + "/jdk-17.0.2/Contents/Home/bin"
const macjavax64binfile = homePath + "/jdk-17.0.2/Contents/Home/bin/java"

const macjavaaarch64url = "https://download.qortal.online/openjdk-17.0.2_macos-aarch64_bin.zip"
const macjavaaarch64file = homePath + "/openjdk-17.0.2_macos-aarch64_bin.zip"
const macjavaaarch64bindir = homePath + "/jdk-17.0.2/Contents/Home/bin"
const macjavaaarch64binfile = homePath + "/jdk-17.0.2/Contents/Home/bin/java"

const isRunning = (query, cb) => {
	let platform = process.platform
	let cmd = ''
	switch (platform) {
		case 'win32': cmd = `tasklist`; break
		case 'darwin': cmd = `ps -ax | grep [q]ortal.jar`; break
		case 'linux': cmd = `ps ax | grep [q]ortal.jar`; break
		default: break
	}
	exec(cmd, (err, stdout, stderr) => {
		cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1)
	})
}

async function downloadWindows() {
	let winLoader = new BrowserWindow({
		width: 500,
		height: 500,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		show: false
	})
	winLoader.loadFile(path.join(__dirname + '/splash/download.html'))

	winLoader.show()
	await electronDl.download(myWindow, winurl, {
		directory: windir,
		onProgress: function () { log.info("Starting Download Windows Installer") }
	})
	winLoader.destroy()
	child(winexe, function (err, data) {
		if (err) {
			log.info(err)
			return
		}
		log.info(data.toString())
	})
}

async function checkPort() {
	await fetch('http://localhost:12391/admin/info').catch(err => {
		return {
			ok: false,
			status: -1,
			statusText: 'Qortal Connect Failure',
		}
	}).then(checkResponseStatus)
}

async function checkResponseStatus(res) {
	if (res.ok) {
		return
	} else {
		await javaversion()
	}
}

async function javaversion() {
	var stderrChunks = []
	let checkJava = await spawn('java', ['-version'],{shell: true})
	if (process.platform === 'linux') {
		if (process.arch === 'x64') {
			if (fs.existsSync(linjavax64bindir)) {
				checkJava = await spawn(linjavax64binfile, ['-version'],{cwd: homePath, shell: true, maxBuffer: Infinity})
			}
		} else if (process.arch === 'arm64') {
			if (fs.existsSync(linjavaarm64bindir)) {
				checkJava = await spawn(linjavaarm64binfile, ['-version'],{cwd: homePath, shell: true, maxBuffer: Infinity})
			}
		} else if (process.arch === 'arm') {
			if (fs.existsSync(linjavaarmbindir)) {
				checkJava = await spawn(linjavaarmbinfile, ['-version'],{cwd: homePath, shell: true, maxBuffer: Infinity})
			}
		}
	} else if (process.platform === 'darwin') {
		if (process.arch === 'x64') {
			if (fs.existsSync(macjavax64bindir)) {
				checkJava = await spawn(macjavax64binfile, ['-version'],{cwd: homePath, shell: true, maxBuffer: Infinity})
			}
		} else {
			if (fs.existsSync(macjavaaarch64bindir)) {
				checkJava = await spawn(macjavaaarch64file, ['-version'],{cwd: homePath, shell: true, maxBuffer: Infinity})
			}
		}
	}

	checkJava.stderr.on('data', (data) => {
		stderrChunks = stderrChunks.concat(data)
	})

	checkJava.stderr.on('end', () => {
		datres = Buffer.concat(stderrChunks).toString().split('\n')[0]
		var javaVersion = new RegExp('(java|openjdk) version').test(datres) ? datres.split(' ')[2].replace(/"/g, '') : false
		log.info("Java Version", javaVersion)
		if (javaVersion != false) {
			checkQortal()
		} else {
			const dialogOpts = {
				type: 'info',
				buttons: [i18n.__("electron_translate_23"), i18n.__("electron_translate_24")],
				title: i18n.__("electron_translate_25"),
				message: i18n.__("electron_translate_26"),
				detail: i18n.__("electron_translate_27")
			}
			dialog.showMessageBox(dialogOpts).then((returnValue) => {
				if (returnValue.response === 0) {
					installJava()
				} else {
					return
				}
			})
		}
	})
}

async function installJava() {
	let splashLoader = new BrowserWindow({
		width: 500,
		height: 500,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		show: false
	})
	splashLoader.loadFile(path.join(__dirname + '/splash/download.html'))

	if (process.platform === 'linux') {
		if (process.arch === 'x64') {
			try {
				splashLoader.show()
				await electronDl.download(myWindow, linjavax64url, {
					directory: homePath,
					onProgress: function () { log.info("Starting Download JAVA") }
				})
			} catch (err) {
				splashLoader.destroy()
				log.info('Download JAVA error', err)
			}
			splashLoader.destroy()
			unzipJavaX64Linux()
		} else if (process.arch === 'arm64') {
			try {
				splashLoader.show()
				await electronDl.download(myWindow, linjavaarm64url, {
					directory: homePath,
					onProgress: function () { log.info("Starting Download JAVA") }
				})
			} catch (err) {
				splashLoader.destroy()
				log.info('Download JAVA error', err)
			}
			splashLoader.destroy()
			unzipJavaArm64Linux()
		} else if (process.arch === 'arm') {
			try {
				splashLoader.show()
				await electronDl.download(myWindow, linjavaarmurl, {
					directory: homePath,
					onProgress: function () { log.info("Starting Download JAVA") }
				})
			} catch (err) {
				splashLoader.destroy()
				log.info('Download JAVA error', err)
			}
			splashLoader.destroy()
			unzipJavaArmLinux()
		}
	} else if (process.platform === 'darwin') {
		if (process.arch === 'x64') {
			try {
				splashLoader.show()
				await electronDl.download(myWindow, macjavax64url, {
					directory: homePath,
					onProgress: function () { log.info("Starting Download JAVA") }
				})
			} catch (err) {
				splashLoader.destroy()
				log.info('Download JAVA error', err)
			}
			splashLoader.destroy()
			unzipJavaX64Mac()
		} else {
			try {
				splashLoader.show()
				await electronDl.download(myWindow, macjavaaarch64url, {
					directory: homePath,
					onProgress: function () { log.info("Starting Download JAVA") }
				})
			} catch (err) {
				splashLoader.destroy()
				log.info('Download JAVA error', err)
			}
			splashLoader.destroy()
			unzipJavaAarch64Mac()
		}
	}
}

async function unzipJavaX64Linux() {
	try {
		await extract(linjavax64file, { dir: homePath })
		log.info('Unzip Java complete')
	} catch (err) {
		log.info('Unzip Java error', err)
	}
	chmodJava()
}

async function unzipJavaArm64Linux() {
	try {
		await extract(linjavaarm64file, { dir: homePath })
		log.info('Unzip Java complete')
	} catch (err) {
		log.info('Unzip Java error', err)
	}
	chmodJava()
}

async function unzipJavaArmLinux() {
	try {
		await extract(linjavaarmfile, { dir: homePath })
		log.info('Unzip Java complete')
	} catch (err) {
		log.info('Unzip Java error', err)
	}
	chmodJava()
}

async function unzipJavaX64Mac() {
	try {
		await extract(macjavax64file, { dir: homePath })
		log.info('Unzip Java complete')
	} catch (err) {
		log.info('Unzip Java error', err)
	}
	chmodJava()
}

async function unzipJavaAarch64Mac() {
	try {
		await extract(macjavaaarch64file, { dir: homePath })
		log.info('Unzip Java complete')
	} catch (err) {
		log.info('Unzip Java error', err)
	}
	chmodJava()
}

async function chmodJava() {
	try {
		await spawn(
			'chmod', ['-R', '+x', javadir],
			{ cwd: homePath, shell: true }
		)
	} catch (err) {
		log.info('chmod error', err)
	}
	removeJavaZip()
}

async function removeJavaZip() {
	if (process.platform === 'linux') {
		if (process.arch === 'x64') {
			try {
				await spawn(
					'rm', ['-rf', linjavax64file],
					{ cwd: homePath, shell: true }
				)
			} catch (err) {
				log.info('rm error', err)
			}
			checkQortal()
		} else if (process.arch === 'arm64') {
			try {
				await spawn(
					'rm', ['-rf', linjavaarm64file],
					{ cwd: homePath, shell: true }
				)
			} catch (err) {
				log.info('rm error', err)
			}
			checkQortal()
		} else if (process.arch === 'arm') {
			try {
				await spawn(
					'rm', ['-rf', linjavaarmfile],
					{ cwd: homePath, shell: true }
				)
			} catch (err) {
				log.info('rm error', err)
			}
			checkQortal()
		}
	} else if (process.platform === 'darwin') {
		if (process.arch === 'x64') {
			try {
				await spawn(
					'rm', ['-rf', macjavax64file],
					{ cwd: homePath, shell: true }
				)
			} catch (err) {
				log.info('rm error', err)
			}
			checkQortal()
		} else {
			try {
				await spawn(
					'rm', ['-rf', macjavaaarch64file],
					{ cwd: homePath, shell: true }
				)
			} catch (err) {
				log.info('rm error', err)
			}
			checkQortal()
		}
	}
}

function checkQortal() {
	if (fs.existsSync(qortaljar)) {
		isRunning('qortal.jar', (status) => {
			if (status == true) {
				log.info("Core is running, perfect !")
			} else {
				log.info("Core is not running, starting it !")
				const dialogOpts = {
					type: 'info',
					buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
					title: i18n.__("electron_translate_15"),
					message: i18n.__("electron_translate_16"),
					detail: i18n.__("electron_translate_17")
				}
				dialog.showMessageBox(dialogOpts).then((returnValue) => {
					if (returnValue.response === 0) {
						startQortal()
					} else {
						return
					}
				})
			}
		})
	} else {
		const dialogOpts = {
			type: 'info',
			buttons: [i18n.__("electron_translate_18"), i18n.__("electron_translate_19")],
			title: i18n.__("electron_translate_20"),
			message: i18n.__("electron_translate_21"),
			detail: i18n.__("electron_translate_22")
		}
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				downloadQortal()
			} else {
				return
			}
		})
	}
}

async function downloadQortal() {
	let qortalLoader = new BrowserWindow({
		width: 500,
		height: 500,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		show: false
	})
	qortalLoader.loadFile(path.join(__dirname + '/splash/download.html'))

	try {
		qortalLoader.show()
		await electronDl.download(myWindow, zipurl, {
			directory: zipdir,
			onProgress: function () { log.info("Starting Download Qortal") }
		})
	} catch (err) {
		qortalLoader.destroy()
		log.info('Download Qortal error', err)
	}
	qortalLoader.destroy()
	unzipQortal()
}

async function unzipQortal() {
	try {
		await extract(zipfile, { dir: zipdir })
		log.info('Unzip Qortal complete')
	} catch (err) {
		log.info('Unzip Qortal error', err)
	}
	chmodQortal()
}

async function chmodQortal() {
	try {
		await spawn(
			'chmod', ['-R', '+x', qortaldir],
			{ cwd: homePath, shell: true }
		)
	} catch (err) {
		log.info('chmod error', err)
	}
	removeQortalZip()
}

async function removeQortalZip() {
	try {
		await spawn(
			'rm', ['-rf', zipfile],
			{ cwd: homePath, shell: true }
		)
	} catch (err) {
		log.info('rm error', err)
	}
	addBindLinux1()
}

async function addBindLinux1() {
	try {
		await spawn(
			'sed', ["-i '1a\LbindAddressL: L0.0.0.0L'", qortalsettings],
			{ cwd: qortaldir, shell: true }
		)
	} catch (err) {
		log.info('Sed error', err)
	}
	addBindLinux2()
}

async function addBindLinux2() {
	try {
		await spawn(
			'sed', ["-i 's/LbindAddressL/\"bindAddress\"\/g'", qortalsettings],
			{ cwd: qortaldir, shell: true }
		)
	} catch (err) {
		log.info('Sed error', err)
	}
	addBindLinux3()
}

async function addBindLinux3() {
	try {
		await spawn(
			'sed', ["-i 's/L0.0.0.0L/\"0.0.0.0\"\/g'", qortalsettings],
			{ cwd: qortaldir, shell: true }
		)
		const dialogOpts = {
			type: 'info',
			buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
			title: i18n.__("electron_translate_15"),
			message: i18n.__("electron_translate_16"),
			detail: i18n.__("electron_translate_17")
		}
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				startQortal()
			} else {
				return
			}
		})
	} catch (err) {
		log.info('Sed error', err)
	}
}

async function startQortal() {
	if (process.platform === 'linux') {
		if (process.arch === 'x64') {
			if (fs.existsSync(linjavax64bindir)) {
				try {
					await spawn(
						linjavax64binfile, ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'java', ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else if (process.arch === 'arm64') {
			if (fs.existsSync(linjavaarm64bindir)) {
				try {
					await spawn(
						linjavaarm64binfile, ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'java', ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else if (process.arch === 'arm') {
			if (fs.existsSync(linjavaarmbindir)) {
				try {
					await spawn(
						linjavaarmbinfile, ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'java', ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		}
	} else if (process.platform === 'darwin') {
		if (process.arch === 'x64') {
			if (fs.existsSync(macjavax64bindir)) {
				try {
					await spawn(
						macjavax64binfile, ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'java', ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else {
			if (fs.existsSync(macjavaaarch64bindir)) {
				try {
					await spawn(
						macjavaaarch64binfile, ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'java', ['-Djava.net.preferIPv4Stack=false', '-Xss1250k', '-Xmx2200m', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		}
	}
}

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
			{ label: "Undo", accelerator: "CommandOrControl+Z", selector: "undo:" },
			{ label: "Redo", accelerator: "CommandOrControl+Shift+Z", selector: "redo:" },
			{ type: "separator" },
			{ label: "Cut", accelerator: "CommandOrControl+X", selector: "cut:" },
			{ label: "Copy", accelerator: "CommandOrControl+C", selector: "copy:" },
			{ label: "Paste", accelerator: "CommandOrControl+V", selector: "paste:" },
			{ label: "Select All", accelerator: "CommandOrControl+A", selector: "selectAll:" }
		]
	}
])

Menu.setApplicationMenu(editMenu)

let myWindow = null

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
			nodeIntegration: true,
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
	myTray.on("double-click", () => myWindow.maximize(), myWindow.show())
}

async function checkAll() {
	if (process.platform === 'win32') {
		app.setAppUserModelId("org.qortal.QortalUI")
		if (fs.existsSync(winjar)) {
			isRunning('qortal.exe', (status) => {
				if (status == true) {
					log.info("Core is running, perfect !")
				} else {
					log.info("Core is not running, starting it !")
					const dialogOpts = {
						type: 'info',
						buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
						title: i18n.__("electron_translate_15"),
						message: i18n.__("electron_translate_16"),
						detail: i18n.__("electron_translate_17")
					}
					dialog.showMessageBox(dialogOpts).then((returnValue) => {
						if (returnValue.response === 0) {
							child(startWinCore, function (err, data) {
								if (err) {
									log.info(err)
									return
								}
								log.info(data.toString())
							})
						} else {
							return
						}
					})
				}
			})
		} else {
			const dialogOpts = {
				type: 'info',
				buttons: [i18n.__("electron_translate_18"), i18n.__("electron_translate_19")],
				title: i18n.__("electron_translate_20"),
				message: i18n.__("electron_translate_21"),
				detail: i18n.__("electron_translate_22")
			}
			dialog.showMessageBox(dialogOpts).then((returnValue) => {
				if (returnValue.response === 0) {
					downloadWindows()
				} else {
					return
				}
			})
		}
	} else if (process.platform === 'darwin') {
		await checkPort()
	} else if (process.platform === 'linux') {
		await checkPort()
	} else {
		const dl = new Notification({
			title: "System Detector",
			body: "No Supported Sytem Detected"
		})
		dl.show()
	}
}

const isLock = app.requestSingleInstanceLock()

if (!isLock) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if (myWindow) {
			if (myWindow.isMinimized())
				myWindow.maximize()
			myWindow.show()
		}
	})
	app.whenReady().then(async () => {
		createWindow()
		createTray()
		await checkAll()
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
			app.quit()
		}
	})
	ipcMain.on('app_version', (event) => {
		log.info(app.getVersion())
		myWindow.webContents.send('app_version', { version: app.getVersion() })
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
		log.info("*** WHOOPS TIME ***" + err)
	})
}
