import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store';

import { doPasteMenuSwitch } from '../redux/app/app-actions';


let pasteMenuElement

class FramePasteMenu extends connect(store)(LitElement) {
    static get properties() {
        return {
            eventObject: {
                type: Object,
                attribute: 'event-object',
                reflectToAttribute: true
            },
            isPasteMenuOpen: {
                type: Boolean
            }
        }
    }

    constructor() {
        super()
        this.eventObject = {}
        this.isPasteMenuOpen = false
    }

    static get styles() {
        return css`
                .paste-context-menu{
                    display: block;
                    opacity: 0;
                    position: absolute;
                    pointer-events: none;
                    padding: 5px, 0;
                    border: 1px solid #B2B2B2;
                    min-width: 150px;
                    max-width: 300px;
                    background: #F9F9F9;
                    /* box-shadow: 3px 3px 2px #E9E9E9; */
                    border-radius: 4px;
                }

                .p-open {
                    pointer-events: all;
                    opacity: 1;
                    z-index: 120;
                }

                #items {
                    list-style: none;
                    margin: 0px;
                    margin-top: 4px;
                    padding-left: 5px;
                    padding-right: 5px;
                    padding-bottom: 3px;
                    font-size: 17px;
                    color: #333333;
                }
                hr { 
                    width: 85%; 
                    background-color: #E4E4E4;
                    border-color: #E4E4E4;
                    color: #E4E4E4;
                }
                li{
                    padding: 3px;
                    padding-left:10px;
                }

                #items :hover{
                    color: white;
                    background: #6a6c75;
                    border-radius: 2px;
                }
            `
    }

    render() {
        return html`
        <div class='paste-context-menu'>
            <ul id='items'>
                <li @click=${() => this.paste()} >Paste</li>
            </ul>
        </div>
        `
    }

    firstUpdated() {
        this.contextElement = this.shadowRoot.querySelector('.paste-context-menu')
    }

    paste() {

        store.dispatch(doPasteMenuSwitch(false))
    }

    positionMenu(eventObject) {


        const getPosition = (event) => {
            let posx = 0
            let posy = 0

            if (event.pageX || event.pageY) {

                posx = event.pageX
                posy = event.pageY
            } else if (event.clientX || event.clientY) {

                posx = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft
                posy = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop
            }

            return {
                x: posx,
                y: posy
            }
        }

        const positionMenu = (event) => {

            const newPosition = {
                left: '0px',
                top: '0px'
            }

            const clickCoords = getPosition(event)

            const clickCoordsX = clickCoords.x
            const clickCoordsY = clickCoords.y

            const menuWidth = this.contextElement.offsetWidth + 4
            const menuHeight = this.contextElement.offsetHeight + 4

            const windowWidth = window.innerWidth
            const windowHeight = window.innerHeight

            if ((windowWidth - clickCoordsX) < menuWidth) {

                newPosition.left = windowWidth - menuWidth + 'px'
            } else {

                newPosition.left = clickCoordsX + 'px'
            }

            if ((windowHeight - clickCoordsY) < menuHeight) {

                newPosition.top = windowHeight - menuHeight + 'px'
            } else {

                newPosition.top = clickCoordsY + 'px'
            }

            return newPosition
        }

        const pos = positionMenu(eventObject)
        this.contextElement.style.top = pos.top
        this.contextElement.style.left = pos.left
        this.contextElement.style.opacity = '1'
        this.contextElement.releasePointerCapture = true
        this.contextElement.classList.add('p-open')
        document.getElementById('main-app').shadowRoot.querySelector('paste-menu').inert = false
    }

    open(eventObject) {

        this.positionMenu(eventObject)
        store.dispatch(doPasteMenuSwitch(true))
    }

    close() {
        this.contextElement.style.opacity = '0'
        this.contextElement.classList.remove('p-open')
    }


    stateChanged(state) {

        this.isPasteMenuOpen = state.app.pasteMenuSwitch
    }
}

window.customElements.define('paste-menu', FramePasteMenu)

const pasteMenuNode = document.createElement('paste-menu')
pasteMenuNode.id = 'paste-menu-node'
pasteMenuNode.inert = false
pasteMenuNode.eventObject = {}
pasteMenuElement = document.body.appendChild(pasteMenuNode)
setTimeout(() => {
    const menuNode = document.getElementById('paste-menu-node')
    const mainApp = document.getElementById('main-app').shadowRoot
    const shadow = mainApp
    pasteMenuElement = shadow.appendChild(menuNode)
}, 500)
export default pasteMenuElement
