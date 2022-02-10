import { LitElement, html, css } from 'lit'
import { Epml } from '../../../epml.js'


const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ToolTip extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            config: { type: Object },
            toolTipMessage: { type: String, reflect: true },
            showToolTip: { type: Boolean, reflect: true }
        }
    }

    static get styles() {
        return css`
        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black;
        }

        .tooltiptext {
            margin-bottom: 100px;
            display: inline;
            visibility: visible;
            width: 120px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -60px;
            opacity: 1;
            transition: opacity 0.3s;
        }

        .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }

        .hide-tooltip {
            display: none;
            visibility: hidden;
            opacity: 0;
        } 
        `
    }

    constructor() {
        super()
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.toolTipMessage = ''
        this.showToolTip = false
    }

    render() {
        return html`
            <span id="myTool" class="tooltiptext">${this.toolTipMessage}</span>
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
                    // setTimeout(getGroupIdFromURL, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()
    }
}

window.customElements.define('tool-tip', ToolTip)
