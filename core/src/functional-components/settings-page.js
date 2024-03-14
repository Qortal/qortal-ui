import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../store.js'
import {doAddNode, doEditNode, doLoadNodeConfig, doRemoveNode, doSetNode} from '../redux/app/app-actions.js'
import {get, registerTranslateConfig, translate, use} from '../../translate/index.js'
import snackbar from './snackbar.js'
import '../components/language-selector.js'
import '../custom-elements/frag-file-input.js'
import FileSaver from 'file-saver'

import '@material/mwc-dialog'
import '@material/mwc-button'
import '@material/mwc-select'
import '@material/mwc-textfield'
import '@material/mwc-icon'
import '@material/mwc-list/mwc-list-item.js'

registerTranslateConfig({
	loader: (lang) => fetch(`/language/${lang}.json`).then((res) => res.json())
})

const checkLanguage = localStorage.getItem('qortalLanguage')

if (checkLanguage === null || checkLanguage.length === 0) {
	localStorage.setItem('qortalLanguage', 'us')
	use('us')
} else {
	use(checkLanguage)
}

let settingsDialog

class SettingsPage extends connect(store)(LitElement) {
	static get properties() {
		return {
			lastSelected: { type: Number },
			nodeConfig: { type: Object },
			theme: { type: String, reflect: true },
			isBeingEdited: { type: Boolean },
			dropdownOpen: { type: Boolean }
		}
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-primary: var(--login-button);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--mdc-dialog-content-ink-color: var(--black);
				--mdc-theme-surface: var(--white);
				--mdc-theme-text-primary-on-background: var(--black);
				--mdc-dialog-min-width: 300px;
				--mdc-dialog-max-width: 650px;
				--mdc-dialog-max-height: 700px;
				--mdc-list-item-text-width: 100%;
			}

			#main {
				width: 210px;
				display: flex;
				align-items: center;
			}

			.globe {
				color: var(--black);
				--mdc-icon-size: 36px;
			}

			span.name {
				display: inline-block;
				width: 150px;
				font-weight: 600;
				color: var(--general-color-blue);
				border: 1px solid transparent;
			}

			.red {
				--mdc-theme-primary: red;
			}

			.buttonred {
				color: #f44336;
			}

			.buttongreen {
				color: #03c851;
			}

			.buttonBlue {
				color: var(--general-color-blue);
			}

			.floatleft {
				float: left;
			}

			.floatright {
				float: right;
			}

			.list-parent {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
			}

			#customSelect {
				position: relative;
				border: 1px solid #ccc;
				cursor: pointer;
				background: var(--plugback);
			}

			#customSelect .selected {
				padding: 10px;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			#customSelect ul {
				position: absolute;
				top: 100%;
				left: 0;
				list-style: none;
				margin: 0;
				padding: 0;
				border: 1px solid #ccc;
				display: none;
				background: var(--plugback);
				width: 100%;
				box-sizing: border-box;
				z-index: 10;
			}

			#customSelect ul.open {
				display: block;
			}

			#customSelect ul li {
				padding: 10px;
				transition: 0.2s all;
			}

			#customSelect ul li:hover {
				background-color: var(--graylight);
			}

			.selected-left-side {
				display: flex;
				align-items: center;
			}
		`
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.nodeConfig = {}
		this.isBeingEdited = false
		this.isBeingEditedIndex = null
		this.dropdownOpen = false
	}

	render() {
		return html`
			<mwc-dialog id="settingsDialog" opened="false">
				<div style="display: inline; text-align: center;">
					<h1>${translate('settings.settings')}</h1>
					<hr />
				</div>
				<br />
				<div style="min-height: 250px; min-width: 500px; box-sizing: border-box; position: relative;">
					<div id="customSelect" @click="${this.toggleDropdown}" @blur="${this.handleBlur}" tabindex="0">
						<div class="selected">
							<div class="selected-left-side">
								<mwc-icon style="margin-right: 10px">link</mwc-icon>
							${this.selectedItem ? html
								`
									<div>
										<span class="name">${this.selectedItem.name}</span>
										<span>${this.selectedItem.protocol + '://' + this.selectedItem.domain + ':' + this.selectedItem.port}</span>
									</div>
								` : html`${translate('settings.selectnode')}`
							}
						</div>
							<mwc-icon>expand_more</mwc-icon>
						</div>
						<ul class="${this.dropdownOpen ? 'open' : ''}">
							${this.nodeConfig.knownNodes.map(
								(n, index) => html`
									<li @click="${(e) => this.handleSelection(e, n, index)}">
										<div class="list-parent">
											<div>
												<span class="name">${n.name}</span>
												<span>${n.protocol + '://' + n.domain + ':' + n.port}</span>
											</div>
											<div>
												<mwc-button
													outlined
													@click="${(e) => {
														e.stopPropagation();
														const currentValues = this.nodeConfig.knownNodes[index]
														const dialog = this.shadowRoot.querySelector('#addNodeDialog')

														// Set the value for mwc-textfield elements
														dialog.querySelector('#nameInput').value = currentValues.name
														dialog.querySelector('#domainInput').value = currentValues.domain
														dialog.querySelector('#portInput').value = currentValues.port

														// Set the selected value for mwc-select
														const protocolList = dialog.querySelector('#protocolList')
														const desiredProtocol = currentValues.protocol
														protocolList.value = desiredProtocol
														this.isBeingEdited = true
														this.isBeingEditedIndex = index
														this.shadowRoot.querySelector('#addNodeDialog').show()
													}}"
												>
													<mwc-icon class="buttonBlue">edit</mwc-icon>
												</mwc-button>
												<mwc-button outlined @click="${(e) => this.removeNode(e, index)}">
													<mwc-icon class="buttonred">remove</mwc-icon>
												</mwc-button>
											</div>
										</div>
									</li>
								`
							)}
						</ul>
					</div>
					<p style="margin-top: 30px; text-align: center;">
						${translate('settings.nodehint')}
					</p>
					<center>
						<mwc-button
							outlined
							@click="${() => this.shadowRoot.querySelector('#addNodeDialog').show()}"
							><mwc-icon class="buttongreen">add</mwc-icon
						>
							${translate('settings.addcustomnode')}
						</mwc-button>
					</center>
					<center>
						<mwc-button outlined @click="${() => this.removeList()}">
							<mwc-icon class="buttonred">remove</mwc-icon>
							${translate('settings.deletecustomnode')}
						</mwc-button>
					</center>
					<br />
					<div class="floatleft">
						${this.renderExportNodesListButton()}
					</div>
					<div class="floatright">
						${this.renderImportNodesListButton()}
					</div>
					<br /><br />
				</div>
				<div style="min-height:100px; min-width: 300px; box-sizing: border-box; position: relative;">
					<hr />
					<br />
					<center>
						<div id="main">
							<mwc-icon class="globe">language</mwc-icon
							>&nbsp;<language-selector></language-selector>
						</div>
					</center>
				</div>
				<mwc-button slot="primaryAction" dialogAction="close" class="red">
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>

			<mwc-dialog id="addNodeDialog">
				<div style="text-align: center;">
					<h2>${translate('settings.addcustomnode')}</h2>
					<hr />
				</div>
				<br />
				<mwc-textfield id="nameInput" style="width:100%;" label="${translate('login.name')}"></mwc-textfield>
				<br />
				<mwc-select id="protocolList" style="width:100%;" label="${translate('settings.protocol')}">
					<mwc-list-item value="http">http</mwc-list-item>
					<mwc-list-item value="https">https</mwc-list-item>
				</mwc-select>
				<br />
				<mwc-textfield id="domainInput" style="width:100%;" label="${translate('settings.domain')}"></mwc-textfield>
				<mwc-textfield id="portInput" style="width:100%;" label="${translate('settings.port')}"></mwc-textfield>
				<mwc-button slot="secondaryAction" dialogAction="close" class="red">
					${translate('general.close')}
				</mwc-button>
				<mwc-button slot="primaryAction" @click="${this.addNode}">
					${translate('settings.addandsave')}
				</mwc-button>
			</mwc-dialog>

			<mwc-dialog id="importQortalNodesListDialog">
				<div style="text-align:center">
					<h2>${translate('settings.import')}</h2>
					<hr />
					<br />
				</div>
				<div style="min-height: 150px; min-width: 500px; box-sizing: border-box; position: relative;">
					<frag-file-input accept=".nodes"handleBlur(event)
						{
							if (!this.shadowRoot.querySelector("#customSelect").contains(event.relatedTarget)) {
								this.dropdownOpen = false
							}
						}
						@file-read-success="${(e) => this.importQortalNodesList(e.detail.result)}"
					>
					</frag-file-input>
					<h4 style="color: #F44336; text-align: center;">
						${translate('walletpage.wchange56')}
					</h4>
					<h5 style="text-align: center;">
						${translate('settings.warning')}
					</h5>
				</div>
				<mwc-button slot="primaryAction" dialogAction="cancel" class="red">
					${translate('general.close')}
				</mwc-button>
			</mwc-dialog>
		`
	}

	firstUpdated() {
		const checkNode = localStorage.getItem('mySelectedNode')
		if (checkNode === null || checkNode.length === 0) {
			localStorage.setItem('mySelectedNode', 0)
		} else {
			this.handleSelectionOnNewStart(checkNode)
		}
	}

	handleSelectionOnNewStart(index) {
		this.localSavedNodes = JSON.parse(localStorage.getItem('myQortalNodes'))
		this.dropdownOpen = false
		this.selectedItem = this.localSavedNodes[index]
		this.requestUpdate()
	}

	toggleDropdown() {
		this.dropdownOpen = !this.dropdownOpen
	}

	handleBlur(event) {
		if (!this.shadowRoot.querySelector('#customSelect').contains(event.relatedTarget)) {
			this.dropdownOpen = false
		}
	}

	focusOnCustomSelect() {
		const customSelect = this.shadowRoot.querySelector('#customSelect')
		if (customSelect) {
			customSelect.focus()
		}
	}

	handleSelection(event, node, index) {
		event.stopPropagation()

		this.selectedItem = node
		this.dropdownOpen = false
		this.requestUpdate()
		this.nodeSelected(index)
		localStorage.setItem('mySelectedNode', index)

		const selectedNodeIndexOnNewStart = localStorage.getItem('mySelectedNode')
		const catchSavedNodes = JSON.parse(localStorage.getItem('myQortalNodes'))
		const selectedNodeOnNewStart = catchSavedNodes[selectedNodeIndexOnNewStart]
		const selectedNameOnNewStart = `${selectedNodeOnNewStart.name}`
		const selectedNodeUrlOnNewStart = `${selectedNodeOnNewStart.protocol + '://' + selectedNodeOnNewStart.domain +':' + selectedNodeOnNewStart.port}`

		let snack2string = get('settings.snack2')

		snackbar.add({
			labelText: `${snack2string} : ${selectedNameOnNewStart} ${selectedNodeUrlOnNewStart}`,
			dismiss: true
		})
	}

	show() {
		this.shadowRoot.getElementById('settingsDialog').show()
	}

	close() {
		this.shadowRoot.getElementById('settingsDialog').close()
	}

	removeList() {
		localStorage.removeItem('myQortalNodes')

		const obj1 = {
			name: 'Local Node',
			protocol: 'http',
			domain: '127.0.0.1',
			port: 12391,
			enableManagement: true
		}

		const obj2 = {
			name: 'Local Testnet',
			protocol: 'http',
			domain: '127.0.0.1',
			port: 62391,
			enableManagement: true
		}

		var renewNodes = []
		renewNodes.push(obj1, obj2)
		localStorage.setItem('myQortalNodes', JSON.stringify(renewNodes))

		let snack1string = get('settings.snack1')
		snackbar.add({
			labelText: `${snack1string}`,
			dismiss: true
		})

		localStorage.removeItem('mySelectedNode')
		localStorage.setItem('mySelectedNode', 0)

		store.dispatch(doLoadNodeConfig())
	}

	nodeSelected(selectedNodeIndex) {
		const selectedNode = this.nodeConfig.knownNodes[selectedNodeIndex]
		const selectedName = `${selectedNode.name}`
		const selectedNodeUrl = `${selectedNode.protocol + '://' + selectedNode.domain +':' + selectedNode.port}`

		const index = parseInt(selectedNodeIndex)
		if (isNaN(index)) return

		store.dispatch(doSetNode(selectedNodeIndex))

		localStorage.removeItem('mySelectedNode');
		localStorage.setItem('mySelectedNode', selectedNodeIndex)
	}

	addNode(e) {
		e.stopPropagation()

		if (this.isBeingEdited) {
			this.editNode(this.isBeingEditedIndex)
			return
		}

		const nameInput = this.shadowRoot.getElementById('nameInput').value
		const protocolList = this.shadowRoot.getElementById('protocolList').value
		const domainInput = this.shadowRoot.getElementById('domainInput').value
		const portInput = this.shadowRoot.getElementById('portInput').value

		if (protocolList.length >= 4 && domainInput.length >= 3 && portInput.length >= 2) {
			const nodeObject = {
				name: nameInput,
				protocol: protocolList,
				domain: domainInput,
				port: portInput,
				enableManagement: true
			}

			store.dispatch(doAddNode(nodeObject))

			const haveNodes = JSON.parse(localStorage.getItem('myQortalNodes'))

			if (haveNodes === null || haveNodes.length === 0) {
				var savedNodes = []
				savedNodes.push(nodeObject)
				localStorage.setItem('myQortalNodes', JSON.stringify(savedNodes))

				let snack3string = get('settings.snack3')
				snackbar.add({
					labelText: `${snack3string}`,
					dismiss: true
				})

				this.shadowRoot.getElementById('nameInput').value = ''
				this.shadowRoot.getElementById('protocolList').value = ''
				this.shadowRoot.getElementById('domainInput').value = ''
				this.shadowRoot.getElementById('portInput').value = ''

				this.shadowRoot.querySelector('#addNodeDialog').close()
			} else {
				var stored = JSON.parse(localStorage.getItem('myQortalNodes'))
				stored.push(nodeObject)
				localStorage.setItem('myQortalNodes', JSON.stringify(stored))

				let snack3string = get('settings.snack3');
				snackbar.add({
					labelText: `${snack3string}`,
					dismiss: true
				})

				this.shadowRoot.getElementById('nameInput').value = ''
				this.shadowRoot.getElementById('protocolList').value = ''
				this.shadowRoot.getElementById('domainInput').value = ''
				this.shadowRoot.getElementById('portInput').value = ''

				this.shadowRoot.querySelector('#addNodeDialog').close()
			}
		}
	}

	removeNode(event, index) {
		event.stopPropagation()

		let stored = JSON.parse(localStorage.getItem('myQortalNodes'))
		stored.splice(index, 1)
		localStorage.setItem('myQortalNodes', JSON.stringify(stored))
		store.dispatch(doRemoveNode(index))

		let snack6string = get('settings.snack6')
		snackbar.add({
			labelText: `${snack6string}`,
			dismiss: true
		})

		this.shadowRoot.querySelector('#addNodeDialog').close()
	}

	editNode(index) {
		const nameInput = this.shadowRoot.getElementById('nameInput').value
		const protocolList = this.shadowRoot.getElementById('protocolList').value
		const domainInput = this.shadowRoot.getElementById('domainInput').value
		const portInput = this.shadowRoot.getElementById('portInput').value

		if (protocolList.length >= 4 && domainInput.length >= 3 && portInput.length >= 2) {
			const nodeObject = {
				name: nameInput,
				protocol: protocolList,
				domain: domainInput,
				port: portInput,
				enableManagement: true,
			}

			let stored = JSON.parse(localStorage.getItem('myQortalNodes'))
			const copyStored = [...stored]
			copyStored[index] = nodeObject
			localStorage.setItem('myQortalNodes', JSON.stringify(copyStored))
			store.dispatch(doEditNode(index, nodeObject))

			let snack7string = get('settings.snack7')
			snackbar.add({
				labelText: `${snack7string}`,
				dismiss: true
			})

			this.shadowRoot.getElementById('nameInput').value = ''
			this.shadowRoot.getElementById('protocolList').value = ''
			this.shadowRoot.getElementById('domainInput').value = ''
			this.shadowRoot.getElementById('portInput').value = ''
			this.isBeingEdited = false
			this.isBeingEditedIndex = null

			this.shadowRoot.querySelector('#addNodeDialog').close()
		}
	}

	openImportNodesDialog() {
		this.shadowRoot.querySelector('#importQortalNodesListDialog').show()
	}

	closeImportNodesDialog() {
		this.shadowRoot.querySelector('#importQortalNodesListDialog').close()
	}

	renderExportNodesListButton() {
		return html`
			<mwc-button
				dense
				unelevated
				label="${translate('settings.export')}"
				@click="${() => this.exportQortalNodesList()}"
			>
			</mwc-button>
		`
	}

	exportQortalNodesList() {
		let nodelist = ''
		const qortalNodesList = JSON.stringify(
			localStorage.getItem('myQortalNodes')
		);
		const qortalNodesListSave = JSON.parse(qortalNodesList || '[]')
		const blob = new Blob([qortalNodesListSave], {
			type: 'text/plain;charset=utf-8',
		})
		nodelist = 'qortal.nodes'
		this.saveFileToDisk(blob, nodelist)
	}

	async saveFileToDisk(blob, fileName) {
		try {
			const fileHandle = await self.showSaveFilePicker({
				suggestedName: fileName,
				types: [{
					description: 'File'
				}],
			})
			const writeFile = async (fileHandle, contents) => {
				const writable = await fileHandle.createWritable()
				await writable.write(contents)
				await writable.close()
			}
			writeFile(fileHandle, blob).then(() => console.log('FILE SAVED'))

			let snack4string = get('settings.snack4')
			snackbar.add({
				labelText: `${snack4string} qortal.nodes`,
				dismiss: true
			})
		} catch (error) {
			if (error.name === 'AbortError') {
				return
			}
			FileSaver.saveAs(blob, fileName)
		}
	}

	renderImportNodesListButton() {
		return html`
			<mwc-button
				dense
				unelevated
				label="${translate('settings.import')}"
				@click="${() => this.openImportNodesDialog()}"
			>
			</mwc-button>
		`
	}

	async importQortalNodesList(file) {
		localStorage.removeItem('myQortalNodes')
		const newItems = JSON.parse(file || '[]')
		localStorage.setItem('myQortalNodes', JSON.stringify(newItems))
		this.shadowRoot.querySelector('#importQortalNodesListDialog').close()

		let snack5string = get('settings.snack5')
		snackbar.add({
			labelText: `${snack5string}`,
			dismiss: true,
		})

		localStorage.removeItem('mySelectedNode')
		localStorage.setItem('mySelectedNode', 0)

		store.dispatch(doLoadNodeConfig())
	}

	stateChanged(state) {
		this.config = state.config
		this.nodeConfig = state.app.nodeConfig
	}
}

window.customElements.define('settings-page', SettingsPage)

const settings = document.createElement('settings-page')
settingsDialog = document.body.appendChild(settings)

export default settingsDialog
