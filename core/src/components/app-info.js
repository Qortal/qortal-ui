import {css, html, LitElement} from 'lit'
import {connect} from 'pwa-helpers'
import {store} from '../store.js'
import {translate} from '../../translate'

class AppInfo extends connect(store)(LitElement) {
    static get properties() {
        return {
            nodeInfo: { type: Array },
            coreInfo: { type: Array },
            nodeConfig: { type: Object },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return css`
            * {
                --mdc-theme-primary: rgb(3, 169, 244);
                --paper-input-container-focus-color: var(--mdc-theme-primary);
            }

            .normal {
                --mdc-theme-primary: rgb(3, 169, 244);
            }

            #profileInMenu {
                flex: 0 0 100px;
                padding:12px;
                border-top: 1px solid var(--border);
                background: var(--sidetopbar);
            }

            .info {
                margin: 0;
                font-size: 14px;
                font-weight: 100;
                display: inline-block;
                width: 100%;
                padding-bottom: 8px;
                color: var(--black);
            }

            .blue {
                color: #03a9f4;
                margin: 0;
                font-size: 14px;
                font-weight: 200;
                display: inline;
            }

            .black {
                color: var(--black);
                margin: 0;
                font-size: 14px;
                font-weight: 200;
                display: inline;
            }
        `
    }

    constructor() {
        super()
        this.nodeInfo = []
        this.coreInfo = []
        this.nodeConfig = {}
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div id="profileInMenu">
                <span class="info">${translate("appinfo.uiversion")}: ${this.nodeConfig.version ? this.nodeConfig.version : ''}</span>
                ${this._renderCoreVersion()}
                <span class="info">${translate("appinfo.blockheight")}: ${this.nodeInfo.height ? this.nodeInfo.height : ''}  <span class=${this.cssStatus}>${this._renderStatus()}</span></span>
                <span class="info">${translate("appinfo.peers")}: ${this.nodeInfo.numberOfConnections ? this.nodeInfo.numberOfConnections : ''}
                <a id="pageLink"></a>
            </div>
        `
    }

    firstUpdated() {
        this.getNodeInfo()
        this.getCoreInfo()

        setInterval(() => {
            this.getNodeInfo()
            this.getCoreInfo()
        }, 60000)
    }

    async getNodeInfo() {
        const appinfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const appinfoUrl = appinfoNode.protocol + '://' + appinfoNode.domain + ':' + appinfoNode.port
        const url = `${appinfoUrl}/admin/status`

        await fetch(url).then(response => {
            return response.json()
        }).then(data => {
            this.nodeInfo = data
        }).catch(err => {
            console.error('Request failed', err)
        })
    }

    async getCoreInfo() {
        const appinfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const appinfoUrl = appinfoNode.protocol + '://' + appinfoNode.domain + ':' + appinfoNode.port
        const url = `${appinfoUrl}/admin/info`

        await fetch(url).then(response => {
            return response.json()
        }).then(data => {
            this.coreInfo = data
        }).catch(err => {
            console.error('Request failed', err)
        })
    }

    _renderStatus() {
        if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === true) {
            this.cssStatus = 'blue'
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === false) {
            this.cssStatus = 'blue'
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === true) {
            this.cssStatus = 'black'
            return html`(${translate("appinfo.synchronizing")}... ${this.nodeInfo.syncPercent !== undefined ? this.nodeInfo.syncPercent + '%' : ''})`
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === false) {
            this.cssStatus = 'black'
            return ''
        } else {
            return ''
        }
    }

    _renderCoreVersion() {
        return html`<span class="info">${translate("appinfo.coreversion")}: ${this.coreInfo.buildVersion ? this.coreInfo.buildVersion : ''}</span>`
    }

    stateChanged(state) {
        this.nodeConfig = state.app.nodeConfig
    }
}

window.customElements.define('app-info', AppInfo)
