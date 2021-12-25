import { LitElement, html } from 'lit-element'
import { installRouter } from 'pwa-helpers/router.js'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doNavigate } from '../redux/app/app-actions.js'
import '../plugins/streams.js'

import { loadPlugins } from '../plugins/load-plugins.js'

import '../styles/app-styles.js'
import './login-view/login-view.js'
import './app-view.js'

import copyTextMenu from '../functional-components/copy-text-menu.js'
// import pasteMenu from '../functional-components/paste-menu.js';
import framePasteMenu from '../functional-components/frame-paste-menu.js';

installRouter((location) => store.dispatch(doNavigate(location)))

class MainApp extends connect(store)(LitElement) {
    static get properties() {
        return {
            name: { type: String },
            loggedIn: { type: Boolean }
        }
    }

    static get styles() {
        return []
    }

    render() {

        return html`${this.renderViews(this.loggedIn)}`
    }

    /**
     * Dynamic renderViews method to introduce conditional rendering of views based on user's logged in state. 
     * @param {Boolean} isLoggedIn 
     */

    renderViews(isLoggedIn) {
        if (isLoggedIn) {

            return html`
                <app-view></app-view>
                `
        } else {

            return html`
                <login-view></login-view>
                `
        }
    }

    stateChanged(state) {

        this.loggedIn = state.app.loggedIn

        if (this.loggedIn === true && this.initial === 0) {

            this.initial = this.initial + 1
            this._loadPlugins()
        }

        document.title = state.config.coin.name
    }

    _loadPlugins() {

        loadPlugins()
    }

    connectedCallback() {
        super.connectedCallback()
        this.initial = 0

        window.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this._textMenu(event);
        })

        window.addEventListener('click', () => {
            copyTextMenu.close()
            framePasteMenu.close()
        })

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                copyTextMenu.close()
                framePasteMenu.close()
            }
        }
    }

    _textMenu(event) {
        const getSelectedText = () => {
            var text = ''
            if (typeof window.getSelection !== 'undefined') {
                text = window.getSelection().toString()
            } else if (typeof this.shadowRoot.selection !== 'undefined' && this.shadowRoot.selection.type == 'Text') {
                text = this.shadowRoot.selection.createRange().text
            }
            return text
        }

        const checkSelectedTextAndShowMenu = () => {
            const selectedText = getSelectedText()
            if (selectedText && typeof selectedText === 'string') {

                const textMenuObject = { selectedText, eventObject: event }
                copyTextMenu.open(textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }
}

window.customElements.define('main-app', MainApp)
