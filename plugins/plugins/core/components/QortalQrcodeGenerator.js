import { html, LitElement } from 'lit'
import { qortalQrcodeGeneratorStyles } from './plugins-css'
import QRCode from './QRCode'

export class QortalQrcodeGenerator extends LitElement {
	static get properties() {
		return {
			auto: { type: Boolean },
			data: { type: String },
			debug: { type: Boolean },
			ecclevel: { type: String },
			format: { type: String },
			margin: { type: Number },
			mask: { type: Number, value: -1 },
			mode: { type: String },
			modulesize: { type: Number },
			version: { type: Number },
			qrcode: { type: Object }
		}
	}

	static get styles() {
		return [qortalQrcodeGeneratorStyles]
	}

	constructor() {
		super()
		this.auto = false
		this.debug = false
		this.ecclevel = 'L'
		this.format = 'html'
		this.mode = 'numeric'
		this.margin = 4
		this.mask = -1
		this.modulesize = 5
		this.version = -1
		this.qrcode = null
	}

	render() {
		return html`<div id="qrCodeContainer">${this.qrcode ? this.qrcode : ''}</div>`
	}

	firstUpdated() {
		// ...
	}

	validateParams() {
		return (this.validateEcclevel() && this.validateFormat() && this.validateMask() && this.validateMode() && this.validateModulesize() && this.validateVersion())
	}

	validateEcclevel() {
		if (this.ecclevel === 'L' || this.ecclevel === 'M' || this.ecclevel === 'Q' || this.ecclevel === 'H') {
			return true
		}

		console.error('[qortal-qrcode-generator] validateEcclevel - Invalid value of `ecclevel`', this.ecclevel)

		return false
	}

	validateFormat() {
		if (this.format == 'html' || this.format == 'png') {
			return true
		}

		console.error('[qortal-qrcode-generator] validateFormat - Invalid value of `format`', this.format)

		return false
	}

	validateMargin() {
		if (this.margin >= -1) {
			return true
		}

		console.error('[qortal-qrcode-generator] validateMargin - Invalid value of `margin`', this.margin)

		return false
	}

	validateMask() {
		if (this.mask >= -1 && this.mask <= 7) {
			return true
		}

		console.error('[qortal-qrcode-generator] validateMask - Invalid value of `mask`', this.mask)

		return false
	}

	validateMode() {
		if (this.mode === 'numeric' || this.mode === 'alphanumeric' || this.mode === 'octet') {
			return true
		}

		console.error('[qortal-qrcode-generator] validateMode - Invalid value of `mode`', this.mode)

		return false
	}

	validateModulesize() {
		if (this.modulesize >= 0.5) {
			return true
		}

		console.error('[qortal-qrcode-generator] validateModulesize - Invalid value of `modulesize`', this.modulesize)

		return false
	}

	validateVersion() {
		if (this.version == -1 || (this.version >= 0 && this.version <= 40)) {
			return true
		}

		console.error('[qortal-qrcode-generator] validateVersion - Invalid value of `version`', this.version)

		return false
	}

	getOptions() {
		return {
			modulesize: this.modulesize,
			margin: this.margin,
			version: this.version,
			mode: this.mode,
			ecclevel: this.ecclevel,
			mask: this.mask
		}
	}

	generateQRCodePNG() {
		let img

		try {
			img = document.createElement('img')
			img.src = QRCode.generatePNG(this.data, this.getOptions())
			this.qrcode = img
		} catch (e) {
			console.error('[qortal-qrcode-generator] generateQRCodePNG - No canvas support', e)
		}
	}

	generateQRCodeHTML() {
		if (this.debug) {
			console.debug('[qortal-qrcode-generator] generateQRCodeHTML - data ', this.data)
		}

		this.qrcode = QRCode.generateHTML(this.data, this.getOptions())
	}

	generateQRCode() {
		if (this.debug) {
			console.log('[qortal-qrcode-generator] generateQRCode', this.validateParams())
		}

		if (!this.validateParams()) {
			return
		}

		if (this.format === 'png') {
			this.generateQRCodePNG()
		} else {
			this.generateQRCodeHTML()
		}

		this.dispatchEvent(
			new CustomEvent('qrcode-generated', {
				bubbles: true,
				composed: true
			})
		)
	}

	updated(changedProperties) {
		if (this.debug) {
			console.log('[qortal-qrcode-generator] updated')
		}

		if ((changedProperties.has('auto') || changedProperties.has('data') || changedProperties.has('ecclevel') || changedProperties.has('mask') || changedProperties.has('mode') || changedProperties.has('version')) && this.auto) {
			this.generateQRCode()
		}
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

window.customElements.define('qortal-qrcode-generator', QortalQrcodeGenerator)
