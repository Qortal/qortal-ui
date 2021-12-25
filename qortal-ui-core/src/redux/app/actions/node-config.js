// Node Config Actions here...
import { LOAD_NODE_CONFIG, SET_NODE, ADD_NODE } from '../app-action-types.js'

const nodeConfigUrl = '/getConfig'

export const doLoadNodeConfig = () => {

    return (dispatch, getState) => {
        fetch(nodeConfigUrl)
            .then(res => {
                return res.json()
            })
            .then(data => {
                const nodeConfig = {
                    node: 0,
                    knownNodes: [{}],
                    version: ''
                }
                nodeConfig.node = data.config.user.node
                nodeConfig.knownNodes = data.config.user.knownNodes
                nodeConfig.version = data.config.user.version
                return dispatch(loadNodeConfig(nodeConfig))
            })
            .catch(err => {
                console.error(err)
            })
    }
}

const loadNodeConfig = (payload) => {
    return {
        type: LOAD_NODE_CONFIG,
        payload
    }
}

export const doSetNode = (nodeIndex) => {
    return (dispatch, getState) => {
        return dispatch(setNode(nodeIndex))
    }
}

const setNode = (payload) => {
    return {
        type: SET_NODE,
        payload
    }
}

export const doAddNode = (nodeObject) => {
    return (dispatch, getState) => {
        return dispatch(addNode(nodeObject))
    }
}

const addNode = (payload) => {
    return {
        type: ADD_NODE,
        payload
    }
}
