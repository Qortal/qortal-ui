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

let ltcChartDialog

class LtcCharts extends LitElement {
	static get properties() {
		return {
			isLoadingTradesChart: { type: Boolean },
			ltcTrades: { type: Array },
			ltcPrice: { type: Array }
		}
	}

	static get styles() {
		return [highChartStyles]
	}

	constructor() {
		super()
		this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
		this.isLoadingTradesChart = false
		this.ltcTrades = []
		this.ltcPrice = []
	}

	render() {
		return html`
			<paper-dialog id="loadChartDialog" class="chart-loading-wrapper" modal>
				<div class="loadingContainer" style="display:${this.isLoadingTradesChart ? 'inline-block' : 'none'}">
					<span style="color: var(--black);">${translate("login.loading")}</span>
				</div>
			</paper-dialog>
			<paper-dialog id="ltcChartDialog" class="chart-info-wrapper">
				<div class="chart-container">
					<div id='ltcStockPriceContainer' class='trades-chart'></div>
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
		await this.getLtcTrades()
		this.isLoadingTradesChart = false
		this.shadowRoot.getElementById('loadChartDialog').close()
		this.enableLtcStockPriceChart()
	}

	async getLtcTrades() {
		let currentLtcTimestamp = Date.now()
		const monthBackLtc = currentLtcTimestamp - 31556952000
           	await parentEpml.request("apiCall", { url: `/crosschain/trades?foreignBlockchain=LITECOIN&minimumTimestamp=${monthBackLtc}&limit=0&reverse=false` }).then((res) => {
			this.ltcTrades = res
		})
		this.ltcPrice = this.ltcTrades.map(item => {
			const ltcSellPrice = this.round(parseFloat(item.foreignAmount) / parseFloat(item.qortAmount))
			return [item.tradeTimestamp, parseFloat(ltcSellPrice)]
		}).filter(item => !!item)
	}

	enableLtcStockPriceChart() {
            const ltcStockPriceData = this.ltcPrice
            const header = 'QORT / LTC ' + get("tradepage.tchange49")
		Highcharts.stockChart(this.shadowRoot.querySelector('#ltcStockPriceContainer'), {
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
				name: 'QORT / LTC',
				data: ltcStockPriceData,
				tooltip: {
					valueDecimals: 8
				}
			}]
		})
	}

	async open() {
		await this.loadTradesChart()
		this.shadowRoot.getElementById('ltcChartDialog').open()
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

window.customElements.define('ltc-charts', LtcCharts)

const chartsltc = document.createElement('ltc-charts')
ltcChartDialog = document.body.appendChild(chartsltc)
export default ltcChartDialog