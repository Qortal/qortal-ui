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
import "@polymer/paper-spinner/paper-spinner-lite.js"
import '@material/mwc-dialog'
import {asyncReplace} from 'lit/directives/async-replace.js';

import { pageStyles } from "./sponsorship-list-css.src.js"

const parentEpml = new Epml({ type: "WINDOW", source: window.parent })

async function* countDown(count, callback) {
	
	
	while (count > 0) {
	  yield count--;
	  await new Promise((r) => setTimeout(r, 1000));
	  if(count === 0){
	
		callback()
	}
	}
  }

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
			errorMessage: { type: String },
			isLoadingCreateSponsorship: { type: Array },
			publicKeyValue: { type: String },
			isOpenModal: {type: Boolean},
			status: {type: Number},
			privateRewardShareKey: {type: String},
			timer: {type: Number},
			openDialogRewardShare: {type: Boolean}
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
		
		this.errorMessage = ""
		this.isLoadingCreateSponsorship = false
		this.publicKeyValue = ""
		this.isOpenModal = false
		this.status = 0
		this.privateRewardShareKey = ""
		this.openDialogRewardShare = false
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

	async saveToClipboard(text) {
		try {
			await navigator.clipboard.writeText(this.privateRewardShareKey)
			parentEpml.request('showSnackBar', text)
		} catch (err) {
			
			console.error('Copy to clipboard error:', err)
		}
	}
	changeStatus(value){
		this.status = value
		
		this.saveToClipboard('Copied to clipboard')
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

	async createRewardShare(publicKeyValue, isCopy) {
		this.openDialogRewardShare = true
		if(!publicKeyValue){
			this.errorMessage = "unable to pull public key from the chain, account has no outgoing transactions"
			return
		}
		this.privateRewardShareKey = ""
	
		this.errorMessage = ""
		const recipientPublicKey = publicKeyValue
		const percentageShare = 0
		const selectedAddress =
			window.parent.reduxStore.getState().app?.selectedAddress
		// Check for valid...
		this.isLoadingCreateSponsorship = true
		


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

	

		// Validate Reward Share by Level
		const validateReceiver = async () => {
			let accountDetails 
			try {
				accountDetails = await getAccountDetails()
			} catch (error) {
				this.errorMessage = "Couldn't fetch account details"
			}
			
			let lastRef = await getLastRef()
				if (accountDetails.level >= 5 || accountDetails.flags === 1) {
					this.status = 1
			
					this.errorMessage = ""

					try {
						const myTransaction = await makeTransactionRequest(lastRef)
				
				
						getTxnRequestResponse(myTransaction)
					} catch (error) {
						this.errorMessage = error
					}
					
				
				} else {
				
					let err5string = get("rewardsharepage.rchange20")
					this.errorMessage = `${err5string} ${accountDetails.level}`
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
				disableModal: true
			})
			return myTxnrequest
		}

		const getTxnRequestResponse = (txnResponse) => {
		
			if(txnResponse?.extraData?.rewardSharePrivateKey && (txnResponse?.data?.message?.includes('multiple') || txnResponse?.data?.message?.includes('SELF_SHARE_EXISTS')) ){
			
				this.privateRewardShareKey = txnResponse?.extraData?.rewardSharePrivateKey
				this.confirmRelationship(publicKeyValue, isCopy)
			} else if (txnResponse.success === false && txnResponse?.message) {
	
				this.errorMessage = txnResponse?.message
				this.isLoadingCreateSponsorship = false
				throw(txnResponse?.message)
			} else if (
				txnResponse.success === true &&
				!txnResponse.data.error
			) {
			
	
				this.privateRewardShareKey = txnResponse?.extraData?.rewardSharePrivateKey
				this.confirmRelationship(publicKeyValue, isCopy)
			} else {
		
				this.errorMessage = txnResponse?.data?.message || txnResponse?.message
				this.isLoadingCreateSponsorship = false
				throw(txnResponse?.data?.message || txnResponse?.message)
			}
		}
		validateReceiver()
	
	}



	async confirmRelationship(recipientPublicKey, isCopy){
		this.status = 2
		let interval = null
		let stop = false
		
		const getAnswer = async () => {
		
			if (!stop) {
				stop= true;
	
				try {
				
					const recipientAddress =
					window.parent.base58PublicKeyToAddress(recipientPublicKey)
				
					const minterAddress = window.parent.reduxStore.getState().app?.selectedAddress.address
				const myRewardShareArray = await parentEpml.request("apiCall", {
					type: "api",
					url: `/addresses/rewardshares?minters=${minterAddress}&recipients=${recipientAddress}`,
				})
					if(myRewardShareArray.length > 0){
						clearInterval(interval)
						this.status = 3

					
						this.timer = countDown(isCopy ? 5 : 180, ()=> this.changeStatus(4));
					}
					
				} catch (error) {
					console.error(error)
				
				}
	
				stop = false
			}
		};
		interval = setInterval(getAnswer, 5000);
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
						<div class="grid-item header">
							<p>${translate("sponsorshipspage.schange2")}</p>
						</div>
						<div class="grid-item header">
							<p>${translate("walletprofile.blocksminted")}</p>
						</div>
						
						<div class="grid-item header">
							<p>${translate("becomeMinterPage.bchange17")}</p>
						</div>
						<div class="grid-item header">
						
						</div>
					</div>

				
						${this.sponsorships.map(
							(sponsorship) => html`
								<ul class="tableGrid">
									<li class="grid-item">
									<p class="grid-item-text">
											Account Address
										</p>
										${sponsorship.address}
									</li>
									<li class="grid-item">
									<p class="grid-item-text">
											Blocks Minted
										</p>
										${+sponsorship.blocksMinted +
										+sponsorship.blocksMintedAdjustment}
									</li>
									
									<li class="grid-item">
									<p class="grid-item-text">
											Copy Sponsorship Key
										</p>
										
										<mwc-button @click=${()=> {

										
											this.createRewardShare(sponsorship?.publicKey, true)
										} }>copy</mwc-button>
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
					<p class="message-error">${this.errorMessage}</p>
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
								@click="${()=> this.createRewardShare(this.publicKeyValue)}"
							>
								${translate(
												"puzzlepage.pchange15"
										  )}
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
				<mwc-dialog escapeKeyAction="" scrimClickAction=""  id="showDialogRewardShareCreationStatus" ?hideActions=${this.errorMessage ? false : this.status < 4  ? true : false} ?open=${this.openDialogRewardShare}>
					
                    <div class="dialog-header" >
						<div class="row">
						<h1>In progress  </h1> <div class=${`smallLoading marginLoader ${this.status > 3 && 'hide'}`}></div>
						</div>
                       
                        <hr />
                    </div>
					<div class="dialog-container">
					<ul>
					
					
					
						<li class="row between">1. Creating relationship <div class=${`smallLoading marginLoader ${this.status !== 1 && 'hide'}`}></div></li>
						<li class=${`row between ${this.status < 2 && 'inactiveText' }`}>
							<p>
							2. Awaiting confirmation on blockchain
							</p>
							 <div class=${`smallLoading marginLoader ${this.status !== 2 && 'hide'}`}></div>
						
						</li>
					
						<li class=${`row between ${this.status < 3 && 'inactiveText' }`}>
						<p>
						3. Finishing up
							</p>

							<div class="row no-width">
							<div class=${`smallLoading marginLoader marginRight ${this.status !== 3 && 'hide'}`} ></div> ${asyncReplace(this.timer)}
							</div>
						
						
						</li>
						<li class=${`row between ${this.status < 4 && 'inactiveText' }`}>
							<p>
							4. Complete
							</p>
							
						
						</li>
						${this.privateRewardShareKey && this.status === 4  ? html`
						<li class=${`column word-break  ${this.status < 4 && 'inactiveText' }`}>
					
           <p style="work-break: break-word">Copy the key below and share it with your sponsored person.</p>
            <div style="background: #eee; padding: 8px; margin: 8px 0; border-radius: 5px;">
                <span style="color: #000;">${this.privateRewardShareKey}</span>
            </div>
			<mwc-button @click=${()=> {
				this.saveToClipboard('Copied to clipboard')
				} }>copy
			</mwc-button>
						</li>
						` : ''}
					</ul>
					${this.status === 4 ? '' : html`
					<div class="warning column">
						<p>
						Warning: do not leave this plugin or close the Qortal UI until completion!
						</p>
						<p class="message-error">${this.errorMessage}</p>
					</div>
					`}
					
					
					</div>
					<mwc-button
                        slot="primaryAction"
						@click=${()=>{
							this.openDialogRewardShare = false
							this.errorMessage = ''
							this.isLoadingCreateSponsorship = false
							this.privateRewardShareKey = ""
							this.atMount()
						}}
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
