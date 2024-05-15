export const setNode = (state, action) => {
	return {
		...state,
		nodeConfig: {
			...state.nodeConfig,
			node: action.payload
		}
	}
}

export const addNode = (state, action) => {
	return {
		...state,
		nodeConfig: {
			...state.nodeConfig,
			knownNodes: [
				...state.nodeConfig.knownNodes,
				action.payload
			]
		}
	}
}

export const editNode = (state, action) => {
	const copyKnownNodes = [...state.nodeConfig.knownNodes]
	copyKnownNodes[action.payload.index] = action.payload.nodeObject

	return {
		...state,
		nodeConfig: {
			...state.nodeConfig,
			knownNodes: copyKnownNodes
		}
	}
}

export const removeNode = (state, action) => {
	const copyKnownNodes = [...state.nodeConfig.knownNodes]
	copyKnownNodes.splice(action.payload, 1)

	return {
		...state,
		nodeConfig: {
			...state.nodeConfig,
			knownNodes: copyKnownNodes
		}
	}
}