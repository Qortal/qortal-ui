import { routes } from './routes.js'

export const addPluginRoutes = epmlInstance => {
    Object.entries(routes).forEach(([route, handler]) => {
        epmlInstance.route(route, handler)
    })
}
