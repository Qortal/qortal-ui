import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { translate, translateUnsafeHTML } from 'lit-translate'

import '@material/mwc-icon'
import '@polymer/paper-ripple'
import '@vaadin/icon'
import '@vaadin/icons'

import '../functional-components/side-menu.js'
import '../functional-components/side-menu-item.js'

class SidenavMenu extends connect(store)(LitElement) {
    static get properties() {
        return {
            config: { type: Object },
            urls: { type: Object },
            theme: { type: String, reflect: true }
        }
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    static get styles() {
        return [
            css`
                * {
                    --item-selected-color: var(--nav-selected-color);
                    --item-selected-color-text: var(--nav-selected-color-text);
                    --item-color-active: var(--nav-color-active);
                    --item-color-hover: var(--nav-color-hover);
                    --item-text-color: var(--nav-text-color);
                    --item-icon-color: var(--nav-icon-color);
                    --item-border-color: var(--nav-border-color);
                    --item-border-selected-color: var(--nav-border-selected-color);
                }

                .s-menu {
                    list-style: none;
                    padding: 0px 0px;
                    background:  var(--sidetopbar);
                    border-radius: 2px;
                    width: 100%;
                    border-top: 1px solid var(--border);
                    outline: none;
                }
            `
        ]
    }

    constructor() {
        super()
        this.urls = []
    }

    render() {
        return html`
            <div class="s-menu">
                <side-menu>
                    <side-menu-item label="${translate("sidemenu.mintingdetails")}" href="/app/minting">
                        <vaadin-icon icon="vaadin:info-circle" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.wallets")}" href="/app/wallet" selected>
                        <vaadin-icon icon="vaadin:wallet" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.tradeportal")}" href="/app/trade-portal">
                        <vaadin-icon icon="vaadin:bullets" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.rewardshare")}" href="/app/reward-share">
                        <vaadin-icon icon="vaadin:share-square" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.nameregistration")}" href="/app/name-registration">
                        <vaadin-icon icon="vaadin:user-check" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.websites")}" href="/app/websites">
                        <vaadin-icon icon="vaadin:desktop" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.datamanagement")}" href="/app/data-management">
                        <vaadin-icon icon="vaadin:database" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.qchat")}" href="/app/q-chat">
                        <vaadin-icon icon="vaadin:chat" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.groupmanagement")}" href="/app/group-management">
                        <vaadin-icon icon="vaadin:group" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    <side-menu-item label="${translate("sidemenu.puzzles")}" href="/app/puzzles">
                        <vaadin-icon icon="vaadin:puzzle-piece" slot="icon"></vaadin-icon>
                    </side-menu-item>
                    ${this.renderNodeManagement()}
                </side-menu>
            </div>
        `
    }

    firstUpdated() {
        // ...
    }

    renderNodeManagement() {
        const checkNodeManagement = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        if (checkNodeManagement.enableManagement = true) {
            return html`
                <side-menu-item label="${translate("sidemenu.nodemanagement")}" href="/app/node-management">
                    <vaadin-icon icon="vaadin:cloud" slot="icon"></vaadin-icon>
                </side-menu-item>
            `
        } else {
            return html``
        }
    }

    stateChanged(state) {
        this.config = state.config
        this.urls = state.app.registeredUrls
    }
}

window.customElements.define('sidenav-menu', SidenavMenu)
