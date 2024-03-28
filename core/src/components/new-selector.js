import {css, html, LitElement} from 'lit'
import {registerTranslateConfig, translate, use} from '../../translate/index.js'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const checkLanguage = localStorage.getItem('qortalLanguage')

if (checkLanguage === null || checkLanguage.length === 0) {
    localStorage.setItem('qortalLanguage', 'us')
    use('us')
} else {
    use(checkLanguage)
}

class NewSelector extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                select {
                    width: auto;
                    height: auto;
                    position: absolute;
                    top: 50px;
                    padding: 5px 5px 5px 5px;
                    font-size: 16px;
                    border: 1px solid var(--black);
                    border-radius: 3px;
                    color: var(--black);
                    background: var(--white);
                    overflow: auto;
                }

                *:focus {
                    outline: none;
                }

                select option {
                    color: var(--black);
                    background: var(--white);
                    line-height: 34px;
                }

                select option:hover {
                    color: var(--white);
                    background: var(--black);
                    line-height: 34px;
                    cursor: pointer;
                }
            `
        ]
    }

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        return html`
            <div style="display: inline;">
                <span>
                    <img src="/img/${translate("selectmenu.languageflag")}-flag-round-icon-32.png" style="width: 24px; height: 24px; padding-top: 4px;" @click=${() => this.toggleMenu()}>
                </span>
                <select id="languageNew" style="display: none;" size="20" tabindex="0" @change="${this.changeLanguage}">
                    <option value="us">US - ${translate("selectmenu.english")}</option>
                    <option value="de">DE - ${translate("selectmenu.german")}</option>
                    <option value="es">ES - ${translate("selectmenu.spanish")}</option>
                    <option value="et">ET - ${translate("selectmenu.estonian")}</option>
                    <option value="fi">FI - ${translate("selectmenu.finnish")}</option>
                    <option value="fr">FR - ${translate("selectmenu.french")}</option>
                    <option value="he">HE - ${translate("selectmenu.hebrew")}</option>
                    <option value="hr">HR - ${translate("selectmenu.croatian")}</option>
                    <option value="hu">HU - ${translate("selectmenu.hungarian")}</option>
                    <option value="hindi">IN - ${translate("selectmenu.hindi")}</option>
                    <option value="it">IT - ${translate("selectmenu.italian")}</option>
                    <option value="jp">JP - ${translate("selectmenu.japanese")}</option>
                    <option value="ko">KO - ${translate("selectmenu.korean")}</option>
                    <option value="nl">NL - ${translate("selectmenu.dutch")}</option>
                    <option value="no">NO - ${translate("selectmenu.norwegian")}</option>
                    <option value="pl">PL - ${translate("selectmenu.polish")}</option>
                    <option value="pt">PT - ${translate("selectmenu.portuguese")}</option>
                    <option value="rs">RS - ${translate("selectmenu.serbian")}</option>
                    <option value="ro">RO - ${translate("selectmenu.romanian")}</option>
                    <option value="ru">RU - ${translate("selectmenu.russian")}</option>
                    <option value="zht">ZHT - ${translate("selectmenu.chinese2")}</option>
                    <option value="zhc">ZHC - ${translate("selectmenu.chinese1")}</option>
                </select>
            </div>

        `
    }

    firstUpdated() {
        const myElement = this.shadowRoot.getElementById('languageNew')

        myElement.addEventListener("change", () => {
            this.selectElement()
        })

        myElement.addEventListener("click", () => {
            const element1 = localStorage.getItem('qortalLanguage')
            const element2 = this.shadowRoot.getElementById('languageNew').value
            if (element1 === element2) {
                myElement.style.display = "none"
            }
        })

        this.selectElement()
    }

    selectElement() {
        const selectedLanguage = localStorage.getItem('qortalLanguage')
        let element = this.shadowRoot.getElementById('languageNew')
        element.value = selectedLanguage
        element.style.display = "none"
    }

    changeLanguage(event) {
       use(event.target.value)
       localStorage.setItem('qortalLanguage', event.target.value)
    }

    toggleMenu() {
        let mySwitchDisplay = this.shadowRoot.getElementById('languageNew')
        if(mySwitchDisplay.style.display == "none") {
            mySwitchDisplay.style.display = "block"
        } else {
            mySwitchDisplay.style.display = "none"
        }
    }
}

window.customElements.define('new-selector', NewSelector)
