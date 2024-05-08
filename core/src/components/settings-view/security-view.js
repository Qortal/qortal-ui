import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import {
	allowQAPPAutoAuth,
	allowQAPPAutoFriendsList,
	allowQAPPAutoLists,
	removeQAPPAutoAuth,
	removeQAPPAutoFriendsList,
	removeQAPPAutoLists,
	setIsOpenDevDialog
} from '../../redux/app/app-actions'
import { securityViewStyles } from '../../styles/core-css'
import FileSaver from 'file-saver'
import snackbar from '../../functional-components/snackbar'
import '@material/mwc-checkbox'
import '@material/mwc-icon'
import '@material/mwc-textfield'
import '@vaadin/password-field/vaadin-password-field.js'

// Multi language support
import { get, translate } from '../../../translate'

class SecurityView extends connect(store)(LitElement) {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			backupErrorMessage: { type: String },
			closeSettings: { attribute: false }
		}
	}

	static get styles() {
		return [securityViewStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.backupErrorMessage = ''
	}

	render() {
		return html`
			<div style="position: relative;" >
				<div class="center-box">
					<p>
						${translate("settings.choose")}
					</p>
					<div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
						<mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
						<vaadin-password-field
							style="width: 100%; color: var(--black);"
							label="${translate("settings.password")}"
							id="downloadBackupPassword"
							helper-text="${translate("login.passwordhint")}"
							autofocus
						></vaadin-password-field>
					</div>
					<div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
						<mwc-icon style="padding: 10px; padding-left:0; padding-top: 42px;">password</mwc-icon>
						<vaadin-password-field
							style="width: 100%; color: var(--black);"
							label="${translate("login.confirmpass")}"
							id="rePassword"
						></vaadin-password-field>
					</div>
					<div style="text-align: center; color: var(--mdc-theme-error); text-transform: uppercase; font-size: 15px;">
						${this.backupErrorMessage}
					</div>
					<div style="max-width: 500px; display: flex; justify-content: center; margin: auto;">
						<div @click=${() => this.checkForDownload()} class="q-button"> ${translate("settings.download")} </div>
					</div>
				</div>
				<hr style="margin-top: 20px;">
				<div class="checkbox-row">
					<label for="authButton" id="authButtonLabel" style="color: var(--black);">
						${get('browserpage.bchange26')}
					</label>
					<mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.checkForAuth(e)} ?checked=${store.getState().app.qAPPAutoAuth}></mwc-checkbox>
				</div>
				<div class="checkbox-row">
					<label for="authButton" id="authButtonLabel" style="color: var(--black);">
						${get('browserpage.bchange39')}
					</label>
					<mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.checkForLists(e)} ?checked=${store.getState().app.qAPPAutoLists}></mwc-checkbox>
				</div>
				<div class="checkbox-row">
					<label for="authButton" id="authButtonLabel" style="color: var(--black);">
						${get('browserpage.bchange53')}
					</label>
					<mwc-checkbox style="margin-right: -15px;" id="authButton" @click=${(e) => this.checkForFriends(e)} ?checked=${store.getState().app.qAPPFriendsList}></mwc-checkbox>
				</div>
				<div class="checkbox-row">
					<button class="add-dev-button" title="${translate('tabmenu.tm18')}" @click=${this.openDevDialog}>
						${translate('tabmenu.tm38')}
					</button>
				</div>
			</div>
		`
	}

	checkForAuth(e) {
		if (e.target.checked) {
			store.dispatch(removeQAPPAutoAuth(false))
		} else {
			store.dispatch(allowQAPPAutoAuth(true))
		}
	}

	checkForLists(e) {
		if (e.target.checked) {
			store.dispatch(removeQAPPAutoLists(false))
		} else {
			store.dispatch(allowQAPPAutoLists(true))
		}
	}

	checkForFriends(e) {
		if (e.target.checked) {
			store.dispatch(removeQAPPAutoFriendsList(false))
		} else {
			store.dispatch(allowQAPPAutoFriendsList(true))
		}
	}

	checkForDownload() {
		const checkPass = this.shadowRoot.getElementById('downloadBackupPassword').value
		const rePass = this.shadowRoot.getElementById('rePassword').value

		if (checkPass === '') {
			this.backupErrorMessage = get("login.pleaseenter")
		} else if (checkPass.length < 5) {
			this.backupErrorMessage = get("login.lessthen8-2")
		} else if (checkPass != rePass) {
			this.backupErrorMessage = get("login.notmatch")
		} else {
			this.downloadBackup()
		}
	}

	openDevDialog() {
		this.closeSettings()
		store.dispatch(setIsOpenDevDialog(true))
	}

	async downloadBackup() {
		let backupname = ''

		this.backupErrorMessage = ''

		const state = store.getState()
		const password = this.shadowRoot.getElementById('downloadBackupPassword').value
		const data = await state.app.wallet.generateSaveWalletData(password, state.config.crypto.kdfThreads, () => { })
		const dataString = JSON.stringify(data)
		const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' })

		backupname = 'qortal_backup_' + state.app.selectedAddress.address + '.json'

		await this.saveFileToDisk(blob, backupname)
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

			this.shadowRoot.getElementById('downloadBackupPassword').value = ''
			this.shadowRoot.getElementById('rePassword').value = ''
		} catch (error) {
			if (error.name === 'AbortError') {
				return
			}

			FileSaver.saveAs(blob, fileName)
			this.shadowRoot.getElementById('downloadBackupPassword').value = ''
			this.shadowRoot.getElementById('rePassword').value = ''
		}
	}
}

window.customElements.define('security-view', SecurityView)