import { html, LitElement } from 'lit'
import { Epml } from '../../../../epml'
import { highChartStyles } from '../../components/plugins-css'
import * as Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import StockChart from 'highcharts/modules/stock'
import 'highcharts/highcharts-more.js'
import 'highcharts/modules/accessibility.js'
import 'highcharts/modules/boost.js'
import 'highcharts/modules/data.js'
import 'highcharts/modules/export-data.js'
import 'highcharts/modules/offline-exporting.js'
import '@polymer/paper-dialog/paper-dialog.js'

// Multi language support
import { get, registerTranslateConfig, translate, use } from '../../../../../core/translate'
registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

Exporting(Highcharts)
StockChart(Highcharts)

let dogeChartDialog

class DogeCharts extends LitElement {
	static get properties() {
		return {
			isLoadingTradesChart: { type: Boolean },
			dogeTrades: { type: Array },
			dogePrice: { type: Array }
		}
	}

	static get styles() {
		return [highChartStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.isLoadingTradesChart = false
		this.dogeTrades = []
		this.dogePrice = []
	}

	render() {
		return html`
			<paper-dialog id="loadChartDialog" class="chart-loading-wrapper" modal>
				<div class="loadingContainer" style="display:${this.isLoadingTradesChart ? 'inline-block' : 'none'}">
					<span style="color: var(--black);">${translate("login.loading")}</span>
				</div>
			</paper-dialog>
			<paper-dialog id="dogeChartDialog" class="chart-info-wrapper">
				<div class="chart-container">
					<div id='dogeStockPriceContainer' class='trades-chart'></div>
				</div>
			</paper-dialog>
		`
	}

	async firstUpdated() {
		this.changeTheme()
		this.changeLanguage()

		window.addEventListener('storage', () => {
			const checkLanguage = localStorage.getItem('qortalLanguage')
			const checkTheme = localStorage.getItem('qortalTheme')

			use(checkLanguage)

			this.theme = (checkTheme === 'dark') ? 'dark' : 'light'
			document.querySelector('html').setAttribute('theme', this.theme)
		})
	}

	async loadTradesChart() {
		this.isLoadingTradesChart = true
		this.shadowRoot.getElementById('loadChartDialog').open()
		await this.getDogeTrades()
		this.isLoadingTradesChart = false
		this.shadowRoot.getElementById('loadChartDialog').close()
		this.enableDogeStockPriceChart()
	}

	async getDogeTrades() {
		let currentDogeTimestamp = Date.now()
		const monthBackDoge = currentDogeTimestamp - 31556952000
           	await parentEpml.request("apiCall", { url: `/crosschain/trades?foreignBlockchain=DOGECOIN&minimumTimestamp=${monthBackDoge}&limit=0&reverse=false` }).then((res) => {
			this.dogeTrades = res
		})
		this.dogePrice = this.dogeTrades.map(item => {
			const dogeSellPrice = this.round(parseFloat(item.foreignAmount) / parseFloat(item.qortAmount))
			return [item.tradeTimestamp, parseFloat(dogeSellPrice)]
		}).filter(item => !!item)
	}

	enableDogeStockPriceChart() {
            const dogeStockPriceData = this.dogePrice
            const header = 'QORT / DOGE ' + get("tradepage.tchange49")
		Highcharts.stockChart(this.shadowRoot.querySelector('#dogeStockPriceContainer'), {
			accessibility: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			rangeSelector: {
				selected: 1,
				labelStyle: {color: 'var(--black)'},
				inputStyle: {color: '#03a9f4'}
			},
			chart: {
				backgroundColor: 'transparent'
			},
			title: {
				text: header,
				style: {color: 'var(--black)'}
			},
			xAxis: {
				labels: {
					style: {
						color: '#03a9f4'
					}
				}
			},
			yAxis: {
				labels: {
					style: {
						color: '#03a9f4'
					}
				}
			},
			series: [{
				name: 'QORT / DOGE',
				data: dogeStockPriceData,
				tooltip: {
					valueDecimals: 8
				}
			}]
		})
	}

	async open() {
		await this.loadTradesChart()
		this.shadowRoot.getElementById('dogeChartDialog').open()
	}

	changeTheme() {
		const checkTheme = localStorage.getItem('qortalTheme')
		this.theme = (checkTheme === 'dark') ? 'dark' : 'light'
		document.querySelector('html').setAttribute('theme', this.theme);
	}

	changeLanguage() {
		const checkLanguage = localStorage.getItem('qortalLanguage')

		if (checkLanguage === null || checkLanguage.length === 0) {
			localStorage.setItem('qortalLanguage', 'us')
			use('us')
		} else {
			use(checkLanguage)
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

window.customElements.define('doge-charts', DogeCharts)

const chartsdoge = document.createElement('doge-charts')
dogeChartDialog = document.body.appendChild(chartsdoge)
export default dogeChartDialog