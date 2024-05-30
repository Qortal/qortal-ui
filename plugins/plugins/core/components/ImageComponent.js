import { html, LitElement } from 'lit'
import { imageComponentStyles } from './plugins-css'

// Multi language support
import { translate } from '../../../../core/translate'

export class ImageComponent extends LitElement {
	static get properties() {
		return {
			class: { type: String },
			gif: { type: Object },
			alt: { type: String },
			attempts: { type: Number },
			maxAttempts: { type: Number },
			error: { type: Boolean },
			sendMessage: { attribute: false },
			setOpenGifModal: { attribute: false }
		}
	}

	static get styles() {
		return [imageComponentStyles]
	}

	constructor() {
		super()
		this.attempts = 0
		this.maxAttempts = 5
	}

	render() {
		if (this.error && this.attempts <= this.maxAttempts) {
			setTimeout(() => {
				this._fetchImage()
			}, 1000)
		}

		return html`
			${this.gif && !this.error ?
				html`
					<img
						class=${this.class}
						src=${this.gif.url}
						alt=${this.alt}
						@click=${() => {
							this.sendMessage({
								type: 'gif',
								identifier: this.gif.identifier,
								name: this.gif.name,
								filePath: this.gif.filePath,
								service: 'GIF_REPOSITORY'
							});
							this.setOpenGifModal(false);
						}}
						@error=${this._fetchImage}
					/>
				`
				: this.error && this.attempts <= this.maxAttempts ?
					html`
						<p class="gif-error-msg">${translate('gifs.gchange15')}</p>
					`
				: html`
					<p class="gif-error-msg">${translate('gifs.gchange16')}</p>
				`
			}
		`
	}

	async _fetchImage() {
		this.attempts++

		if (this.attempts > this.maxAttempts) return

		await new Promise((res) => {
			setTimeout(() => {
				res()
			}, 1000)
		})

		try {
			const response = await fetch(this.gif.url)
			const data = await response.json()

			if (data.ok) {
				this.error = false

				this.gif = {
					...this.gif,
					url: data.src
				}

				this.requestUpdate()
			} else {
				this.error = !data.ok || data.error
			}
		} catch (error) {
			this.error = true
			console.error(error)

			await this._fetchImage()
		}
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

window.customElements.define('image-component', ImageComponent)
