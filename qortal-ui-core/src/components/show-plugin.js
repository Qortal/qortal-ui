import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { Epml } from '../epml.js'
import { addPluginRoutes } from '../plugins/addPluginRoutes.js'

class ShowPlugin extends connect(store)(LitElement) {
    static get properties() {
        return {
            app: { type: Object },
            pluginConfig: { type: Object },
            url: { type: String },
            linkParam: { type: String }
        }
    }

    static get styles() {
        return css`
            html {
                --scrollbarBG: #a1a1a1;
                --thumbBG: #6a6c75;
            }

            *::-webkit-scrollbar {
                width: 11px;
            }

            * {
                scrollbar-width: thin;
                scrollbar-color: var(--thumbBG) var(--scrollbarBG);
            }

            *::-webkit-scrollbar-track {
                background: var(--scrollbarBG);
            }

            *::-webkit-scrollbar-thumb {
                background-color: var(--thumbBG);
                border-radius: 6px;
                border: 3px solid var(--scrollbarBG);
            }
            
            iframe#showPluginFrame {
                width:100%;
                height:calc(var(--window-height) - 68px);
                border:0;
                padding:0;
                margin:0;
            }
        `
    }

    render() {
        const plugSrc = (myPlug) => {
            return myPlug === undefined ? 'about:blank' : `${window.location.origin}/plugin/${myPlug.domain}/${myPlug.page}${this.linkParam}`
        }

        const plugArr = []
        this.app.registeredUrls.forEach(myPlugArr => {
            myPlugArr.menus.length === 0 ? plugArr.push(myPlugArr) : myPlugArr.menus.forEach(i => plugArr.push(myPlugArr, i))
        })

        const myPlugObj = plugArr.find(pagePlug => {
            return pagePlug.url === this.url
        })

        return html`
            <iframe src="${plugSrc(myPlugObj)}" id="showPluginFrame"></iframe>
        `
    }

    firstUpdated() {

        const showingPluginEpml = new Epml({
            type: 'WINDOW',
            source: this.shadowRoot.getElementById('showPluginFrame').contentWindow
        })
        addPluginRoutes(showingPluginEpml)
        showingPluginEpml.imReady()
        this.showingPluginEpml = showingPluginEpml
        Epml.registerProxyInstance('visible-plugin', showingPluginEpml)
    }

    updated(changedProps) {
        if (changedProps.has('url')) {
            //...
        }

        if (changedProps.has('computerUrl')) {
            if (this.computedUrl !== 'about:blank') {
                this.loading = true
            }
        }
    }

    stateChanged(state) {
        this.app = state.app
        this.config = state.config

        const split = state.app.url.split('/')

        if (split[0] === '' && split[1] === 'app' && split[2] === undefined) {
            this.url = 'wallet'
            this.linkParam = ''
        } else if (split.length === 5 && split[1] === 'app') {
            this.url = split[2]
            this.linkParam = split[3] === undefined ? '' : '?' + split[3] + '/' + split[4]
        } else if (split[1] === 'app') {
            this.url = split[2]
            this.linkParam = ''
        } else {
            this.url = '404'
            this.linkParam = ''
        }
    }
}

window.customElements.define('show-plugin', ShowPlugin)
