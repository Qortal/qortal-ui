import { html, LitElement } from 'lit'
import { Epml } from '../../../epml'
import { chatRightPanelSettingsStyles } from './plugins-css'
import './WrapperModal'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@vaadin/button'

// Multi language support
import { translate } from '../../../../core/translate'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class ChatRightPanelSettings extends LitElement {
	static get properties() {
		return {
			toggle: { attribute: false },
			agoTime: { type: Boolean },
			isoTime: { type: Boolean },
			bothTime: { type: Boolean },
			currentFontSize16: { type: Boolean },
			currentFontSize18: { type: Boolean },
			currentFontSize20: { type: Boolean },
			currentFontSize22: { type: Boolean }		}
	}

	static get styles() {
		return [chatRightPanelSettingsStyles]
	}

	constructor() {
		super()
		this.agoTime = false
		this.isoTime = false
		this.bothTime = false
		this.currentFontSize16 = false
		this.currentFontSize18 = false
		this.currentFontSize20 = false
		this.currentFontSize22 = false
	}

	render() {
		return html`
			<div class="container">
				<div class="close-row" style="margin-top: 15px">
					<vaadin-icon class="top-bar-icon" @click=${() => this.toggle(false)} style="margin: 0px 10px" icon="vaadin:close" slot="icon"></vaadin-icon>
				</div>
				<div class="container-body">
					<div style="margin-top: 5px;">
						<p class="group-name">${translate("chatsettings.cs2")}</p>
						<hr style="color: var(--black);">
					</div>
					<div class="group-info">
						<p class="group-description">${translate("chatsettings.cs3")}</p>
						<div class="checkbox-row">
							<label for="agoButton" id="agoButtonLabel" style="color: var(--black);">${translate("chatsettings.cs4")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="agoButton"
								@click=${(e) => this.setAgo(e)}
								?checked=${this.agoTime}
							></mwc-checkbox>
						</div>
						<div class="checkbox-row" style="margin-top: -20px;">
							<label for="isoButton" id="isoButtonLabel" style="color: var(--black);">${translate("chatsettings.cs5")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="agoButton"
								@click=${(e) => this.setIso(e)}
								?checked=${this.isoTime}
							></mwc-checkbox>
						</div>
						<div class="checkbox-row" style="margin-top: -20px;">
							<label for="bothButton" id="bothButtonLabel" style="color: var(--black);">${translate("chatsettings.cs5")} + ${translate("chatsettings.cs4")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="agoButton"
								@click=${(e) => this.setBoth(e)}
								?checked=${this.bothTime}
							></mwc-checkbox>
						</div>
					</div>
					<div><hr style="color: var(--black);"></div>
					<div class="group-info">
						<p class="group-description">${translate("chatsettings.cs6")}</p>
						<div class="checkbox-row">
							<label for="font16Button" id="font16ButtonLabel" style="color: var(--black);">${translate("chatsettings.cs7")} 16${translate("chatsettings.cs8")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="font16Button"
								@click=${(e) => this.setFont16(e)}
								?checked=${this.currentFontSize16}
							></mwc-checkbox>
						</div>
						<div class="checkbox-row" style="margin-top: -20px;">
							<label for="font18Button" id="font18ButtonLabel" style="color: var(--black);">18${translate("chatsettings.cs8")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="font18Button"
								@click=${(e) => this.setFont18(e)}
								?checked=${this.currentFontSize18}
							></mwc-checkbox>
							<span style="color: var(--black)">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
							<label for="font24Button" id="font20ButtonLabel" style="color: var(--black);">20${translate("chatsettings.cs8")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="font20Button"
								@click=${(e) => this.setFont20(e)}
								?checked=${this.currentFontSize20}
							></mwc-checkbox>
							<span style="color: var(--black)">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
							<label for="font22Button" id="font22ButtonLabel" style="color: var(--black);">22${translate("chatsettings.cs8")}</label>
							<mwc-checkbox
								style="margin-right: -15px;"
								id="font22Button"
								@click=${(e) => this.setFont22(e)}
								?checked=${this.currentFontSize22}
							></mwc-checkbox>
						</div>
					</div>
				</div>
			</div>
		`
	}

	firstUpdated() {
		this.setTimeFormat()
		this.setFontFormat()
	}

	setTimeFormat() {
		if (localStorage.getItem('timestampForChats') === 'ago') {
			this.agoTime = true
			this.isoTime = false
			this.bothTime = false
		} else if (localStorage.getItem('timestampForChats') === 'iso') {
			this.agoTime = false
			this.isoTime = true
			this.bothTime = false
		} else if (localStorage.getItem('timestampForChats') === 'both') {
			this.agoTime = false
			this.isoTime = false
			this.bothTime = true
		}
	}

	setAgo(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('timestampForChats', 'ago')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		} else {
			window.localStorage.setItem('timestampForChats', 'ago')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		}
	}

	setIso(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('timestampForChats', 'iso')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		} else {
			window.localStorage.setItem('timestampForChats', 'ago')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		}
	}

	setBoth(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('timestampForChats', 'both')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		} else {
			window.localStorage.setItem('timestampForChats', 'ago')
			window.dispatchEvent( new Event('storage') )
			this.setTimeFormat()
		}
	}

	setFontFormat() {
		if (localStorage.getItem('fontsizeForChats') === 'font16') {
			this.currentFontSize16 = true
			this.currentFontSize18 = false
			this.currentFontSize20 = false
			this.currentFontSize22 = false
		} else if (localStorage.getItem('fontsizeForChats') === 'font18') {
			this.currentFontSize16 = false
			this.currentFontSize18 = true
			this.currentFontSize20 = false
			this.currentFontSize22 = false
		} else if (localStorage.getItem('fontsizeForChats') === 'font20') {
			this.currentFontSize16 = false
			this.currentFontSize18 = false
			this.currentFontSize20 = true
			this.currentFontSize22 = false
		} else if (localStorage.getItem('fontsizeForChats') === 'font22') {
			this.currentFontSize16 = false
			this.currentFontSize18 = false
			this.currentFontSize20 = false
			this.currentFontSize22 = true
		}
	}

	setFont16(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('fontsizeForChats', 'font16')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		} else {
			window.localStorage.setItem('fontsizeForChats', 'font16')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		}
	}

	setFont18(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('fontsizeForChats', 'font18')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		} else {
			window.localStorage.setItem('fontsizeForChats', 'font16')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		}
	}

	setFont20(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('fontsizeForChats', 'font20')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		} else {
			window.localStorage.setItem('fontsizeForChats', 'font16')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		}
	}

	setFont22(e) {
		if (!e.target.checked) {
			window.localStorage.setItem('fontsizeForChats', 'font22')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		} else {
			window.localStorage.setItem('fontsizeForChats', 'font16')
			window.dispatchEvent( new Event('storage') )
			this.setFontFormat()
		}
	}

	// Standard functions
	getApiKey() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
	}

	isEmptyArray(arr) {
		if (!arr) { return true }
		return arr.length === 0
	}

	round(number) {
		return (Math.round(parseFloat(number) * 1e8) / 1e8).toFixed(8)
	}
}

window.customElements.define('chat-right-panel-settings', ChatRightPanelSettings)