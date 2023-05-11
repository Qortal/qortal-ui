import { ADD_PLUGIN, ADD_PLUGIN_URL, PAGE_URL } from '../app-action-types.js'

export const doAddPluginUrl = (pluginUrlsConf) => {
    return (dispatch, getState) => {
        dispatch(addPluginUrl(pluginUrlsConf))
    }
}

const addPluginUrl = (payload) => {
    return {
        type: ADD_PLUGIN_URL,
        payload
    }
}

export const doAddPlugin = (epmlInstance) => {
    return (dispatch, getState) => {
        dispatch(addPlugin(epmlInstance))
    }
}

const addPlugin = (payload) => {
    return {
        type: ADD_PLUGIN,
        payload
    }
}

export const doPageUrl = (pageUrl) => {
    return (dispatch, getState) => {
        dispatch(myPageUrl(pageUrl))
    }
}

const myPageUrl = (payload) => {
    return {
        type: PAGE_URL,
        payload
    }
}
