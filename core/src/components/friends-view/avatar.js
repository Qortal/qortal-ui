import {css, html, LitElement} from 'lit';
import axios from 'axios';
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item.js';
import {RequestQueueWithPromise} from '../../../../plugins/plugins/utils/queue';
import '../../../../plugins/plugins/core/components/TimeAgo';
import {connect} from 'pwa-helpers';
import {store} from '../../store';
import ShortUniqueId from 'short-unique-id';

const requestQueue = new RequestQueueWithPromise(3);
const requestQueueRawData = new RequestQueueWithPromise(3);
const requestQueueStatus = new RequestQueueWithPromise(3);

export class AvatarComponent extends connect(store)(LitElement) {
	static get properties() {
		return {
			resource: { type: Object },
			isReady: { type: Boolean },
			status: { type: Object },
			name: { type: String },
		};
	}

	static get styles() {
		return css`
			* {
				--mdc-theme-text-primary-on-background: var(--black);
				box-sizing: border-box;
			}
			:host {
				width: 100%;
				box-sizing: border-box;
			}
			img {
				width: 100%;
				max-height: 30vh;
				border-radius: 5px;
				cursor: pointer;
				position: relative;
			}
			.smallLoading,
			.smallLoading:after {
				border-radius: 50%;
				width: 2px;
				height: 2px;
			}

			.defaultSize {
				width: 100%;
				height: 160px;
			}
			.parent-feed-item {
				position: relative;
				display: flex;
				background-color: var(--chat-bubble-bg);
				flex-grow: 0;
				flex-direction: column;
				align-items: flex-start;
				justify-content: center;
				border-radius: 5px;
				padding: 12px 15px 4px 15px;
				min-width: 150px;
				width: 100%;
				box-sizing: border-box;
				cursor: pointer;
				font-size: 16px;
			}
			.avatar {
				width: 36px;
				height: 36px;
				border-radius: 50%;
				overflow: hidden;
				display: flex;
				align-items: center;
			}
			.avatarApp {
				width: 30px;
				height: 30px;
				border-radius: 50%;
				overflow: hidden;
				display: flex;
				align-items: center;
			}
			.feed-item-name {
				user-select: none;
				color: #03a9f4;
				margin-bottom: 5px;
			}

			.app-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
			}

			mwc-menu {
				position: absolute;
			}
		`;
	}

	constructor() {
		super();
		this.resource = {
			identifier: '',
			name: '',
			service: '',
		};
		this.status = {
			status: '',
		};
		this.isReady = false;
		this.nodeUrl = this.getNodeUrl();
		this.myNode = this.getMyNode();
		this.isFetching = false;
		this.uid = new ShortUniqueId();
	}
	getNodeUrl() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];

		return myNode.protocol + '://' + myNode.domain + ':' + myNode.port;
	}
	getMyNode() {
		return window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
			];
	}

	getApiKey() {
		const myNode =
			window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
				window.parent.reduxStore.getState().app.nodeConfig.node
			];
		return myNode.apiKey;
	}

	async fetchResource() {
		try {
			if (this.isFetching) return;
			this.isFetching = true;
			await axios.get(
				`${this.nodeUrl}/arbitrary/resource/properties/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`
			);
			this.isFetching = false;
		} catch (error) {
			this.isFetching = false;
		}
	}

	async fetchVideoUrl() {
		await this.fetchResource();
	}

	async getRawData() {
		const url = `${this.nodeUrl}/arbitrary/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`;
		return await requestQueueRawData.enqueue(() => {
			return axios.get(url);
		});
		// const response2 = await fetch(url, {
		//   method: 'GET',
		//   headers: {
		//     'Content-Type': 'application/json'
		//   }
		// })

		// const responseData2 = await response2.json()
		// return responseData2
	}

	updateDisplayWithPlaceholders(display, resource, rawdata) {
		const pattern = /\$\$\{([a-zA-Z0-9_\.]+)\}\$\$/g;

		for (const key in display) {
			const value = display[key];

			display[key] = value.replace(pattern, (match, p1) => {
				if (p1.startsWith('rawdata.')) {
					const dataKey = p1.split('.')[1];
					if (rawdata[dataKey] === undefined) {
						console.error('rawdata key not found:', dataKey);
					}
					return rawdata[dataKey] || match;
				} else if (p1.startsWith('resource.')) {
					const resourceKey = p1.split('.')[1];
					if (resource[resourceKey] === undefined) {
						console.error('resource key not found:', resourceKey);
					}
					return resource[resourceKey] || match;
				}
				return match;
			});
		}
	}

	async fetchStatus() {
		let isCalling = false;
		let percentLoaded = 0;
		let timer = 24;
		const response = await requestQueueStatus.enqueue(() => {
			return axios.get(
				`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`
			);
		});
		if (response && response.data && response.data.status === 'READY') {
			this.status = response.data;

			return;
		}
		const intervalId = setInterval(async () => {
			if (isCalling) return;
			isCalling = true;

			const data = await requestQueue.enqueue(() => {
				return axios.get(
					`${this.nodeUrl}/arbitrary/resource/status/${this.resource.service}/${this.resource.name}/${this.resource.identifier}?apiKey=${this.myNode.apiKey}`
				);
			});
			const res = data.data;

			isCalling = false;
			if (res.localChunkCount) {
				if (res.percentLoaded) {
					if (
						res.percentLoaded === percentLoaded &&
						res.percentLoaded !== 100
					) {
						timer = timer - 5;
					} else {
						timer = 24;
					}
					if (timer < 0) {
						clearInterval(intervalId);
					}
					percentLoaded = res.percentLoaded;
				}

				this.status = res;
				if (this.status.status === 'DOWNLOADED') {
					await this.fetchResource();
				}
			}

			// check if progress is 100% and clear interval if true
			if (res.status === 'READY') {
				clearInterval(intervalId);
				this.status = res;
				this.isReady = true;
			}
		}, 5000); // 1 second interval
	}

	async _fetchImage() {
		try {
			await this.fetchVideoUrl();
			await this.fetchStatus();
		} catch (error) {
			/* empty */
		}
	}

	firstUpdated() {
		this._fetchImage();
	}

	render() {
		return html`
			<div>
				${this.status.status !== 'READY'
					? html`
							<mwc-icon style="user-select:none;"
								>account_circle</mwc-icon
							>
					  `
					: ''}
				${this.status.status === 'READY'
					? html`
							<div
								style="height: 24px;width: 24px;overflow: hidden;"
							>
								<img
									src="${this
										.nodeUrl}/arbitrary/THUMBNAIL/${this
										.name}/qortal_avatar?async=true&apiKey=${this
										.myNode.apiKey}"
									style="width:100%; height:100%;border-radius:50%"
									onerror="this.onerror=null; this.src='/img/incognito.png';"
								/>
							</div>
					  `
					: ''}
			</div>
		`;
	}
}

customElements.define('avatar-component', AvatarComponent);
