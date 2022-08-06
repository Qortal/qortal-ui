import { LitElement, html } from 'lit';
import { Epml } from '../../../epml.js';
import '../components/ButtonIconCopy.js';
import { use, translate, registerTranslateConfig } from 'lit-translate';

registerTranslateConfig({
	loader: (lang) => fetch(`/language/${lang}.json`).then((res) => res.json()),
});
import '@polymer/paper-spinner/paper-spinner-lite.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@vaadin/button';
import { _blocksNeed } from './utils/blocks-needed.js';
import { pageStyles } from './become-minter-css.js';
import './components/not-sponsored';
const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

class BecomeMinter extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			isLoadingSponsorshipKeySubmit: { type: Boolean },
			sponsorshipKeyValue: { type: String },
			addMintingAccountMessage: { type: String },

			nodeInfo: { type: Object },
			isPageLoading: { type: Boolean },
			addressInfo: { type: Object },
			rewardSharePublicKey: { type: String },
		};
	}

	static styles = [pageStyles];

	constructor() {
		super();
		this.theme = localStorage.getItem('qortalTheme')
			? localStorage.getItem('qortalTheme')
			: 'light';
		this.isLoadingSponsorshipKeySubmit = false;
		this.sponsorshipKeyValue = '';
		this.addMintingAccountMessage = '';
		this.isPageLoading = true;
		this.nodeInfo = {};
		this.addressInfo = {};
		this.rewardSharePublicKey = '';
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem('qortalLanguage');

		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem('qortalLanguage', 'us');
			use('us');
		} else {
			use(checkLanguage);
		}
	}

	_handleStorage() {
		const checkLanguage = localStorage.getItem('qortalLanguage');
		const checkTheme = localStorage.getItem('qortalTheme');

		use(checkLanguage);

		if (checkTheme === 'dark') {
			this.theme = 'dark';
		} else {
			this.theme = 'light';
		}
		document.querySelector('html').setAttribute('theme', this.theme);
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('storage', this._handleStorage);
	}

	disconnectedCallback() {
		window.removeEventListener('storage', this._handleStorage);
		super.disconnectedCallback();
	}

	getNodeInfo() {
		parentEpml
			.request('apiCall', { url: `/admin/status` })
			.then((res) => {
				this.nodeInfo = res;
				this.isPageLoading = false;
			})
			.catch(() => {
				this.isPageLoading = false;
			});
	}

	async firstUpdated() {
		console.log({ change: 6 });

		this.changeLanguage();
		this.getNodeInfo();
		this.addressInfo =
			window.parent.reduxStore.getState().app.accountInfo.addressInfo;

		await this.getRewardShareRelationship(
			window.parent.reduxStore.getState().app?.selectedAddress?.address
		);
	}

	updateMintingAccounts() {
		parentEpml
			.request('apiCall', {
				url: `/admin/mintingaccounts`,
			})
			.then((res) => {
				setTimeout(() => (this.mintingAccounts = res), 1);
			});
	}

	getApiKey() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];
		let apiKey = myNode.apiKey;
		return apiKey;
	}

	renderErr1Text() {
		return html`${translate('nodepage.nchange27')}`;
	}

	renderErr2Text() {
		return html`${translate('nodepage.nchange28')}`;
	}

	addMintingAccount(e) {
		this.isLoadingSponsorshipKeySubmit = true;
		this.addMintingAccountMessage = 'Loading...';

		parentEpml
			.request('apiCall', {
				url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
				method: 'POST',
				body: this.sponsorshipKeyValue,
			})
			.then((res) => {
				if (res === true) {
					this.updateMintingAccounts();
					this.sponsorshipKeyValue = '';
					this.addMintingAccountMessage = this.renderErr1Text();
					this.isLoadingSponsorshipKeySubmit = false;
				} else {
					this.sponsorshipKeyValue = '';
					this.addMintingAccountMessage = this.renderErr2Text();
					this.isLoadingSponsorshipKeySubmit = false;
				}
			});
	}

	inputHandler(e) {
		this.sponsorshipKeyValue = e.target.value;
	}

	async getRewardShareRelationship(recipientAddress) {
		let myRewardShareArray = await parentEpml.request('apiCall', {
			type: 'api',
			url: `/addresses/rewardshares?minters=${recipientAddress}&recipients=${recipientAddress}`,
		});

		this.rewardSharePublicKey = myRewardShareArray[0]?.rewardSharePublicKey;
	}

	_levelUpBlocks() {
		let countBlocksString = (
			_blocksNeed(0) -
			(this.addressInfo?.blocksMinted +
				this.addressInfo?.blocksMintedAdjustment)
		).toString();
		return countBlocksString;
	}

	render() {
		const isAlreadySponsored =
			this.addressInfo?.error !== 124 &&
			this.addressInfo?.level === 0 &&
			this.rewardSharePublicKey;

		return html`
			<div class="page-container">
				<h1 class="header-title">
					${translate('becomeMinterPage.bchange1')}
				</h1>
				<div class="fullWidth">
					<hr class="divider" />
				</div>

				${this.isPageLoading ? html` <p>Loading....</p> ` : ''}
				${isAlreadySponsored
					? ''
					: html`
							<not-sponsored></not-sponsored>
							<!-- <div class="inner-container">
								<div class="sub-main">
									<h2 class="level-black">
										${translate('becomeMinterPage.bchange2')}
									</h2>
									<p class="description">
										${translate('becomeMinterPage.bchange3')}
									</p>
									<h2 class="level-black">
										${translate('becomeMinterPage.bchange4')}
									</h2>
									<p class="description">
										${translate('becomeMinterPage.bchange5')}
									</p>
									<p class="description">
										${translate('becomeMinterPage.bchange6')}
									</p>

									<p class="message">
										${this.addMintingAccountMessage}
									</p>
									<div class="form-wrapper">
										<div class="form-item form-item--input">
											<mwc-textfield
												?disabled="${this.isLoadingSponsorshipKeySubmit}"
												label="${translate('becomeMinterPage.bchange8')}"
												id="addSponsorshipKey"
												@input="${this.inputHandler}"
												.value="${this.sponsorshipKeyValue || ''}"
												fullWidth
											>
											</mwc-textfield>
										</div>

										<div
											class="form-item form-item--button"
										>
											<vaadin-button
												?disabled="${this.isLoadingSponsorshipKeySubmit}"
												@click="${this.addMintingAccount}"
											>
												${this.isLoadingSponsorshipKeySubmit === false
								? html`${translate(
										'becomeMinterPage.bchange9'
								  )}`
								: html`<paper-spinner-lite
										active
								  ></paper-spinner-lite>`}
											</vaadin-button>
										</div>
									</div>
								</div>
							</div> -->
					  `}
				${!isAlreadySponsored
					? ''
					: html`
							<div class="inner-container">
								<div class="column column-center">
									<div class="column column-center">
										<span class="level-black"
											>${translate(
												'becomeMinterPage.bchange10'
											)}</span
										>
										<hr
											style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;"
										/>
									</div>
									<br />
									<div class="row row-center gap">
										<div class="content-box">
											<span class="title"
												>${translate(
													'becomeMinterPage.bchange11'
												)}</span
											>
											<hr
												style="color: #eee; border-radius: 90%; margin-bottom: 1rem;"
											/>
											<h4>
												${translate(
													'becomeMinterPage.bchange12'
												)}
											</h4>
										</div>
										<div class="content-box">
											<span class="title"
												>${translate(
													'becomeMinterPage.bchange13'
												)}</span
											>
											<hr
												style="color: #eee; border-radius: 90%; margin-bottom: 1rem;"
											/>
											<h4>
												${this._levelUpBlocks()}
												${translate(
													'becomeMinterPage.bchange14'
												)}
											</h4>
										</div>
										<div class="content-box">
											<span class="title"
												>${translate(
													'becomeMinterPage.bchange15'
												)}</span
											>
											<hr
												style="color: #eee; border-radius: 90%; margin-bottom: 1rem;"
											/>
											<h4 class="no-margin">
												${translate(
													'becomeMinterPage.bchange16'
												)}
											</h4>
											<div
												class="row row-center column-center no-wrap"
											>
												<p class="address">
													${this.rewardSharePublicKey}
												</p>
												<button-icon-copy
													title="${translate(
														'walletpage.wchange3'
													)}"
													onSuccessMessage="${translate(
														'walletpage.wchange4'
													)}"
													onErrorMessage="${translate(
														'walletpage.wchange39'
													)}"
													textToCopy=${this
														.rewardSharePublicKey}
													buttonSize="28px"
													iconSize="16px"
													color="var(--copybutton)"
													offsetLeft="4px"
												>
												</button-icon-copy>
											</div>
										</div>
									</div>
									<br />
								</div>
							</div>
					  `}
			</div>
		`;
	}
}

window.customElements.define('become-minter', BecomeMinter);
