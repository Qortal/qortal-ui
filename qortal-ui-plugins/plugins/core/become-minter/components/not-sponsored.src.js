import { LitElement, html } from 'lit';
import { Epml } from '../../../../epml.js';
import '../../components/ButtonIconCopy.js';
import { use, translate, registerTranslateConfig } from 'lit-translate';

registerTranslateConfig({
	loader: (lang) => fetch(`/language/${lang}.json`).then((res) => res.json()),
});
import '@polymer/paper-spinner/paper-spinner-lite.js';

import '@material/mwc-button';
import '@material/mwc-textfield';
import '@vaadin/button';
import { pageStyles } from '../become-minter-css.src.js';
const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });
// hello
class NotSponsored extends LitElement {
	static get properties() {
		return {
			isLoadingSponsorshipKeySubmit: { type: Boolean },
			sponsorshipKeyValue: { type: String },
			addMintingAccountMessage: { type: String },
		};
	}

	static styles = [pageStyles];

	constructor() {
		super();
		this.isLoadingSponsorshipKeySubmit = false;
		this.sponsorshipKeyValue = '';
		this.addMintingAccountMessage = '';
	}

	renderErr1Text() {
		return html`${translate('nodepage.nchange27')}`;
	}

	renderErr2Text() {
		return html`${translate('nodepage.nchange28')}`;
	}

	getApiKey() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];
		let apiKey = myNode.apiKey;
		return apiKey;
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

	render() {
		return html`
			<div class="inner-container">
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

					<p class="message">${this.addMintingAccountMessage}</p>
					<div class="form-wrapper">
						<div class="form-item form-item--input">
							<mwc-textfield
								?disabled="${this
									.isLoadingSponsorshipKeySubmit}"
								label="${translate(
									'becomeMinterPage.bchange8'
								)}"
								id="addSponsorshipKey"
								@input="${this.inputHandler}"
								.value="${this.sponsorshipKeyValue || ''}"
								fullWidth
							>
							</mwc-textfield>
						</div>

						<div class="form-item form-item--button">
							<vaadin-button
								?disabled="${this
									.isLoadingSponsorshipKeySubmit}"
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
			</div>
		`;
	}
}

window.customElements.define('not-sponsored', NotSponsored);
