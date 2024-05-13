import { combineReducers } from 'redux'
import app from './app/app-reducer'
import config from './config/config-reducer'
import user from './user/user-reducer'

export default combineReducers({
	user,
	app,
	config
})