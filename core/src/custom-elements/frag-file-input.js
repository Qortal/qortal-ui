import {css, html, LitElement} from 'lit'

import '@material/mwc-button'
import '@material/mwc-icon'

import {translate} from '../../translate'

class FragFileInput extends LitElement {
    static get properties () {
        return {
            accept: { type: String },
            readAs: { type: String }
        }
    }

    static get styles () {
        return css`
            #drop-area {
                border: 2px dashed #ccc;
                font-family: "Roboto", sans-serif;
                padding: 20px;
            }

            #trigger:hover {
                cursor: pointer;
            }

            #drop-area.highlight {
                border-color: var(--mdc-theme-primary, #000);
            }

            p {
                margin-top: 0;
            }

            form {
                margin-bottom: 10px;
            }

            #fileInput {
                display: none;
            }
        `
    }

    constructor () {
        super()
        this.readAs = this.readAs || 'Text'
    }

    render () {
        return html`
            <div id="drop-area">
                <slot name="info-text"></slot>
                <div style="line-height: 40px; text-align: center;">
                    <slot id="trigger" name="inputTrigger" @click=${() => this.shadowRoot.getElementById('fileInput').click()} style="dispay:inline;">
                        <mwc-button><mwc-icon>cloud_upload</mwc-icon><span style="color: var(--black);">&nbsp; ${translate("fragfile.selectfile")}</span></mwc-button>
                    </slot><br>
                    <span style="text-align: center; padding-top: 4px; color: var(--black);">${translate("fragfile.dragfile")}</span>
                </div>
            </div>
            <input type="file" id="fileInput" accept="${this.accept}" @change="${e => this.readFile(e.target.files[0])}">
        `
    }

    readFile (file) {
        const fr = new FileReader()
        fr.onload = () => {
            this.dispatchEvent(new CustomEvent('file-read-success', {
                detail: { result: fr.result },
                bubbles: true,
                composed: true
            }))
        }
        fr['readAs' + this.readAs](file)
    }

    firstUpdated () {
        this._dropArea = this.shadowRoot.getElementById('drop-area')

        const preventDefaults = e => {
            e.preventDefault()
            e.stopPropagation()
        }

            ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this._dropArea.addEventListener(eventName, preventDefaults, false)
        })

        const highlight = e => {
            this._dropArea.classList.add('highlight')
        }

        const unhighlight = e => {
            this._dropArea.classList.remove('highlight')
        }

            ;['dragenter', 'dragover'].forEach(eventName => {
            this._dropArea.addEventListener(eventName, highlight, false)
        })

        ;['dragleave', 'drop'].forEach(eventName => {
            this._dropArea.addEventListener(eventName, unhighlight, false)
        })

        this._dropArea.addEventListener('drop', e => {
            const dt = e.dataTransfer
            const file = dt.files[0]

            this.readFile(file)
        }, false)
    }
}

window.customElements.define('frag-file-input', FragFileInput)
