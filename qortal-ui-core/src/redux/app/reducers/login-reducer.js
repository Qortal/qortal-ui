export const loginReducer = (state, action) => {
    switch (action.status) {
        case 'success':
            return {
                ...state,
                wallet: action.payload.wallet,
                loggedIn: true,
                loggingIn: false
            }
        case 'error':
            return {
                ...state,
                loggedIn: false,
                loggingIn: false
            }
        default:
            return {
                ...state,
                loggingIn: true
            }
    }
}
