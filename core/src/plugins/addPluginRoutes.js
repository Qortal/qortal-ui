import { routes } from './routes'

export const addPluginRoutes = epmlInstance => {
	Object.entries(routes).forEach(([route, handler]) => {
		epmlInstance.route(route, handler)
	})
}