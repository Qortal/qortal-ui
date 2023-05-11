import { routes } from './trade-bot-routes.js'

export const addTradeBotRoutes = epmlInstance => {
    Object.entries(routes).forEach(([route, handler]) => {
        epmlInstance.route(route, handler)
    })
}
