let config = require('./default.config.js')
let userConfig = {}
try {
    userConfig = require('./customConfig.js')
} catch (e) {
    console.warn(e)
    console.warn('Error loading user config')
}
const checkKeys = (storeObj, newObj) => {
    for (const key in newObj) {
        if (!Object.prototype.hasOwnProperty.call(storeObj, key)) return

        if (typeof newObj[key] === 'object') {
            storeObj[key] = checkKeys(storeObj[key], newObj[key])
        } else {
            storeObj[key] = newObj[key]
        }
    }
    return storeObj
}

const getConfig = customConfig => {
    config = checkKeys(config, customConfig)
    return config
}

module.exports = getConfig(userConfig)
