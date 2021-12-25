import { parentEpml } from '../connect.js'

import { startConfigWatcher } from './onNewBlock.js'

const setAccountInfo = async (addr) => {

    const names = await parentEpml.request('apiCall', {
        url: `/names/address/${addr}`
    })
    const addressInfo = await parentEpml.request('apiCall', {
        url: `/addresses/${addr}`
    })

    let accountInfo = {
        names: names,
        addressInfo: addressInfo
    }

    parentEpml.request('setAccountInfo', accountInfo)
}


const objectToArray = (object) => {

    let groupList = object.groups.map(group => group.groupId === 0 ? { groupId: group.groupId, url: `group/${group.groupId}`, groupName: "Qortal General Chat", sender: group.sender, senderName: group.senderName, timestamp: group.timestamp === undefined ? 1 : group.timestamp } : { ...group, url: `group/${group.groupId}` })
    let directList = object.direct.map(dc => {
        return { ...dc, url: `direct/${dc.address}` }
    })
    let chatHeadMasterList = [...groupList, ...directList]

    return chatHeadMasterList
}

const sortActiveChat = (activeChatObject, localChatHeads) => {

    let oldChatHeads = JSON.parse(localChatHeads)

    if (window.parent._.isEqual(oldChatHeads, activeChatObject) === true) {
        return
    } else {

        let oldActiveChats = objectToArray(oldChatHeads)
        let newActiveChats = objectToArray(activeChatObject)

        let results = newActiveChats.filter(newChat => {
            let value = oldActiveChats.some(oldChat => newChat.timestamp === oldChat.timestamp)
            return !value
        });

        results.forEach(chat => {

            if (chat.sender !== window.parent.reduxStore.getState().app.selectedAddress.address) {

                if (chat.sender !== undefined) parentEpml.request('showNotification', chat)
            } else {
                // ...
            }
        })

    }

}


let initialChatWatch = 0

const chatHeadWatcher = (activeChats) => {

    let addr = window.parent.reduxStore.getState().app.selectedAddress.address

    let key = `${addr.substr(0, 10)}_chat-heads`

    try {
        let localChatHeads = localStorage.getItem(key)

        if (localChatHeads === null) {
            parentEpml.request('setLocalStorage', {
                key: key,
                dataObj: activeChats
            }).then(ms => {
                parentEpml.request('setChatHeads', activeChats).then(ret => {
                    // ...
                })
            })
        } else {

            parentEpml.request('setLocalStorage', {
                key: key,
                dataObj: activeChats
            }).then(ms => {
                parentEpml.request('setChatHeads', activeChats).then(ret => {
                    // ...
                })
            })

            if (initialChatWatch >= 1) {

                sortActiveChat(activeChats, localChatHeads)
            } else {

                initialChatWatch = initialChatWatch + 1
            }
        }

    } catch (e) {
        console.error(e)

    }
}

let socketObject
let activeChatSocketTimeout
let initial = 0
let closeGracefully = false
let onceLoggedIn = false
let retryOnClose = false
let canPing = false

parentEpml.subscribe('logged_in', async isLoggedIn => {

    const initChatHeadSocket = () => {

        let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        let nodeUrl = myNode.domain + ":" + myNode.port

        let activeChatSocketLink

        if (window.parent.location.protocol === "https:") {

            activeChatSocketLink = `wss://${nodeUrl}/websockets/chat/active/${window.parent.reduxStore.getState().app.selectedAddress.address}`;
        } else {

            activeChatSocketLink = `ws://${nodeUrl}/websockets/chat/active/${window.parent.reduxStore.getState().app.selectedAddress.address}`;
        }

        const activeChatSocket = new WebSocket(activeChatSocketLink);

        // Open Connection
        activeChatSocket.onopen = () => {

            console.log(`[SOCKET]: Connected.`);
            socketObject = activeChatSocket

            initial = initial + 1
            canPing = true
        }

        // Message Event
        activeChatSocket.onmessage = (e) => {

            chatHeadWatcher(JSON.parse(e.data))
        }

        // Closed Event
        activeChatSocket.onclose = () => {

            console.log(`[SOCKET]: CLOSED`);
            clearInterval(activeChatSocketTimeout)

            if (closeGracefully === false && initial <= 52) {

                if (initial <= 52) {

                    parentEpml.request('showSnackBar', "Connection to the Qortal Core was lost, is your Core running ?")
                    retryOnClose = true
                    setTimeout(pingActiveChatSocket, 10000)
                    initial = initial + 1
                } else {

                    parentEpml.request('showSnackBar', "Cannot connect to the Qortal Core, restart UI and Core!")
                }
            }
        }

        // Error Event
        activeChatSocket.onerror = (e) => {

            console.log(`[SOCKET]: ${e.type}`);
        }
    }


    const pingActiveChatSocket = () => {

        if (window.parent.reduxStore.getState().app.loggedIn === true) {

            if (!onceLoggedIn) {

                initChatHeadSocket()
                onceLoggedIn = true
                activeChatSocketTimeout = setTimeout(pingActiveChatSocket, 295000)
            } else if (retryOnClose) {

                retryOnClose = false
                clearTimeout(activeChatSocketTimeout)
                initChatHeadSocket()
                onceLoggedIn = true
                activeChatSocketTimeout = setTimeout(pingActiveChatSocket, 295000)
            } else if (canPing) {

                socketObject.send('ping')
                activeChatSocketTimeout = setTimeout(pingActiveChatSocket, 295000)
            }

        } else {

            if (onceLoggedIn && !closeGracefully) {

                closeGracefully = true
                socketObject.close()
                clearTimeout(activeChatSocketTimeout)
                onceLoggedIn = false
                canPing = false
            }
        }
    }


    if (isLoggedIn === 'true') {

        // Call Set Account Info...
        setAccountInfo(window.parent.reduxStore.getState().app.selectedAddress.address)

        // Start Chat Watcher Socket
        pingActiveChatSocket()
    } else {

        if (onceLoggedIn) {

            closeGracefully = true
            socketObject.close()
            clearTimeout(activeChatSocketTimeout)
            onceLoggedIn = false
            canPing = false
        }

        initialChatWatch = 0
    }
})

startConfigWatcher()
