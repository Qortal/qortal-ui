import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store'

class MyElement extends connect(store)(LitElement) {
	render () {
		return html`<style></style>`
	}
}

window.customElements.define('my-element', MyElement)