import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../../store.js'

const TRANSITION_EVENT_NAMES = ['transitionend', 'webkitTransitionEnd', 'oTransitionEnd', 'MSTransitionEnd']

class LoadingRipple extends connect(store)(LitElement) {
    static get properties () {
        return {
            welcomeMessage: {
                type: String,
                attribute: 'welcome-message',
                reflectToAttribute: true
            },
            loadingMessage: {
                type: String,
                attribute: 'loading-message',
                reflectToAttribute: true
            }
        }
    }

    constructor () {
        super()
        this.welcomeMessage = ''
        this.loadingMessage = ''
    }

    static get styles () {
        return css`
            * {
                --paper-spinner-color: var(--mdc-theme-secondary);
            }
            
        `
    }

    render () {
        return html`
        <style>
            #rippleWrapper{
                position:fixed;
                top:0;
                left:0;
                bottom:0;
                right:0;
                height:0;
                width:0;
                z-index:999;
                overflow: visible;
                --ripple-activating-transition: transform 0.3s cubic-bezier(0.6, 0.0, 1, 1), opacity 0.3s cubic-bezier(0.6, 0.0, 1, 1);
                --ripple-disable-transition: opacity 0.5s ease;
            }
            #ripple{
                border-radius:50%;
                border-width:0;
                margin-left:-100vmax;
                margin-top: -100vmax;
                height:200vmax;
                width:200vmax;
                overflow:hidden;
                background: var(--mdc-theme-secondary);
                transform: scale(0);
                overflow:hidden;
            }
            #ripple.error {
                transition: var(--ripple-activating-transition);
                background: var(--mdc-theme-error)
            }
            #rippleShader {
                background: var(--mdc-theme-surface);
                opacity:0;
                height:100%;
                width:100%;
            }
            #ripple.activating{
                transition: var(--ripple-activating-transition);
                transform: scale(1)
            }
            .activating #rippleShader {
                transition: var(--ripple-activating-transition);
                opacity: 1;
            }
            #ripple.disabling{
                transition: var(--ripple-disable-transition);
                opacity: 0;
            }
            #rippleContentWrapper {
                position: absolute;
                top:100vmax;
                left:100vmax;
                height:var(--window-height);
                width:100vw;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #rippleContent {
                opacity: 0;
                text-align:center;
            }
            .activating-done #rippleContent {
                opacity: 1;
                transition: var(--ripple-activating-transition);
            }
        </style>
            <div id="rippleWrapper">
                <div id="ripple">
                    <div id="rippleShader"></div>
                    <div id="rippleContentWrapper">
                        <div id="rippleContent">
                            <h1>${this.welcomeMessage}</h1>
                            <paper-spinner-lite active></paper-spinner-lite>
                            <p>${this.loadingMessage}</p>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    firstUpdated () {
        this._rippleWrapper = this.shadowRoot.getElementById('rippleWrapper')
        this._ripple = this.shadowRoot.getElementById('ripple')
        this._rippleContentWrapper = this.shadowRoot.getElementById('rippleContentWrapper')
    }

    // duh
    open (origin) {
        this._rippleWrapper.style.top = origin.y + 'px'
        this._rippleWrapper.style.left = origin.x + 'px'
        this._rippleContentWrapper.style.marginTop = -origin.y + 'px'
        this._rippleContentWrapper.style.marginLeft = -origin.x + 'px'

        return new Promise((resolve, reject) => {
            this._ripple.classList.add('activating')
            let isOpened = false
            const doneOpeningEvent = () => {
                if (isOpened) return
                // Clear events
                TRANSITION_EVENT_NAMES.forEach(name => this._ripple.removeEventListener(name, doneOpeningEvent))
                this._ripple.classList.add('activating-done')
                isOpened = true
                resolve()
            }
            TRANSITION_EVENT_NAMES.forEach(name => this._ripple.addEventListener(name, doneOpeningEvent))
        })
    }

    // Fades out
    fade () {
        return new Promise((resolve, reject) => {
            // CAN'T FADE OUT CAUSE THE STUPID THING GETS KILLED CAUSE OF STATE.APP.LOGGEEDIN
            // let rippleClosed = false
            this._ripple.classList.remove('activating')
            this._ripple.classList.remove('activating-done')
            this._ripple.classList.remove('disabling')
            resolve()
            // this._ripple.classList.add('disabling')
            // const rippleFadedEvent = () => {
            //     console.log('ripple closed event')
            //     if (rippleClosed) return
            //     rippleClosed = true
            //     // Reset the ripple
            //     TRANSITION_EVENT_NAMES.forEach(name => this._ripple.removeEventListener(name, rippleFadedEvent))
            //     this._ripple.classList.remove('activating')
            //     this._ripple.classList.remove('activating-done')
            //     this._ripple.classList.remove('disabling')
            //     this.rippleIsOpen = false
            //     resolve()
            // }
            // console.log('==============================================================================================================================================')
            // TRANSITION_EVENT_NAMES.forEach(name => this._ripple.addEventListener(name, rippleFadedEvent))
        })
    }

    // un-ripples...
    close () {
        return new Promise((resolve, reject) => {
            let rippleClosed = false
            this._ripple.classList.add('error')
            this._ripple.classList.remove('activating')
            this._ripple.classList.remove('activating-done')
            const rippleClosedEvent = () => {
                if (rippleClosed) return
                rippleClosed = true
                TRANSITION_EVENT_NAMES.forEach(name => this._ripple.removeEventListener(name, rippleClosedEvent))
                // Reset the ripple
                this._ripple.classList.remove('error')
                this.rippleIsOpen = false
                resolve()
            }
            TRANSITION_EVENT_NAMES.forEach(name => this._ripple.addEventListener(name, rippleClosedEvent))
        })
    }

    stateChanged (state) {
        // this.loggedIn = state.app.loggedIn
    }
}

window.customElements.define('loading-ripple', LoadingRipple)
