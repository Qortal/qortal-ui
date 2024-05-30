// Node Config Actions here...
import { ADD_NODE, EDIT_NODE, LOAD_NODE_CONFIG, REMOVE_NODE, SET_NODE } from '../app-action-types'
import { UI_VERSION } from '../version'

const nodeConfigUrl = '/getConfig'
const checkNodes = JSON.parse(localStorage.getItem('myQortalNodes'))
const checkMyNode = localStorage.getItem('mySelectedNode')

export const doLoadNodeConfig = () => {
	return (dispatch, getState) => {
		fetch(nodeConfigUrl).then(res => {
				return res.json()
			}).then(data => {
				const nodeConfig = {
					node: 0,
					knownNodes: [{}],
					version: ''
				}

				if (checkMyNode === null || checkMyNode.length === 0) {
					localStorage.setItem('mySelectedNode', 0)
					nodeConfig.node = localStorage.getItem('mySelectedNode')
				} else {
					nodeConfig.node = localStorage.getItem('mySelectedNode')
				}

				if (checkNodes === null || checkNodes.length === 0) {
					var saveNode = []
					saveNode.push(obj1, obj2)
					localStorage.setItem('myQortalNodes', JSON.stringify(saveNode))
					nodeConfig.knownNodes = JSON.parse(localStorage.getItem('myQortalNodes'))
				} else {
					nodeConfig.knownNodes = JSON.parse(localStorage.getItem('myQortalNodes'))
				}

				nodeConfig.version = UI_VERSION

				return dispatch(loadNodeConfig(nodeConfig))
			}).catch(err => {
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

export const doRemoveNode = (index) => {
	return (dispatch, getState) => {
		return dispatch(removeNode(index))
	}
}

export const doEditNode = (index, nodeObject) => {
	return (dispatch, getState) => {
		return dispatch(editNode({ index, nodeObject }))
	}
}

const addNode = (payload) => {
	return {
		type: ADD_NODE,
		payload
	}
}

const editNode = (payload) => {
	return {
		type: EDIT_NODE,
		payload
	}
}

const removeNode = (payload) => {
	return {
		type: REMOVE_NODE,
		payload
	}
}

const obj1 = {
	name: 'Local Node',
	protocol: 'http',
	domain: '127.0.0.1',
	port: 12391,
	enableManagement: true
}

const obj2 = {
	name: 'Local Testnet',
	protocol: 'http',
	domain: '127.0.0.1',
	port: 62391,
	enableManagement: true
}
