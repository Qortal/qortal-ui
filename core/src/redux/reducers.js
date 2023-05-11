import { combineReducers } from 'redux'

import app from './app/app-reducer.js'
import config from './config/config-reducer.js'
import user from './user/user-reducer.js'

export default combineReducers({
    user,
    app,
    config
})
