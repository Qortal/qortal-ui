import { LitElement, html, css } from 'lit-element'
import { Epml } from '../../../epml.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Messaging extends LitElement {
    static get properties() {
        return {}
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
            }
            #page {
                background: #fff;
                padding: 12px 24px;
            }

            h2 {
                margin:0;
                font-weight: 400;
            }

            h3, h4, h5 {
                color:#333;
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
                /* font-size: 19px; */
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
                border: 1px solid #eee;
                padding: 1em;
                /** box-shadow: 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20); **/
                box-shadow: 0 .3px 1px 0 rgba(0,0,0,0.14), 0 1px 1px -1px rgba(0,0,0,0.12), 0 1px 2px 0 rgba(0,0,0,0.20);
                margin-bottom: 1.5rem;
            }

            p {
                color:#333;
            }

            ul, ul li {
                color:#333;
            }
        `
    }

    constructor() {
        super()
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

                    <!-- <span style="display: block; text-align: center"><strong>- more info -</strong></span> -->

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

    getUrl(pageId) {
        this.onPageNavigation(`/app/${pageId}`)

    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }


    firstUpdated() {

        window.addEventListener("contextmenu", (event) => {

            event.preventDefault();
            this._textMenu(event)
        });

        window.addEventListener("click", () => {

            parentEpml.request('closeCopyTextMenu', null)
        });

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {

                parentEpml.request('closeCopyTextMenu', null)
            }
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
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
        })


        parentEpml.imReady()
    }

    _textMenu(event) {

        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {

                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }

                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }

                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }

    clearSelection() {

        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

}

window.customElements.define('q-messaging', Messaging)
