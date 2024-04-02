import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import isElectron from 'is-electron'
import {registerTranslateConfig, translate, use} from '../../../../core/translate'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'

registerTranslateConfig({
  loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class MintingInfo extends LitElement {
    static get properties() {
        return {
            selectedAddress: { type: Object },
            loading: { type: Boolean },
            adminInfo: { type: Array },
            nodeInfo: { type: Array },
            sampleBlock: { type: Array },
            addressInfo: { type: Array },
            addressLevel: { type: Array },
            theme: { type: String, reflect: true },
            tier4Online: { type: Number }
        }
    }

    static get styles() {
        return css`
        * {
            --mdc-theme-surface: var(--white);
            --mdc-dialog-content-ink-color: var(--black);
        }

        @keyframes moveInBottom {
            0% {
                opacity: 0;
                transform: translateY(30px);
            }

            100% {
                opacity: 1;
                transform: translate(0);
            }
        }

        [hidden] {
            display: hidden !important;
            visibility: none !important;
        }

        h4 {
            font-weight:600;
            font-size:20px;
            line-height: 28px;
            color: var(--black);
        }

        .header-title {
            display: block;
            overflow: hidden;
            font-size: 40px;
            color: var(--black);
            font-weight: 400;
            text-align: center;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            word-break: break-word;
            cursor: inherit;
            margin-top: 2rem;
        }

        .level-black {
            font-size: 32px;
            color: var(--black);
            font-weight: 400;
            text-align: center;
            margin-top: 2rem;
        }

        .level-blue {
            display: inline-block;
            font-size: 32px;
            color: #03a9f4;
            font-weight: 400;
            text-align: center;
            margin-top: 2rem;
        }

        .sub-main {
            position: relative;
            text-align: center;
            width: 100%;
        }

        .center-box {
            position: absolute;
            width: 100%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 0%);
            text-align: center;
        }

        .content-box {
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 10px 25px;
            text-align: center;
            display: inline-block;
            min-width: 250px;
	    margin-left: 10px;
	    margin-bottom: 5px;
        }

        .help-icon {
            color: #f44336;
        }

        .details {
            display: flex;
            font-size: 18px;
        }

        .title {
            font-weight:600;
            font-size:20px;
            line-height: 28px;
            opacity: 0.66;
            color: #03a9f4;
        }

        .sub-title {
            font-weight:600;
            font-size:20px;
            line-height: 24px;
            opacity: 0.66;
        }

        .input {
            width: 90%;
            border: none;
            display: inline-block;
            font-size: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            resize: none;
            background: #eee;
        }

        .textarea {
            width: 90%;
            border: none;
            display: inline-block;
            font-size: 16px;
            padding: 10px 20px;
            border-radius: 5px;
            height: 120px;
            resize: none;
            background: #eee;
        }

        .not-minter {
            display: inline-block;
            font-size: 32px;
            color: #03a9f4;
            font-weight: 400;
            margin-top: 2rem;
        }

        .blue {
            color: #03a9f4;
        }

        .black {
            color: var(--black);
        }

        .red {
            color: #f44336;
        }

        .red-button {
            --mdc-theme-primary: red;
            --mdc-theme-on-primary: white;
        }

        mwc-button.red-button {
            --mdc-theme-primary: red;
            --mdc-theme-on-primary: white;
        }
        `
    }

    constructor() {
        super()
        this.selectedAddress = window.parent.reduxStore.getState().app.selectedAddress.address
        this.adminInfo = []
        this.nodeInfo = []
        this.sampleBlock = []
        this.addressInfo = []
        this.addressLevel = []
        this.tier4Online = 0
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
    }

    render() {
        if (this.renderMintingPage() === "false") {
            return html`
            <div>
                <div>
                    <span class="header-title">${translate("mintingpage.mchange1")}</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <div>
                            <span class="level-black">${translate("mintingpage.mchange2")}</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange3")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._averageBlockTime()} ${translate("mintingpage.mchange25")}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange4")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._timeCalc()} ${translate("mintingpage.mchange26")}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange5")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._dayReward()} QORT</h4>
                        </div><br>
                    </div>
                </div>
            </div>
        `} else {
            return html`
            <div>
                <div>
                    <span class="header-title">${translate("mintingpage.mchange1")}</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <div>
                            <span class="level-black">${translate("mintingpage.mchange2")}</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange3")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._averageBlockTime()} ${translate("mintingpage.mchange25")}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange4")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._timeCalc()} ${translate("mintingpage.mchange26")}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange5")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._dayReward()} QORT</h4>
                        </div><br><br><br>
                        <div>
                            <span class="level-black">${this.renderMintingHelp()}</span>
                            <hr style="width: 50%;color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange15")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4><span class=${this.cssMinting}>${this._mintingStatus()}</span></h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange16")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${translate("mintingpage.mchange27")} ${this.addressInfo.level}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange17")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._levelUpBlocks()} ${translate("mintingpage.mchange26")}</h4>
                        </div><br>
                        <div>
		            <span class="level-black">${translate("mintingpage.mchange18")} <div class="level-blue">${this._levelUp()}</div> ${translate("mintingpage.mchange38")} <div class="level-blue">${this._levelUpDays()}</div> ${translate("mintingpage.mchange29")} !</span>
                        </div><br><br><br>
                        <div>
                            <span class="level-black">${translate("mintingpage.mchange19")}</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange20")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._currentTier()}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange21")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countLevels()} ${translate("mintingpage.mchange30")}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange22")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._tierPercent()} %</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange23")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countReward()} QORT</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">${translate("mintingpage.mchange24")}</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countRewardDay()} QORT</h4>
                        </div>
                    </div>
                </div>

                <!-- Become A Minter Dialog -->
                <mwc-dialog id="becomeMinterDialog">
                    <div style="text-align:center">
                        <h2>${translate("mintingpage.mchange32")}</h2>
                        <hr>
                    </div>
                    <div>
                        <h3>${translate("mintingpage.mchange33")}</h3><br />
                        ${translate("mintingpage.mchange34")}
                    </div>
                    <div>
                        <h3>${translate("mintingpage.mchange35")}</h3><br />
                        ${translate("mintingpage.mchange36")}
                        <br />
                        ${translate("mintingpage.mchange37")}
                    </div>
                   <mwc-button slot="primaryAction" dialogAction="cancel" class="red-button">${translate("general.close")}</mwc-button>
                </mwc-dialog>

            </div>
        `}
    }

    async firstUpdated() {
        this.changeTheme()
        this.changeLanguage()

        await this.getAddressLevel()

        const getAdminInfo = () => {
            parentEpml.request("apiCall", { url: `/admin/info` }).then((res) => {
                setTimeout(() => { this.adminInfo = res; }, 1)
            })
            setTimeout(getAdminInfo, 30000)
        };

        const getNodeInfo = () => {
            parentEpml.request("apiCall", { url: `/admin/status` }).then((res) => {
                this.nodeInfo = res
                // Now look up the sample block
                getSampleBlock()
            })
            setTimeout(getNodeInfo, 30000)
        };

        const getSampleBlock = () => {
            let callBlock = parseFloat(this.nodeInfo.height) - 1440
            parentEpml.request("apiCall", { url: `/blocks/byheight/${callBlock}` }).then((res) => {
                setTimeout(() => { this.sampleBlock = res }, 1)
            })
        }

        const getAddressInfo = () => {
            parentEpml.request('apiCall', { url: `/addresses/${window.parent.reduxStore.getState().app.selectedAddress.address}` }).then((res) => {
                setTimeout(() => { this.addressInfo = res }, 1)
            })
            setTimeout(getAddressInfo, 30000)
        }

        window.addEventListener('storage', () => {
            const checkLanguage = localStorage.getItem('qortalLanguage')
            const checkTheme = localStorage.getItem('qortalTheme')

            use(checkLanguage)

            if (checkTheme) {
                this.theme = checkTheme
            } else {
                this.theme = 'light'
            }
            document.querySelector('html').setAttribute('theme', this.theme)
        })

        if (!isElectron()) {
        } else {
            window.addEventListener('contextmenu', (event) => {
                event.preventDefault()
                window.parent.electronAPI.showMyMenu()
            })
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
        })

        parentEpml.ready().then(() => {
            parentEpml.subscribe("config", async c => {
                if (!configLoaded) {
                    setTimeout(getAdminInfo, 1)
                    setTimeout(getNodeInfo, 1)
                    setTimeout(getAddressInfo, 1)
                    setInterval(this.getAddressLevel, 30000)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })
        })
        parentEpml.imReady()
        this.clearConsole()
        setInterval(() => {
            this.clearConsole()
        }, 60000)
    }

    clearConsole() {
        if (!isElectron()) {
        } else {
            console.clear()
            window.parent.electronAPI.clearCache()
        }
    }

    async getAddressLevel() {
		this.addressLevel = await parentEpml.request('apiCall', {
			url: `/addresses/online/levels`
		})
        this.tier4Online = parseFloat(this.addressLevel[7].count) + parseFloat(this.addressLevel[8].count)
    }

    changeTheme() {
        const checkTheme = localStorage.getItem('qortalTheme')
        if (checkTheme) {
            this.theme = checkTheme
        } else {
            this.theme = 'light'
        }
        document.querySelector('html').setAttribute('theme', this.theme)
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

    renderMintingPage() {
        if (this.addressInfo.error === 124) {
            return "false"
        } else {
            return "true"
        }
    }

    _averageBlockTime() {
        let avgBlockString = (this.adminInfo.currentTimestamp - this.sampleBlock.timestamp).toString();
        let averageTimeString = ((avgBlockString / 1000) / 1440).toFixed(2)
        let averageBlockTimeString = (averageTimeString).toString()
        return "" + averageBlockTimeString
    }

    _timeCalc() {
        let timeString = (this.adminInfo.currentTimestamp - this.sampleBlock.timestamp).toString()
        let averageString = ((timeString / 1000) / 1440).toFixed(2)
        let averageBlockDay = (86400 / averageString).toFixed(2)
        let averageBlockDayString = (averageBlockDay).toString()
        return "" + averageBlockDayString
    }

    _dayReward() {
        let rewardString = (this._timeCalc() * this._blockReward()).toFixed(2)
        let rewardDayString = (rewardString).toString()
        return "" + rewardDayString
    }

    _mintingStatus() {
        if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === true) {
            this.cssMinting = "blue"
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === false) {
            this.cssMinting = "blue"
            return html`${translate("appinfo.minting")}`
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === true) {
            this.cssMinting = "red"
            return html`(${translate("appinfo.synchronizing")}... ${this.nodeStatus.syncPercent !== undefined ? this.nodeStatus.syncPercent + '%' : ''})`
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === false) {
            this.cssMinting = "red"
            return html`${translate("mintingpage.mchange9")}`
        } else {
            return "No Status"
        }
    }

    renderMintingHelp() {
        if (this._mintingStatus() === "Not Minting") {
            return html`${translate("mintingpage.mchange9")} <div class="level-blue">==></div> ${translate("mintingpage.mchange7")}<br><mwc-button class="red-button" @click=${() => this.shadowRoot.querySelector("#becomeMinterDialog").show()}><mwc-icon class="help-icon">help_outline</mwc-icon>&nbsp;${translate("mintingpage.mchange31")}</mwc-button>`
        } else {
            return html`${translate("mintingpage.mchange6")}`
        }
    }

    _levelUpDays() {
        let nextBatch = 1000 - (this.nodeInfo.height % 1000)
        let countBlocks = this._blocksNeed() - (this.addressInfo.blocksMinted + this.addressInfo.blocksMintedAdjustment)
        countBlocks = +countBlocks + 1000
        let countBlocksActual = countBlocks + nextBatch - (countBlocks % 1000)
        let countDays = (countBlocksActual / this._timeCalc()).toFixed(2)
        let countString = countDays.toString()
        return "" + countString
    }

    _levelUpBlocks() {
        let nextBatch = 1000 - (this.nodeInfo.height % 1000)
        let countBlocks = this._blocksNeed() - (this.addressInfo.blocksMinted + this.addressInfo.blocksMintedAdjustment)
        countBlocks = +countBlocks + 1000
        let countBlocksActual = countBlocks + nextBatch - (countBlocks % 1000)
        let countBlocksString = countBlocksActual.toString()
        return "" + countBlocksString
    }

    _blocksNeed() {
        if (this.addressInfo.level === 0) {
            return "7200"
        } else if (this.addressInfo.level === 1) {
            return "72000"
        } else if (this.addressInfo.level === 2) {
            return "201600"
        } else if (this.addressInfo.level === 3) {
            return "374400"
        } else if (this.addressInfo.level === 4) {
            return "618400"
        } else if (this.addressInfo.level === 5) {
            return "964000"
        } else if (this.addressInfo.level === 6) {
            return "1482400"
        } else if (this.addressInfo.level === 7) {
            return "2173600"
        } else if (this.addressInfo.level === 8) {
            return "3037600"
        } else if (this.addressInfo.level === 9) {
            return "4074400"
        }
    }

    _levelUp() {
        if (this.addressInfo.level === 0) {
            return "1"
        } else if (this.addressInfo.level === 1) {
            return "2"
        } else if (this.addressInfo.level === 2) {
            return "3"
        } else if (this.addressInfo.level === 3) {
            return "4"
        } else if (this.addressInfo.level === 4) {
            return "5"
        } else if (this.addressInfo.level === 5) {
            return "6"
        } else if (this.addressInfo.level === 6) {
            return "7"
        } else if (this.addressInfo.level === 7) {
            return "8"
        } else if (this.addressInfo.level === 8) {
            return "9"
        } else if (this.addressInfo.level === 9) {
            return "10"
        }
    }

    _currentTier() {
        if (this.addressInfo.level === 0) {
            return html`${translate("mintingpage.mchange28")} 0 (${translate("mintingpage.mchange27")} 0)`
        } else if (this.addressInfo.level === 1) {
            return html`${translate("mintingpage.mchange28")} 1 (${translate("mintingpage.mchange27")} 1 + 2)`
        } else if (this.addressInfo.level === 2) {
            return html`${translate("mintingpage.mchange28")} 1 (${translate("mintingpage.mchange27")} 1 + 2)`
        } else if (this.addressInfo.level === 3) {
            return html`${translate("mintingpage.mchange28")} 2 (${translate("mintingpage.mchange27")} 3 + 4)`
        } else if (this.addressInfo.level === 4) {
            return html`${translate("mintingpage.mchange28")} 2 (${translate("mintingpage.mchange27")} 3 + 4)`
        } else if (this.addressInfo.level === 5) {
            return html`${translate("mintingpage.mchange28")} 3 (${translate("mintingpage.mchange27")} 5 + 6)`
        } else if (this.addressInfo.level === 6) {
            return html`${translate("mintingpage.mchange28")} 3 (${translate("mintingpage.mchange27")} 5 + 6)`
        } else if (this.addressInfo.level === 7) {
            return html`${translate("mintingpage.mchange28")} 4 (${translate("mintingpage.mchange27")} 7 + 8)`
        } else if (this.addressInfo.level === 8) {
            return html`${translate("mintingpage.mchange28")} 4 (${translate("mintingpage.mchange27")} 7 + 8)`
        } else if (this.addressInfo.level === 9) {
            return html`${translate("mintingpage.mchange28")} 5 (${translate("mintingpage.mchange27")} 9 + 10)`
        } else if (this.addressInfo.level === 10) {
            return html`${translate("mintingpage.mchange28")} 5 (${translate("mintingpage.mchange27")} 9 + 10)`
        }
    }

    _tierPercent() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            return "6"
        } else if (this.addressInfo.level === 2) {
            return "6"
        } else if (this.addressInfo.level === 3) {
            return "13"
        } else if (this.addressInfo.level === 4) {
            return "13"
        } else if (this.addressInfo.level === 5) {
            if (this.tier4Online < 30) {
                return "45"
            } else {
                return "19"
            }
        } else if (this.addressInfo.level === 6) {
            if (this.tier4Online < 30) {
                return "45"
            } else {
                return "19"
            }
        } else if (this.addressInfo.level === 7) {
            if (this.tier4Online < 30) {
                return "45"
            } else {
                return "26"
            }
        } else if (this.addressInfo.level === 8) {
            if (this.tier4Online < 30) {
                return "45"
            } else {
                return "26"
            }
        } else if (this.addressInfo.level === 9) {
            return "32"
        } else if (this.addressInfo.level === 10) {
            return "32"
        }
    }

    _blockReward() {
        if (this.nodeInfo.height < 259201) {
            return "5.00"
        } else if (this.nodeInfo.height < 518401) {
            return "4.75"
        } else if (this.nodeInfo.height < 777601) {
            return "4.50"
        } else if (this.nodeInfo.height < 1036801) {
            return "4.25"
        } else if (this.nodeInfo.height < 1296001) {
            return "4.00"
        } else if (this.nodeInfo.height < 1555201) {
            return "3.75"
        } else if (this.nodeInfo.height < 1814401) {
            return "3.50"
        } else if (this.nodeInfo.height < 2073601) {
            return "3.25"
        } else if (this.nodeInfo.height < 2332801) {
            return "3.00"
        } else if (this.nodeInfo.height < 2592001) {
            return "2.75"
        } else if (this.nodeInfo.height < 2851201) {
            return "2.50"
        } else if (this.nodeInfo.height < 3110401) {
            return "2.25"
        } else {
            return "2.00"
        }
    }

    _countLevels() {
        if (this.addressInfo.level === 0) {
            let countTier0 = (this.addressLevel[0].count).toString()
            return "" + countTier0
        } else if (this.addressInfo.level === 1) {
            let countTier10 = (this.addressLevel[1].count + this.addressLevel[2].count).toString()
            return "" + countTier10
        } else if (this.addressInfo.level === 2) {
            let countTier11 = (this.addressLevel[1].count + this.addressLevel[2].count).toString()
            return "" + countTier11
        } else if (this.addressInfo.level === 3) {
            let countTier20 = (this.addressLevel[3].count + this.addressLevel[4].count).toString()
            return "" + countTier20
        } else if (this.addressInfo.level === 4) {
            let countTier21 = (this.addressLevel[3].count + this.addressLevel[4].count).toString()
            return "" + countTier21
        } else if (this.addressInfo.level === 5) {
            if (this.tier4Online < 30) {
                let countTier30 = (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier30
            } else {
                let countTier30 = (this.addressLevel[5].count + this.addressLevel[6].count).toString()
                return "" + countTier30
            }
        } else if (this.addressInfo.level === 6) {
            if (this.tier4Online < 30) {
                let countTier31 = (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier31
            } else {
                let countTier31 = (this.addressLevel[5].count + this.addressLevel[6].count).toString()
                return "" + countTier31
            }
        } else if (this.addressInfo.level === 7) {
            if (this.tier4Online < 30) {
                let countTier40 = (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier40
            } else {
                let countTier40 = (this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier40
            }
        } else if (this.addressInfo.level === 8) {
            if (this.tier4Online < 30) {
                let countTier40 = (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier40
            } else {
                let countTier41 = (this.addressLevel[7].count + this.addressLevel[8].count).toString()
                return "" + countTier41
            }
        } else if (this.addressInfo.level === 9) {
            let countTier50 = (this.addressLevel[9].count + this.addressLevel[10].count).toString()
            return "" + countTier50
        } else if (this.addressInfo.level === 10) {
            let countTier51 = (this.addressLevel[9].count + this.addressLevel[10].count).toString()
            return "" + countTier51
        }
    }

    _countReward() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            let countReward10 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[1].count + this.addressLevel[2].count)).toFixed(8)
            let countReward11 = (countReward10).toString()
            return "" + countReward11
        } else if (this.addressInfo.level === 2) {
            let countReward20 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[1].count + this.addressLevel[2].count)).toFixed(8)
            let countReward21 = (countReward20).toString()
            return "" + countReward21
        } else if (this.addressInfo.level === 3) {
            let countReward30 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[3].count + this.addressLevel[4].count)).toFixed(8)
            let countReward31 = (countReward30).toString()
            return "" + countReward31;
        } else if (this.addressInfo.level === 4) {
            let countReward40 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[3].count + this.addressLevel[4].count)).toFixed(8)
            let countReward41 = (countReward40).toString();
            return "" + countReward41;
        } else if (this.addressInfo.level === 5) {
            if (this.tier4Online< 30) {
                let countReward50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward51 = (countReward50).toString();
                return "" + countReward51;
            } else {
                let countReward50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count)).toFixed(8)
                let countReward51 = (countReward50).toString();
                return "" + countReward51;
            }
        } else if (this.addressInfo.level === 6) {
            if (this.tier4Online < 30) {
                let countReward60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward61 = (countReward60).toString()
                return "" + countReward61
            } else {
                    let countReward60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count)).toFixed(8)
                    let countReward61 = (countReward60).toString()
                    return "" + countReward61
            }
        } else if (this.addressInfo.level === 7) {
            if (this.tier4Online < 30) {
                let countReward70 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward71 = (countReward70).toString()
                return "" + countReward71
            } else {
                let countReward70 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward71 = (countReward70).toString()
                return "" + countReward71
            }
        } else if (this.addressInfo.level === 8) {
            if (this.tier4Online < 30) {
                let countReward80 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward81 = (countReward80).toString()
                return "" + countReward81
            } else {
                let countReward80 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[7].count + this.addressLevel[8].count)).toFixed(8)
                let countReward81 = (countReward80).toString()
                return "" + countReward81
            }
        } else if (this.addressInfo.level === 9) {
            let countReward90 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[9].count + this.addressLevel[10].count)).toFixed(8)
            let countReward91 = (countReward90).toString()
            return "" + countReward91
        } else if (this.addressInfo.level === 10) {
            let countReward100 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[9].count + this.addressLevel[10].count)).toFixed(8)
            let countReward101 = (countReward100).toString()
            return "" + countReward101
        }
    }

    _countRewardDay() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            let countRewardDay10 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[1].count + this.addressLevel[2].count) * this._timeCalc()).toFixed(8)
            let countRewardDay11 = (countRewardDay10).toString()
            return "" + countRewardDay11
        } else if (this.addressInfo.level === 2) {
            let countRewardDay20 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[1].count + this.addressLevel[2].count) * this._timeCalc()).toFixed(8)
            let countRewardDay21 = (countRewardDay20).toString()
            return "" + countRewardDay21
        } else if (this.addressInfo.level === 3) {
            let countRewardDay30 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[3].count + this.addressLevel[4].count) * this._timeCalc()).toFixed(8)
            let countRewardDay31 = (countRewardDay30).toString()
            return "" + countRewardDay31
        } else if (this.addressInfo.level === 4) {
            let countRewardDay40 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[3].count + this.addressLevel[4].count) * this._timeCalc()).toFixed(8)
            let countRewardDay41 = (countRewardDay40).toString()
            return "" + countRewardDay41
        } else if (this.addressInfo.level === 5) {
            if (this.tier4Online < 30) {
                let countRewardDay50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay51 = (countRewardDay50).toString()
                return "" + countRewardDay51
            } else {
                let countRewardDay50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count) * this._timeCalc()).toFixed(8)
                let countRewardDay51 = (countRewardDay50).toString()
                return "" + countRewardDay51
            }
        } else if (this.addressInfo.level === 6) {
            if (this.tier4Online < 30) {
                let countRewardDay60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay61 = (countRewardDay60).toString()
                return "" + countRewardDay61
            } else {
                let countRewardDay60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count) * this._timeCalc()).toFixed(8)
                let countRewardDay61 = (countRewardDay60).toString()
                return "" + countRewardDay61
            }
        } else if (this.addressInfo.level === 7) {
            if (this.tier4Online < 30) {
                let countRewardDay70 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay71 = (countRewardDay70).toString()
                return "" + countRewardDay71
            } else {
                let countRewardDay70 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay71 = (countRewardDay70).toString()
                return "" + countRewardDay71
            }
        } else if (this.addressInfo.level === 8) {
            if (this.tier4Online < 30) {
                let countRewardDay80 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[5].count + this.addressLevel[6].count + this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay81 = (countRewardDay80).toString()
                return "" + countRewardDay81
            } else {
                let countRewardDay80 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[7].count + this.addressLevel[8].count) * this._timeCalc()).toFixed(8)
                let countRewardDay81 = (countRewardDay80).toString()
                return "" + countRewardDay81
            }
        } else if (this.addressInfo.level === 9) {
            let countRewardDay90 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[9].count + this.addressLevel[10].count) * this._timeCalc()).toFixed(8)
            let countRewardDay91 = (countRewardDay90).toString()
            return "" + countRewardDay91
        } else if (this.addressInfo.level === 10) {
            let countRewardDay100 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[9].count + this.addressLevel[10].count) * this._timeCalc()).toFixed(8)
            let countRewardDay101 = (countRewardDay100).toString()
            return "" + countRewardDay101
        }
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    isEmptyArray(arr) {
        if (!arr) return true
        return arr.length === 0
    }
}

window.customElements.define('minting-info', MintingInfo)
