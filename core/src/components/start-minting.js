import { html, LitElement } from 'lit'
import { asyncReplace } from 'lit/directives/async-replace.js'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { routes } from '../plugins/routes'
import { startMintingStyles } from '../styles/core-css'
import '../functional-components/my-button'
import "@material/mwc-button"
import '@material/mwc-dialog'

// Multi language support
import { get, translate } from '../../translate'

async function* countDown(count, callback) {
	while (count > 0) {
		yield count--
		await new Promise((r) => setTimeout(r, 1000))
		if (count === 0) {
			callback()
		}
	}
}

class StartMinting extends connect(store)(LitElement) {
	static get properties() {
		return {
			addressInfo: { type: Object },
			mintingAccountData: { type: Array },
			errorMsg: { type: String },
			openDialogRewardShare: { type: Boolean },
			status: { type: Number },
			timer: { type: Number },
			privateRewardShareKey: { type: String }
		}
	}

	static get styles() {
		return [startMintingStyles]
	}

	constructor() {
		super()
		this.addressInfo = {}
		this.mintingAccountData = []
		this.errorMsg = ''
		this.openDialogRewardShare = false
		this.status = 0
		this.privateRewardShareKey = ''
		this.address = this.getAddress()
		this.nonce = this.getNonce()
		this.base58PublicKey = this.getBase58PublicKey()
	}

	render() {
		return html`${this.renderStartMintingButton()}`
	}

	firstUpdated() {
		this.getMintingAcccounts()
	}

	getBase58PublicKey() {
		const appState = window.parent.reduxStore.getState().app
		const selectedAddress = appState && appState.selectedAddress
		const base58PublicKey = selectedAddress && selectedAddress.base58PublicKey

		return base58PublicKey || ''
	}

	getAddress() {
		const appState = window.parent.reduxStore.getState().app
		const selectedAddress = appState && appState.selectedAddress
		const address = selectedAddress && selectedAddress.address

		return address || ''
	}

	getNonce() {
		const appState = window.parent.reduxStore.getState().app
		const selectedAddress = appState && appState.selectedAddress
		const nonce = selectedAddress && selectedAddress.nonce

		return nonce || ''
	}

	renderErrorMsg1() {
		return html`${translate("startminting.smchange1")}`
	}

	renderErrorMsg2() {
		return html`${translate("startminting.smchange2")}`
	}

	renderErrorMsg3() {
		return html`${translate("startminting.smchange3")}`
	}

	renderErrorMsg4() {
		return html`${translate("startminting.smchange4")}`
	}

	async getMintingAcccounts() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/admin/mintingaccounts`

		try {
			const res = await fetch(url)

			this.mintingAccountData = await res.json()
		} catch (error) {
			this.errorMsg = this.renderErrorMsg1()
		}
	}

	async changeStatus(value) {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const address = this.address

		this.status = value

		// Check to see if a sponsorship key on a newly-level 1 minter exists. If it does, remove it.
		const findMintingAccountFromOtherUser = this.mintingAccountData.find((ma) => ma.recipientAccount === address && ma.mintingAccount !== address)

		const removeMintingAccount = async (publicKey) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`
			return await fetch(url, {
				method: 'DELETE',
				body: publicKey
			})
		}

		const addMintingAccount = async (sponsorshipKeyValue) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`

			return await fetch(url, {
				method: 'POST',
				body: sponsorshipKeyValue
			})
		}

		try {
			if (findMintingAccountFromOtherUser && findMintingAccountFromOtherUser.publicKey && findMintingAccountFromOtherUser.publicKey[0]) {
				await removeMintingAccount(
					findMintingAccountFromOtherUser.publicKey[0]
				)
			}
		} catch (error) {
			this.errorMsg = this.renderErrorMsg2()

			return
		}

		try {
			await addMintingAccount(this.privateRewardShareKey)

			await routes.showSnackBar({
				data: translate('becomeMinterPage.bchange19')
			})

			this.status = 5

			await this.getMintingAcccounts()
		} catch (error) {
			this.errorMsg = this.renderErrorMsg3()

		}
	}

	async confirmRelationship() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		let interval = null
		let stop = false

		this.status = 2

		const getAnswer = async () => {
			const rewardShares = async (minterAddr) => {
				const url = `${nodeUrl}/addresses/rewardshares?minters=${minterAddr}&recipients=${minterAddr}`
				const res = await fetch(url)

				return await res.json()
			}

			if (!stop) {
				stop = true

				try {
					const address = this.address
					const myRewardShareArray = await rewardShares(address)

					if (myRewardShareArray.length > 0) {
						clearInterval(interval)

						this.status = 3
						this.timer = countDown(180, () => this.changeStatus(4))
					}
				} catch (error) { }

				stop = false
			}
		}

		interval = setInterval(getAnswer, 5000)
	}

	renderStartMintingButton() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const mintingAccountData = this.mintingAccountData
		const addressInfo = window.parent.reduxStore.getState().app.accountInfo.addressInfo
		const address = this.address
		const nonce = this.nonce
		const publicAddress = this.base58PublicKey
		const findMintingAccount = mintingAccountData.find((ma) => ma.mintingAccount === address)
		const isMinterButKeyMintingKeyNotAssigned = addressInfo && addressInfo.error !== 124 && addressInfo.level >= 1 && !findMintingAccount

		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef
			let rewarddialog1 = get('transactions.rewarddialog1')
			let rewarddialog2 = get('transactions.rewarddialog2')
			let rewarddialog3 = get('transactions.rewarddialog3')
			let rewarddialog4 = get('transactions.rewarddialog4')

			return await routes.transaction({
				data: {
					type: 38,
					nonce: nonce,
					params: {
						recipientPublicKey: publicAddress,
						percentageShare: 0,
						lastReference: mylastRef,
						rewarddialog1: rewarddialog1,
						rewarddialog2: rewarddialog2,
						rewarddialog3: rewarddialog3,
						rewarddialog4: rewarddialog4
					}
				},
				disableModal: true
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			let err6string = get('rewardsharepage.rchange21')

			if (txnResponse && txnResponse.extraData && txnResponse.extraData.rewardSharePrivateKey &&
				txnResponse.data && (txnResponse.data.message && (txnResponse.data.message.includes('multiple') || txnResponse.data.message.includes('SELF_SHARE_EXISTS')))) {
				return err6string
			}

			if (txnResponse.success === false && txnResponse.message) {
				throw txnResponse
			} else if (txnResponse.success === true && txnResponse.data && !txnResponse.data.error) {
				return err6string
			} else {
				throw txnResponse
			}
		}

		const createSponsorshipKey = async () => {
			this.status = 1

			let lastRef = await getLastRef()
			let myTransaction = await makeTransactionRequest(lastRef)

			getTxnRequestResponse(myTransaction)

			if (myTransaction && myTransaction.extraData) {
				return myTransaction.extraData.rewardSharePrivateKey
			}
		}


		const getLastRef = async () => {
			const url = `${nodeUrl}/addresses/lastreference/${address}`
			const res = await fetch(url)

			return await res.text()
		}

		const startMinting = async () => {
			this.openDialogRewardShare = true
			this.errorMsg = ''

			const address = this.address

			const findMintingAccountsFromUser = this.mintingAccountData.filter((ma) => ma.recipientAccount === address && ma.mintingAccount === address)

			if (findMintingAccountsFromUser.length > 2) {
				this.errorMsg = translate("startminting.smchange10")

				return
			}

			try {
				this.privateRewardShareKey = await createSponsorshipKey()

				await this.confirmRelationship(publicAddress)
			} catch (error) {
				console.log({ error })

				this.errorMsg = (error && error.data && error.data.message) ? error.data.message : this.renderErrorMsg4()
			}
		}

		return html`
			${isMinterButKeyMintingKeyNotAssigned ? html`
				<div class="start-minting-wrapper">
					<my-button
						label="${translate('becomeMinterPage.bchange18')}"
						?isLoading=${false}
						.onClick=${async () => {
							await startMinting();
							if (this.errorMsg) {
								await routes.showSnackBar({
									data: this.errorMsg
								});
							}
						}}
					></my-button>
				</div>
				<!-- Dialog for tracking the progress of starting minting -->
				${this.openDialogRewardShare ? html`
					<div class="dialogCustom">
						<div class="dialogCustomInner">
							<div class="dialog-header" >
								<div class="row">
									<h1>In progress</h1>
									<div class=${`smallLoading marginLoader ${this.status > 3 && 'hide'}`}></div>
								</div>
								<hr />
							</div>
							<div class="dialog-container">
								<ul>
									<li class="row between">
										<p>1. ${translate("startminting.smchange5")}</p>
										<div class=${`smallLoading marginLoader ${this.status !== 1 && 'hide'}`}></div>
									</li>
									<li class=${`row between ${this.status < 2 && 'inactiveText'}`}>
										<p>2. ${translate("startminting.smchange6")}</p>
										<div class=${`smallLoading marginLoader ${this.status !== 2 && 'hide'}`}></div>
									</li>
									<li class=${`row between ${this.status < 3 && 'inactiveText'}`}>
										<p>3. ${translate("startminting.smchange7")}</p>
										<div class="row no-width">
											<div class=${`smallLoading marginLoader marginRight ${this.status !== 3 && 'hide'}`} ></div>
											<p>${asyncReplace(this.timer)}</p>
										</div>
									</li>
									<li class=${`row between ${this.status < 4 && 'inactiveText'}`}>
										<p>4. ${translate("startminting.smchange8")}</p>
										<div class=${`smallLoading marginLoader ${this.status !== 4 && 'hide'}`}></div>
									</li>
									<li class=${`row between ${this.status < 5 && 'inactiveText'}`}>
										<p>5. ${translate("startminting.smchange9")}</p>
									</li>
								</ul>
								<div class="warning column">
									<p>Warning: do not close the Qortal UI until completion!</p>
									<p class="message-error">${this.errorMsg}</p>
								</div>
							</div>
							<div class="modalFooter">
								${this.errorMsg || this.status === 5 ? html`
									<mwc-button slot="primaryAction" @click=${() => { this.openDialogRewardShare = false; this.errorMsg = '';}} class="red">
										${translate("general.close")}
									</mwc-button>
								` : ''}
							</div>
						</div>
					</div>
				` : ''}
			` : ''}
		`
	}

	stateChanged(state) {
		this.addressInfo = state.app.accountInfo.addressInfo
	}
}

window.customElements.define('start-minting', StartMinting)