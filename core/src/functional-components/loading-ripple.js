import { html, LitElement } from 'lit'
import { loadingRippleStyles } from '../styles/core-css'

const TRANSITION_EVENT_NAMES = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd']

let rippleElement

class LoadingRipple extends LitElement {
	static get properties() {
		return {
			welcomeMessage: { type: String, attribute: 'welcome-message', reflectToAttribute: true },
			loadingMessage: { type: String, attribute: 'loading-message', reflectToAttribute: true}
		}
	}

	static get styles() {
		return [loadingRippleStyles]
	}

	constructor() {
		super()
		this.welcomeMessage = ''
		this.loadingMessage = ''
	}

	render() {
		return html`
			<div id="rippleWrapper">
				<div id="ripple">
					<div id="rippleShader"></div>
					<div id="rippleContentWrapper">
						<div id="rippleContent">
							<h1 style="color: var(--black);">${this.welcomeMessage}</h1>
							<paper-spinner-lite active></paper-spinner-lite>
							<p style="color: var(--black);">${this.loadingMessage}</p>
						</div>
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this._rippleWrapper = this.shadowRoot.getElementById('rippleWrapper')
		this._ripple = this.shadowRoot.getElementById('ripple')
		this._rippleContentWrapper = this.shadowRoot.getElementById('rippleContentWrapper')
	}

	open(origin) {
		this._rippleWrapper.style.top = origin.y + 'px'
		this._rippleWrapper.style.left = origin.x + 'px'
		this._rippleContentWrapper.style.marginTop = -origin.y + 'px'
		this._rippleContentWrapper.style.marginLeft = -origin.x + 'px'

		return new Promise((resolve, reject) => {
			this._ripple.classList.add('activating')

			let isOpened = false

			const doneOpeningEvent = () => {
				if (isOpened) return

				// Clear events
				TRANSITION_EVENT_NAMES.forEach(name => this._ripple.removeEventListener(name, doneOpeningEvent))

				this._ripple.classList.add('activating-done')

				isOpened = true

				resolve()
			}

			TRANSITION_EVENT_NAMES.forEach(name => this._ripple.addEventListener(name, doneOpeningEvent))
		})
	}

	fade() {
		return new Promise((resolve, reject) => {
			this._ripple.classList.remove('activating')
			this._ripple.classList.remove('activating-done')
			this._ripple.classList.remove('disabling')

			resolve()
		})
	}

	close() {
		return new Promise((resolve, reject) => {
			let rippleClosed = false

			this._ripple.classList.add('error')
			this._ripple.classList.remove('activating')
			this._ripple.classList.remove('activating-done')

			const rippleClosedEvent = () => {
				if (rippleClosed) return

				rippleClosed = true

				TRANSITION_EVENT_NAMES.forEach(name => this._ripple.removeEventListener(name, rippleClosedEvent))

				// Reset the ripple
				this._ripple.classList.remove('error')
				this.rippleIsOpen = false

				resolve()
			}

			TRANSITION_EVENT_NAMES.forEach(name => this._ripple.addEventListener(name, rippleClosedEvent))
		})
	}

	stateChanged(state) {
		// ...
	}
}

window.customElements.define('loading-ripple', LoadingRipple)

const rippleNode = document.createElement('loading-ripple')
rippleNode.id = 'ripple-node'
rippleNode.loadingMessage = ''
rippleElement = document.body.appendChild(rippleNode)
setTimeout(() => {
	const ripple = document.getElementById('ripple-node')
	const mainApp = document.getElementById('main-app')
	const shadow = mainApp.shadowRoot
	rippleElement = shadow.appendChild(ripple)
}, 500) // Should just keep checking for the main-app and it's shadow and then append once it's there
export default rippleElement