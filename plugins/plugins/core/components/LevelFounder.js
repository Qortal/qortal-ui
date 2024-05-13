import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { RequestQueue } from '../../utils/classes'
import { levelFounderStyles } from './plugins-css'
import '@polymer/paper-tooltip/paper-tooltip.js'

// Multi language support
import { translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const queue = new RequestQueue(3)

class LevelFounder extends LitElement {
	static get properties() {
		return {
			checkleveladdress: { type: String },
			memberInfo: { type: Array }
		}
	}

	static get styles() {
		return [levelFounderStyles]
	}

	constructor() {
		super()
		this.memberInfo = []
	}

	render() {
		return html`
			<div class="message-data">
				${this.renderFounder()}
				${this.renderLevel()}
			</div>
		`
	}

	firstUpdated() {
		queue.push(() => this.checkAddressInfo())
	}

	async checkAddressInfo() {
		try {
			let toCheck = this.checkleveladdress

			this.memberInfo = await parentEpml.request('apiCall', {
				url: `/addresses/${toCheck}`
			})
		} catch (error) {
			console.error(error)
		}
	}

	renderFounder() {
		let adressfounder = this.memberInfo.flags

		if (adressfounder === 1) {
			return html`
				<span id="founderTooltip" class="badge">F</span>
				<paper-tooltip class="custom" for="founderTooltip" position="top">FOUNDER</paper-tooltip>
			`
		} else {
			return html``
		}
	}

	renderLevel() {
		let adresslevel = this.memberInfo.level

		return adresslevel ?
			html`
				<img id="level-img" src=${`/img/badges/level-${adresslevel}.png`} alt=${`badge-${adresslevel}`} class="message-data-level" />
				<paper-tooltip class="level-img-tooltip" for="level-img" position="top">
					${translate("mintingpage.mchange27")} ${adresslevel}
				</paper-tooltip>
			`
			: ''
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

window.customElements.define('level-founder', LevelFounder)
