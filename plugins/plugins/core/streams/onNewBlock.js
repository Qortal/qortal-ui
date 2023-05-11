import { parentEpml } from '../connect.js'

let socketObject
let activeBlockSocketTimeout
let initial = 0
let closeGracefully = false
let isCalled = false
let retryOnClose = false
let blockFirstCall = true

let nodeStatusSocketObject
let nodeStatusSocketTimeout
let nodeStatusSocketcloseGracefully = false
let nodeStatusCount = 0
let nodeStatusRetryOnClose = false
let nodeStateCall = false

let isLoggedIn = false

let oldAccountInfo

parentEpml.subscribe('logged_in', loggedIn => {

    if (loggedIn === 'true') {
        isLoggedIn = true
    } else {
        isLoggedIn = false
    }
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

        return
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

    socketObject.close();
    closeGracefully = true

    nodeStatusSocketObject.close();
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
                socketObject !== undefined ? closeSockets() : undefined;
                nodeStatusSocketObject !== undefined ? closeSockets() : undefined;
                initNodeStatusCall(oldState)
                pingactiveBlockSocket()

                // Call doNodeInfo
                doNodeInfo()
            }

            let _newState = JSON.parse(c);
            let newState = { node: _newState.node, knownNodes: _newState.knownNodes }

            if (window.parent._.isEqual(oldState, newState) === true) {
                return
            } else {
                oldState = newState
                nodeStateCall = true
                isCalled = true
                socketObject !== undefined ? closeSockets() : undefined;
                nodeStatusSocketObject !== undefined ? closeSockets() : undefined;
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

    if (nodeConfig.node == 0) {
        pingNodeStatusSocket()
    } else if (nodeConfig.node == 1) {
        pingNodeStatusSocket()
    } else if (nodeStatusSocketObject !== undefined) {
        nodeStatusSocketObject.close()
        nodeStatusSocketcloseGracefully = true
    } else {
        // ...
    }
}

const initBlockSocket = () => {

    let myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
    let nodeUrl = myNode.domain + ":" + myNode.port

    let activeBlockSocketLink

    if (window.parent.location.protocol === "https:") {

        activeBlockSocketLink = `wss://${nodeUrl}/websockets/blocks`;
    } else {

        activeBlockSocketLink = `ws://${nodeUrl}/websockets/blocks`;
    }

    const activeBlockSocket = new WebSocket(activeBlockSocketLink);

    // Open Connection
    activeBlockSocket.onopen = (e) => {

        console.log(`[SOCKET-BLOCKS]: Connected.`);
        closeGracefully = false
        socketObject = activeBlockSocket

        initial = initial + 1
    }

    // Message Event
    activeBlockSocket.onmessage = (e) => {

        processBlock(JSON.parse(e.data));

        if (isLoggedIn) {

            // Call Set Account Info...
            setAccountInfo(window.parent.reduxStore.getState().app.selectedAddress.address)
        }
    }

    // Closed Event
    activeBlockSocket.onclose = () => {

        console.log(`[SOCKET-BLOCKS]: CLOSED`);

        processBlock({});
        blockFirstCall = true
        clearInterval(activeBlockSocketTimeout)

        if (closeGracefully === false && initial <= 52) {

            if (initial <= 52) {

                retryOnClose = true
                setTimeout(pingactiveBlockSocket, 10000)
                initial = initial + 1
            } else {

                // ... Stop retrying...
                retryOnClose = false
            }
        }
    }

    // Error Event
    activeBlockSocket.onerror = (e) => {

        console.log(`[SOCKET-BLOCKS]: ${e.type}`);
        blockFirstCall = true
        processBlock({});
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

        activeNodeStatusSocketLink = `wss://${nodeUrl}/websockets/admin/status`;
    } else {

        activeNodeStatusSocketLink = `ws://${nodeUrl}/websockets/admin/status`;
    }

    const activeNodeStatusSocket = new WebSocket(activeNodeStatusSocketLink);

    // Open Connection
    activeNodeStatusSocket.onopen = (e) => {

        console.log(`[SOCKET-NODE-STATUS]: Connected.`);
        nodeStatusSocketcloseGracefully = false
        nodeStatusSocketObject = activeNodeStatusSocket

        nodeStatusCount = nodeStatusCount + 1
    }

    // Message Event
    activeNodeStatusSocket.onmessage = (e) => {

        doNodeStatus(JSON.parse(e.data))
    }

    // Closed Event
    activeNodeStatusSocket.onclose = () => {

        console.log(`[SOCKET-NODE-STATUS]: CLOSED`);

        doNodeStatus({});
        clearInterval(nodeStatusSocketTimeout)

        if (nodeStatusSocketcloseGracefully === false && nodeStatusCount <= 52) {

            if (nodeStatusCount <= 52) {

                nodeStatusRetryOnClose = true
                setTimeout(pingNodeStatusSocket, 10000)
                nodeStatusCount = nodeStatusCount + 1
            } else {

                // ... Stop retrying...
                nodeStatusRetryOnClose = false
            }
        }
    }

    // Error Event
    activeNodeStatusSocket.onerror = (e) => {

        console.log(`[SOCKET-NODE-STATUS]: ${e.type}`);
        doNodeStatus({});
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
