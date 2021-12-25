export const LOAD_CONFIG_FROM_API = 'LOAD_CONFIG_FROM_API'

const configUrl = '/getConfig'

export const doLoadConfigFromAPI = () => {
    return (dispatch, getState) => {
        if (getState().config.loaded) return dispatch(loadConfigFromAPI('success'))
        dispatch(loadConfigFromAPI())
        fetch(configUrl)
            .then(res => res.json())
            .then(data => dispatch(loadConfigFromAPI('success', data.config)))
            .catch(err => {
                console.error(err)
                dispatch(loadConfigFromAPI('error', err))
            })
    }
}

const loadConfigFromAPI = (status, payload) => {
    return {
        type: LOAD_CONFIG_FROM_API,
        status,
        payload
    }
}
