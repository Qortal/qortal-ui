import {css, html, LitElement} from 'lit';
import {connect} from 'pwa-helpers';
import {store} from '../store.js';
import {get, translate} from '../../translate'
import {asyncReplace} from 'lit/directives/async-replace.js';

import '../functional-components/my-button.js';
import {routes} from '../plugins/routes.js';
import "@material/mwc-button"
import '@material/mwc-dialog'


async function* countDown(count, callback) {
	while (count > 0) {
		yield count--;
		await new Promise((r) => setTimeout(r, 1000));
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
		};
	}

	static get styles() {
		return [
			css`
			p, h1 {
				color: var(--black)
			}
			.dialogCustom {
				position: fixed;
    				z-index: 10000;
    				display: flex;
    				justify-content: center;
    				flex-direction: column;
    				align-items: center;
    				top: 0px;
    				bottom: 0px;
    				left: 0px;
    				width: 100vw;
			}
			.dialogCustomInner {
				width: 300px;
				min-height: 400px;
				background-color: var(--white);
				box-shadow: var(--mdc-dialog-box-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
				padding: 20px 24px;
				border-radius: 4px;
			}
			.dialogCustomInner ul {
				padding-left: 0px
			}
			.dialogCustomInner li {
				margin-bottom: 10px;
			}
			.start-minting-wrapper {
				position: absolute;
				transform: translate(50%, 20px);
				z-index: 10;
			}
			.dialog-header h1 {
				font-size: 18px;
			}
			.row {
				display: flex;
				width: 100%;
				align-items: center;
			}
			.modalFooter {
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
			.hide {
				visibility: hidden
			}
			.inactiveText {
				opacity: .60
			}
			.column {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.smallLoading,
			.smallLoading:after {
				border-radius: 50%;
				width: 2px;
				height: 2px;
			}
			.smallLoading {
				border-width: 0.6em;
				border-style: solid;
				border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
				rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
				font-size: 10px;
				position: relative;
				text-indent: -9999em;
				transform: translateZ(0px);
				animation: 1.1s linear 0s infinite normal none running loadingAnimation;
			}
			@-webkit-keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			@keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			.word-break {
				word-break:break-all;
			}
			.dialog-container {
				width: 300px;
				min-height: 300px;
				max-height: 75vh;
				padding: 5px;
				display: flex;
				align-items: flex-start;
				flex-direction: column;
			}
			.between {
				justify-content: space-between;
			}
			.no-width {
				width: auto
			}
			.between p {
				margin: 0;
				padding: 0;
				color: var(--black);
			}
			.marginLoader {
				margin-left: 10px;
			}
			.marginRight {
				margin-right: 10px;
			}
			.warning{
				display: flex;
				flex-grow: 1
			}
			.message-error {
				color: var(--error);
			}
			`,
		];
	}

	constructor() {
		super();
		this.addressInfo = {};
		this.mintingAccountData = [];
		this.errorMsg = '';
		this.openDialogRewardShare = false;
		this.status = 0;
		this.privateRewardShareKey = "";
		this.address = this.getAddress();
		this.nonce = this.getNonce();
		this.base58PublicKey = this.getBase58PublicKey()
	}
	getBase58PublicKey(){
		const appState = window.parent.reduxStore.getState().app;
const selectedAddress = appState && appState.selectedAddress;
const base58PublicKey = selectedAddress && selectedAddress.base58PublicKey;
		return base58PublicKey || ""
	}

	getAddress(){
		const appState = window.parent.reduxStore.getState().app;
const selectedAddress = appState && appState.selectedAddress;
const address = selectedAddress && selectedAddress.address;
		return address || ""

	}
	getNonce(){
		const appState = window.parent.reduxStore.getState().app;
const selectedAddress = appState && appState.selectedAddress;
const nonce = selectedAddress && selectedAddress.nonce;
		return nonce || ""

	}

	render() {
		return html` ${this.renderStartMintingButton()} `;
	}

	firstUpdated() {
		this.getMintingAcccounts();
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
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		const url = `${nodeUrl}/admin/mintingaccounts`;
		try {
			const res = await fetch(url);
			this.mintingAccountData = await res.json();
		} catch (error) {
			this.errorMsg = this.renderErrorMsg1();
		}
	}

	async changeStatus(value){
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		this.status = value
		const address = this.address

		// Check to see if a sponsorship key on a newly-level 1 minter exists. If it does, remove it.
		const findMintingAccountFromOtherUser = this.mintingAccountData.find((ma) => ma.recipientAccount === address && ma.mintingAccount !== address);

		const removeMintingAccount = async (publicKey) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`;
			return await fetch(url, {
				method: 'DELETE',
				body: publicKey,
			});
		};

		const addMintingAccount = async (sponsorshipKeyValue) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`;
			return await fetch(url, {
				method: 'POST',
				body: sponsorshipKeyValue,
			});
		};

		try {
			if (
				findMintingAccountFromOtherUser &&
				findMintingAccountFromOtherUser.publicKey &&
				findMintingAccountFromOtherUser.publicKey[0]
			) {
				await removeMintingAccount(
					findMintingAccountFromOtherUser.publicKey[0]
				);
			}

		} catch (error) {
			this.errorMsg = this.renderErrorMsg2();
			return;
		}

		try {
			await addMintingAccount(this.privateRewardShareKey);
			await routes.showSnackBar({
				data: translate('becomeMinterPage.bchange19'),
			});
			this.status = 5;
			await this.getMintingAcccounts();
		} catch (error) {
			this.errorMsg = this.renderErrorMsg3();

		}
	}

	async confirmRelationship() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
			store.getState().app.nodeConfig.node
			];
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;

		let interval = null
		let stop = false
		this.status = 2
		const getAnswer = async () => {
			const rewardShares = async (minterAddr) => {
				const url = `${nodeUrl}/addresses/rewardshares?minters=${minterAddr}&recipients=${minterAddr}`;
				const res = await fetch(url);
				return await res.json();
			};

			if (!stop) {
				stop = true;
				try {
					const address = this.address
					const myRewardShareArray = await rewardShares(address);
					if (myRewardShareArray.length > 0) {
						clearInterval(interval)
						this.status = 3
						this.timer = countDown(180, () => this.changeStatus(4));
					}

				} catch (error) {
				}
				stop = false
			}
		};
		interval = setInterval(getAnswer, 5000);
	}

	renderStartMintingButton() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		const mintingAccountData = this.mintingAccountData;
		const addressInfo = window.parent.reduxStore.getState().app.accountInfo.addressInfo
		const address = this.address
		const nonce = this.nonce
		const publicAddress = this.base58PublicKey
		const findMintingAccount = mintingAccountData.find((ma) => ma.mintingAccount === address);
		const isMinterButKeyMintingKeyNotAssigned = addressInfo && addressInfo.error !== 124 && addressInfo.level >= 1 && !findMintingAccount;

		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef;
			let rewarddialog1 = get('transactions.rewarddialog1');
			let rewarddialog2 = get('transactions.rewarddialog2');
			let rewarddialog3 = get('transactions.rewarddialog3');
			let rewarddialog4 = get('transactions.rewarddialog4');

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
						rewarddialog4: rewarddialog4,
					},
				},
				disableModal: true,
			});
		};

		const getTxnRequestResponse = (txnResponse) => {
			let err6string = get('rewardsharepage.rchange21');

			if (txnResponse && txnResponse.extraData && txnResponse.extraData.rewardSharePrivateKey &&
				txnResponse.data && (txnResponse.data.message && (txnResponse.data.message.includes('multiple') || txnResponse.data.message.includes('SELF_SHARE_EXISTS')))) {
				return err6string;
			}

			if (txnResponse.success === false && txnResponse.message) {
				throw txnResponse;
			} else if (txnResponse.success === true && txnResponse.data && !txnResponse.data.error) {
				return err6string;
			} else {
				throw txnResponse;
			}
		};


		const createSponsorshipKey = async () => {
			this.status = 1;
			let lastRef = await getLastRef();
			let myTransaction = await makeTransactionRequest(lastRef);
			getTxnRequestResponse(myTransaction);

			if (myTransaction && myTransaction.extraData) {
				return myTransaction.extraData.rewardSharePrivateKey;
			}
		};


		const getLastRef = async () => {
			const url = `${nodeUrl}/addresses/lastreference/${address}`;
			const res = await fetch(url);
			return await res.text();
		};

		const startMinting = async () => {
			this.openDialogRewardShare = true
			this.errorMsg = '';
			const address = this.address

			const findMintingAccountsFromUser = this.mintingAccountData.filter((ma) => ma.recipientAccount === address && ma.mintingAccount === address);

			if(findMintingAccountsFromUser.length > 2){
				this.errorMsg = translate("startminting.smchange10")
				return;
			}

			try {
				this.privateRewardShareKey = await createSponsorshipKey();
				await this.confirmRelationship(publicAddress)
			} catch (error) {
				console.log({ error })
				this.errorMsg = (error && error.data && error.data.message) ? error.data.message : this.renderErrorMsg4();

			}
		};

		return html`
			${isMinterButKeyMintingKeyNotAssigned ? html`
				<div class="start-minting-wrapper">
					<my-button label="${translate('becomeMinterPage.bchange18')}"
						?isLoading=${false}
						.onClick=${async () => {
							await startMinting();
							if (this.errorMsg) {
								await routes.showSnackBar({
									data: this.errorMsg,
								});
							}
						}}
					>
					</my-button>
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
									<p>
										1. ${translate("startminting.smchange5")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 1 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 2 && 'inactiveText'}`}>
									<p>
										2. ${translate("startminting.smchange6")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 2 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 3 && 'inactiveText'}`}>
									<p>
										3. ${translate("startminting.smchange7")}
									</p>
									<div class="row no-width">
										<div class=${`smallLoading marginLoader marginRight ${this.status !== 3 && 'hide'}`} ></div> <p>${asyncReplace(this.timer)}</p>
									</div>
								</li>

								<li class=${`row between ${this.status < 4 && 'inactiveText'}`}>
									<p>
										4. ${translate("startminting.smchange8")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 4 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 5 && 'inactiveText'}`}>
									<p>
										5. ${translate("startminting.smchange9")}
									</p>
								</li>
							</ul>
							<div class="warning column">
								<p>
									Warning: do not close the Qortal UI until completion!
								</p>
								<p class="message-error">${this.errorMsg}</p>
							</div>
						</div>
						<div class="modalFooter">
							${this.errorMsg || this.status === 5 ? html`
							<mwc-button
                        				slot="primaryAction"
								@click=${() => {
									this.openDialogRewardShare = false
									this.errorMsg = ''
								}}
                        				class="red"
                    				>
                    				${translate("general.close")}
                    				</mwc-button>
						` : '' }
					</div>
				</div>
			</div>

			` : ""}
			` : ''}
		`;
	}

	stateChanged(state) {
		this.addressInfo = state.app.accountInfo.addressInfo;
	}
}

window.customElements.define('start-minting', StartMinting);
