import { LitElement, html, css } from 'lit-element'
import { connect } from 'pwa-helpers'
import { store } from '../store';

import { doCopyMenuSwitch } from '../redux/app/app-actions';


let copyTextMenuElement

class CopyTextMenu extends connect(store)(LitElement) {
    static get properties() {
        return {
            selectedText: {
                type: String,
                attribute: 'selected-text',
                reflectToAttribute: true
            },
            eventObject: {
                type: Object,
                attribute: 'event-object',
                reflectToAttribute: true
            },
            isCopyMenuOpen: {
                type: Boolean
            }
        }
    }

    constructor() {
        super()
        this.selectedText = ''
        this.eventObject = {}
        this.isCopyMenuOpen = false
    }

    static get styles() {
        return css`
                .context-menu{
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

                .c-open {
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
        <div class='context-menu'>
            <ul id='items'>
                <li @click=${() => this.saveToClipboard(this.selectedText)} >Copy</li>
            </ul>
            <!-- <hr /> -->
            <!-- <ul id="items">
                <li>Another Menu Option</li>
            </ul> -->
        </div>
        `
    }

    firstUpdated() {
        this.contextElement = this.shadowRoot.querySelector('.context-menu')
    }

    saveToClipboard(text) {

        try {

            navigator.clipboard.writeText(text).then(() => {

                window.getSelection().removeAllRanges()
                window.parent.getSelection().removeAllRanges()

                store.dispatch(doCopyMenuSwitch(false))

                // ...
            }).catch((err) => {
                console.log('failed: ', err)
            })
        } catch (err) {

            // Fallback, if all fails
            document.execCommand('copy');

            window.getSelection().removeAllRanges()
            window.parent.getSelection().removeAllRanges()

            store.dispatch(doCopyMenuSwitch(false))
        }
    }

    textMenu(selectedText, eventObject, isFrame) {

        this.selectedText = selectedText

        const getPosition = (isFrame, event) => {
            let posx = 0
            let posy = 0

            if (isFrame) {

                const p = document.querySelector('main')
                const d = document.getElementById('main-app').shadowRoot.querySelector('app-view').shadowRoot.querySelector('app-drawer-layout').children[1].querySelector('show-plugin').shadowRoot.querySelector('iframe')

                posx = p.offsetWidth - d.offsetWidth + event.pageX
                posy = d.offsetTop + event.pageY
            } else {
                if (event.pageX || event.pageY) {

                    posx = event.pageX
                    posy = event.pageY
                } else if (event.clientX || event.clientY) {

                    posx = event.clientX + document.body.scrollLeft +
                        document.documentElement.scrollLeft
                    posy = event.clientY + document.body.scrollTop +
                        document.documentElement.scrollTop
                }
            }

            return {
                x: posx,
                y: posy
            }
        }

        const positionMenu = (isFrame, event) => {

            const newPosition = {
                left: '0px',
                top: '0px'
            }

            const clickCoords = getPosition(isFrame, event)

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

        const pos = positionMenu(isFrame, eventObject)
        this.contextElement.style.top = pos.top
        this.contextElement.style.left = pos.left
        this.contextElement.style.opacity = '1'
        this.contextElement.releasePointerCapture = true
        this.contextElement.classList.add('c-open')
        document.getElementById('main-app').shadowRoot.querySelector('copy-text-menu').inert = false
    }

    open(textMenuObject) {

        const selectedText = textMenuObject.selectedText
        const eventObject = textMenuObject.eventObject
        const isFrame = textMenuObject.isFrame
        this.textMenu(selectedText, eventObject, isFrame)
        store.dispatch(doCopyMenuSwitch(true))
    }

    close() {
        this.contextElement.style.opacity = '0'
        this.contextElement.classList.remove('c-open')
    }

    stateChanged(state) {

        this.isCopyMenuOpen = state.app.copyMenuSwitch
    }
}

window.customElements.define('copy-text-menu', CopyTextMenu)

const copyTextMenuNode = document.createElement('copy-text-menu')
copyTextMenuNode.id = 'copy-text-menu-node'
copyTextMenuNode.inert = false
copyTextMenuNode.eventObject = {}
copyTextMenuElement = document.body.appendChild(copyTextMenuNode)
setTimeout(() => {
    const menuNode = document.getElementById('copy-text-menu-node')
    const mainApp = document.getElementById('main-app').shadowRoot
    const shadow = mainApp
    copyTextMenuElement = shadow.appendChild(menuNode)
}, 500)
export default copyTextMenuElement
