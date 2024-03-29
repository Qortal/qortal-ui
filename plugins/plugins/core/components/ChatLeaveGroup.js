import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-icon'
import './WrapperModal'
import {get, translate} from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatLeaveGroup extends LitElement {
  static get properties() {
    return {
      isLoading: { type: Boolean },
      isOpenLeaveModal: {type: Boolean},
      leaveGroupObj: { type: Object },
      error: {type: Boolean},
      message: {type: String},
      chatHeads: {type: Array},
      setActiveChatHeadUrl: {attribute: false},
      selectedAddress: {attribute: Object}
    }
  }

  constructor() {
    super();
    this.isLoading = false;
    this.isOpenLeaveModal = false
    this.leaveGroupObj = {}
    this.fee = null
    this.error = false
    this.message = ''
    this.chatHeads = []
  }

  static get styles() {
    return css`
      .top-bar-icon {
            cursor: pointer;
            height: 18px;
            width: 18px;
            transition: .2s all;
        }
        .top-bar-icon:hover {
            color: var(--black)
        }
        .modal-button {
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: var(--mdc-theme-primary);
            background-color: transparent;
            padding: 8px 10px;
            border-radius: 5px;
            border: none;
            transition: all 0.3s ease-in-out;
        }
    `
  }

  firstUpdated() {

    }

    async unitFee() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const url = `${nodeUrl}/transactions/unitfee?txType=LEAVE_GROUP`
        let fee = null

        try {
            const res = await fetch(url)
            const data = await res.json()
            fee = (Number(data) / 1e8).toFixed(3)
        } catch (error) {
            fee = null
        }

      return fee
    }

    timeIsoString(timestamp) {
        let myTimestamp = timestamp === undefined ? 1587560082346 : timestamp
        let time = new Date(myTimestamp)
        return time.toISOString()
    }

    resetDefaultSettings() {
        this.error = false
        this.message = ''
        this.isLoading = false
    }

    renderErr9Text() {
        return html`${translate("grouppage.gchange49")}`
    }

    async confirmRelationship() {


		let interval = null
		let stop = false
		const getAnswer = async () => {
			const currentChats = this.chatHeads

			if (!stop) {
				stop = true;
				try {
                    const findGroup = currentChats.find((item)=> item.groupId === this.leaveGroupObj.groupId)
					if (!findGroup) {
						clearInterval(interval)
						this.isLoading = false
                        this.isOpenLeaveModal= false
                        this.setActiveChatHeadUrl('')
					}

				} catch (error) {
				}
				stop = false
			}
		};
		interval = setInterval(getAnswer, 5000);
	}

    async _leaveGroup(groupId, groupName) {
        // Reset Default Settings...
        this.resetDefaultSettings()

        const leaveFeeInput = await this.unitFee()
        if(!leaveFeeInput){
            throw Error()
        }
        this.isLoading = true

        // Get Last Ref
        const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${this.selectedAddress.address}`
			})
        };

        const validateReceiver = async () => {
            let lastRef = await getLastRef();
            let myTransaction = await makeTransactionRequest(lastRef)
            getTxnRequestResponse(myTransaction)

        }

        // Make Transaction Request
        const makeTransactionRequest = async (lastRef) => {
            let groupdialog3 = get("transactions.groupdialog3")
            let groupdialog4 = get("transactions.groupdialog4")
			return await parentEpml.request('transaction', {
				type: 32,
				nonce: this.selectedAddress.nonce,
				params: {
					fee: leaveFeeInput,
					registrantAddress: this.selectedAddress.address,
					rGroupName: groupName,
					rGroupId: groupId,
					lastReference: lastRef,
					groupdialog3: groupdialog3,
					groupdialog4: groupdialog4,
				}
			})
        }

        const getTxnRequestResponse = (txnResponse) => {

            if (txnResponse.success === false && txnResponse.message) {
                this.error = true
                this.message = txnResponse.message
                throw new Error(txnResponse)
            } else if (txnResponse.success === true && !txnResponse.data.error) {
                this.message = this.renderErr9Text()
                this.error = false
                this.confirmRelationship()
            } else {
                this.error = true
                this.message = txnResponse.data.message
                throw new Error(txnResponse)
            }
        }
        await validateReceiver()
    }

  render() {
    return html`
         <vaadin-icon @click=${()=> {
            this.isOpenLeaveModal = true
         }} class="top-bar-icon" style="margin: 0px 20px" icon="vaadin:exit" slot="icon"></vaadin-icon>
         <!-- Leave Group Dialog -->
         <wrapper-modal
                .removeImage=${() => {
                    if(this.isLoading) return
                    this.isOpenLeaveModal = false
                } }
                style=${(this.isOpenLeaveModal) ? "display: block" : "display: none"}>
                    <div style="text-align:center">
                        <h1>${translate("grouppage.gchange35")}</h1>
                        <hr>
                    </div>

                    <div class="itemList">
                        <span class="title">${translate("grouppage.gchange4")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.groupName}</span></div>

                        <span class="title">${translate("grouppage.gchange5")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.description}</span></div>

                        <span class="title">${translate("grouppage.gchange10")}</span>
                        <br>
                        <div><span>${this.leaveGroupObj.owner}</span></div>

                        <span class="title">${translate("grouppage.gchange31")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.created)}></time-ago></span></div>

                        ${!this.leaveGroupObj.updated ? "" : html`<span class="title">${translate("grouppage.gchange32")}</span>
                        <br>
                        <div><span><time-ago datetime=${this.timeIsoString(this.leaveGroupObj.updated)}></time-ago></span></div>`}
                    </div>

                    <div style="text-align:right; height:36px;">
                        <span ?hidden="${!this.isLoading}">
                            <!-- loading message -->
                            ${translate("grouppage.gchange36")} &nbsp;
                            <paper-spinner-lite
                                style="margin-top:12px;"
                                ?active="${this.isLoading}"
                                alt="Leaving"
                            >
                            </paper-spinner-lite>
                        </span>
                        <span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
                            ${this.message}
                        </span>
                    </div>

                    <button
                    class="modal-button"
                        ?disabled="${this.isLoading}"
                        @click=${() => this._leaveGroup(this.leaveGroupObj.groupId, this.leaveGroupObj.groupName)}
                    >
                    ${translate("grouppage.gchange37")}
                    </button>
                    <button
                    @click=${() => {
                        this.isOpenLeaveModal= false
                    }}
                    class="modal-button"
                        ?disabled="${this.isLoading}"

                    >
                    ${translate("general.close")}
                    </button>
                </wrapper-modal >
    `;
  }
}

customElements.define('chat-leave-group', ChatLeaveGroup);
