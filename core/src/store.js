import {applyMiddleware, compose, createStore} from 'redux'
import thunk from 'redux-thunk'

import reducers from './redux/reducers.js'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(thunk)
    )
)
