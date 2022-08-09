import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { translate, get } from 'lit-translate';

import '../functional-components/my-button.js';
import { routes } from '../plugins/routes.js';

class StartMinting extends connect(store)(LitElement) {
	static get properties() {
		return {
			addressInfo: { type: Object },
			mintingAccountData: { type: Array },
			errorMsg: { type: String },
		};
	}

	static get styles() {
		return [
			css`
				.start-minting-wrapper {
					position: absolute;
					bottom: 130px;
					left: 50%;
					transform: translateX(calc(-50% - 10px));
				}
			`,
		];
	}

	constructor() {
		super();

		this.addressInfo = {};
		this.mintingAccountData = [];
		this.errorMsg = '';
	}

	render() {
		return html` ${this.renderStartMintingButton()} `;
	}

	firstUpdated() {
		this.getMintingAcccounts();
	}

	async getMintingAcccounts() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				store.getState().app.nodeConfig.node
			];
		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		const url = `${nodeUrl}/admin/mintingaccounts`;
		try {
			const res = await fetch(url);
			const mintingAccountData = await res.json();

			this.mintingAccountData = mintingAccountData;
		} catch (error) {
			this.errorMsg = 'Cannot fetch minting accounts';
		}
	}

	renderStartMintingButton() {
		const myNode =
			store.getState().app.nodeConfig.knownNodes[
				store.getState().app.nodeConfig.node
			];
		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		const mintingAccountData = this.mintingAccountData;

		const addressInfo = this.addressInfo;
		const rewardShares = async (minterAddr) => {
			const url = `${nodeUrl}/addresses/rewardshares?minters=${minterAddr}&recipients=${minterAddr}`;
			const res = await fetch(url);
			const data = await res.json();
			return data;
		};
		const address =
			window.parent.reduxStore.getState().app?.selectedAddress?.address;
		const nonce =
			window.parent.reduxStore.getState().app?.selectedAddress?.nonce;
		const publicAddress =
			window.parent.reduxStore.getState().app?.selectedAddress
				?.base58PublicKey;

		const findMintingAccount = mintingAccountData.find((ma) =>
			ma.publicKey.includes(publicAddress)
		);
		const isMinterButKeyMintingKeyNotAssigned =
			addressInfo?.error !== 124 &&
			addressInfo?.level === 1 &&
			!findMintingAccount;

		const removeMintingAccount = async (publicKey) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`;

			return await fetch(url, {
				method: 'DELETE',
				body: publicKey,
			});
		};

		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef;
			let rewarddialog1 = get('transactions.rewarddialog1');
			let rewarddialog2 = get('transactions.rewarddialog2');
			let rewarddialog3 = get('transactions.rewarddialog3');
			let rewarddialog4 = get('transactions.rewarddialog4');

			let myTxnrequest = await routes.transaction({
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
			});
			return myTxnrequest;
		};

		const getTxnRequestResponse = (txnResponse) => {
			if (txnResponse.success === false && txnResponse.message) {
				throw new Error(txnResponse);
			} else if (
				txnResponse.success === true &&
				!txnResponse.data.error
			) {
				let err6string = get('rewardsharepage.rchange21');
				return err6string;
			} else {
				throw new Error(txnResponse);
			}
		};

		const createSponsorshipKey = async () => {
			let lastRef = await getLastRef();

			let myTransaction = await makeTransactionRequest(lastRef);

			getTxnRequestResponse(myTransaction);
			return myTransaction.data;
		};
		const addMintingAccount = async (sponsorshipKeyValue) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`;

			return await fetch(url, {
				method: 'POST',
				body: sponsorshipKeyValue,
			});
		};

		const getLastRef = async () => {
			const url = `${nodeUrl}/addresses/lastreference/${address}`;

			const res = await fetch(url);

			const data = await res.text();

			return data;
		};
		const startMinting = async () => {
			this.errorMsg = '';
			let rewardSharesList;
			try {
				rewardSharesList = await rewardShares(address);
			} catch (error) {
				this.errorMsg = 'Cannot fetch reward shares';
				return;
			}
			// check to see if self-share exists

			const findRewardShareData = rewardSharesList.find(
				(rs) =>
					rs?.mintingAccount === address && rs?.recipient === address
			);
			let sponsorshipKeyValue = null;
			try {
				if (!findRewardShareData) {
					// if no self-share exits, create one.
					sponsorshipKeyValue = await createSponsorshipKey();
				} else {
					sponsorshipKeyValue =
						findRewardShareData.rewardSharePublicKey;
				}
			} catch (error) {
				this.errorMsg = 'Cannot create sponsorship key';
				return;
			}

			// Check to see if a sponsorship key on a newly-level 1 minter exists. If it does, remove it.
			const findMintingAccountFromOtherUser = mintingAccountData.find(
				(ma) => !ma.publicKey.includes(publicAddress)
			);

			try {
				if (
					findMintingAccountFromOtherUser &&
					findMintingAccountFromOtherUser?.publicKey[0]
				) {
					await removeMintingAccount(
						findMintingAccountFromOtherUser?.publicKey[0]
					);
				}
			} catch (error) {
				this.errorMsg = 'Failed to remove key';
				return;
			}

			try {
				await addMintingAccount(sponsorshipKeyValue);
				routes.showSnackBar({
					data: translate('becomeMinterPage.bchange19'),
				});
				this.getMintingAcccounts();
			} catch (error) {
				this.errorMsg = 'Failed to add minting key';
				return;
			}
		};

		return html`
			${isMinterButKeyMintingKeyNotAssigned
				? html`
						<div class="start-minting-wrapper">
							<my-button
								label="${translate(
									'becomeMinterPage.bchange18'
								)}"
								?isLoading=${false}
								.onClick=${async () => {
									await startMinting();
									if (this.errorMsg) {
										routes.showSnackBar({
											data: this.errorMsg,
										});
									}
								}}
							></my-button>
						</div>
				  `
				: ''}
		`;
	}

	stateChanged(state) {
		this.addressInfo = state.app.accountInfo.addressInfo;
	}
}

window.customElements.define('start-minting', StartMinting);
