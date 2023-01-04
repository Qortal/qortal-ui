import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { doPageUrl } from '../redux/app/app-actions.js'
import { translate, translateUnsafeHTML } from 'lit-translate'
import WebWorker from 'web-worker:./computePowWorker.js';
import { routes } from '../plugins/routes.js';

import '@material/mwc-icon'
import '@material/mwc-button'

class AppInfo extends connect(store)(LitElement) {
    static get properties() {
        return {
            blockInfo: { type: Object },
            nodeStatus: { type: Object },
            nodeInfo: { type: Array },
            coreInfo: { type: Array },
            nodeConfig: { type: Object },
            pageUrl: { type: String },
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                * {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --paper-input-container-focus-color: var(--mdc-theme-primary);
                }
                .normal {
                    --mdc-theme-primary: rgb(3, 169, 244);
                }

                .normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }

                mwc-button.normal-button {
                    --mdc-theme-primary: rgb(3, 169, 244);
                    --mdc-theme-on-primary: white;
                }
                .test-net {
                    --mdc-theme-primary: black;
                }

                .test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
                }

                mwc-button.test-net-button {
                    --mdc-theme-primary: black;
                    --mdc-theme-on-primary: white;
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
                    font-weight:100;
                    display: inline-block;
                    width:100%;
                    padding-bottom:8px;
                    color: var(--black);
                }
                .blue {
                    color: #03a9f4;
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
                .black {
                    color: var(--black);
                    margin: 0;
                    font-size: 14px;
                    font-weight:200;
                    display: inline;
                }
            `
        ]
    }

    constructor() {
        super()
        this.blockInfo = {}
        this.nodeInfo = []
        this.coreInfo = []
        this.nodeStatus = {}
        this.pageUrl = ''
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.publicKeyisOnChainConfirmation = false
        this.interval
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

    async confirmPublicKeyOnChain(address) {
        const _computePow2 = async (chatBytes) => {
            const difficulty = 14;
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'
            const worker = new WebWorker();
            let nonce = null
            let chatBytesArray = null
              await new Promise((res, rej) => {
                worker.postMessage({chatBytes, path, difficulty});
            
                worker.onmessage = e => {
                  worker.terminate()
                  chatBytesArray = e.data.chatBytesArray
                    nonce = e.data.nonce
                    res()
                 
                }
              })

            let _response = await routes.sign_chat({
                data: {
                    nonce: store.getState().app.selectedAddress.nonce,
                    chatBytesArray: chatBytesArray,
                    chatNonce: nonce
                },
             
            });
        return _response
        };

	
		let stop = false
		const checkPublicKey = async () => {
			if (!stop) {
				stop = true;
				try {
                if(this.publicKeyisOnChainConfirmation){
                    clearInterval(this.interval)
                    return
                }
            const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node];
		    const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
            const url = `${nodeUrl}/addresses/publickey/${address}`;
			const res = await fetch(url)
                let data = ''
                try {
                    data =   await res.text();
                 } catch (error) {
                    data = {
                        error: 'error'
                    }
                 }
                    if(data === 'false' && this.nodeInfo.isSynchronizing !== true){
                    let _reference = new Uint8Array(64);
                    window.crypto.getRandomValues(_reference);
                    let reference = window.parent.Base58.encode(_reference);
                      const chatRes =  await routes.chat({
                        data: {
                            type: 19,
                            nonce: store.getState().app.selectedAddress.nonce,
                            params: {
                                lastReference: reference,
                                proofOfWorkNonce: 0,
                                fee: 0,
                                timestamp: Date.now(),
                                
                            },
                            disableModal: true
                        },
                        disableModal: true,
                    });
                      
                        try {
                         const powRes =   await _computePow2(chatRes)
                            if(powRes === true){
                                clearInterval(this.interval)
				
                        this.publicKeyisOnChainConfirmation = true
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                  
					if (!data.error && data !== 'false' && data) {
						clearInterval(this.interval)
				
                        this.publicKeyisOnChainConfirmation = true
					}

				} catch (error) {
				}
				stop = false
			}
		};
		this.interval = setInterval(checkPublicKey, 5000);
	}

    firstUpdated() {
        this.getNodeInfo()
        this.getCoreInfo()
       try {
        this.confirmPublicKeyOnChain(store.getState().app.selectedAddress.address)
       } catch (error) {
        console.error(error)
       }
       
        
        setInterval(() => {
            this.getNodeInfo()
            this.getCoreInfo()
        }, 30000)
    }

    async getNodeInfo() {
        const appinfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const appinfoUrl = appinfoNode.protocol + '://' + appinfoNode.domain + ':' + appinfoNode.port
        const url = `${appinfoUrl}/admin/status`
        await fetch(url).then(response => {
            return response.json()
        })
        .then(data => {
            this.nodeInfo = data
        })
        .catch(err => {
            console.error('Request failed', err)
        })
    }

    async getCoreInfo() {
        const appinfoNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
        const appinfoUrl = appinfoNode.protocol + '://' + appinfoNode.domain + ':' + appinfoNode.port
        const url = `${appinfoUrl}/admin/info`
        await fetch(url).then(response => {
            return response.json()
        })
        .then(data => {
            this.coreInfo = data
        })
        .catch(err => {
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

    gotoPage(url) {
        const myLink = this.shadowRoot.querySelector('#pageLink')
        myLink.href = url
        myLink.click()
        store.dispatch(doPageUrl(''))
    }

    stateChanged(state) {
        this.blockInfo = state.app.blockInfo
        this.nodeStatus = state.app.nodeStatus
        this.nodeConfig = state.app.nodeConfig
        this.pageUrl = state.app.pageUrl
        if (this.pageUrl.length > 5) {
            this.gotoPage(this.pageUrl)
        }
    }
}

window.customElements.define('app-info', AppInfo)
