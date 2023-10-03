const {
	app,
	BrowserWindow,
	ipcMain,
	ipcRenderer,
	Menu,
	Notification,
	Tray,
	nativeImage,
	dialog,
	webContents,
	nativeTheme,
	crashReporter,
	webFrame
} = require('electron')

const { autoUpdater } = require('electron-updater')
const server = require('./server.js')
const log = require('electron-log')
const path = require('path')
const i18n = require('./lib/i18n.js')
const fs = require('fs')
const os = require("os")
const electronDl = require('electron-dl')
const Store = require('electron-store')
const extract = require('extract-zip')
const execFile = require('child_process').execFile
const exec = require('child_process').exec
const spawn = require('child_process').spawn
const homePath = app.getPath('home')
const downloadPath = app.getPath('downloads')
const logPath = app.getPath('logs')
const debugFileUnix = logPath + '/qortal-ui.log'
const debugFileWin = logPath + '\\qortal-ui.log'
const myMemory = os.totalmem()
const store = new Store()

crashReporter.start({
	productName: 'Qortal-UI',
	uploadToServer: false
})

if (myMemory > 16000000000) {
	app.commandLine.appendSwitch('js-flags', '--max-executable-size=192', '--max-old-space-size=8192', '--max-semi-space-size=2')
        log.info("Memory Size Is 16GB Using JS Memory Heap Size 8GB")
} else if (myMemory > 12000000000) {
	app.commandLine.appendSwitch('js-flags', '--max-executable-size=192', '--max-old-space-size=6144', '--max-semi-space-size=2')
        log.info("Memory Size Is 12GB Using JS Memory Heap Size 6GB")
} else if (myMemory > 7000000000) {
	app.commandLine.appendSwitch('js-flags', '--max-executable-size=192', '--max-old-space-size=4096', '--max-semi-space-size=2')
        log.info("Memory Size Is 8GB Using JS Memory Heap Size 4GB")
} else {
	app.commandLine.appendSwitch('js-flags', '--max-executable-size=192', '--max-old-space-size=2048', '--max-semi-space-size=2')
        log.info("Memory Size Is 4GB Using JS Memory Heap Size 2GB")
}

setInterval (function() {
    let mu = process.memoryUsage()
    log.info('heapTotal:',  mu.heapTotal, 'heapUsed:', mu.heapUsed);
    if (mu.heapUsed > 1024 * 1024 * 1024) {
        log.info('Taking out the garbage')
        global.gc()
    }
}, 1000 * 120)

if (process.arch === 'arm') {
	app.disableHardwareAcceleration()
	app.commandLine.appendSwitch('enable-experimental-web-platform-features')
        app.commandLine.appendSwitch('disable-software-rasterizer')
        app.commandLine.appendSwitch('in-process-gpu')
	log.info('We are on 32bit. Hardware Acceleration is disabled !')
} else {
	app.commandLine.appendSwitch('enable-experimental-web-platform-features')
	app.commandLine.appendSwitch('disable-renderer-backgrounding')
	app.commandLine.appendSwitch('disable-http-cache')
        app.commandLine.appendSwitch('disable-software-rasterizer')
        app.commandLine.appendSwitch('in-process-gpu')
	log.info('We are on 64bit. Hardware Acceleration is enabled !')
}

if (process.platform === 'win32') {
	app.commandLine.appendSwitch('log-file', debugFileWin)
	app.commandLine.appendSwitch('enable-logging')
} else {
	app.commandLine.appendSwitch('log-file', debugFileUnix)
	app.commandLine.appendSwitch('enable-logging')
}

app.enableSandbox()
electronDl()

process.env['APP_PATH'] = app.getAppPath()

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

if (!store.has('askingCore')) {
	store.set('askingCore', false)
}

log.info('App starting...')
log.info('App Platform is', process.platform)
log.info('Platform arch is', process.arch)
log.info("Memory Size", os.totalmem())

const winjar = String.raw`C:\Program Files\Qortal\qortal.jar`
const winurl = "https://github.com/Qortal/qortal/releases/latest/download/qortal.exe"
const winexe = downloadPath + "\\qortal.exe"
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

let win = BrowserWindow.getFocusedWindow();

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

async function checkWin() {
	if (fs.existsSync(winjar)) {
		isRunning('qortal.exe', (status) => {
			if (status == true) {
				log.info("Core is running, perfect !")
			} else {
				if (!store.get('askingCore')) {
					const dialogOpts = {
						type: 'info',
						buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
						title: i18n.__("electron_translate_15"),
						message: i18n.__("electron_translate_16"),
						detail: i18n.__("electron_translate_17"),
						checkboxLabel: i18n.__("electron_translate_28"),
						checkboxChecked: false
					}
					dialog.showMessageBox(dialogOpts).then((returnValue) => {
						if (returnValue.response === 0) {
							spawn(startWinCore, { detached: true })
							store.set('askingCore', returnValue.checkboxChecked)
						} else {
							store.set('askingCore', returnValue.checkboxChecked)
							return
						}
					})
				}
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
		directory: downloadPath,
		onProgress: function () { log.info("Starting Download Qortal Core Installer") }
	})
	winLoader.destroy()

	const coreInstall = execFile(winexe, (e, stdout, stderr) => {
		if (e) {
			log.info(e)
			removeQortalExe()
		} else {
			log.info('Qortal Core Installation Done', stdout, stderr)
			removeQortalExe()
		}
	})

	coreInstall.stdin.end()
}

async function removeQortalExe() {
	try {
		await fs.rmSync(winexe, {
			force: true,
		})
	} catch (err) {
		log.info('renove error', err)
	}

	checkWin()
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
	} else if (process.platform === 'win32') {
		await checkWin()
	} else {
		await javaversion()
	}
}

async function javaversion() {
	var stderrChunks = []
	let checkJava = await spawn('java', ['-version'], { shell: true })
	if (process.platform === 'linux') {
		if (process.arch === 'x64') {
			if (fs.existsSync(linjavax64bindir)) {
				checkJava = await spawn(linjavax64binfile, ['-version'], { cwd: homePath, shell: true, maxBuffer: Infinity })
			}
		} else if (process.arch === 'arm64') {
			if (fs.existsSync(linjavaarm64bindir)) {
				checkJava = await spawn(linjavaarm64binfile, ['-version'], { cwd: homePath, shell: true, maxBuffer: Infinity })
			}
		} else if (process.arch === 'arm') {
			if (fs.existsSync(linjavaarmbindir)) {
				checkJava = await spawn(linjavaarmbinfile, ['-version'], { cwd: homePath, shell: true, maxBuffer: Infinity })
			}
		}
	} else if (process.platform === 'darwin') {
		if (process.arch === 'x64') {
			if (fs.existsSync(macjavax64bindir)) {
				checkJava = await spawn(macjavax64binfile, ['-version'], { cwd: homePath, shell: true, maxBuffer: Infinity })
			}
		} else {
			if (fs.existsSync(macjavaaarch64bindir)) {
				checkJava = await spawn(macjavaaarch64file, ['-version'], { cwd: homePath, shell: true, maxBuffer: Infinity })
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
				if (!store.get('askingCore')) {
					const dialogOpts = {
						type: 'info',
						buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
						title: i18n.__("electron_translate_15"),
						message: i18n.__("electron_translate_16"),
						detail: i18n.__("electron_translate_17"),
						checkboxLabel: i18n.__("electron_translate_28"),
						checkboxChecked: false
					}
					dialog.showMessageBox(dialogOpts).then((returnValue) => {
						if (returnValue.response === 0) {
							startQortal()
							store.set('askingCore', returnValue.checkboxChecked)
						} else {
							store.set('askingCore', returnValue.checkboxChecked)
							return
						}
					})
				}
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
	checkAndStart()
}

async function checkAndStart() {
	try {
		if (!store.get('askingCore')) {
			const dialogOpts = {
				type: 'info',
				buttons: [i18n.__("electron_translate_13"), i18n.__("electron_translate_14")],
				title: i18n.__("electron_translate_15"),
				message: i18n.__("electron_translate_16"),
				detail: i18n.__("electron_translate_17"),
				checkboxLabel: i18n.__("electron_translate_28"),
				checkboxChecked: false
			}
			dialog.showMessageBox(dialogOpts).then((returnValue) => {
				if (returnValue.response === 0) {
					startQortal()
					store.set('askingCore', returnValue.checkboxChecked)
				} else {
					store.set('askingCore', returnValue.checkboxChecked)
					return
				}
			})
		}
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
						'nohup', ['nice', '-n', '20', linjavax64binfile, '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', 'java', '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else if (process.arch === 'arm64') {
			if (fs.existsSync(linjavaarm64bindir)) {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', linjavaarm64binfile, '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', 'java', '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else if (process.arch === 'arm') {
			if (fs.existsSync(linjavaarmbindir)) {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', linjavaarmbinfile, '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', 'java', '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
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
						'nohup', ['nice', '-n', '20', macjavax64binfile, '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', 'java', '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			}
		} else {
			if (fs.existsSync(macjavaaarch64bindir)) {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', macjavaaarch64binfile, '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
					)
				} catch (err) {
					log.info('Start qortal error', err)
				}
			} else {
				try {
					await spawn(
						'nohup', ['nice', '-n', '20', 'java', '-Djava.net.preferIPv4Stack=false', '-jar', qortaljar, qortalsettings, '1>run.log', '2>&1', '&'],
						{ cwd: qortaldir, shell: true, detached: true }
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
		submenu: [
			{ label: "Quit", click() { app.quit() } }
		]
	},
	{
		label: i18n.__("electron_translate_34"),
		submenu: [{
			label: i18n.__("electron_translate_31"),
			click() {
				const dialogOpts = {
					type: 'info',
					noLink: true,
					buttons: [i18n.__("electron_translate_29"), i18n.__("electron_translate_30")],
					title: i18n.__("electron_translate_31"),
					message: i18n.__("electron_translate_32"),
					detail: i18n.__("electron_translate_33"),
					checkboxLabel: i18n.__("electron_translate_28"),
					checkboxChecked: store.get('askingCore')
				}
				dialog.showMessageBox(dialogOpts).then((returnValue) => {
					if (returnValue.response === 0) {
						store.set('askingCore', returnValue.checkboxChecked)
					} else {
						store.set('askingCore', returnValue.checkboxChecked)
						return
					}
				})
			}
		}]
	},
	{
		label: "Edit",
		submenu: [
			{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
			{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
			{ type: "separator" },
			{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
			{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
			{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
			{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
		]
	},
	{
		label: "Check for update", click() { autoUpdater.checkForUpdatesAndNotify() }
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
			partition: 'persist:webviewsession',
			nodeIntegration: true,
			contextIsolation: true,
			enableRemoteModule: false,
			allowRunningInsecureContent: false,
			experimentalFeatures: true,
			preload: path.join(__dirname, '/lib/preload.js')
		},
		show: false
	})
	myWindow.maximize()
	myWindow.show()
	myWindow.loadURL('http://localhost:12388/app')
	myWindow.on('closed', function () {
		myWindow = null
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

let newWindow = null

function createNewWindow() {
	newWindow = new BrowserWindow({
		backgroundColor: '#eee',
		width: 1280,
		height: 720,
		minWidth: 700,
		minHeight: 640,
		icon: path.join(__dirname + '/img/icons/png/256x256.png'),
		title: "Qortal UI New Instance",
		autoHideMenuBar: true,
		webPreferences: {
			partition: 'persist:webviewsession',
			nodeIntegration: true,
			contextIsolation: true,
			enableRemoteModule: false,
			allowRunningInsecureContent: false,
			experimentalFeatures: false,
			preload: path.join(__dirname, '/lib/preload.js')
		},
		show: false
	})
	newWindow.show()
	newWindow.loadURL('http://localhost:12388/app')
	newWindow.on('closed', function () {
		newWindow = null
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
			label: i18n.__("electron_translate_31"),
			click: function () {
				const dialogOpts = {
					type: 'info',
					noLink: true,
					buttons: [i18n.__("electron_translate_29"), i18n.__("electron_translate_30")],
					title: i18n.__("electron_translate_31"),
					message: i18n.__("electron_translate_32"),
					detail: i18n.__("electron_translate_33"),
					checkboxLabel: i18n.__("electron_translate_28"),
					checkboxChecked: store.get('askingCore')
				}
				dialog.showMessageBox(dialogOpts).then((returnValue) => {
					if (returnValue.response === 0) {
						store.set('askingCore', returnValue.checkboxChecked)
					} else {
						store.set('askingCore', returnValue.checkboxChecked)
						return
					}
				})
			},
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
		await checkPort()
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
	ipcMain.on('set-start-core', (event) => {
		const dialogOpts = {
			type: 'info',
			noLink: true,
			buttons: [i18n.__("electron_translate_29"), i18n.__("electron_translate_30")],
			title: i18n.__("electron_translate_31"),
			message: i18n.__("electron_translate_32"),
			detail: i18n.__("electron_translate_33"),
			checkboxLabel: i18n.__("electron_translate_28"),
			checkboxChecked: store.get('askingCore')
		}
		dialog.showMessageBox(dialogOpts).then((returnValue) => {
			if (returnValue.response === 0) {
				store.set('askingCore', returnValue.checkboxChecked)
			} else {
				store.set('askingCore', returnValue.checkboxChecked)
				return
			}
		})
	})
	ipcMain.on('clear-all-cache', (event) => {
		const theWindows = BrowserWindow.getAllWindows()[0]
		const ses = theWindows.webContents.session
		console.clear()
		ses.clearCache()
	})
	ipcMain.on('check-for-update', (event) => {
		const check = new Notification({
			title: i18n.__("electron_translate_43"),
			body: i18n.__("electron_translate_44")
		})
		check.show()
		autoUpdater.checkForUpdatesAndNotify()
	})
	ipcMain.on('show-my-menu', (event) => {
		let homePageOptions = Menu.buildFromTemplate([
			{
				label: i18n.__("electron_translate_35"),
				role: 'copy'
			},
			{
				label: i18n.__("electron_translate_36"),
				role: 'paste'
			},
			{
				type: "separator"
			},
			{
				label: i18n.__("electron_translate_37"),
				submenu: [
					{
						label: i18n.__("electron_translate_38"),
						role: 'zoomIn'
					},
					{
						label: i18n.__("electron_translate_39"),
						role: 'zoomOut'
					},
					{
						label: i18n.__("electron_translate_40"),
						role: 'resetZoom'
					},
					{
						type: 'separator'
					},
					{
						label: i18n.__("electron_translate_41"),
						role: 'togglefullscreen'
					}
				]
			},
			{
				type: "separator"
			},
			{
				label: i18n.__("electron_translate_42"),
				click: function () {
					createNewWindow()
				},
			}
		])
		homePageOptions.popup(myWindow)
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
	autoUpdater.on('update-not-available', (event) => {
		log.info("NO UPDATE")
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
	ipcMain.on('focus-app', (event) => {
		if (myWindow.isMinimized()) {
			myWindow.restore()
		}
		myWindow.maximize()
		myWindow.focus()
	})
	process.on('uncaughtException', function (err) {
		log.info("*** WHOOPS TIME ***" + err)
	})

}