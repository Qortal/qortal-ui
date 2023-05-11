export const parentEpml = new Epml({
    type: 'WINDOW',
    source: window.parent
})

export const visiblePluginEpml = new Epml({
    type: 'PROXY',
    source: {
        proxy: parentEpml,
        target: 'visible-plugin',
        id: 'core-plugin' // self id for responses, matches that in proxy.html
    }
})