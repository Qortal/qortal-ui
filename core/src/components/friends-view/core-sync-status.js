import { LitElement, html, css } from 'lit';
import '@material/mwc-icon';
import { store } from '../../store';
import { connect } from 'pwa-helpers';
import '@vaadin/tooltip';
import { get } from 'lit-translate';
class CoreSyncStatus extends connect(store)(LitElement) {
	static get properties() {
		return {
			nodeStatus: {type: Object}
		};
	}
	

	constructor() {
		super();
		this.nodeStatus = {
			isMintingPossible:false,
isSynchronizing:true,
syncPercent:undefined,
numberOfConnections:undefined,
height:undefined,
		}
	}
	static styles = css`
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 16px;
			border-bottom: 1px solid #e0e0e0;
		}

		.content {
			padding: 16px;
		}
		.close {
			visibility: hidden;
			position: fixed;
			z-index: -100;
			right: -1000px;
		}

		.parent-side-panel {
			transform: translateX(100%); /* start from outside the right edge */
    		transition: transform 0.3s ease-in-out;
		}
		.parent-side-panel.open {
			transform: translateX(0); /* slide in to its original position */

		}
	`;

stateChanged(state) {
	this.nodeStatus = state.app.nodeStatus
}

	render() {
		return html`
			<mwc-icon id="icon"  style="color: ${this.nodeStatus.syncPercent === 100 ? 'green': 'red'};user-select:none;margin-right:20px"
				>wifi</mwc-icon
			>
			<vaadin-tooltip
			  for="icon"
			  position="bottom"
			  hover-delay=${400}
			  hide-delay=${1}
			  text=${this.nodeStatus.syncPercent === 100 ? get('notifications.status1'): get('notifications.status2')}>
		  </vaadin-tooltip>
			
			
		`;
	}


}

customElements.define('core-sync-status', CoreSyncStatus);
