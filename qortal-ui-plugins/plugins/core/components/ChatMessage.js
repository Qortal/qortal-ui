import { LitElement, html, css } from 'lit-element'
import { render } from 'lit-html'
import { Epml } from '../../../epml.js'


const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatMessage extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            message: { type: Object, reflect: true }
        }
    }

    static get styles() {
        return css`
        
     .message-data {
        margin-bottom: 15px;
    }

    .message-data-time {
        color: #a8aab1;
        font-size: 13px;
        padding-left: 6px;
    }

    .message {
        color: black;
        padding: 12px 10px;
        line-height: 19px;
        font-size: 16px;
        border-radius: 7px;
        margin-bottom: 20px;
        width: 90%;
        position: relative;
    }

    .message:after {
        bottom: 100%;
        left: 93%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
        border-bottom-color: #ddd;
        border-width: 10px;
        margin-left: -10px;
    }

    .my-message {
        background: #ddd;
        border: 2px #ccc solid;
    }

    .other-message {
        background: #f1f1f1;
        border: 2px solid #dedede;
    }

    .other-message:after {
        border-bottom-color: #f1f1f1;
        left: 7%;
    }

    .align-left {
        text-align: left;
    }

    .align-right {
        text-align: right;
    }

    .float-right {
        float: right;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
        `
    }

    // attributeChangedCallback(name, oldVal, newVal) {
    //     console.log('attribute change: ', name, newVal.address);
    //     super.attributeChangedCallback(name, oldVal, newVal);
    // }

    constructor() {
        super()
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.message = {}
    }

    render() {

        return html`
            <li class="clearfix">
                <div class="message-data ${this.message.sender === this.selectedAddress.address ? "align-right" : ""}">
                    <span class="message-data-name">${this.message.sender}</span> &nbsp;
                    <span class="message-data-time">10:10 AM, Today</span>

                </div>
                <div class="message ${this.message.sender === this.selectedAddress.address ? "my-message float-right" : "other-message"}">
                    ${this.message.decodedMessage}
                </div>
            </li>
        `
    }


    firstUpdated() {
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
    }

}

window.customElements.define('chat-message', ChatMessage)
