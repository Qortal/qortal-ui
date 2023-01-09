import { LitElement, html, css } from 'lit';
import { render } from 'lit/html.js';
import { Epml } from '../../../../epml.js';
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate';
import { qchatStyles } from './q-chat-css.src.js'
import WebWorker from 'web-worker:./computePowWorker.src.js';

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

import '../../components/ChatWelcomePage.js'
import '../../components/ChatHead.js'
import '../../components/ChatPage.js'
import '../../components/WrapperModal.js';
import '../../components/ChatSeachResults.js';
import '../../components/ChatGroupsManagement.js'
import snackbar from '../../components/snackbar.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-icon'
import '@material/mwc-snackbar'
import '@vaadin/grid'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder'
import { Editor, Extension } from '@tiptap/core'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class Chat extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            chatTitle: { type: String },
            chatHeads: { type: Array },
            chatHeadsObj: { type: Object },
            chatId: { type: String },
            messages: { type: Array },
            btnDisable: { type: Boolean },
            isLoading: { type: Boolean },
            balance: { type: Number },
            theme: { type: String, reflect: true },
            blockedUsers: { type: Array },
            blockedUserList: { type: Array },
            privateMessagePlaceholder: { type: String},
            chatEditor: { type:  Object },
            imageFile: { type: Object },
            activeChatHeadUrl: { type: String },
            openPrivateMessage: { type: Boolean },
            userFound: { type: Array},
            userFoundModalOpen: { type: Boolean },
            userSelected: { type: Object },
            editor: {type: Object}
        }
    }

 static styles = [qchatStyles]

    constructor() {
        super()
        this.selectedAddress = {}
        this.config = {
            user: {
                node: {

                }
            }
        }
        this.chatTitle = ""
        this.chatHeads = []
        this.chatHeadsObj = {}
        this.chatId = ''
        this.balance = 1
        this.messages = []
        this.btnDisable = false
        this.isLoading = false
        this.showNewMessageBar = this.showNewMessageBar.bind(this)
        this.hideNewMessageBar = this.hideNewMessageBar.bind(this)
        this.setOpenPrivateMessage = this.setOpenPrivateMessage.bind(this)
        this._sendMessage = this._sendMessage.bind(this)
        this.insertImage = this.insertImage.bind(this)
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.blockedUsers = []
        this.blockedUserList = []
        this.privateMessagePlaceholder = ""
        this.imageFile = null
        this.activeChatHeadUrl = ''
        this.openPrivateMessage = false
        this.userFound = []
        this.userFoundModalOpen = false
        this.userSelected = {}
    }

  async setActiveChatHeadUrl(url) {
        this.activeChatHeadUrl = ''
        await this.updateComplete;
        this.activeChatHeadUrl = url
    }

    resetChatEditor(){
     
            this.editor.commands.setContent('')
      
    }
    async getUpdateCompleteTextEditor() {
        await super.getUpdateComplete();
        const marginElements = Array.from(this.shadowRoot.querySelectorAll('chat-text-editor'));
        await Promise.all(marginElements.map(el => el.updateComplete));
        const marginElements2 = Array.from(this.shadowRoot.querySelectorAll('wrapper-modal'));
        await Promise.all(marginElements2.map(el => el.updateComplete));
        return true;
    }

    async  connectedCallback() {
        super.connectedCallback();
        await this.getUpdateCompleteTextEditor();

        const elementChatId = this.shadowRoot.getElementById('messageBox').shadowRoot.getElementById('privateMessage')
        console.log({elementChatId})
        this.editor = new Editor({
            element: elementChatId,
            extensions: [
              StarterKit,
              Underline,
              Placeholder.configure({
                placeholder: 'Write something …',
              }),
              Extension.create({
                addKeyboardShortcuts:()=> {
                  return {
                    'Enter': ()=> {
                        const chatTextEditor = this.shadowRoot.getElementById('messageBox')
                        chatTextEditor.sendMessageFunc({
                        })
                      return true
                    }
                  }
                }})
            ]
          })
         
      }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editor.destroy()
  
      }

      updatePlaceholder(editor, text){
        editor.extensionManager.extensions.forEach((extension) => {
            if (extension.name === "placeholder") {
    
              extension.options["placeholder"] = text
              editor.commands.focus('end')
            }
          })
    }

    render() {
        return html`
            <div class="container clearfix">
                <div class="people-list" id="people-list">
                    <div class="search">
                        <div class="create-chat" @click=${() => {
                            this.openPrivateMessage = true;
                            }}>${translate("chatpage.cchange1")}
                        </div>
                        <chat-groups-management></chat-groups-management>
                    </div>
                    <ul class="list">
                        ${this.isEmptyArray(this.chatHeads) ? this.renderLoadingText() : this.renderChatHead(this.chatHeads)}
                    </ul>
                    <div class="blockedusers">
                        <div class="center">
                            <mwc-button raised label="${translate("chatpage.cchange3")}" icon="person_off" @click=${() => this.shadowRoot.querySelector('#blockedUserDialog').show()}></mwc-button>
                        </div>
                    </div>
                </div>
                <div class="chat">
                    <div id="newMessageBar" class="new-message-bar hide-new-message-bar clearfix" @click=${() => this.scrollToBottom()}>
                        <span style="flex: 1;">${translate("chatpage.cchange4")}</span>
                        <span>${translate("chatpage.cchange5")} <mwc-icon style="font-size: 16px; vertical-align: bottom;">keyboard_arrow_down</mwc-icon></span>
                    </div>
                    <div class="chat-history">
               
                        ${window.parent.location.pathname !== "/app/q-chat" || this.activeChatHeadUrl ? html`${this.renderChatPage(this.chatId)}` : html`${this.renderChatWelcomePage()}`}
                    </div>
                </div>
                <!-- Start Chatting Dialog -->
                <wrapper-modal 
                    .onClickFunc=${() => {
                        this.resetChatEditor();
                        this.openPrivateMessage = false;
                        this.shadowRoot.getElementById('sendTo').value = "";
                        this.userFoundModalOpen = false;
                        this.userFound = [];
                    } } 
                    style=${this.openPrivateMessage ? "visibility:visible;z-index:50" : "visibility: hidden;z-index:-100;position: relative"}>
                    <div style=${"position: relative"}>
                        <div class="dialog-container">
                            <div class="dialog-header" style="text-align: center">
                                <h1>${translate("chatpage.cchange1")}</h1>
                                <hr>
                            </div>
                            <p class="dialog-subheader">${translate("chatpage.cchange6")}</p>
                            <div class="search-field">
                                <input 
                                    type="text"
                                    class="name-input" 
                                    ?disabled=${this.isLoading} 
                                    id="sendTo" 
                                    placeholder="${translate("chatpage.cchange7")}" 
                                    value=${this.userSelected.name}
                                    @keypress=${() => {
                                        this.userSelected = {};
                                        this.requestUpdate();
                                        }}
                                />
                                ${this.userSelected.name ? (
                                    html`
                                    <div class="user-verified">
                                        <p >${translate("chatpage.cchange38")}</p>
                                        <vaadin-icon icon="vaadin:check-circle-o" slot="icon"></vaadin-icon>
                                    </div>
                                    `
                                ) : (
                                    html`                                    
                                    <vaadin-icon 
                                        @click=${this.userSearch}
                                        slot="icon" 
                                        icon="vaadin:open-book"
                                        class="search-icon">
                                    </vaadin-icon>
                                    `
                                )}
                            </div>
                            
                            <chat-text-editor 
                                iframeId="privateMessage" 
                                ?hasGlobalEvents=${false}
                                placeholder="${translate("chatpage.cchange8")}"
                                .imageFile=${this.imageFile}
                                ._sendMessage=${this._sendMessage}
                                .insertImage=${this.insertImage}
                                ?isLoading=${this.isLoading}
                                .isLoadingMessages=${false}
                                id="messageBox"
                                .editor=${this.editor}
                                .updatePlaceholder=${(editor, value)=> this.updatePlaceholder(editor, value)}
                                >
                            </chat-text-editor>
                            <div class="modal-button-row">
                                <button 
                                    class="modal-button-red" 
                                    @click=${() => {
                                    this.resetChatEditor();
                                    this.openPrivateMessage = false;
                                    }}
                                    ?disabled="${this.isLoading}"
                                >
                                    ${translate("chatpage.cchange33")}
                                </button>
                                <button
                                    class="modal-button"
                                    @click=${()=> {
                                        const chatTextEditor = this.shadowRoot.getElementById('messageBox')
                        chatTextEditor.sendMessageFunc({
                        })
                                     
                                    
                                    }}
                                    ?disabled="${this.isLoading}">
                                        ${this.isLoading === false 
                                        ? this.renderSendText() 
                                        : html`
                                            <paper-spinner-lite active></paper-spinner-lite>
                                        `}
                                </button>
                            </div>
                        </div>
                        <div class="search-results-div">
                            <chat-search-results 
                                .onClickFunc=${(result) => {
                                    this.userSelected = result;
                                    this.userFound = [];
                                    this.userFoundModalOpen = false;
                                }}
                                .closeFunc=${() => {
                                    this.userFoundModalOpen = false;
                                    this.userFound = [];
                                }}
                                .searchResults=${this.userFound}
                                ?isOpen=${this.userFoundModalOpen}
                                ?loading=${this.isLoading}>
                            </chat-search-results>
                        </div>
                    </div>    	
                </wrapper-modal>

                <!-- Blocked User Dialog -->
                <mwc-dialog id="blockedUserDialog">
                    <div style="text-align:center">
                        <h1>${translate("chatpage.cchange10")}</h1>
                        <hr>
                        <br>
                    </div>
                    <vaadin-grid theme="compact" id="blockedGrid" ?hidden="${this.isEmptyArray(this.blockedUserList)}" aria-label="Blocked List" .items="${this.blockedUserList}" all-rows-visible>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange11")}" .renderer=${(root, column, data) => {
                            if (data.item.name = 'No registered name') {
                                render(html`${translate("chatpage.cchange15")}`, root);
                            } else {
                                render(html`${data.item.name}`, root);
                            }
                        }}>
                        </vaadin-grid-column>
                        <vaadin-grid-column auto-width header="${translate("chatpage.cchange12")}" path="owner"></vaadin-grid-column>
                        <vaadin-grid-column width="10rem" flex-grow="0" header="${translate("chatpage.cchange13")}" .renderer=${(root, column, data) => {
                            render(html`${this.renderUnblockButton(data.item)}`, root);
                        }}>
                        </vaadin-grid-column>
                    </vaadin-grid>
                    ${this.isEmptyArray(this.blockedUserList) ? html`
                        <span style="color: var(--black); text-align: center;">${translate("chatpage.cchange14")}</span>
                    `: ''}
                    <mwc-button
                        slot="primaryAction"
                        dialogAction="cancel"
                        class="red"
                    >
                    ${translate("general.close")}
                   </mwc-button>
                </mwc-dialog>
            </div>
  
        `
    }

    firstUpdated() {
        this.changeLanguage()
        this.changeTheme()
        this.getChatBlockedList()
        this.getLocalBlockedList()

        const getBlockedUsers = async () => {
            let blockedUsers = await parentEpml.request('apiCall', {
                url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`
            })
            this.blockedUsers = blockedUsers
            setTimeout(getBlockedUsers, 60000)
        }

        const stopKeyEventPropagation = (e) => {
            e.stopPropagation();
            return false;
        }

        const nameInput = this.shadowRoot.getElementById('sendTo');

        nameInput.addEventListener('keydown', stopKeyEventPropagation);

        this.shadowRoot.getElementById('messageBox').addEventListener('keydown', stopKeyEventPropagation);

        // let typingTimer;                
        // let doneTypingInterval = 3000;  

        // //on keyup, start the countdown
        // nameInput.addEventListener('keyup', () => {
        //     clearTimeout(typingTimer);
        //     if (nameInput.value) {
        //         console.log("typing started!");
        //         typingTimer = setTimeout(this.userSearch, doneTypingInterval);
        //     }
        // });

        const getDataFromURL = () => {
            let tempUrl = document.location.href
            let splitedUrl = decodeURI(tempUrl).split('?')
            let urlData = splitedUrl[1]
            if (urlData !== undefined) {
                this.chatId = urlData
            }
        }

        const runFunctionsAfterPageLoad = () => {
            // Functions to exec after render while waiting for page info...
            // getDataFromURL()

            try {
                let key = `${window.parent.reduxStore.getState().app.selectedAddress.address.substr(0, 10)}_chat-heads`
                let localChatHeads = localStorage.getItem(key)
                this.setChatHeads(JSON.parse(localChatHeads))
            } catch (e) {
                // TODO: Could add error handling in case there's a weird one... (-_-)
                return
            }

            // Clear Interval...
            if (this.selectedAddress.address !== undefined) {
                clearInterval(runFunctionsAfterPageLoadInterval)
                return
            }
        }

        let runFunctionsAfterPageLoadInterval = setInterval(runFunctionsAfterPageLoad, 100);

        window.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            this._textMenu(event)
        })

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
            parentEpml.request('closeFramePasteMenu', null)
        })

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme === 'dark') {
                this.theme = 'dark'
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
                parentEpml.request('closeFramePasteMenu', null)
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
                    setTimeout(getBlockedUsers, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
            parentEpml.subscribe('chat_heads', chatHeads => {
                chatHeads = JSON.parse(chatHeads)
                this.getChatHeadFromState(chatHeads)
            })
            parentEpml.request('apiCall', {
                url: `/addresses/balance/${window.parent.reduxStore.getState().app.selectedAddress.address}`
            }).then(res => {
                this.balance = res
            })
            parentEpml.subscribe('copy_menu_switch', async value => {

                if (value === 'false' && window.getSelection().toString().length !== 0) {

                    this.clearSelection()
                }
            })
        })
        parentEpml.imReady()
    }

    setOpenPrivateMessage(props) {
        this.openPrivateMessage = props.open;
        this.shadowRoot.getElementById("sendTo").value = props.name
    }

   async userSearch() {
    const nameValue = this.shadowRoot.getElementById('sendTo').value;
        if(!nameValue) {
            this.userFound = [];
            this.userFoundModalOpen = true;
            return;
        }
        try {
            const result = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/names/${nameValue}`
            })
            if (result.error === 401) {
                this.userFound = [];
            } else {
                this.userFound = [
                    ...this.userFound, 
                    result,
                  ];
            }
            this.userFoundModalOpen = true;
        } catch (error) {
            console.error(error);
            let err4string = get("chatpage.cchange35");
            parentEpml.request('showSnackBar', `${err4string}`)
        }
    }



    async _sendMessage(outSideMsg, msg) { 
        this.isLoading = true;
        // this.chatEditor.disable();

        const trimmedMessage = msg
        if (/^\s*$/.test(trimmedMessage)) {
            this.isLoading = false;
            // this.chatEditor.enable();
        } else {
            const messageObject = {
                messageText: trimmedMessage,
                images: [''],
                repliedTo: '',
                version: 2
            }
            const stringifyMessageObject = JSON.stringify(messageObject)
            this.sendMessage(stringifyMessageObject);
        }
    }
      
      async sendMessage(messageText) {
        this.isLoading = true;
      
        const _recipient = this.shadowRoot.getElementById('sendTo').value;
      
        let recipient;
      
        const validateName = async (receiverName) => {  
            let myRes;
            try {                
                let myNameRes = await parentEpml.request('apiCall', {
                    type: 'api',
                    url: `/names/${receiverName}`
                });
                if (myNameRes.error === 401) {
                    myRes = false;
                } else {
                    myRes = myNameRes;
                }
                return myRes;
            } catch (error) {
                return "";
            }
        };
      
        const myNameRes = await validateName(_recipient);
        if (!myNameRes) {
            recipient = _recipient;
        } else {
            recipient = myNameRes.owner;
        };
      
        const getAddressPublicKey = async () => {
            let isEncrypted;
            let _publicKey;
      
            let addressPublicKey = await parentEpml.request('apiCall', {
                type: 'api',
                url: `/addresses/publickey/${recipient}`
            })
            
            if (addressPublicKey.error === 102) {
                _publicKey = false;
                let err4string = get("chatpage.cchange19");
                parentEpml.request('showSnackBar', `${err4string}`);
                // this.chatEditor.enable();
                this.isLoading = false;
            } else if (addressPublicKey !== false) {
                isEncrypted = 1;
                _publicKey = addressPublicKey;
                sendMessageRequest(isEncrypted, _publicKey);
            } else {
                let err4string = get("chatpage.cchange39");
                parentEpml.request('showSnackBar', `${err4string}`);
                // this.chatEditor.enable();
                this.isLoading = false;
            }
        };
        let _reference = new Uint8Array(64);
        window.crypto.getRandomValues(_reference);
        let reference = window.parent.Base58.encode(_reference);
        const sendMessageRequest = async (isEncrypted, _publicKey) => {
            let chatResponse = await parentEpml.request('chat', {
                type: 18,
                nonce: this.selectedAddress.nonce,
                params: {
                    timestamp: Date.now(),
                    recipient: recipient,
                    recipientPublicKey: _publicKey,
                    hasChatReference: 0,
                    message: messageText,
                    lastReference: reference,
                    proofOfWorkNonce: 0,
                    isEncrypted: 1,
                    isText: 1
                }
            });
            
            _computePow(chatResponse);
    };
      
        const _computePow = async (chatBytes) => {
            const difficulty = this.balance < 4 ? 18 : 8
            const path = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full';
            const worker = new WebWorker();
            let nonce = null;
            let chatBytesArray = null;
              await new Promise((res, rej) => {
                worker.postMessage({chatBytes, path, difficulty});
                worker.onmessage = e => {
                  worker.terminate();
                  chatBytesArray = e.data.chatBytesArray;
                    nonce = e.data.nonce;
                    res();
                }
              });
              
            let _response = await parentEpml.request('sign_chat', {
                nonce: this.selectedAddress.nonce,
                chatBytesArray: chatBytesArray,
                chatNonce: nonce
            });
           
            getSendChatResponse(_response);
        };
      
        const getSendChatResponse = (response) => {
            if (response === true) {
                this.setActiveChatHeadUrl(`direct/${recipient}`);
                this.shadowRoot.getElementById('sendTo').value = "";
                this.openPrivateMessage = false;
                this.resetChatEditor();
            } else if (response.error) {
                parentEpml.request('showSnackBar', response.message);
            } else {
                let err2string = get("chatpage.cchange21");
                parentEpml.request('showSnackBar', `${err2string}`);
            }
      
            this.isLoading = false;
            // this.chatEditor.enable();
        };
      
        // Exec..
        getAddressPublicKey();
      
      }

    insertImage(file) {
        if (file.type.includes('image')) {
            this.imageFile = file;
            // this.chatEditor.disable();
            return;
        }       
         parentEpml.request('showSnackBar', get("chatpage.cchange28")); 
    }

    renderLoadingText() {
        return html`${translate("chatpage.cchange2")}`
    }

    renderSendText() {
        return html`${translate("chatpage.cchange9")}`
    }

    relMessages() {
        setTimeout(() => {
            window.location.href = window.location.href.split( '#' )[0]
        }, 500)
    }

    getLocalBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`

        localStorage.removeItem("MessageBlockedAddresses")

        var hidelist = []

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            data.map(item => {
                hidelist.push(item)
            })
            localStorage.setItem("MessageBlockedAddresses", JSON.stringify(hidelist))
     
            this.blockedUserList = hidelist
        })
    }

    getChatBlockedList() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const blockedAddressesUrl = `${nodeUrl}/lists/blockedAddresses?apiKey=${this.getApiKey()}`
        const err1string = 'No registered name'

        localStorage.removeItem("ChatBlockedAddresses")

        var obj = [];

        fetch(blockedAddressesUrl).then(response => {
            return response.json()
        }).then(data => {
            return data.map(item => {
                const noName = {
                    name: err1string,
                    owner: item
                }
                fetch(`${nodeUrl}/names/address/${item}?limit=0&reverse=true`).then(res => {
                    return res.json()
                }).then(jsonRes => {
                    if(jsonRes.length) {
                        jsonRes.map (item => {
                            obj.push(item)
                        })
                    } else {
                        obj.push(noName)
                    }
                    localStorage.setItem("ChatBlockedAddresses", JSON.stringify(obj))
                    this.blockedUserList = JSON.parse(localStorage.getItem("ChatBlockedAddresses") || "[]")
                })
            })
        })
    }

    async unblockUser(websiteObj) {
        let owner = websiteObj.owner

        let items = [
            owner
        ]

        let ownersJsonString = JSON.stringify({ "items": items })

        let ret = await parentEpml.request('apiCall', {
            url: `/lists/blockedAddresses?apiKey=${this.getApiKey()}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: `${ownersJsonString}`
        })

        if (ret === true) {
            this.blockedUsers = this.blockedUsers.filter(item => item != owner)
            this.getChatBlockedList()
            this.blockedUserList = JSON.parse(localStorage.getItem("ChatBlockedAddresses") || "[]")
            let err2string = get("chatpage.cchange16")
            snackbar.add({
                labelText: `${err2string}`,
                dismiss: true
            })
            this.relMessages()
        }
        else {
            let err3string = get("chatpage.cchange17")
            snackbar.add({
                labelText: `${err3string}`,
                dismiss: true
            })
        }
        return ret
    }

    renderUnblockButton(websiteObj) {
        return html`<mwc-button dense unelevated label="${translate("chatpage.cchange18")}" icon="person_remove" @click="${() => this.unblockUser(websiteObj)}"></mwc-button>`
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme === 'dark') {
            this.theme = 'dark';
        } else {
            this.theme = 'light';
        }
        document.querySelector('html').setAttribute('theme', this.theme);
    }

    changeLanguage() {
        const checkLanguage = localStorage.getItem('qortalLanguage')

        if (checkLanguage === null || checkLanguage.length === 0) {
            localStorage.setItem('qortalLanguage', 'us')
            use('us')
        } else {
            use(checkLanguage)
        }
    }

    renderChatWelcomePage() {
        return html`
        <chat-welcome-page 
            myAddress=${JSON.stringify(this.selectedAddress)}
            .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}>
        </chat-welcome-page>`
    }

    renderChatHead(chatHeadArr) {

        let tempUrl = document.location.href
        let splitedUrl = decodeURI(tempUrl).split('?')
        // let activeChatHeadUrl = splitedUrl[1] === undefined ? '' : splitedUrl[1]

        return chatHeadArr.map(eachChatHead => {
            return html`<chat-head activeChatHeadUrl=${this.activeChatHeadUrl} .setActiveChatHeadUrl=${(val)=> this.setActiveChatHeadUrl(val)} chatInfo=${JSON.stringify(eachChatHead)}></chat-head>`
        })
    }

    renderChatPage(chatId) {
        
        // Check for the chat ID from and render chat messages
        // Else render Welcome to Q-CHat

        // TODO: DONE: Do the above in the ChatPage 
        return html`
        <chat-page 
            .chatHeads=${this.chatHeads} 
            .hideNewMessageBar=${this.hideNewMessageBar} 
            .showNewMessageBar=${this.showNewMessageBar} 
            myAddress=${window.parent.reduxStore.getState().app.selectedAddress.address} 
            chatId=${this.activeChatHeadUrl} 
            .setOpenPrivateMessage=${(val) => this.setOpenPrivateMessage(val)}
            .setActiveChatHeadUrl=${(val)=> this.setActiveChatHeadUrl(val)}>
        </chat-page>
        `
    }

    setChatHeads(chatObj) {

        let groupList = chatObj.groups.map(group => group.groupId === 0 ? { groupId: group.groupId, url: `group/${group.groupId}`, groupName: "Qortal General Chat", timestamp: group.timestamp === undefined ? 2 : group.timestamp } : { ...group, timestamp: group.timestamp === undefined ? 1 : group.timestamp, url: `group/${group.groupId}` })
        let directList = chatObj.direct.map(dc => {
            return { ...dc, url: `direct/${dc.address}` }
        })
        const compareNames = (a, b) => {
            return a.groupName.localeCompare(b.groupName)
        }
        groupList.sort(compareNames)
        let chatHeadMasterList = [...groupList, ...directList]

        const compareArgs = (a, b) => {
            return b.timestamp - a.timestamp
        }
        this.chatHeads = chatHeadMasterList.sort(compareArgs)
    }

    getChatHeadFromState(chatObj) {

        if (chatObj === undefined) {
            return
        } else {

            this.chatHeadsObj = chatObj
            this.setChatHeads(chatObj)
        }
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

    _textArea(e) {

        if (e.keyCode === 13 && !e.shiftKey) this._sendMessage()
    }

    clearSelection() {

        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    onPageNavigation(pageUrl) {
        parentEpml.request('setPageUrl', pageUrl)
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        let apiKey = myNode.apiKey;
        return apiKey;
    }

    scrollToBottom() {
        const viewElement = this.shadowRoot.querySelector('chat-page').shadowRoot.querySelector('chat-scroller').shadowRoot.getElementById('viewElement');
        viewElement.scroll({ top: viewElement.scrollHeight, left: 0, behavior: 'smooth' })
    }

    showNewMessageBar() {
        this.shadowRoot.getElementById('newMessageBar').classList.remove('hide-new-message-bar')
    }

    hideNewMessageBar() {
        this.shadowRoot.getElementById('newMessageBar').classList.add('hide-new-message-bar')
    }
}

window.customElements.define('q-chat', Chat)