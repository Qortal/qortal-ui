import { LitElement, html } from 'lit';
import { Epml } from '../../../epml.js';
import '../components/ButtonIconCopy.js';
import { use, translate, registerTranslateConfig } from 'lit-translate';
import { blocksNeed } from './utils/blocks-needed.js';

registerTranslateConfig({
	loader: (lang) => fetch(`/language/${lang}.json`).then((res) => res.json()),
});
import '@polymer/paper-spinner/paper-spinner-lite.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@vaadin/button';
import { pageStyles } from './become-minter-css.js';
import './components/not-sponsored.src';
import './components/yes-sponsored.src';
const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

class BecomeMinter extends LitElement {
	static get properties() {
		return {
			theme: { type: String, reflect: true },
			sponsorshipKeyValue: { type: String },

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
		this.sponsorshipKeyValue = '';
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

	async getNodeInfo() {
		const nodeInfo = await parentEpml.request('apiCall', {
			url: `/admin/status`,
		});

		return nodeInfo;
	}

	async firstUpdated() {
		this.changeLanguage();

		this.addressInfo =
			window.parent.reduxStore.getState().app.accountInfo.addressInfo;
		this.isPageLoading = true;
		try {
			const [nodeInfo, myRewardShareArray] = await Promise.all([
				this.getNodeInfo(),
				await this.getRewardShareRelationship(
					window.parent.reduxStore.getState().app?.selectedAddress
						?.address
				),
			]);

			this.nodeInfo = nodeInfo;
			this.rewardSharePublicKey =
				myRewardShareArray[0]?.rewardSharePublicKey;
			this.isPageLoading = false;
		} catch (error) {
			console.error(error);

			this.isPageLoading = false;
		}
	}

	async getRewardShareRelationship(recipientAddress) {
		const myRewardShareArray = await parentEpml.request('apiCall', {
			type: 'api',
			url: `/addresses/rewardshares?minters=${recipientAddress}&recipients=${recipientAddress}`,
		});

		return myRewardShareArray;
	}

	_levelUpBlocks() {
		let countBlocksString = (
			blocksNeed(0) -
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
			${this.isPageLoading
				? html`
						<div class="loadingContainer">
							<div class="loading"></div>
						</div>
						<div class="backdrop"></div>
				  `
				: ''}

			<div class="page-container">
				<h1 class="header-title">
					${translate('becomeMinterPage.bchange1')}
				</h1>
				<div class="fullWidth">
					<hr class="divider" />
				</div>

				${isAlreadySponsored
					? ''
					: html` <not-sponsored></not-sponsored> `}
				${!isAlreadySponsored
					? ''
					: html`
							<yes-sponsored
								.rewardSharePublicKey=${this
									.rewardSharePublicKey}
								.addressInfo=${this.addressInfo}
							></yes-sponsored>
					  `}
			</div>
		`;
	}
}

window.customElements.define('become-minter', BecomeMinter);
