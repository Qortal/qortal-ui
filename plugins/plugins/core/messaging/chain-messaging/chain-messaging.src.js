import {css, html, LitElement} from 'lit'
import {Epml} from '../../../../epml.js'
import isElectron from 'is-electron'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChainMessaging extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }

            paper-spinner-lite{
                height: 24px;
                width: 24px;
                --paper-spinner-color: var(--mdc-theme-primary);
                --paper-spinner-stroke-width: 2px;
            }

            #chain-messaging-page {
                background: var(--white);
            }

        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="chain-messaging-page">
                <h2 style="text-align: center; margin-top: 3rem; color: var(--black)">Coming Soon!</h2>
            </div>
        `
    }

    firstUpdated() {
        this.changeTheme()

        window.addEventListener('storage', () => {
            const checkTheme = localStorage.getItem('qortalTheme')

            if (checkTheme) {
                this.theme = checkTheme
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        if (!isElectron()) {
        } else {
            window.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                window.parent.electronAPI.showMyMenu()
            })
        }
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme) {
            this.theme = checkTheme;
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }
}

window.customElements.define('chain-messaging', ChainMessaging)
