/* Just a copy paste for setting up elements :) */
import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'

class MyElement extends connect(store)(LitElement) {
    static get properties () {
        return {

        }
    }

    static get styles () {
        return css`
            
        `
    }

    render () {
        return html`
            <style>
            
            </style>
        `
    }

    stateChanged (state) {
        // this.loggedIn = state.app.loggedIn
    }
}

window.customElements.define('my-element', MyElement)
