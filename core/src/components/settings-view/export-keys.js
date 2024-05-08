import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { Epml } from '../../epml'
import { addTradeBotRoutes } from '../../tradebot/addTradeBotRoutes'
import { exportKeysStyles } from '../../styles/core-css'
import FileSaver from 'file-saver'
import snackbar from '../../functional-components/snackbar'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'

// Multi language support
import { get, translate } from '../../../translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ExportKeys extends connect(store)(LitElement) {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			backupErrorMessage: { type: String },
			btcPMK: { type: String },
			ltcPMK: { type: String },
			dogePMK: { type: String },
			dgbPMK: { type: String },
			rvnPMK: { type: String },
			arrrPMK: { type: String },
			btcWALLET: { type: String },
			ltcWALLET: { type: String },
			dogeWALLET: { type: String },
			dgbWALLET: { type: String },
			rvnWALLET: { type: String },
			arrrWALLET: { type: String },
			btcName: { type: String },
			ltcName: { type: String },
			dogeName: { type: String },
			dgbName: { type: String },
			rvnName: { type: String },
			arrrName: { type: String },
			btcShort: { type: String },
			ltcShort: { type: String },
			dogeShort: { type: String },
			dgbShort: { type: String },
			rvnShort: { type: String },
			arrrShort: { type: String },
			enableArrr: { type: Boolean },
			dWalletAddress: { type: String },
			dPrivateKey: { type: String },
			dCoinName: { type: String },
			dCoinShort: { type: String }
		}
	}

	static get styles() {
		return [exportKeysStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.backupErrorMessage = ''
		this.btcPMK = store.getState().app.selectedAddress.btcWallet.derivedMasterPrivateKey
		this.btcWALLET = store.getState().app.selectedAddress.btcWallet.address
		this.btcName = 'Bitcoin'
		this.btcShort = 'btc'
		this.ltcPMK = store.getState().app.selectedAddress.ltcWallet.derivedMasterPrivateKey
		this.ltcWALLET = store.getState().app.selectedAddress.ltcWallet.address
		this.ltcName = 'Litecoin'
		this.ltcShort = 'ltc'
		this.dogePMK = store.getState().app.selectedAddress.dogeWallet.derivedMasterPrivateKey
		this.dogeWALLET = store.getState().app.selectedAddress.dogeWallet.address
		this.dogeName = 'Dogecoin'
		this.dogeShort = 'doge'
		this.dgbPMK = store.getState().app.selectedAddress.dgbWallet.derivedMasterPrivateKey
		this.dgbWALLET = store.getState().app.selectedAddress.dgbWallet.address
		this.dgbName = 'Digibyte'
		this.dgbShort = 'dgb'
		this.rvnPMK = store.getState().app.selectedAddress.rvnWallet.derivedMasterPrivateKey
		this.rvnWALLET = store.getState().app.selectedAddress.rvnWallet.address
		this.rvnName = 'Ravencoin'
		this.rvnShort = 'rvn'
		this.arrrPMK = ''
		this.arrrWALLET = ''
		this.arrrName = 'Pirate Chain'
		this.arrrShort = 'arrr'
		this.enableArrr = false
		this.dWalletAddress = ''
		this.dPrivateKey = ''
		this.dCoinName = ''
		this.dCoinShort = 'btc'
	}

	render() {
		return html`
			<div style="position: relative;">
				<div class="center-box">
					<p>
						${translate("settings.exp4")}
					</p>
				</div>
				<div class="sub-main">
					<div class="center-box">
						<div class="content-box">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/btc.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.btcWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.btcWALLET, this.btcPMK, this.btcName, this.btcShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
						<div class="content-box">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/ltc.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.ltcWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.ltcWALLET, this.ltcPMK, this.ltcName, this.ltcShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
						<div class="content-box">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/doge.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.dogeWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.dogeWALLET, this.dogePMK, this.dogeName, this.dogeShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
						<div class="content-box">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/dgb.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.dgbWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.dgbWALLET, this.dgbPMK, this.dgbName, this.dgbShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
						<div class="content-box">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/rvn.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.rvnWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.rvnWALLET, this.rvnPMK, this.rvnName, this.rvnShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
						<div class="content-box" style="display:${this.enableArrr ? 'block' : 'none'}">
							<div style="display: flex; align-items: center; justify-content: center;">
								<img src="/img/arrr.png" style="width: 32px; height: 32px;">&nbsp;&nbsp;${this.arrrWALLET}<br>
							</div>
							<div @click=${() => this.checkForPmkDownload(this.arrrWALLET, this.arrrPMK, this.arrrName, this.arrrShort)} class="export-button"> ${translate("settings.exp2")} </div>
						</div>
					</div>
				</div>
				<hr style="margin-top: 20px;">
				<div class="button-row">
					<button class="repair-button" title="${translate('nodepage.nchange38')}" @click="${() => this.openRepairLTCDialog()}">${translate("nodepage.nchange38")}</button>
				</div>
			</div>
			<mwc-dialog id="savePkmDialog" scrimClickAction="" escapeKeyAction="">
				<img src="/img/${this.dCoinShort}.png" style="width: 32px; height: 32px;">
				<h3>${this.dCoinName} ${translate("settings.exp2")}</h3>
				<hr>
				<h4>${translate("settings.address")}: ${this.dWalletAddress}</h4>
				<mwc-button
					slot="primaryAction"
					@click="${() => this.closeSavePkmDialog()}"
					class="red"
				>
					${translate("general.close")}
				</mwc-button>
				<mwc-button
					slot="secondaryAction"
					@click="${() => this.exportKey(this.dPrivateKey, this.dCoinName, this.dWalletAddress)}"
				>
					${translate("settings.exp3")}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog id="arrrWalletNotSynced" scrimClickAction="" escapeKeyAction="">
				<img src="/img/arrr.png" style="width: 32px; height: 32px;">
				<h3>${translate("settings.arrr1")}</h3>
				<hr>
				<h4>${translate("settings.arrr2")}</h4>
				<mwc-button
					slot="primaryAction"
					@click="${() => this.closeArrrWalletNotSynced()}"
					class="red"
				>
					${translate("general.close")}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog id="needCoreUpdate" scrimClickAction="" escapeKeyAction="">
				<img src="/img/arrr.png" style="width: 32px; height: 32px;">
				<h3>${translate("settings.arrr3")}</h3>
				<hr>
				<h4>${translate("settings.arrr4")}</h4>
				<mwc-button
					slot="primaryAction"
					@click="${() => this.closeNeedCoreUpdate()}"
					class="red"
				>
					${translate("general.close")}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog id="repairLTCDialog" scrimClickAction="" escapeKeyAction="">
				<img src="/img/ltc.png" style="width: 32px; height: 32px;">
				<h3>${translate("nodepage.nchange38")}</h3>
				<hr>
				<h4>${translate("nodepage.nchange39")}</h4>
				<h4>${translate("nodepage.nchange40")}</h4>
				<mwc-button slot="primaryAction" @click="${() => this.repairLtcWallet()}" class="green">
					${translate("general.continue")}
				</mwc-button>
				<mwc-button slot="secondaryAction" @click="${() => this.closeRepairLTCDialog()}" class="red">
					${translate("login.lp4")}
				</mwc-button>
			</mwc-dialog>
			<mwc-dialog id="pleaseWaitDialog" scrimClickAction="" escapeKeyAction="">
				<div class="lds-roller">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
				<h2>${translate("nodepage.nchange41")}</h2>
			</mwc-dialog>
			<mwc-dialog id="okDialog" scrimClickAction="" escapeKeyAction="">
				<img src="/img/ltc.png" style="width: 32px; height: 32px;">
				<h3>${translate("nodepage.nchange38")}</h3>
				<hr>
				<h3>${translate("nodepage.nchange42")}</h3>
			</mwc-dialog>
			<mwc-dialog id="errorDialog" scrimClickAction="" escapeKeyAction="">
				<img src="/img/ltc.png" style="width: 32px; height: 32px;">
				<h3>${translate("nodepage.nchange38")}</h3>
				<hr>
				<h3>${translate("nodepage.nchange43")}</h3>
			</mwc-dialog>
		`
	}

	async firstUpdated() {
		addTradeBotRoutes(parentEpml)
		parentEpml.imReady()

		await this.fetchArrrWalletAddress()
		await this.checkArrrWalletPrivateKey()
	}

	async fetchArrrWalletAddress() {
		let resAD = await parentEpml.request('apiCall', {
			url: `/crosschain/arrr/walletaddress?apiKey=${this.getApiKey()}`,
			method: 'POST',
			body: `${store.getState().app.selectedAddress.arrrWallet.seed58}`
		})

		if (resAD != null && resAD.error != 1201) {
			this.arrrWALLET = ''
			this.enableArrr = true
			this.arrrWALLET = resAD
		} else {
			this.arrrWALLET = ''
			this.enableArrr = false
			this.shadowRoot.querySelector('#arrrWalletNotSynced').show()
		}
	}

	async checkArrrWalletPrivateKey() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const privateKeyUrl = `${nodeUrl}/crosschain/arrr/walletprivatekey?apiKey=${this.getApiKey()}`

		await fetch(privateKeyUrl, {
			method: 'POST',
			body: `${store.getState().app.selectedAddress.arrrWallet.seed58}`
		}).then(res => {
			if (res.status === 404) {
				this.arrrPMK = ''
				this.enableArrr = false
				this.shadowRoot.querySelector('#needCoreUpdate').show()
			} else {
				this.fetchArrrWalletPrivateKey()
			}
		})
	}

	async fetchArrrWalletPrivateKey() {
		let resPK = await parentEpml.request('apiCall', {
			url: `/crosschain/arrr/walletprivatekey?apiKey=${this.getApiKey()}`,
			method: 'POST',
			body: `${store.getState().app.selectedAddress.arrrWallet.seed58}`
		})

		if (resPK != null && resPK.error != 1201) {
			this.arrrPMK = ''
			this.enableArrr = true
			this.arrrPMK = resPK
		} else {
			this.arrrPMK = ''
			this.enableArrr = false
			this.shadowRoot.querySelector('#arrrWalletNotSynced').show()
		}
	}

	closeArrrWalletNotSynced() {
		this.shadowRoot.querySelector('#arrrWalletNotSynced').close()
	}

	closeNeedCoreUpdate() {
		this.arrrPMK = ''
		this.enableArrr = false
		this.shadowRoot.querySelector('#needCoreUpdate').close()
	}

	closeSavePkmDialog() {
		this.shadowRoot.querySelector('#savePkmDialog').close()
	}

	openRepairLTCDialog() {
		this.shadowRoot.querySelector('#repairLTCDialog').show()
	}

	closeRepairLTCDialog() {
		this.shadowRoot.querySelector('#repairLTCDialog').close()
	}

	async repairLtcWallet() {
		this.shadowRoot.querySelector('#repairLTCDialog').close()
		this.shadowRoot.querySelector('#pleaseWaitDialog').show()

		let resRepair = await parentEpml.request('apiCall', {
			url: `/crosschain/ltc/repair?apiKey=${this.getApiKey()}`,
			method: 'POST',
			body: `${store.getState().app.selectedAddress.ltcWallet.derivedMasterPrivateKey}`
		})

		if (resRepair != null && resRepair.error != 128) {
			this.shadowRoot.querySelector('#pleaseWaitDialog').close()

			await this.openOkDialog()
		} else {
			this.shadowRoot.querySelector('#pleaseWaitDialog').close()

			await this.openErrorDialog()
		}
	}

	async openOkDialog() {
		const okDelay = ms => new Promise(res => setTimeout(res, ms))

		this.shadowRoot.querySelector('#okDialog').show()

		await okDelay(3000)

		this.shadowRoot.querySelector('#okDialog').close()
	}

	async openErrorDialog() {
		const errorDelay = ms => new Promise(res => setTimeout(res, ms))

		this.shadowRoot.querySelector('#errorDialog').show()

		await errorDelay(3000)

		this.shadowRoot.querySelector('#errorDialog').close()
	}

	checkForPmkDownload(wAddress, wPkm, wName, wShort) {
		this.dWalletAddress = ''
		this.dPrivateKey = ''
		this.dCoinName = ''
		this.dCoinShort = ''
		this.dWalletAddress = wAddress
		this.dPrivateKey = wPkm
		this.dCoinName = wName
		this.dCoinShort = wShort
		this.shadowRoot.querySelector('#savePkmDialog').show()
	}

	async exportKey(cMasterKey, cName, cAddress) {
		let exportname = ''

		const myPrivateMasterKey = cMasterKey
		const myCoinName = cName
		const myCoinAddress = cAddress
		const blob = new Blob([`${myPrivateMasterKey}`], { type: 'text/plain;charset=utf-8' })

		exportname = 'Private_Master_Key_' + myCoinName + '_' + myCoinAddress + '.txt'

		await this.saveFileToDisk(blob, exportname)
	}

	async saveFileToDisk(blob, fileName) {
		try {
			const fileHandle = await self.showSaveFilePicker({
				suggestedName: fileName,
				types: [{
					description: "File"
				}]
			})

			const writeFile = async (fileHandle, contents) => {
				const writable = await fileHandle.createWritable()

				await writable.write(contents)
				await writable.close()
			}

			writeFile(fileHandle, blob).then(() => console.log("FILE SAVED"))

			let snack4string = get("general.save")

			snackbar.add({
				labelText: `${snack4string} ${fileName} ✅`,
				dismiss: true
			})
		} catch (error) {
			if (error.name === 'AbortError') {
				return
			}

			FileSaver.saveAs(blob, fileName)
		}
	}

	getApiKey() {
		const apiNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		return apiNode.apiKey
	}
}

window.customElements.define('export-keys', ExportKeys)