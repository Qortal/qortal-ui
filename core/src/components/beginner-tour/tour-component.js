import { html, LitElement } from 'lit'
import { connect } from 'pwa-helpers'
import { store } from '../../store'
import { setNewTab } from '../../redux/app/app-actions'
import { tourComponentStyles } from '../../styles/core-css'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './tour.css'
import '@material/mwc-button'
import '@material/mwc-icon'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/tooltip'

// Multi language support
import { get, translate } from '../../../translate'

class TourComponent extends connect(store)(LitElement) {
	static get properties() {
		return {
			getElements: { attribute: false },
			dialogOpenedCongrats: { type: Boolean },
			hasViewedTour: { type: Boolean },
			disableTour: { type: Boolean },
			nodeUrl: { type: String },
			address: { type: String }
		}
	}

	static get styles() {
		return [tourComponentStyles]
	}

	constructor() {
		super()
		this.dialogOpenedCongrats = false
		this._controlOpenWelcomeModal = this._controlOpenWelcomeModal.bind(this)
		this.hasName = false
		this.nodeUrl = ''
		this.address = ''
		this._disableTour = this._disableTour.bind(this)
		this.disableTour = false
	}

	render() {
		return html`
			<!-- Profile read-view -->
			${this.dialogOpenedCongrats && this.hasViewedTour ? html`
				<paper-dialog class="full-info-wrapper" ?opened="${this.dialogOpenedCongrats}">
					<h3>Congratulations!</h3>
					<div style="display:flex;gap:15px;justify-content:center;margin-top:10px">
						${translate("tour.tour13")}
					</div>
					<div style="display:flex;gap:15px;justify-content:center;margin-top:10px">
						${translate("tour.tour14")}
					</div>
					<div class="accept-button" @click=${this.visitQtube}>
						${translate("tour.tour15")}
					</div>
					<div style="width:100%;display:flex;justify-content:center;margin-top:10px">
						<div class="close-button" @click=${() => { this.onClose() }}>
							${translate("general.close")}
						</div>
					</div>
				</paper-dialog>
			` : ''}
		`
	}

	async firstUpdated() {
		this.getNodeUrl()
		this.address = store.getState().app.selectedAddress.address

		const hasViewedTour = JSON.parse(localStorage.getItem(`hasViewedTour-${this.address}`) || 'false')
		const name = await this.getName(this.address)

		if (name) {
			this.hasName = true
		}

		this.hasViewedTour = hasViewedTour

		if (!hasViewedTour) {
			try {
				if (name) {
					this.hasViewedTour = true
					this.hasName = true
					localStorage.setItem(`hasViewedTour-${this.address}`, JSON.stringify(true))
				}
			} catch (error) {
				console.log({ error })
			}
		}

		await new Promise((res) => {
			setTimeout(() => {
				res()
			}, 1000)
		})

		if (!this.hasViewedTour && this.disableTour !== true) {
			const elements = this.getElements()

			let steps = [{
				popover: {
					title: get("tour.tour6"),
					description: `
						<div style="display:flex;justify-content:center;gap:15px">
							<img style="height:40px;width:auto;margin:15px 0px;" src="/img/qort.png" />
						</div>
						<div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
							<div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div>
							<p style="margin:0px;padding:0px">${get("tour.tour7")}</p>
						</div>
						<div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
							<div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div>
							<p style="margin:0px;padding:0px">${get("tour.tour8")}</p>
						</div>
						<div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
							<div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div>
							<p style="margin:0px;padding:0px">${get("tour.tour9")}</p>
						</div>
					`
				}
			}]

			const step2 = elements['core-sync-status-id']
			const step3 = elements['tab']
			const step4 = elements['checklist']

			if (step2) {
				steps.push({
					element: step2,
					popover: {
						title: get("tour.tour5"),
						description: `
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
								<p style="margin:0px;padding:0px">${get("tour.tour1")}</p>
							</div>
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
								<span><img src="/img/synced.png" style="height: 24px; width: 24px; padding-top: 4px;" /></span>
								<p style="margin:0px;padding:0px">${get("tour.tour2")}</p>
							</div>
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
								<span><img src="/img/synced_minting.png" style="height: 24px; width: 24px; padding-top: 4px;" /></span>
								<p style="margin:0px;padding:0px">${get("tour.tour3")}</p>
							</div>
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
								<span><img src="/img/syncing.png" style="height: 24px; width: 24px; padding-top: 4px;" /></span>
								<p style="margin:0px;padding:0px">${get("tour.tour4")}</p>
							</div>

						`
					}
				})
			}

			if (step3) {
				steps.push({
					element: step3,
					popover: {
						title: 'Tab View',
						description: `
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
								<p style="margin:0px;padding:0px">${get("tour.tour10")}</p>
							</div>
							<div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
								<span><img src="/img/addplugin.webp" style="height: 36px; width: 36px; padding-top: 4px;" /></span>
								<p style="margin:0px;padding:0px">
									You can also bookmark other Q-Apps and Plugins by clicking on the ${get('tabmenu.tm19')} button
								</p>
							</div>
						`
					}
				})
			}

			if (step4) {
				steps.push({ element: step4, popover: { title: get("tour.tour11"), description: get("tour.tour12")}})
				this.hasViewedTour
			}

			let currentStepIndex = 0

			const driverObj = driver({
				popoverClass: 'driverjs-theme',
				showProgress: true,
				showButtons: ['next', 'previous'],
				steps: steps,
				allowClose: false,
				onDestroyed: () => {
					localStorage.setItem(`hasViewedTour-${this.address}`, JSON.stringify(true))
					this.hasViewedTour = true
					this.openWelcomeModal()
				}
			})

			driverObj.drive()
		} else {
			this.dispatchEvent(
				new CustomEvent('send-tour-finished', {
					bubbles: true,
					composed: true
				})
			)
		}
	}

	_controlOpenWelcomeModal() {
		this.isSynced = true

		const seenWelcomeSync = JSON.parse(localStorage.getItem('welcome-sync') || 'false')

		if (this.hasName) return
		if (seenWelcomeSync) return
		if (!this.hasViewedTour) return

		this.dialogOpenedCongrats = true
	}

	openWelcomeModal() {
		this.dispatchEvent(
			new CustomEvent('send-tour-finished', {
				bubbles: true,
				composed: true
			})
		)

		const seenWelcomeSync = JSON.parse(localStorage.getItem('welcome-sync') || 'false')

		if (this.hasName) return
		if (seenWelcomeSync) return
		if (!this.isSynced) return

		this.dialogOpenedCongrats = true
	}

	_disableTour() {
		this.disableTour = true
		driver.reset()
	}

	connectedCallback() {
		super.connectedCallback()
		window.addEventListener('open-welcome-modal-sync', this._controlOpenWelcomeModal)
		window.addEventListener('disable-tour', this._disableTour)
	}

	disconnectedCallback() {
		window.removeEventListener('open-welcome-modal-sync', this._controlOpenWelcomeModal)
		window.addEventListener('disable-tour', this._disableTour)
		super.disconnectedCallback()
	}

	getNodeUrl() {
		const myNode = store.getState().app.nodeConfig.knownNodes[store.getState().app.nodeConfig.node]
		const myNodeUrl =  myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		this.nodeUrl = myNodeUrl
	}

	async getName(recipient) {
		try {
			const endpoint = `${this.nodeUrl}/names/address/${recipient}`
			const res = await fetch(endpoint)
			const getNames = await res.json()

			if (Array.isArray(getNames) && getNames.length > 0) {
				return getNames[0].name
			} else {
				return ''
			}
		} catch (error) {
			return ''
		}
	}

	visitQtube() {
		this.onClose()
		const query = `?service=APP&name=Q-Tube`
		store.dispatch(
			setNewTab({
				url: `qdn/browser/index.html${query}`,
				id: 'q-mail-notification',
				myPlugObj: {
					url: 'myapp',
					domain: 'core',
					page: `qdn/browser/index.html${query}`,
					title: 'Q-Tube',
					menus: [],
					parent: false
				}
			})
		)
	}

	onClose() {
		localStorage.setItem(`welcome-sync-${this.address}`, JSON.stringify(true))
		this.dialogOpenedCongrats = false
	}
}

window.customElements.define('tour-component', TourComponent)