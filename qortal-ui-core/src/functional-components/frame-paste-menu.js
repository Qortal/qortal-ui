import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store';

import { doFramePasteMenuSwitch } from '../redux/app/app-actions';


let framePasteMenuElement

class FramePasteMenu extends connect(store)(LitElement) {
    static get properties() {
        return {
            eventObject: {
                type: Object,
                attribute: 'event-object',
                reflectToAttribute: true
            },
            framePasteMenuOpen: {
                type: Object
            },
            elementId: {
                type: String
            }
        }
    }

    constructor() {
        super()
        this.eventObject = {}
        this.framePasteMenuOpen = {
            isOpen: false,
            elementId: ''
        }
        this.elementId = ''
    }

    static get styles() {
        return css`
                .frame-paste-context-menu{
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
        <div class='frame-paste-context-menu'>
            <ul id='items'>
                <li @click=${() => this.paste()} >Paste</li>
            </ul>
        </div>
        `
    }

    firstUpdated() {
        this.contextElement = this.shadowRoot.querySelector('.frame-paste-context-menu')
    }

    paste() {

        store.dispatch(doFramePasteMenuSwitch({ isOpen: false, elementId: this.elementId }))
    }

    positionMenu(eventObject) {


        const getPosition = (event) => {
            let posx = 0
            let posy = 0

            const p = document.querySelector('main')
            const d = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('app-drawer-layout').children[1].querySelector('show-plugin').shadowRoot.querySelector('iframe')

            posx = p.offsetWidth - d.offsetWidth + event.pageX
            posy = d.offsetTop + event.pageY

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
        document.getElementById('main-app').shadowRoot.querySelector('frame-paste-menu').inert = false
    }

    open(eventObject) {

        this.elementId = eventObject.elementId
        this.positionMenu(eventObject)
        store.dispatch(doFramePasteMenuSwitch({ isOpen: true, elementId: eventObject.elementId }))
    }

    close() {
        this.contextElement.style.opacity = '0'
        this.contextElement.classList.remove('p-open')
    }


    stateChanged(state) {

        this.framePasteMenuOpen = state.app.framePasteMenuSwitch
    }
}

window.customElements.define('frame-paste-menu', FramePasteMenu)

const framePasteMenuNode = document.createElement('frame-paste-menu')
framePasteMenuNode.id = 'frame-paste-menu-node'
framePasteMenuNode.inert = false
framePasteMenuNode.eventObject = {}
framePasteMenuElement = document.body.appendChild(framePasteMenuNode)
setTimeout(() => {
    const menuNode = document.getElementById('frame-paste-menu-node')
    const mainApp = document.getElementById('main-app').shadowRoot
    const shadow = mainApp
    framePasteMenuElement = shadow.appendChild(menuNode)
}, 500)
export default framePasteMenuElement
