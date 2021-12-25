import { LitElement, html } from 'lit-element'

// import '../styles/styles.scss'
import './styles.scss'
import './app-theme.js'

class AppStyles extends LitElement {
    // static get styles () {
    //     return [
    //         css`
    //             html, * {
    //                 color: var(--color, green);
    //             }
    //         `
    //     ]
    // }

    /* Disable shadow DOM, so that the styles DO bleed */
    createRenderRoot () {
        return this
    }

    render () {
        return html`
            <style>
                /* NOT THE IDEAL SOLUTION. Would be better to compile sass and inline it here...
                someone can do this for me at some point...or I could  */
                /* https://material.io/develop/web/components/layout-grid/ */

                /* @import url('/'); */

                * {
                    /* from https://codepen.io/sdthornton/pen/wBZdXq/ */
                    --shadow-1: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
                    --shadow-2: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                    --shadow-3: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                    --shadow-4: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
                    --shadow-5: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);

                    --paper-input-container-focus-color: var(--mdc-theme-secondary);
                    
                    font-family: "Roboto", sans-serif;
                    color: var(--mdc-theme-on-surface);
                    --window-height: ${this.windowHeight};

                }

                hr {
                    border-color: var(--theme-on-surface);
                }

            </style>
            <app-theme></app-theme>
        `
    }

    constructor () {
        super()
        this.windowHeight = html`100vh`
        window.addEventListener('resize', () => this._windowResized())
        this._windowResized()
    }

    // For mobile chrome's address bar
    _windowResized () {
        const ua = navigator.userAgent
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)
        // console.log(isMobile, 'MOBILE')
        const isChrome = /Chrome/i.test(ua)
        const isSafari = /Version\/[\d\.]+.*Safari/.test(ua)

        if (isMobile && isChrome) {
            this.windowHeight = html`calc(100vh - 56px)`
            // document.body.style.setProperty('--window-height', 'calc(100vh - 56px)')
            // console.log('not same')
        } else if (isMobile && isSafari) {
            this.windowHeight = html`calc(100vh - 72px)`
        } else {
            this.windowHeight = html`100vh`
            // document.body.style.setProperty('--window-height', '100vh')
            // console.log('same')
        }
    }
}

window.customElements.define('app-styles', AppStyles)
