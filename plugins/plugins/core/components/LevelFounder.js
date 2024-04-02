import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import {translate} from '../../../../core/translate'
import '@polymer/paper-tooltip/paper-tooltip.js'
import {RequestQueue} from '../../utils/queue.js'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

 const queue = new RequestQueue(3);


class LevelFounder extends LitElement {
    static get properties() {
        return {
            checkleveladdress: { type: String },
            config: { type: Object },
            memberInfo: { type: Array }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --mdc-theme-secondary: var(--mdc-theme-primary);
                --mdc-dialog-content-ink-color: var(--black);
                --mdc-theme-surface: var(--white);
                --mdc-theme-text-primary-on-background: var(--black);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
                --lumo-primary-text-color: rgb(0, 167, 245);
                --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                --lumo-primary-color: hsl(199, 100%, 48%);
                --lumo-base-color: var(--white);
                --lumo-body-text-color: var(--black);
            }

            h2 {
                 margin:0;
            }

            h2, h3, h4, h5 {
                color: var(--black);
                font-weight: 400;
            }

            .custom {
                --paper-tooltip-background: #03a9f4;
                --paper-tooltip-text-color: #fff;
            }

            .level-img-tooltip {
                --paper-tooltip-background: #000000;
                --paper-tooltip-text-color: #fff;
                --paper-tooltip-delay-in: 300;
                --paper-tooltip-delay-out: 3000;
            }

            .message-data {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 5px;
            }

            .message-data-level {
                width: 20px;
                height: 20px;
            }


            .badge {
                align-items: center;
                background: rgb(3, 169, 244);
                border: 1px solid transparent;
                border-radius: 50%;
                color: rgb(255, 255, 255);
                display: flex;
                font-size: 10px;
                font-weight: 400;
                height: 12px;
                width: 12px;
                justify-content: center;
                cursor: pointer;
            }
        `
    }

    constructor() {
        super()
        this.memberInfo = []
    }

    render() {
        return html`
            <div class="message-data">
                ${this.renderFounder()}
                ${this.renderLevel()}
            </div>
        `
    }

    firstUpdated() {
       queue.push(() =>  this.checkAddressInfo());
    }

    async checkAddressInfo() {
        try {
            let toCheck = this.checkleveladdress
			this.memberInfo = await parentEpml.request('apiCall', {
				url: `/addresses/${toCheck}`
			})
        } catch (error) {
            console.error(error)
        }

    }

    renderFounder() {
        let adressfounder = this.memberInfo.flags
        if (adressfounder === 1) {
            return html`
            <span id="founderTooltip" class="badge">F</span>
            <paper-tooltip class="custom" for="founderTooltip" position="top">FOUNDER</paper-tooltip>
        `
        } else {
            return html``
        }
    }

    renderLevel() {
        let adresslevel = this.memberInfo.level
        return adresslevel ? html`
            <img id="level-img" src=${`/img/badges/level-${adresslevel}.png`} alt=${`badge-${adresslevel}`} class="message-data-level" />
            <paper-tooltip class="level-img-tooltip" for="level-img" position="top" >
                ${translate("mintingpage.mchange27")} ${adresslevel}
            </paper-tooltip>
        ` : ''
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }
}

window.customElements.define('level-founder', LevelFounder)
