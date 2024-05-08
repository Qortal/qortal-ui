import { routes } from './trade-bot-routes'

export const addTradeBotRoutes = epmlInstance => {
	Object.entries(routes).forEach(([route, handler]) => {
		epmlInstance.route(route, handler)
	})
}