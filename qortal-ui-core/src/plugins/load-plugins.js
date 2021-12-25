import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from './addPluginRoutes'
import { doAddPlugin } from '../redux/app/app-actions.js'

let retryLoadPluginsInterval = 0
export const loadPlugins = () => fetch('/getPlugins')
    .then(response => response.json())
    .then(response => {
        const plugins = response.plugins
        const config = store.getState().config
        pluginLoader(plugins, config)
    })
    .catch(err => {
        retryLoadPluginsInterval += 1000
        console.error(err)
        console.error(`Could not load plugins. Retrying in ${retryLoadPluginsInterval / 1000} second(s)`)
        setTimeout(loadPlugins, retryLoadPluginsInterval)
    })

export const pluginLoader = (plugins, config) => {
    const pluginContentWindows = []
    plugins.forEach(plugin => {
        const frame = document.createElement('iframe')
        frame.className += 'pluginJSFrame'
        frame.sandbox = 'allow-scripts allow-same-origin'

        frame.src = window.location.origin + '/qortal-components/plugin-mainjs-loader.html#' + plugin + '/main.js'

        const insertedFrame = window.document.body.appendChild(frame)

        pluginContentWindows.push(insertedFrame.contentWindow)

        const epmlInstance = new Epml({
            type: 'WINDOW',
            source: insertedFrame.contentWindow
        })

        addPluginRoutes(epmlInstance)
        epmlInstance.imReady()

        Epml.registerProxyInstance(`${plugin}-plugin`, epmlInstance)

        store.dispatch(doAddPlugin(epmlInstance))
    })
}
