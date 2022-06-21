import { LitElement, html, css } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../store.js'
import { use, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'

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

class LanguageSelector extends connect(store)(LitElement) {
    static get properties() {
        return {
            config: { type: Object },
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
                    background: var(--white);
                }

                *:focus {
                    outline: none;
                }

                select option { 
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
                <select @change="${this.changeLanguage}">
                    <option value="us">${translate("selectmenu.selectlanguage")}</option>
                    <option value="us">US - ${translate("selectmenu.english")}</option>
                    <option value="de">DE - ${translate("selectmenu.german")}</option>
                    <option value="es">ES - ${translate("selectmenu.spanish")}</option>
                    <option value="fr">FR - ${translate("selectmenu.french")}</option>
                    <option value="hr">HR - ${translate("selectmenu.croatian")}</option>
                    <option value="hu">HU - ${translate("selectmenu.hungarian")}</option>
                    <option value="hindi">IN - ${translate("selectmenu.hindi")}</option>
                    <option value="it">IT - ${translate("selectmenu.italian")}</option>
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
        // ...
    }

    changeLanguage(event) {
       use(event.target.value)
       localStorage.setItem('qortalLanguage', event.target.value)
    }

    stateChanged(state) {
        this.config = state.config
    }
}

window.customElements.define('language-selector', LanguageSelector)
