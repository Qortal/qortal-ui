import { html, LitElement } from 'lit'
import { chatSearchResultsStyles } from './plugins-css'
import '@vaadin/icon'
import '@vaadin/icons'

// Multi language support
import { translate } from '../../../../core/translate'

export class ChatSearchResults extends LitElement {
	static get properties() {
		return {
			onClickFunc: { attribute: false },
			closeFunc: { attribute: false },
			searchResults: { type: Array },
			isOpen: { type: Boolean },
			loading: { type: Boolean }
		}
	}

	static get styles() {
		return [chatSearchResultsStyles]
	}

	constructor() {
		super()
	}

	render() {
		return html`
			<div class="chat-results-card" style=${this.isOpen ? "display: block;" : "display: none;"}>
				<vaadin-icon @click=${() => this.closeFunc()} icon="vaadin:close-small" slot="icon" class="close-icon"></vaadin-icon>
				${this.loading ?
					(html`
						<div class="spinner-container">
							<paper-spinner-lite active></paper-spinner-lite>
						</div>
					`)
					: (html`
						<p class="chat-result-header">${translate("chatpage.cchange36")}</p>
						<div class="divider"></div>
						<div class="chat-result-container">
							${this.searchResults.length === 0 ?
								(html`
									<p class="no-results">${translate("chatpage.cchange37")}</p>
								`)
								: (html`
									${this.searchResults.map((result) => {
										return (html`
											<div class="chat-result-card" @click=${() => {this.shadowRoot.querySelector(".chat-result-card").classList.add("active"); this.onClickFunc(result);}}>
												<p class="chat-result">${result.name}</p>
											</div>
										`)
									})}
								`)
							}
						</div>
					`)
				}
			</div>
		`
	}

	firstUpdated() {
		// ...
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

window.customElements.define('chat-search-results', ChatSearchResults)
