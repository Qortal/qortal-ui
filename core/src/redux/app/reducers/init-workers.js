export const initWorkersReducer = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...state,
                workers: {
                    workers: action.payload,
                    ready: true,
                    loading: false
                }
            }
        case 'error':
            return {
                ...state,
                workers: {
                    ...state.workers,
                    ready: false,
                    loading: false,
                    lastError: action.payload
                }
            }
        default:
            return {
                ...state,
                workers: {
                    ...state.workers,
                    // ready: true,
                    loading: true
                }
            }
    }
}
