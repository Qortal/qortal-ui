export const loadStateFromLocalStorage = (key) => {
    try {
        const config = localStorage.getItem(key)
        if (config === null) return void 0
        return JSON.parse(config)
    } catch (e) {
        // Could add error handling in case there's a weird one...don't want to overwrite config if it's malfunctioned
        return void 0
    }
}

// const loadConfigFromAPI = () => {
//     return fetch(configURL).then(res => res.json())
// }

// export const loadConfig = async (key) => loadConfigFromLocalStorage() || loadConfigFromAPI()

export const saveStateToLocalStorage = (key, state) => {
    try {
        const stateJSON = JSON.stringify(state)
        localStorage.setItem(key, stateJSON)
    } catch (e) {
        console.error(e, 'e')
    }
}
