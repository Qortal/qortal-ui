import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Messaging extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-surface: var(--white);
                --mdc-dialog-content-ink-color: var(--black);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
            }

            #page {
                background: var(--white);
                padding: 12px 24px;
            }

            h2 {
                margin:0;
                font-weight: 400;
            }

            h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            .major-title {
                color: rgb(3, 169, 244);
                margin-top: 1rem;
                font-weight: 400;
                font-size: 28px;
                text-align: center;
            }

            .sub-title {
                color: rgb(3, 169, 244);
                margin-top: .5rem;
                font-weight: 400;
                text-align: center;
            }

            .sub-title:hover {
                cursor: pointer;
            }

            .sub-url {
                font-size: 19px;
                text-decoration: underline;
            }

            .sub-url:hover {
                cursor: pointer;
            }

            .divCard {
                border: 1px solid var(--border);
                padding: 1em;
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
                margin-bottom: 1.5rem;
            }

            p {
                color: var(--black);
            }

            ul, ul li {
                color: var(--black);
            }
        `
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="page">
                <div class="divCard">
                    <h2 class="major-title">Welcome to the Qortal Messaging System!</h2>
                    <p style="font-size: 19px;">With this system, you are able to accomplish multiple types of messaging available to you in Qortal:</p>
                    <ul>
                        <li class="sub-url" @click=${() => this.getUrl('chain-messaging')}><strong>Chain Based Messaging</strong></li>
                        <li class="sub-url" @click=${() => this.getUrl('q-chat')}><strong>Q-Chat</strong></li>
                    </ul>
                </div>

                <div class="divCard">
                    <h3 class="sub-title" @click=${() => this.getUrl('chain-messaging')}>Chain-Based Messaging</h3>
                    <p style="font-size: 17px;">A long-term message that is stored <strong>ON CHAIN</strong>.
                    These messages <strong>are able</strong> to be <strong>sent to groups or individual accounts</strong>, and are essentially <strong>the 'e-mail' of Qortal</strong>.
                    Use these messages if you intend on the message being a <strong>PERMANENT message</strong> that stays when and where you send it.</p>

                    <ul>
                        <li style="font-size: 17px; padding: 10px;">There are no @ in Qortal Chain Messaging, only 'registered names'. As the registered names on the chain can only be registered ONCE. Therefore, there are NO DUPLICATES.</li>
                        <li style="font-size: 17px; padding: 10px;">Chain Messages LAST FOREVER</li>
                        <li style="font-size: 17px; padding: 10px;"><strong>Encyption is DEFAULT</strong>, unless chosen to be NOT encrypted. (also known as a 'public message' which are readable by an api call from anyone.)</li>
                        <li style="font-size: 17px; padding: 10px;">'Attachments' will be possible in the future, with the use of the Qortal Data System.</li>
                        <li style="font-size: 17px; padding: 10px;">Public Messages can be used for 'verification purposes' such as 'copyrights' or 'I did it first' notations. The terms 'copyright' and 'patent' are a thing of the past, if you did it first, put in a public message, and it is by default proven.</li>
                    </ul>

                </div>

                <div class="divCard">
                    <h3 class="sub-title" @click=${() => this.getUrl('q-chat')}>Q-Chat</h3>
                    <p style="font-size: 17px;">Is a custom chat system that is UNLIKE ANY OTHER in existence. It is the FIRST OF ITS KIND IN THE WORLD.
                    It is a real-time, blockchain-based chat system that utilizes a memory-based PoW (Proof Of Work) algorithm, to implement a specialized transaction that is 'temporary', on the Qortal blockchain.
                    Q-Chat messages will DISSAPEAR AFTER 24 HOURS and therefore are not a great choice for things you wish to be permanent.</p>

                    <ul>
                        <li style="font-size: 17px; padding: 10px;"><strong>In the future, there will be a 'pinning' system</strong>, that will allow you to convert, or send messages by default with, the ability to stay forever on the Qortal Blockchain. So that if you DO decide that you like a message enough to keep it forever, you may do so.</li>
                        <li style="font-size: 17px; padding: 10px;"><strong>Q-chat messages are encrypted</strong> (at the moment in June, 2020, Q-chat PM's are encrypted, but the group messages are base58 encoded, meaning they aren't plain text, but if you're smart you can decode them. However, IN THE NEAR FUTURE, ALL MESSAGES REGARDLESS OF GROUP OR PM WILL BE DEFAULT ENCRYPTED WITH PUB/PRIV KEY OF YOUR QORTAL ACCOUNT.</li>
                        <li style="font-size: 17px; padding: 10px;">Uses a UNIQUE memory-based PoW algorithm, to send messages FREE (no transaction fee)</li>
                        <li style="font-size: 17px; padding: 10px;">Text-based messaging for the future.</li>
                    </ul>

                </div>
            </div>
        `
    }

    firstUpdated() {
        this.changeTheme()

        if (!isElectron()) {
        } else {
            window.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                window.parent.electronAPI.showMyMenu()
            })
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()
        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)
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

    getUrl(pageId) {
        this.onPageNavigation(`/app/${pageId}`)
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }
}

window.customElements.define('q-messaging', Messaging)
