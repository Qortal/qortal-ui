import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { becomeMinterStyles } from '../components/plugins-css'
import '../components/ButtonIconCopy'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/button'

// Multi language support
import { translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class NotSponsored extends LitElement {
	static properties = {
		atMount: { type: Function },
		isLoadingSponsorshipKeySubmit: { type: Boolean },
		sponsorshipKeyValue: { type: String },
		addMintingAccountMessage: { type: String }
	}

	static get styles() {
		return [becomeMinterStyles]
	}

	constructor() {
		super()
		this.isLoadingSponsorshipKeySubmit = false
		this.sponsorshipKeyValue = ''
		this.addMintingAccountMessage = ''
		this.atMount = () => {}
	}

	render() {
		return html`
			<div class="inner-container">
				<div class="sub-main">
					<h2 class="level-black">
						${translate('mintingpage.mchange33')}
					</h2>
					<p class="description">
						${translate('mintingpage.mchange34')}
					</p>
					<h2 class="level-black">
						${translate('mintingpage.mchange35')}
					</h2>
					<p class="description">
						${translate('mintingpage.mchange36')}
					</p>
					<p class="description">
						${translate('mintingpage.mchange37')}
					</p>
					<p class="message">${this.addMintingAccountMessage}</p>
					<div class="form-wrapper">
						<div class="form-item form-item--input">
							<mwc-textfield
								?disabled="${this
								.isLoadingSponsorshipKeySubmit}"
								label="${translate('becomeMinterPage.bchange8')}"
								id="addSponsorshipKey"
								@input="${this.inputHandler}"
								.value="${this.sponsorshipKeyValue || ''}"
								fullWidth
							>
							</mwc-textfield>
						</div>
						<div class="form-item form-item--button">
							<vaadin-button
								theme="primary"
								?disabled="${this.isLoadingSponsorshipKeySubmit}"
								@click="${this.addMintingAccount}"
							>
								${this.isLoadingSponsorshipKeySubmit === false ?
									html`
										${translate('puzzlepage.pchange15')}
									`
									: html`
										<paper-spinner-lite active></paper-spinner-lite>
									`
								}
							</vaadin-button>
						</div>
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		// ...
	}

	renderErr1Text() {
		return html`${translate('nodepage.nchange27')}`
	}

	renderErr2Text() {
		return html`${translate('nodepage.nchange28')}`
	}

	addMintingAccount(e) {
		this.isLoadingSponsorshipKeySubmit = true
		this.addMintingAccountMessage = 'Loading...'
		parentEpml.request('apiCall', {
			url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
			method: 'POST',
			body: this.sponsorshipKeyValue
		}).then((res) => {
			if (res === true) {
				// refetch data
				this.atMount()
				this.sponsorshipKeyValue = ''
				this.addMintingAccountMessage = this.renderErr1Text()
				this.isLoadingSponsorshipKeySubmit = false
			} else {
				this.sponsorshipKeyValue = ''
				this.addMintingAccountMessage = this.renderErr2Text()
				this.isLoadingSponsorshipKeySubmit = false
			}
		})
	}

	inputHandler(e) {
		this.sponsorshipKeyValue = e.target.value
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

window.customElements.define('not-sponsored', NotSponsored)
