export const loadConfigFromAPI = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...action.payload,
                loaded: true,
                loading: false
            }
        case 'error':
            return {
                ...state,
                loaded: false,
                loading: false,
                loadingError: action.payload
            }
        default:
            return {
                ...state,
                loading: true
            }
    }
}
