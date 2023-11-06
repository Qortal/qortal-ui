import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../store.js'

class MyElement extends connect(store)(LitElement) {
    static get properties () {
        return {
        }
    }

    static get styles () {
        return css``
    }

    render () {
        return html`
            <style>
            </style>
        `
    }

    stateChanged (state) {
    }
}

window.customElements.define('my-element', MyElement)
