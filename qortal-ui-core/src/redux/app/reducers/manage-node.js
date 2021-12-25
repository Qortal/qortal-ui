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
