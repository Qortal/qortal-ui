import { css, html, LitElement } from 'lit'
import { createPopper } from '@popperjs/core'
import { popoverComponentStyles } from '../../styles/core-css'
import '@material/mwc-icon'

export class PopoverComponent extends LitElement {
	static get properties() {
		return {
			for: { type: String, reflect: true },
			message: { type: String }
		}
	}

	static get styles() {
		return [popoverComponentStyles]
	}

	constructor() {
		super()
		this.message = ''
	}

	render() {
		return html`
			<span class="close-icon" @click="${this.closePopover}"><mwc-icon style="color: var(--black)">close</mwc-icon></span>
			<div><mwc-icon style="color: var(--black)">info</mwc-icon> ${this.message} <slot></slot></div>
		`
	}

	attachToTarget(target) {
		if (!this.popperInstance && target) {
			this.popperInstance = createPopper(target, this, {
				placement: 'bottom',
				strategy: 'fixed'
			})
		}
	}

	openPopover(target) {
		this.attachToTarget(target)
		this.style.display = 'block'
	}

	closePopover() {
		this.style.display = 'none'

		if (this.popperInstance) {
			this.popperInstance.destroy()
			this.popperInstance = null
		}

		this.requestUpdate()
	}
}

window.customElements.define('popover-component', PopoverComponent)