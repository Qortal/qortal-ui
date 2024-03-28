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

class LanguageSelector extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true }
        }
    }

    static get styles() {
        return [
            css`
                select {
                    width: 175px;
                    height: 34px;
                    padding: 5px 0px 5px 5px;
                    font-size: 16px;
                    border: 1px solid var(--black);
                    border-radius: 3px;
                    color: var(--black);
                    background:
                        linear-gradient(45deg, transparent 50%, white 50%),
                        linear-gradient(135deg, white 50%, transparent 50%),
                        linear-gradient(to right, #03a9f4, #03a9f4);
                    background-position:
                        calc(100% - 17px) calc(0.5em + 4px),
                        calc(100% - 7px) calc(0.5em + 4px),
                        100% 0;
                    background-size:
                        10px 10px,
                        10px 10px,
                        2.2em 2.2em;
                    background-repeat: no-repeat;
                    -webkit-box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    box-sizing: border-box;
                    -webkit-appearance:none;
                    -moz-appearance:none;
                }

                *:focus {
                    outline: none;
                }

                select option {
                    color: var(--black);
                    background: var(--white);
                    line-height: 34px;
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
                <select id="languageSelect" @change="${this.changeLanguage}">
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
        const myElement = this.shadowRoot.getElementById('languageSelect')

        myElement.addEventListener("change", () => {
            this.selectElement()
        })

        this.selectElement()
    }

    selectElement() {
        const selectedLanguage = localStorage.getItem('qortalLanguage')
        let element = this.shadowRoot.getElementById('languageSelect')
        element.value = selectedLanguage
    }

    changeLanguage(event) {
       use(event.target.value)
       localStorage.setItem('qortalLanguage', event.target.value)
    }
}

window.customElements.define('language-selector', LanguageSelector)
