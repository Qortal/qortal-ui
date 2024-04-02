import {parentEpml} from '../connect.js'
const MIN_RECONNECT_INTERVAL = 1000; // 1 second
const MAX_RECONNECT_INTERVAL = 60000; // 1 minute

let socketObject
let activeBlockSocketTimeout
let closeGracefully = false
let isCalled = false
let retryOnClose = false
let blockFirstCall = true
let nodeStatusSocketObject
let nodeStatusSocketTimeout
let nodeStatusSocketcloseGracefully = false
let nodeStatusRetryOnClose = false
let nodeStateCall = false
let isLoggedIn = false
let oldAccountInfo
let blockSocketReconnectInterval = MIN_RECONNECT_INTERVAL;
let nodeStatusSocketReconnectInterval = MIN_RECONNECT_INTERVAL;

parentEpml.subscribe('logged_in', loggedIn => {
    isLoggedIn = loggedIn === 'true';
})


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
    if (window.parent._.isEqual(oldAccountInfo, accountInfo) === true) {

    } else {
        parentEpml.request('setAccountInfo', accountInfo)
        oldAccountInfo = accountInfo
    }
}

const doNodeInfo = async () => {
    const nodeInfo = await parentEpml.request('apiCall', {
        url: '/admin/info'
    })
    parentEpml.request('updateNodeInfo', nodeInfo)
}

let initStateCount = 0
let oldState

const closeSockets = () => {
    socketObject.close()
    closeGracefully = true
    nodeStatusSocketObject.close()
    nodeStatusSocketcloseGracefully = true
}

export const startConfigWatcher = () => {
    parentEpml.ready().then(() => {
        parentEpml.subscribe('node_config', c => {
            if (initStateCount === 0) {
                let _oldState = JSON.parse(c)
                oldState = { node: _oldState.node, knownNodes: _oldState.knownNodes }
                initStateCount = initStateCount + 1
                nodeStateCall = true
                isCalled = true
                socketObject !== undefined ? closeSockets() : undefined
                nodeStatusSocketObject !== undefined ? closeSockets() : undefined
                initNodeStatusCall(oldState)
                pingactiveBlockSocket()
                // Call doNodeInfo
                doNodeInfo()
            }
            let _newState = JSON.parse(c)
            let newState = { node: _newState.node, knownNodes: _newState.knownNodes }
            if (window.parent._.isEqual(oldState, newState) === true) {

            } else {
                oldState = newState
                nodeStateCall = true
                isCalled = true
                socketObject !== undefined ? closeSockets() : undefined
                nodeStatusSocketObject !== undefined ? closeSockets() : undefined
                initNodeStatusCall(newState)
                pingactiveBlockSocket()
                // Call doNodeInfo
                doNodeInfo()
            }
        })
    })
    parentEpml.imReady()
}

const processBlock = (blockObject) => {
    parentEpml.request('updateBlockInfo', blockObject)
}

const doNodeStatus = async (nodeStatusObject) => {
    parentEpml.request('updateNodeStatus', nodeStatusObject)
}

const initNodeStatusCall = (nodeConfig) => {
    if (nodeConfig.node >= 0) {
        pingNodeStatusSocket()
    } else if (nodeStatusSocketObject !== undefined) {
        nodeStatusSocketObject.close()
        nodeStatusSocketcloseGracefully = true
    } else {
        // ...
    }
}

function attemptReconnectBlockSocket() {
    setTimeout(() => {
        initBlockSocket();
        blockSocketReconnectInterval = Math.min(blockSocketReconnectInterval * 2, MAX_RECONNECT_INTERVAL);
    }, blockSocketReconnectInterval);
}

function attemptReconnectNodeStatusSocket() {
    setTimeout(() => {
        initNodeStatusSocket();
        nodeStatusSocketReconnectInterval = Math.min(nodeStatusSocketReconnectInterval * 2, MAX_RECONNECT_INTERVAL);
    }, nodeStatusSocketReconnectInterval);
}


const initBlockSocket = () => {
    let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
    let nodeUrl = myNode.domain + ":" + myNode.port
    let activeBlockSocketLink
    if (window.parent.location.protocol === "https:") {
        activeBlockSocketLink = `wss://${nodeUrl}/websockets/blocks`
    } else {
        activeBlockSocketLink = `ws://${nodeUrl}/websockets/blocks`
    }
    const activeBlockSocket = new WebSocket(activeBlockSocketLink)
    // Open Connection
    activeBlockSocket.onopen = (e) => {
        blockSocketReconnectInterval = MIN_RECONNECT_INTERVAL;
        closeGracefully = false
        socketObject = activeBlockSocket
    }
    // Message Event
    activeBlockSocket.onmessage = (e) => {
        processBlock(JSON.parse(e.data))
        if (isLoggedIn) {
            // Call Set Account Info...
            setAccountInfo(window.parent.reduxStore.getState().app.selectedAddress.address)
        }
    }
    // Closed Event
    activeBlockSocket.onclose = () => {
        processBlock({});
        blockFirstCall = true;
        attemptReconnectBlockSocket();
    };
    // Error Event
    activeBlockSocket.onerror = (e) => {
        blockFirstCall = true
        processBlock({})
    }
    if (blockFirstCall) {
        parentEpml.request('apiCall', {
            url: '/blocks/last'
        }).then(res => {
            processBlock(res)
            blockFirstCall = false
        })
    }
}

const pingactiveBlockSocket = () => {
    if (isCalled) {
        isCalled = false
        initBlockSocket()
        activeBlockSocketTimeout = setTimeout(pingactiveBlockSocket, 295000)
    } else if (retryOnClose) {
        retryOnClose = false
        clearTimeout(activeBlockSocketTimeout)
        initBlockSocket()
        isCalled = true
        activeBlockSocketTimeout = setTimeout(pingactiveBlockSocket, 295000)
    } else {
        socketObject.send("non-integer ping")
        activeBlockSocketTimeout = setTimeout(pingactiveBlockSocket, 295000)
    }
}

const initNodeStatusSocket = () => {
    let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
    let nodeUrl = myNode.domain + ":" + myNode.port
    let activeNodeStatusSocketLink
    if (window.parent.location.protocol === "https:") {
        activeNodeStatusSocketLink = `wss://${nodeUrl}/websockets/admin/status`
    } else {
        activeNodeStatusSocketLink = `ws://${nodeUrl}/websockets/admin/status`
    }
    const activeNodeStatusSocket = new WebSocket(activeNodeStatusSocketLink)
    // Open Connection
    activeNodeStatusSocket.onopen = (e) => {
        nodeStatusSocketReconnectInterval = MIN_RECONNECT_INTERVAL;

        nodeStatusSocketcloseGracefully = false
        nodeStatusSocketObject = activeNodeStatusSocket
    }
    // Message Event
    activeNodeStatusSocket.onmessage = (e) => {
        doNodeStatus(JSON.parse(e.data))
    }
    // Closed Event
    activeNodeStatusSocket.onclose = () => {
        doNodeStatus({});
        attemptReconnectNodeStatusSocket();
    };
    // Error Event
    activeNodeStatusSocket.onerror = (e) => {
        doNodeStatus({})
    }
}

const pingNodeStatusSocket = () => {
    if (nodeStateCall) {
        clearTimeout(nodeStatusSocketTimeout)
        initNodeStatusSocket()
        nodeStateCall = false
        nodeStatusSocketTimeout = setTimeout(pingNodeStatusSocket, 295000)
    } else if (nodeStatusRetryOnClose) {
        nodeStatusRetryOnClose = false
        clearTimeout(nodeStatusSocketTimeout)
        initNodeStatusSocket()
        nodeStatusSocketTimeout = setTimeout(pingNodeStatusSocket, 295000)
    } else {
        nodeStatusSocketObject.send("non-integer ping")
        nodeStatusSocketTimeout = setTimeout(pingNodeStatusSocket, 295000)
    }
}
