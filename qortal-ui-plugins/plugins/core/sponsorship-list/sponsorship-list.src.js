import { LitElement, html } from "lit"
import { Epml } from "../../../epml.js"
import "../components/ButtonIconCopy.js"
import { use, get, translate, registerTranslateConfig } from "lit-translate"
import { blocksNeed } from "../../utils/blocks-needed.js"
import "../components/ButtonIconCopy.js"

registerTranslateConfig({
	loader: (lang) => fetch(`/language/${lang}.json`).then((res) => res.json()),
})

import "@polymer/paper-spinner/paper-spinner-lite.js"
import "@material/mwc-button"
import "@material/mwc-textfield"
import "@vaadin/button"
import "@material/mwc-button"
import "@polymer/paper-spinner/paper-spinner-lite.js"
import '@material/mwc-dialog'

import { pageStyles } from "./sponsorship-list-css.src.js"

const parentEpml = new Epml({ type: "WINDOW", source: window.parent })

class SponsorshipList extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			nodeInfo: { type: Object },
			isPageLoading: { type: Boolean },
			addressInfo: { type: Object },
			rewardSharePublicKey: { type: String },
			mintingAccountData: { type: Array },
			sponsorships: { type: Array },
			removeRewardShareLoading: { type: Array },
			createSponsorshipMessage: { type: String },
			isLoadingCreateSponsorship: { type: Array },
			publicKeyValue: { type: String },
			error: { type: Boolean },
			isOpenModal: {type: Boolean}
		}
	}

	static styles = [pageStyles]

	constructor() {
		super()
		this.theme = localStorage.getItem("qortalTheme")
			? localStorage.getItem("qortalTheme")
			: "light"
		this.isPageLoading = true
		this.nodeInfo = {}
		this.addressInfo = {}
		this.rewardSharePublicKey = ""
		this.mintingAccountData = null
		this.sponsorships = []
		this.removeRewardShareLoading = false
		this.error = false
		this.createSponsorshipMessage = ""
		this.isLoadingCreateSponsorship = false
		this.publicKeyValue = ""
		this.isOpenModal = false
	}

	inputHandler(e) {
		this.publicKeyValue = e.target.value
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem("qortalLanguage")

		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem("qortalLanguage", "us")
			use("us")
		} else {
			use(checkLanguage)
		}
	}

	_handleStorage() {
		const checkLanguage = localStorage.getItem("qortalLanguage")
		const checkTheme = localStorage.getItem("qortalTheme")

		use(checkLanguage)

		if (checkTheme === "dark") {
			this.theme = "dark"
		} else {
			this.theme = "light"
		}
		document.querySelector("html").setAttribute("theme", this.theme)
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener("storage", this._handleStorage)
	}

	disconnectedCallback() {
		window.removeEventListener("storage", this._handleStorage)
		super.disconnectedCallback()
	}

	async getNodeInfo() {
		const nodeInfo = await parentEpml.request("apiCall", {
			url: `/admin/status`,
		})

		return nodeInfo
	}

	async atMount() {
		this.changeLanguage()

		this.addressInfo =
			window.parent.reduxStore.getState().app.accountInfo.addressInfo
		this.isPageLoading = true
		try {
		
			const address =
				window.parent.reduxStore.getState().app?.selectedAddress
					?.address
			let rewardShares = await this.getRewardShareRelationship(
				address
			)

			rewardShares = rewardShares.filter((rs) => rs.recipient !== address)

			const getAccountInfo = rewardShares.map(async (rs) => {
				const addressInfo = await parentEpml.request("apiCall", {
					type: "api",
					url: `/addresses/${rs.recipient}`,
				})
				
				let blocksRemaining = this._levelUpBlocks(addressInfo)
				blocksRemaining = +blocksRemaining > 0 ? +blocksRemaining : 0
				return {
					...addressInfo,
					...rs,
					
					blocksRemaining: blocksRemaining,
				}
			})
			const accountInfoValues = await Promise.all(getAccountInfo)

			this.sponsorships = accountInfoValues
			this.nextSponsorshipEnding = accountInfoValues
				.filter((sponsorship) => sponsorship.blocksRemaining !== 0)
				.sort((a, b) => a.blocksRemaining - b.blocksRemaining)[0]
			this.isPageLoading = false

			const openModal = accountInfoValues.find(s=> s.blocksRemaining <= 0)
			if(openModal){
				this.shadowRoot.querySelector('#showDialog').show()
			}
		} catch (error) {
			

			this.isPageLoading = false
		}
	}

	async firstUpdated() {
		await this.atMount()
	}

	async getRewardShareRelationship(recipientAddress) {
		const myRewardShareArray = await parentEpml.request("apiCall", {
			type: "api",
			url: `/addresses/rewardshares?minters=${recipientAddress}`,
		})

		return myRewardShareArray
	}

	_levelUpBlocks(accountInfo) {
		let countBlocksString = (
			blocksNeed(0) -
			(accountInfo?.blocksMinted + accountInfo?.blocksMintedAdjustment)
		).toString()
		return countBlocksString
	}

	async removeRewardShare(rewardShareObject) {
		
		const selectedAddress =
			window.parent.reduxStore.getState().app?.selectedAddress

		const myPercentageShare = -1

		// Check for valid...
		this.removeRewardShareLoading = true

		// Get Last Ref
		const getLastRef = async () => {
			let myRef = await parentEpml.request("apiCall", {
				type: "api",
				url: `/addresses/lastreference/${selectedAddress?.address}`,
			})
			return myRef
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
			let myTxnrequest = await parentEpml.request("transaction", {
				type: 381,
				nonce: selectedAddress?.nonce,
				params: {
					rewardShareKeyPairPublicKey:
						rewardShareObject.rewardSharePublicKey,
					recipient: rewardShareObject.recipient,
					percentageShare: myPercentageShare,
					lastReference: mylastRef,
					rewarddialog5: rewarddialog5,
					rewarddialog6: rewarddialog6,
				},
			})
			return myTxnrequest
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.removeRewardShareLoading = false
				parentEpml.request("showSnackBar", txnResponse.message)
				throw new Error(txnResponse)
			} else if (
				txnResponse.success === true &&
				!txnResponse.data.error
			) {
				let err7tring = get("rewardsharepage.rchange22")
				this.removeRewardShareLoading = false
				parentEpml.request("showSnackBar", `${err7tring}`)
				this.sponsorships = this.sponsorships.filter((s)=> s.address !== rewardShareObject.address)
			} else {
				this.removeRewardShareLoading = false
				parentEpml.request("showSnackBar", txnResponse.data.message)
				throw new Error(txnResponse)
			}
		}
		removeReceiver()
	}

	async createRewardShare(e) {
		this.error = false
		this.createSponsorshipMessage = ""
		const recipientPublicKey = this.publicKeyValue
		const percentageShare = 0
		const selectedAddress =
			window.parent.reduxStore.getState().app?.selectedAddress
		// Check for valid...
		this.isLoadingCreateSponsorship = true

		let recipientAddress =
			window.parent.base58PublicKeyToAddress(recipientPublicKey)

		// Get Last Ref
		const getLastRef = async () => {
			let myRef = await parentEpml.request("apiCall", {
				type: "api",
				url: `/addresses/lastreference/${selectedAddress.address}`,
			})
			return myRef
		}

		// Get Account Details
		const getAccountDetails = async () => {
			let myAccountDetails = await parentEpml.request("apiCall", {
				type: "api",
				url: `/addresses/${selectedAddress.address}`,
			})
			return myAccountDetails
		}

		// Get Reward Relationship if it already exists
		const getRewardShareRelationship = async (minterAddr) => {
			let isRewardShareExisting = false
			let myRewardShareArray = await parentEpml.request("apiCall", {
				type: "api",
				url: `/addresses/rewardshares?minters=${minterAddr}&recipients=${recipientAddress}`,
			})
			isRewardShareExisting =
				myRewardShareArray.length !== 0 ? true : false
			return isRewardShareExisting
		}

		// Validate Reward Share by Level
		const validateReceiver = async () => {
			let accountDetails = await getAccountDetails()
			let lastRef = await getLastRef()
			let isExisting = await getRewardShareRelationship(
				selectedAddress.address
			)

			// Check for creating self share at different levels (also adding check for flags...)
			if (accountDetails.flags === 1) {
				this.error = false
				this.createSponsorshipMessage = ""
				let myTransaction = await makeTransactionRequest(lastRef)
				if (isExisting === true) {
					this.error = true
					this.createSponsorshipMessage = `Cannot Create Multiple Reward Shares!`
				} else {
					// Send the transaction for confirmation by the user
					this.error = false
					this.createSponsorshipMessage = ""
					getTxnRequestResponse(myTransaction)
				}
			} else if (accountDetails.address === recipientAddress) {
				if (accountDetails.level >= 1 && accountDetails.level <= 4) {
					this.error = false
					this.createSponsorshipMessage = ""
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err1string = get("rewardsharepage.rchange18")
						this.error = true
						this.createSponsorshipMessage = `${err1string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.createSponsorshipMessage = ""
						getTxnRequestResponse(myTransaction)
					}
				} else if (accountDetails.level >= 5) {
					this.error = false
					this.createSponsorshipMessage = ""
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err2string = get("rewardsharepage.rchange19")
						this.error = true
						this.createSponsorshipMessage = `${err2string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.createSponsorshipMessage = ""
						getTxnRequestResponse(myTransaction)
					}
				} else {
					let err3string = get("rewardsharepage.rchange20")
					this.error = true
					this.createSponsorshipMessage = `${err3string} ${accountDetails.level}`
				}
			} else {
				//Check for creating reward shares
				if (accountDetails.level >= 5) {
					this.error = false
					this.createSponsorshipMessage = ""
					let myTransaction = await makeTransactionRequest(lastRef)
					if (isExisting === true) {
						let err4string = get("rewardsharepage.rchange18")
						this.error = true
						this.createSponsorshipMessage = `${err4string}`
					} else {
						// Send the transaction for confirmation by the user
						this.error = false
						this.createSponsorshipMessage = ""
						getTxnRequestResponse(myTransaction)
					}
				} else {
					this.error = true
					let err5string = get("rewardsharepage.rchange20")
					this.createSponsorshipMessage = `${err5string} ${accountDetails.level}`
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
			let myTxnrequest = await parentEpml.request("transaction", {
				type: 38,
				nonce: selectedAddress.nonce,
				params: {
					recipientPublicKey,
					percentageShare,
					lastReference: mylastRef,
					rewarddialog1: rewarddialog1,
					rewarddialog2: rewarddialog2,
					rewarddialog3: rewarddialog3,
					rewarddialog4: rewarddialog4,
				},
			})
			return myTxnrequest
		}

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				this.error = true
				this.createSponsorshipMessage = txnResponse.message
				throw new Error(txnResponse)
			} else if (
				txnResponse.success === true &&
				!txnResponse.data.error
			) {
				let err6string = get("rewardsharepage.rchange21")
				this.createSponsorshipMessage = err6string
				this.error = false
			} else {
				this.error = true
				this.createSponsorshipMessage = txnResponse.data.message
				throw new Error(txnResponse)
			}
		}
		validateReceiver()
		this.isLoadingCreateSponsorship = false
	}


	render() {

		return html`
			${
				this.isPageLoading
					? html`
							<div class="loadingContainer">
								<div class="loading"></div>
							</div>
							<div class="backdrop"></div>
					  `
					: ""
			}

			<div class="page-container">
				<h1 class="header-title">
					${translate("mintingpage.mchange35")}
				</h1>
				<div class="fullWidth">
					<hr class="divider" />
				</div>
				<div class="inner-container">
					${this.sponsorships.length === 0 ? html`
					<div class="sub-title">
						<p>${translate("sponsorshipspage.schange9")}</p>
					</div>
					` : ''}
				${this.sponsorships.length > 0 ?
						html`
					<div class="sub-title">
						<p>${translate("sponsorshipspage.schange1")}</p>
					</div>
					<div class="tableGrid table-header">
						<div class="grid-item">
							<p>${translate("sponsorshipspage.schange2")}</p>
						</div>
						<div class="grid-item">
							<p>${translate("walletprofile.blocksminted")}</p>
						</div>
						
						<div class="grid-item">
							<p>${translate("becomeMinterPage.bchange17")}</p>
						</div>
						<div class="grid-item">
						
						</div>
					</div>

				
						${this.sponsorships.map(
							(sponsorship) => html`
								<ul class="tableGrid">
									<li class="grid-item">
										
										${sponsorship.address}
									</li>
									<li class="grid-item">
										
										${+sponsorship.blocksMinted +
										+sponsorship.blocksMintedAdjustment}
									</li>
									
									<li class="grid-item">
										
										<button-icon-copy
											title="${translate(
												"becomeMinterPage.bchange17"
											)}"
											onSuccessMessage="${translate(
												"walletpage.wchange4"
											)}"
											onErrorMessage="${translate(
												"walletpage.wchange39"
											)}"
											textToCopy=${sponsorship.rewardSharePublicKey}
											buttonSize="28px"
											iconSize="16px"
											color="var(--copybutton)"
											offsetLeft="4px"
										></button-icon-copy>
									</li>
									<li class="grid-item grid-item-button">
										<mwc-button
											class=${`red ${sponsorship.blocksRemaining <= 0 && 'btn--sponsorshipfinished'}`}
											?disabled=${this
												.removeRewardShareLoading}
											@click=${() =>
												this.removeRewardShare(
													sponsorship
												)}
											><mwc-icon>create</mwc-icon
											>${translate(
												"rewardsharepage.rchange17"
											)}</mwc-button>
										
									</li>
								</ul>
							`
						)}
					
					
							<div class="summary-box">
								<p class="text text--bold">
								${translate("sponsorshipspage.schange3")} =
									<span class="text text--normal">
									${this.sponsorships.length}
									</span>
									
								</p>
								<p class="text text--bold">
								${translate("sponsorshipspage.schange4")} = 
									<span class="text text--normal">
									${this.nextSponsorshipEnding
										?.blocksRemaining}
									${translate("mintingpage.mchange26")}
									</span>
									
								</p>
							</div>
						`
					: ''}
					<p class="message">${this.createSponsorshipMessage}</p>
					<div class="form-wrapper">
						<div class="sponsor-minter-wrapper">
							<p class="sponsor-minter-text">${translate("sponsorshipspage.schange5")}</p>
						</div>
						<div class="form-item form-item--input">
							<mwc-textfield
								?disabled="${this.isLoadingCreateSponsorship}"
								label="${translate("rewardsharepage.rchange10")}"
								id="addPublicKey"
								@input="${this.inputHandler}"
								.value="${this.publicKeyValue || ""}"
								fullWidth
							>
							</mwc-textfield>
						</div>
						<div class="form-item form-item--button">
							<vaadin-button
								?disabled="${this.isLoadingCreateSponsorship || !this.publicKeyValue}"
								@click="${this.createRewardShare}"
							>
								${
									this.isLoadingCreateSponsorship === false
										? html`${translate(
												"puzzlepage.pchange15"
										  )}`
										: html`<paper-spinner-lite
												active
										  ></paper-spinner-lite>`
								}
							</vaadin-button>
						</div>
					</div>
				</div>
				<mwc-dialog  id="showDialog">
					
                    <div class="dialog-header" >
                        <h1>${translate("sponsorshipspage.schange6")}</h1>
                        <hr />
                    </div>
					<div class="dialog-container">

					<p class="dialog-paragraph" style="text-align:center; width:100%">${this.sponsorships.filter(s=> s.blocksRemaining <= 0).length} ${translate("sponsorshipspage.schange7")}!</p>

					<p class="dialog-paragraph" style="margin:0px; padding:0px;text-decoration:underline"> ${translate("sponsorshipspage.schange8")}</p>
						${this.sponsorships.filter(s=> s.blocksRemaining <= 0).map((ms)=> html`
						<p class="dialog-paragraph">${ms.address}</p>
						`)}
					</div>
                 
                    <mwc-button
                        slot="primaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                    </mwc-button>
				
                </mwc-dialog>
			</div>
		`
	}
}

window.customElements.define("sponsorship-list", SponsorshipList)
