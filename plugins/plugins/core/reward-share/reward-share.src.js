import { html, LitElement } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml'
import { rewardShareStyles } from '../components/plugins-css'
import isElectron from 'is-electron'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@material/mwc-slider'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'

// Multi language support
import { get, registerTranslateConfig, translate, use } from '../../../../core/translate'
registerTranslateConfig({
	loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class RewardShare extends LitElement {
	static get properties() {
		return {
			isLoading: { type: Boolean },
			rewardShares: { type: Array },
			recipientPublicKey: { type: String },
			selectedAddress: { type: Object },
			btnDisable: { type: Boolean },
			createRewardShareLoading: { type: Boolean },
			removeRewardShareLoading: { type: Boolean },
			rewardSharePercentage: { type: Number },
			error: { type: Boolean },
			message: { type: String },
			theme: { type: String, reflect: true }
		}
	}

	static get styles() {
		return [rewardShareStyles]
	}

	constructor() {
		super()
		this.selectedAddress = {}
		this.rewardShares = []
		this.recipientPublicKey = ''
		this.rewardSharePercentage = 0
		this.btnDisable = false
		this.createRewardShareLoading = false
		this.removeRewardShareLoading = false
		this.isLoading = false
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
	}

	render() {
		return html`
			<div id="reward-share-page">
				<div style="min-height:48px; display: flex; padding-bottom: 6px;">
					<h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">${translate("rewardsharepage.rchange1")}</h3>
					<mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createRewardShareDialog').show()}>
						<mwc-icon>add</mwc-icon>
						${translate("rewardsharepage.rchange2")}
					</mwc-button>
					<mwc-button style="float:right;" @click=${() => this.shadowRoot.querySelector('#createSelfShareDialog').show()}>
						<mwc-icon>add</mwc-icon>
						${translate("rewardsharepage.rchange16")}
					</mwc-button>
				</div>
				<div class="divCard">
					<h3 style="margin: 0; margin-bottom: 1em; text-align: center;">${translate("rewardsharepage.rchange3")}</h3>
					<vaadin-grid id="accountRewardSharesGrid" ?hidden="${this.isEmptyArray(this.rewardShares)}" .items="${this.rewardShares}" all-rows-visible>
						<vaadin-grid-column auto-width header="${translate("rewardsharepage.rchange4")}" path="mintingAccount"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("rewardsharepage.rchange5")}" path="sharePercent"></vaadin-grid-column>
						<vaadin-grid-column auto-width header="${translate("rewardsharepage.rchange6")}" path="recipient"></vaadin-grid-column>
						<vaadin-grid-column width="12em" header="${translate("rewardsharepage.rchange7")} / ${translate("rewardsharepage.rchange8")}" .renderer=${(root, column, data) => {
							render(html`${this.renderRemoveRewardShareButton(data.item)}`, root)
						}}>
						</vaadin-grid-column>
					</vaadin-grid>
					${(this.isEmptyArray(this.rewardShares) && !this.isLoading) ? html`
						<span style="color: var(--black);">${translate("rewardsharepage.rchange15")}</span>
					`: ''}
					${this.isLoading ? html`
						<div class="spinner">
							<paper-spinner-lite active></paper-spinner-lite>
						</div>
					` : ''}
				</div>
				<mwc-dialog id="createRewardShareDialog" scrimClickAction="${this.createRewardShareLoading ? '' : 'close'}">
					<div>${translate("rewardsharepage.rchange9")}</div>
					<br>
					<mwc-textfield style="width:100%;" ?disabled="${this.createRewardShareLoading}" label="${translate("rewardsharepage.rchange10")}" id="recipientPublicKey"></mwc-textfield>
					<p style="margin-bottom:0;">
						${translate("rewardsharepage.rchange11")}: ${this.rewardSharePercentage}
					</p>
					<mwc-slider
						@change="${e => this.rewardSharePercentage = this.shadowRoot.getElementById('rewardSharePercentageSlider').value}"
						id="rewardSharePercentageSlider"
						style="width:100%;"
						step="1"
						pin
						markers
						max="100"
						value="${this.rewardSharePercentage}"
					>
					</mwc-slider>
					<div style="text-align:right; height:36px;">
						<span ?hidden="${!this.createRewardShareLoading}">
							<!-- loading message -->
							${translate("rewardsharepage.rchange13")} &nbsp;
							<paper-spinner-lite
								style="margin-top:12px;"
								?active="${this.createRewardShareLoading}"
								alt="${translate("rewardsharepage.rchange13")}"
							>
							</paper-spinner-lite>
						</span>
						<span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
							${this.message}
						</span>
					</div>
					<mwc-button
						?disabled="${this.createRewardShareLoading}"
						slot="primaryAction"
						@click=${this.createRewardShare}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
					<mwc-button
						?disabled="${this.createRewardShareLoading}"
						slot="secondaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
				<mwc-dialog id="createSelfShareDialog" scrimClickAction="${this.createRewardShareLoading ? '' : 'close'}">
					<div>${translate("rewardsharepage.rchange9")}</div>
					<br>
					<div>${translate("rewardsharepage.rchange10")}:<br>${this.selectedAddress.base58PublicKey}</div>
					<p style="margin-bottom:0;">
						${translate("rewardsharepage.rchange11")}: 0
					</p>
					<div style="text-align:right; height:36px;">
						<span ?hidden="${!this.createRewardShareLoading}">
							<!-- loading message -->
							${translate("rewardsharepage.rchange13")} &nbsp;
							<paper-spinner-lite
								style="margin-top:12px;"
								?active="${this.createRewardShareLoading}"
								alt="${translate("rewardsharepage.rchange13")}"
							>
							</paper-spinner-lite>
						</span>
						<span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
							${this.message}
						</span>
					</div>
					<mwc-button
						?disabled="${this.createRewardShareLoading}"
						slot="primaryAction"
						@click=${this.createSelfShare}
					>
						${translate("rewardsharepage.rchange14")}
					</mwc-button>
					<mwc-button
						?disabled="${this.createRewardShareLoading}"
						slot="secondaryAction"
						dialogAction="cancel"
						class="red"
					>
						${translate("general.close")}
					</mwc-button>
				</mwc-dialog>
			</div>
		`
	}

	firstUpdated() {
		this.changeTheme()
		this.changeLanguage()

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			use(checkLanguage)

			if (checkTheme === 'dark') {
				this.theme = 'dark'
			} else {
				this.theme = 'light'
			}

			document.querySelector('html').setAttribute('theme', this.theme)
		})

		if (!isElectron()) {
		} else {
			window.addEventListener('contextmenu', (event) => {
			})
		}

		const updateRewardshares = () => {
			this.isLoading = true
			this.rewardShares = []

			parentEpml.request('apiCall', {
				url: `/addresses/rewardshares?involving=${this.selectedAddress.address}`
			}).then(res => {
				this.rewardShares = res
				this.isLoading = false
			})

			setTimeout(updateRewardshares, 60000)
		}

		let configLoaded = false

		parentEpml.ready().then(() => {
			parentEpml.subscribe('selected_address', async selectedAddress => {
				this.selectedAddress = {}
				selectedAddress = JSON.parse(selectedAddress)
				if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
				this.selectedAddress = selectedAddress
			})

			parentEpml.subscribe('config', c => {
				if (!configLoaded) {
					setTimeout(updateRewardshares, 1)
					configLoaded = true
				}
				this.config = JSON.parse(c)
			})
		})

		parentEpml.imReady()

		this.clearConsole()

		setInterval(() => {
			this.clearConsole()
		}, 60000)
	}

	clearConsole() {
		if (!isElectron()) {
		} else {
			console.clear()
			window.parent.electronAPI.clearCache()
		}
	}

	changeTheme() {
		const checkTheme = localStorage.getItem('qortalTheme')

		if (checkTheme === 'dark') {
			this.theme = 'dark'
		} else {
			this.theme = 'light'
		}

		document.querySelector('html').setAttribute('theme', this.theme)
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem('qortalLanguage')

		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem('qortalLanguage', 'us')
			use('us')
		} else {
			use(checkLanguage)
		}
	}

	renderRemoveRewardShareButton(rewardShareObject) {
		if (rewardShareObject.recipient === this.selectedAddress.address) {
			return html`${translate("rewardsharepage.rchange16")}`
		} else {
			return html`<mwc-button class="red" ?disabled=${this.removeRewardShareLoading} @click=${() => this.removeRewardShare(rewardShareObject)}><mwc-icon>create</mwc-icon>${translate("rewardsharepage.rchange17")}</mwc-button>`
		}
	}

	async createRewardShare(e) {
		this.error = false
		this.message = ''

		const recipientPublicKey = this.shadowRoot.getElementById("recipientPublicKey").value
		const percentageShare = this.shadowRoot.getElementById("rewardSharePercentageSlider").value

		// Check for valid...
		this.createRewardShareLoading = true

		let recipientAddress = window.parent.base58PublicKeyToAddress(recipientPublicKey)

		// Get Last Ref
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}

		// Get Account Details
		const getAccountDetails = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/${this.selectedAddress.address}`
			})
		}

		// Get Reward Relationship if it already exists
		const getRewardShareRelationship = async (minterAddr) => {
			let isRewardShareExisting = false
			let myRewardShareArray = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/rewardshares?minters=${minterAddr}&recipients=${recipientAddress}`
			})
			isRewardShareExisting = myRewardShareArray.length !== 0
			return isRewardShareExisting
		}

		// Validate Reward Share by Level
		const validateReceiver = async () => {
			let accountDetails = await getAccountDetails()
			let lastRef = await getLastRef()
			let isExisting = await getRewardShareRelationship(this.selectedAddress.address)

			// Check for creating self share at different levels (also adding check for flags...)
			if (accountDetails.flags === 1) {
				this.error = false
				this.message = ''
				let myTransaction = await makeTransactionRequest(lastRef)
				if (isExisting === true) {
					this.error = true
					this.message = `Cannot Create Multiple Reward Shares!`
				} else {
					// Send the transaction for confirmation by the user
					this.error = false
					this.message = ''
					getTxnRequestResponse(myTransaction)
				}
			} else if (accountDetails.address === recipientAddress) {
				if (accountDetails.level >= 1 && accountDetails.level <= 4) {
					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err1string = get("rewardsharepage.rchange18")
						this.error = true
						this.message = `${err1string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else if (accountDetails.level >= 5) {

					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err2string = get("rewardsharepage.rchange19")
						this.error = true
						this.message = `${err2string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else {
					let err3string = get("rewardsharepage.rchange20")
					this.error = true
					this.message = `${err3string} ${accountDetails.level}`
				}
			} else {
				//Check for creating reward shares
				if (accountDetails.level >= 5) {
					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err4string = get("rewardsharepage.rchange18")
						this.error = true
						this.message = `${err4string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else {
					this.error = true
					let err5string = get("rewardsharepage.rchange20")
					this.message = `${err5string} ${accountDetails.level}`
				}
			}
		}

		// Make Transaction Request
		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef
			let rewarddialog1 = get("transactions.rewarddialog1")
			let rewarddialog2 = get("transactions.rewarddialog2")
			let rewarddialog3 = get("transactions.rewarddialog3")
			let rewarddialog4 = get("transactions.rewarddialog4")
			return await parentEpml.request('transaction', {
				type: 38,
				nonce: this.selectedAddress.nonce,
				params: {
					recipientPublicKey,
					percentageShare,
					lastReference: mylastRef,
					rewarddialog1: rewarddialog1,
					rewarddialog2: rewarddialog2,
					rewarddialog3: rewarddialog3,
					rewarddialog4: rewarddialog4
				}
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.error = true
				this.message = txnResponse.message
				throw new Error(txnResponse)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				this.message = get("rewardsharepage.rchange21")
				this.error = false
			} else {
				this.error = true
				this.message = txnResponse.data.message
				throw new Error(txnResponse)
			}
		}

		await validateReceiver()
		this.createRewardShareLoading = false
	}

	async createSelfShare(e) {
		this.error = false
		this.message = ''
		const recipientPublicKey = this.selectedAddress.base58PublicKey
		const percentageShare = 0

		// Check for valid...
		this.createRewardShareLoading = true

		let recipientAddress = window.parent.base58PublicKeyToAddress(recipientPublicKey)

		// Get Last Ref
		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}

		// Get Account Details
		const getAccountDetails = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/${this.selectedAddress.address}`
			})
		}

		// Get Reward Relationship if it already exists
		const getRewardShareRelationship = async (minterAddr) => {
			let isRewardShareExisting = false
			let myRewardShareArray = await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/rewardshares?minters=${minterAddr}&recipients=${recipientAddress}`
			})
			isRewardShareExisting = myRewardShareArray.length !== 0
			return isRewardShareExisting
		}

		// Validate Reward Share by Level
		const validateReceiver = async () => {
			let accountDetails = await getAccountDetails()
			let lastRef = await getLastRef()
			let isExisting = await getRewardShareRelationship(this.selectedAddress.address)

			// Check for creating self share at different levels (also adding check for flags...)
			if (accountDetails.flags === 1) {
				this.error = false
				this.message = ''
				let myTransaction = await makeTransactionRequest(lastRef)
				if (isExisting === true) {
					this.error = true
					this.message = `Cannot Create Multiple Reward Shares!`
				} else {
					// Send the transaction for confirmation by the user
					this.error = false
					this.message = ''
					getTxnRequestResponse(myTransaction)
				}
			} else if (accountDetails.address === recipientAddress) {
				if (accountDetails.level >= 1 && accountDetails.level <= 4) {
					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err1string = get("rewardsharepage.rchange18")
						this.error = true
						this.message = `${err1string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else if (accountDetails.level >= 5) {

					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err2string = get("rewardsharepage.rchange19")
						this.error = true
						this.message = `${err2string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else {
					let err3string = get("rewardsharepage.rchange20")
					this.error = true
					this.message = `${err3string} ${accountDetails.level}`
				}
			} else {
				//Check for creating reward shares
				if (accountDetails.level >= 5) {
					this.error = false
					this.message = ''
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err4string = get("rewardsharepage.rchange18")
						this.error = true
						this.message = `${err4string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.message = ''
						getTxnRequestResponse(myTransaction)
					}
				} else {
					this.error = true
					let err5string = get("rewardsharepage.rchange20")
					this.message = `${err5string} ${accountDetails.level}`
				}
			}
		}

		// Make Transaction Request
		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef
			let rewarddialog1 = get("transactions.rewarddialog1")
			let rewarddialog2 = get("transactions.rewarddialog2")
			let rewarddialog3 = get("transactions.rewarddialog3")
			let rewarddialog4 = get("transactions.rewarddialog4")
			return await parentEpml.request('transaction', {
				type: 38,
				nonce: this.selectedAddress.nonce,
				params: {
					recipientPublicKey,
					percentageShare,
					lastReference: mylastRef,
					rewarddialog1: rewarddialog1,
					rewarddialog2: rewarddialog2,
					rewarddialog3: rewarddialog3,
					rewarddialog4: rewarddialog4
				}
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.error = true
				this.message = txnResponse.message
				throw new Error(txnResponse)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				this.message = get("rewardsharepage.rchange21")
				this.error = false
			} else {
				this.error = true
				this.message = txnResponse.data.message
				throw new Error(txnResponse)
			}
		}

		await validateReceiver()
		this.createRewardShareLoading = false
	}

	async removeRewardShare(rewardShareObject) {
		const myPercentageShare = -1

		// Check for valid...
		this.removeRewardShareLoading = true

		// Get Last Ref
		const getLastRef = async () => {

			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
		}

		// Remove Reward Share
		const removeReceiver = async () => {
			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)

			getTxnRequestResponse(myTransaction)
		}

		// Make Transaction Request
		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef
			let rewarddialog5 = get("transactions.rewarddialog5")
			let rewarddialog6 = get("transactions.rewarddialog6")
			return await parentEpml.request('transaction', {
				type: 381,
				nonce: this.selectedAddress.nonce,
				params: {
					rewardShareKeyPairPublicKey: rewardShareObject.rewardSharePublicKey,
					recipient: rewardShareObject.recipient,
					percentageShare: myPercentageShare,
					lastReference: mylastRef,
					rewarddialog5: rewarddialog5,
					rewarddialog6: rewarddialog6
				}
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.removeRewardShareLoading = false
				parentEpml.request('showSnackBar', txnResponse.message)
				throw new Error(txnResponse)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				let err7tring = get("rewardsharepage.rchange22")
				this.removeRewardShareLoading = false
				parentEpml.request('showSnackBar', `${err7tring}`)
			} else {
				this.removeRewardShareLoading = false
				parentEpml.request('showSnackBar', txnResponse.data.message)
				throw new Error(txnResponse)
			}
		}

		await removeReceiver()
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('reward-share', RewardShare)