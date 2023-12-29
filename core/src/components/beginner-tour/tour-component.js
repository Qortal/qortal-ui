import { LitElement, html, css } from 'lit';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '@material/mwc-icon';
import '@polymer/paper-spinner/paper-spinner-lite.js';
import '@vaadin/tooltip';
import '@material/mwc-button';
import { get, translate } from '../../../translate/index.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { setNewTab } from '../../redux/app/app-actions.js';
import { store } from '../../store.js';
import { connect } from 'pwa-helpers';
import './tour.css';
class TourComponent extends connect(store)(LitElement) {
	static get properties() {
		return {
			getElements: { attribute: false },
			dialogOpenedCongrats: { type: Boolean },
			hasViewedTour: { type: Boolean },
		};
	}

	constructor() {
		super();
		this.dialogOpenedCongrats = false;
		this._controlOpenWelcomeModal =
			this._controlOpenWelcomeModal.bind(this);
		this.hasName = false;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-primary: rgb(3, 169, 244);
				--mdc-theme-secondary: var(--mdc-theme-primary);
				--mdc-theme-surface: var(--white);
				--mdc-dialog-content-ink-color: var(--black);
				box-sizing: border-box;
				color: var(--black);
				background: var(--white);
			}

			:host {
				box-sizing: border-box;
				position: fixed;
				bottom: 25px;
				right: 25px;
				z-index: 50000;
			}

			.full-info-wrapper {
				width: 100%;
				min-width: 600px;
				max-width: 600px;
				text-align: center;
				background: var(--white);
				border: 1px solid var(--black);
				border-radius: 15px;
				padding: 25px;
				box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
				display: block !important;
			}

			.buttons {
				display: inline;
			}
			.accept-button {
				font-family: Roboto, sans-serif;
				letter-spacing: 0.3px;
				font-weight: 300;
				padding: 8px 5px;
				border-radius: 3px;
				text-align: center;
				color: var(--black);
				transition: all 0.3s ease-in-out;
				display: flex;
				align-items: center;
				gap: 10px;
				font-size: 18px;
				justify-content: center;
				outline: 1px solid var(--black);
			}

			.accept-button:hover {
				cursor: pointer;
				background-color: #03a8f485;
			}

			.close-button {
				font-family: Roboto, sans-serif;
				letter-spacing: 0.3px;
				font-weight: 300;
				padding: 8px 5px;
				border-radius: 3px;
				text-align: center;
				color: #f44336;
				transition: all 0.3s ease-in-out;
				display: flex;
				align-items: center;
				gap: 10px;
				font-size: 18px;
        width:auto;
			}

			.close-button:hover {
				cursor: pointer;
				background-color: #f4433663;
			}
		`;
	}

	_controlOpenWelcomeModal() {
    this.isSynced = true
		
		const seenWelcomeSync = JSON.parse(
			localStorage.getItem('welcome-sync') || 'false'
		);
		if (this.hasName) return;
		if (seenWelcomeSync) return;
    if(!this.hasViewedTour) return
		this.dialogOpenedCongrats = true;
	}

  openWelcomeModal() {
		this.dispatchEvent(
			new CustomEvent('send-tour-finished', {
				bubbles: true,
				composed: true,
			})
		);
		const seenWelcomeSync = JSON.parse(
			localStorage.getItem('welcome-sync') || 'false'
		);
		if (this.hasName) return;
		if (seenWelcomeSync) return;
    if(!this.isSynced) return
		this.dialogOpenedCongrats = true;
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener(
			'open-welcome-modal-sync',
			this._controlOpenWelcomeModal
		);
	}

	disconnectedCallback() {
		window.removeEventListener(
			'open-welcome-modal-sync',
			this._controlOpenWelcomeModal
		);

		super.disconnectedCallback();
	}

	getNodeUrl() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		const nodeUrl =
			myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
		return nodeUrl;
	}
	getMyNode() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode;
	}

	async getName(recipient) {
		try {
			const endpoint = `${this.nodeUrl}/names/address/${recipient}`;
			const res = await fetch(endpoint);
			const getNames = await res.json();

			if (Array.isArray(getNames) && getNames.length > 0) {
				return getNames[0].name;
			} else {
				return '';
			}
		} catch (error) {
			return '';
		}
	}
	async firstUpdated() {
		this.address = store.getState().app.selectedAddress.address
		const hasViewedTour = JSON.parse(
			localStorage.getItem(`hasViewedTour-${this.address}`) || 'false'
		);
		const name = await this.getName(this.address);
		if (name) {
			this.hasName = true;
		}
		this.hasViewedTour = hasViewedTour;
		if (!hasViewedTour) {
			try {
				if (name) {
					this.hasViewedTour = true;
					this.hasName = true;
					localStorage.setItem(`hasViewedTour-${this.address}`, JSON.stringify(true))
				}
			} catch (error) {
				console.log({ error });
			}
		}
		await new Promise((res) => {
			setTimeout(() => {
				res();
			}, 1000);
		});
		if (!this.hasViewedTour) {
			const elements = this.getElements();
			let steps = [
				{
					popover: {
						title: get("tour.tour6"),
						description: `
            <div style="display:flex;justify-content:center;gap:15px">
                <img style="height:40px;width:auto;margin:15px 0px;" src="/img/qort.png" />
            </div>
            <div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
                <div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div> <p style="margin:0px;padding:0px">${get("tour.tour7")}</p>
            </div>
            <div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
                <div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div> <p style="margin:0px;padding:0px">${get("tour.tour8")}</p>
            </div>
            <div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
                <div style="height:6px;width:6px;border-radius:50%;background:var(--black)"></div> <p style="margin:0px;padding:0px">${get("tour.tour9")}</p>
            </div>
          `,
						// ... other options
					},
				},
			];
			const step2 = elements['core-sync-status-id'];
			const step3 = elements['tab'];
			const step4 = elements['checklist'];

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
           
                `,
					},
				});
			}
			if (step3) {
				steps.push({
					element: step3,
					popover: {
						title: 'Tab View',
						description: `
              <div style="display:flex;gap:15px;align-items:center;margin-top:15px;margin-bottom:30px">
              <p style="margin:0px;padding:0px">${get("tour.tour10")}
              </p>
          </div>
          <div style="display:flex;gap:15px;align-items:center;margin-top:15px;">
          <span><img src="/img/addplugin.webp" style="height: 36px; width: 36px; padding-top: 4px;" /></span>
           <p style="margin:0px;padding:0px">You can also bookmark other Q-Apps and Plugins by clicking on the ${get(
				'tabmenu.tm19'
			)} button</p>
         </div>
              `,
					},
				});
			}
			if (step4) {
				steps.push(
					{
						element: step4,
						popover: {
							title: get("tour.tour11"),
							description: get("tour.tour12"),
						},
					}
				);this.hasViewedTour
			}
			let currentStepIndex = 0;
			const driverObj = driver({
				popoverClass: 'driverjs-theme',
				showProgress: true,
				showButtons: ['next', 'previous'],
				steps: steps,
				allowClose: false,
				onDestroyed: () => {
					localStorage.setItem(`hasViewedTour-${this.address}`, JSON.stringify(true))
					this.hasViewedTour = true;
					this.openWelcomeModal();
				}
			});

			driverObj.drive();
		} else {
			this.dispatchEvent(
				new CustomEvent('send-tour-finished', {
					bubbles: true,
					composed: true,
				})
			);
		}
	}

	visitQtube() {
		this.onClose();
		const query = `?service=APP&name=Q-Tube`;
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
					parent: false,
				},
			})
		);
	}

	onClose() {
		localStorage.setItem(`welcome-sync-${this.address}`, JSON.stringify(true))
		this.dialogOpenedCongrats = false;
	}

	render() {
		return html`
			<!-- Profile read-view -->
			${this.dialogOpenedCongrats && this.hasViewedTour
				? html`
						<paper-dialog
							class="full-info-wrapper"
							?opened="${this.dialogOpenedCongrats}"
						>
							<h3>Congratulations!</h3>
							<div
								style="display:flex;gap:15px;justify-content:center;margin-top:10px"
							>
								${translate("tour.tour13")}
							</div>
							<div
								style="display:flex;gap:15px;justify-content:center;margin-top:10px"
							>
								${translate("tour.tour14")}
							</div>

							<div
								class="accept-button"
								@click=${this.visitQtube}
							>
              ${translate("tour.tour15")}
							</div>
              <div style="width:100%;display:flex;justify-content:center;margin-top:10px">
							<div
								class="close-button"
								@click=${()=> {
                  this.dialogOpenedCongrats = false
                }}
							>
								${translate("general.close")}
							</div>
              </div>
						</paper-dialog>
				  `
				: ''}
		`;
	}
}
customElements.define('tour-component', TourComponent);
