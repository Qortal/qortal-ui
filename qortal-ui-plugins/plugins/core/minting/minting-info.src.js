import { LitElement, html, css } from "lit";
import { render } from "lit/html.js";
import { Epml } from "../../../epml.js";

import "@material/mwc-icon";
import "@material/mwc-button";
import "@material/mwc-dialog";
import "@material/mwc-textfield";

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent });

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
        }
    }

    static get styles() {
        return css`
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
            color:#000000;
        }

        .header-title {
            display: block;
            overflow: hidden;
            font-size: 40px;
            color: black;
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
            color: black;
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
            border: 1px solid #a1a1a1;
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
            color: #000000;
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
        this.adminInfo = [];
        this.nodeInfo = [];
        this.sampleBlock = [];
        this.addressInfo = [];
        this.addressLevel = [];
    }

    render() {
	if (this.renderMintingPage() === "false") {
        return html`
            <div>
                <div>
                    <span class="header-title">General Minting Details</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <div>
                            <span class="level-black">Blockchain Statistics</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">Avg. Qortal Blocktime</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._averageBlockTime()} Seconds</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Avg. Blocks Per Day</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._timeCalc()} Blocks</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Avg. Created QORT Per Day</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._dayReward()} QORT</h4>
                        </div><br><br><br>
                        <div>
                            <span class="level-black">${this.renderActivateHelp()}</span>
                            <hr style="width: 50%;color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                    </div>
                </div>

                <!-- Activate Account Dialog -->
                <mwc-dialog id="activateAccountDialog">
                    <div style="text-align:center">
                        <h2>Activate Your Account</h2>
                        <hr>
                    </div>
                    <div>
                        <h3>Introduction</h3><br />
							To "activate" your account, an OUTGOING transaction needs to take place.
							Name Registration is the most common method. You can ask someone in Q-Chat to send you a small amount of QORT so that you may activate your account,
							or buy QORT within the Trade Portal then make an OUTGOING transaction of any kind and secure your public key on the blockchain.
							Until you do this, your public key is only known by you, in your UI, and no one else can pull your public key from the chain.
                    </div>
                   <mwc-button slot="primaryAction" dialogAction="cancel" class="red-button">Close</mwc-button>
                </mwc-dialog>
            </div>
        `} else {
        return html`
            <div>
                <div>
                    <span class="header-title">General Minting Details</span>
                    <hr style="color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                </div>
                <div class="sub-main">
                    <div class="center-box">
                        <div>
                            <span class="level-black">Blockchain Statistics</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">Avg. Qortal Blocktime</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._averageBlockTime()} Seconds</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Avg. Blocks Per Day</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._timeCalc()} Blocks</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Avg. Created QORT Per Day</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._dayReward()} QORT</h4>
                        </div><br><br><br>
                        <div>
                            <span class="level-black">${this.renderMintingHelp()}</span>
                            <hr style="width: 50%;color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">Current Status</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4><span class=${this.cssMinting}>${this._mintingStatus()}</span></h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Current Level</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>Level ${this.addressInfo.level}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Blocks To Next Level</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._levelUpBlocks()} Blocks</h4>
                        </div><br>
                        <div>
		            <span class="level-black">If you continue minting 24/7 you will reach level <div class="level-blue">${this._levelUp()}</div> in <div class="level-blue">${this._levelUpDays()}</div> days !</span>
                        </div><br><br><br>
                        <div>
                            <span class="level-black">Minting Rewards Info</span>
                            <hr style="width: 50%; color: #eee; border-radius: 80%; margin-bottom: 2rem;">
                        </div><br>
                        <div class="content-box">
                            <span class="title">Current Tier</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._currentTier()}</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Total Minters in The Tier</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countLevels()} Minters</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Tier Share Per Block</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._tierPercent()} %</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Est. Reward Per Block</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countReward()} QORT</h4>
                        </div>
                        <div class="content-box">
                            <span class="title">Est. Reward Per Day</span>
                            <hr style="color: #eee; border-radius: 90%; margin-bottom: 1rem;">
                            <h4>${this._countRewardDay()} QORT</h4>
                        </div>
                    </div>
                </div>

                <!-- Become A Minter Dialog -->
                <mwc-dialog id="becomeMinterDialog">
                    <div style="text-align:center">
                        <h2>Become A Minter</h2>
                        <hr>
                    </div>
                    <div>
                        <h3>Introduction</h3><br />
                        In Qortal, in order to become a minter and begin earning QORT rewards with your increase in Minter Level, you must first become ‘sponsored’.
                        A sponsor in Qortal is any other minter of level 5 or higher, or a Qortal Founder. You will obtain a sponsorship key from the sponsor, and use that key to get to level 1.
                        Once you have reached level 1, you will be able to create your own minting key and start earning rewards for helping secure the Qortal Blockchain.
                    </div>
                    <div>
                        <h3>Sponsorship</h3><br />
                        Your sponsor will issue you a ‘Sponsorship Key’ which you will use to add to your node, and begin minting (for no rewards until reaching level 1.)
                        Once you reach level 1, you create/assign your own ‘Minting Key’ and begin earning rewards. You have XXXX blocks remaining in your sponsorship period.
                        <br />
                        Simply reach out to a minter in Qortal who is high enough level to issue a sponsorship key, obtain that key, then come back here and input the key to begin your minting journey !
                    </div>
                   <mwc-button slot="primaryAction" dialogAction="cancel" class="red-button">Close</mwc-button>
                </mwc-dialog>

            </div>
        `}
    }

    firstUpdated() {
        const getAdminInfo = () => {
            parentEpml.request("apiCall", {url: `/admin/info`}).then((res) => {
                setTimeout(() => {this.adminInfo = res;}, 1);
            });
            setTimeout(getAdminInfo, 30000);
        };

        const getNodeInfo = () => {
            parentEpml.request("apiCall", {url: `/admin/status`}).then((res) => {
                this.nodeInfo = res;
                // Now look up the sample block
                getSampleBlock()
            });
            setTimeout(getNodeInfo, 30000);
        };

        const getSampleBlock = () => {
            let callBlock = parseFloat(this.nodeInfo.height) - 10000;
            parentEpml.request("apiCall", {url: `/blocks/byheight/${callBlock}`}).then((res) => {
                setTimeout(() => {this.sampleBlock = res;}, 1);
            });
        };

        const getAddressInfo = () => {
            parentEpml.request('apiCall', {url: `/addresses/${window.parent.reduxStore.getState().app.selectedAddress.address}`}).then((res) => {
                setTimeout(() => {this.addressInfo = res;}, 1);
            });
            setTimeout(getAddressInfo, 30000);
        };

        const getAddressLevel = () => {
            parentEpml.request('apiCall', {url: `/addresses/online/levels`}).then((res) => {
                setTimeout(() => {this.addressLevel = res;}, 1);
            });
            setTimeout(getAddressLevel, 30000);
        };

        let configLoaded = false;

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })
        });

        parentEpml.ready().then(() => {
            parentEpml.subscribe("config", async c => {
                if (!configLoaded) {
                    setTimeout(getAdminInfo, 1);
                    setTimeout(getNodeInfo, 1);
                    setTimeout(getAddressInfo, 1);
                    setTimeout(getAddressLevel, 1);
                    configLoaded = true;
                }
                this.config = JSON.parse(c);
            })
            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) this.clearSelection();
            })
        });

        parentEpml.imReady();
    }

    renderMintingPage() {
        if (this.addressInfo.error === 124) {
            return "false"
        } else {
            return "true"
        }
    }

    renderActivateHelp() {
        if (this.renderMintingPage() === "false") {
            return html `Activate Account Details <div class="level-blue">==></div> Not Activated<br><mwc-button class="red-button" @click=${() => this.shadowRoot.querySelector("#activateAccountDialog").show()}><mwc-icon class="help-icon">help_outline</mwc-icon>&nbsp;Press For Help</mwc-button>`;
        } else {
            return "No Details";
        }
    }
    _averageBlockTime() {
        let avgBlockString = (this.adminInfo.currentTimestamp - this.sampleBlock.timestamp).toString();
	let averageTimeString = ((avgBlockString / 1000) / 10000).toFixed(2);
	let averageBlockTimeString = (averageTimeString).toString();
        return "" + averageBlockTimeString;
    }

    _timeCalc() {
        let timeString = (this.adminInfo.currentTimestamp - this.sampleBlock.timestamp).toString();
	let averageString = ((timeString / 1000) / 10000).toFixed(2);
	let averageBlockDay = (86400 / averageString).toFixed(2);
	let averageBlockDayString = (averageBlockDay).toString();
        return "" + averageBlockDayString;
    }

    _dayReward() {
        let rewardString = (this._timeCalc() * this._blockReward()).toFixed(2);
	let rewardDayString = (rewardString).toString();
        return "" + rewardDayString ;
    }

    _mintingStatus() {
        if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === true) {
            this.cssMinting = "blue"
            return "Minting"
        } else if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === false) {
            this.cssMinting = "blue"
            return "Minting"
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === true) {
            this.cssMinting = "red"
            return `(Synchronizing... ${this.nodeInfo.syncPercent !== undefined ? this.nodeInfo.syncPercent + '%' : ''})`
        } else if (this.nodeInfo.isMintingPossible === false && this.nodeInfo.isSynchronizing === false) {
            this.cssMinting = "red"
            return "Not Minting"
        } else {
            return "No Status"
        }
    }

    renderMintingHelp() {
        if (this._mintingStatus() === "Not Minting") {
            return html `Minting Account Details <div class="level-blue">==></div> Not A Minter<br><mwc-button class="red-button" @click=${() => this.shadowRoot.querySelector("#becomeMinterDialog").show()}><mwc-icon class="help-icon">help_outline</mwc-icon>&nbsp;Press For Help</mwc-button>`;
        } else {
            return "Minting Account Details";
        }
    }

    _levelUpDays() {
        let countDays = ((this._blocksNeed() - (this.addressInfo.blocksMinted + this.addressInfo.blocksMintedAdjustment)) / this._timeCalc()).toFixed(2);
        let countString = (countDays).toString();
        return "" + countString;
    }

    _levelUpBlocks() {
        let countBlocksString = (this._blocksNeed() - (this.addressInfo.blocksMinted + this.addressInfo.blocksMintedAdjustment)).toString();
        return "" + countBlocksString;
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
            return "Tier 0 (Level 0)"
        } else if (this.addressInfo.level === 1) {
            return "Tier 1 (Level 1 + 2)"
        } else if (this.addressInfo.level === 2) {
            return "Tier 1 (Level 1 + 2)"
        } else if (this.addressInfo.level === 3) {
            return "Tier 2 (Level 3 + 4)"
        } else if (this.addressInfo.level === 4) {
            return "Tier 2 (Level 3 + 4)"
        } else if (this.addressInfo.level === 5) {
            return "Tier 3 (Level 5 + 6)"
        } else if (this.addressInfo.level === 6) {
            return "Tier 3 (Level 5 + 6)"
        } else if (this.addressInfo.level === 7) {
            return "Tier 4 (Level 7 + 8)"
        } else if (this.addressInfo.level === 8) {
            return "Tier 4 (Level 7 + 8)"
        } else if (this.addressInfo.level === 9) {
            return "Tier 5 (Level 9 + 10)"
        } else if (this.addressInfo.level === 10) {
            return "Tier 5 (Level 9 + 10)"
        }
    }

    _tierPercent() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            return "5"
        } else if (this.addressInfo.level === 2) {
            return "5"
        } else if (this.addressInfo.level === 3) {
            return "10"
        } else if (this.addressInfo.level === 4) {
            return "10"
        } else if (this.addressInfo.level === 5) {
            return "15"
        } else if (this.addressInfo.level === 6) {
            return "15"
        } else if (this.addressInfo.level === 7) {
            return "20"
        } else if (this.addressInfo.level === 8) {
            return "20"
        } else if (this.addressInfo.level === 9) {
            return "25"
        } else if (this.addressInfo.level === 10) {
            return "25"
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
            return "0"
        } else if (this.addressInfo.level === 1) {
            let countTier10 = (this.addressLevel[0].count + this.addressLevel[1].count).toString();
            return "" + countTier10;
        } else if (this.addressInfo.level === 2) {
            let countTier11 = (this.addressLevel[0].count + this.addressLevel[1].count).toString();
            return "" + countTier11;
        } else if (this.addressInfo.level === 3) {
            let countTier20 = (this.addressLevel[2].count + this.addressLevel[3].count).toString();
            return "" + countTier20;
        } else if (this.addressInfo.level === 4) {
            let countTier21 = (this.addressLevel[2].count + this.addressLevel[3].count).toString();
            return "" + countTier21;
        } else if (this.addressInfo.level === 5) {
            let countTier30 = (this.addressLevel[4].count + this.addressLevel[5].count).toString();
            return "" + countTier30;
        } else if (this.addressInfo.level === 6) {
            let countTier31 = (this.addressLevel[4].count + this.addressLevel[5].count).toString();
            return "" + countTier31;
        } else if (this.addressInfo.level === 10) {
            let countTier101 = (this.addressLevel[6].count).toString();
            return "" + countTier101;
        }
    }

    _countReward() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            let countReward10 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[0].count + this.addressLevel[1].count)).toFixed(8);
            let countReward11 = (countReward10).toString();
            return "" + countReward11;
        } else if (this.addressInfo.level === 2) {
            let countReward20 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[0].count + this.addressLevel[1].count)).toFixed(8);
            let countReward21 = (countReward20).toString();
            return "" + countReward21;
        } else if (this.addressInfo.level === 3) {
            let countReward30 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[2].count + this.addressLevel[3].count)).toFixed(8);
            let countReward31 = (countReward30).toString();
            return "" + countReward31;
        } else if (this.addressInfo.level === 4) {
            let countReward40 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[2].count + this.addressLevel[3].count)).toFixed(8);
            let countReward41 = (countReward40).toString();
            return "" + countReward41;
        } else if (this.addressInfo.level === 5) {
            let countReward50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[4].count + this.addressLevel[5].count)).toFixed(8);
            let countReward51 = (countReward50).toString();
            return "" + countReward51;
        } else if (this.addressInfo.level === 6) {
            let countReward60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[4].count + this.addressLevel[5].count)).toFixed(8);
            let countReward61 = (countReward60).toString();
            return "" + countReward61;
        } else if (this.addressInfo.level === 10) {
            let countReward100 = ((this._blockReward() / 100 * this._tierPercent()) / this.addressLevel[6].count).toFixed(8);
            let countReward101 = (countReward100).toString();
            return "" + countReward101;
        }
    }

    _countRewardDay() {
        if (this.addressInfo.level === 0) {
            return "0"
        } else if (this.addressInfo.level === 1) {
            let countRewardDay10 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[0].count + this.addressLevel[1].count) * this._timeCalc()).toFixed(8);
            let countRewardDay11 = (countRewardDay10).toString();
            return "" + countRewardDay11;
        } else if (this.addressInfo.level === 2) {
            let countRewardDay20 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[0].count + this.addressLevel[1].count) * this._timeCalc()).toFixed(8);
            let countRewardDay21 = (countRewardDay20).toString();
            return "" + countRewardDay21;
        } else if (this.addressInfo.level === 3) {
            let countRewardDay30 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[2].count + this.addressLevel[3].count) * this._timeCalc()).toFixed(8);
            let countRewardDay31 = (countRewardDay30).toString();
            return "" + countRewardDay31;
        } else if (this.addressInfo.level === 4) {
            let countRewardDay40 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[2].count + this.addressLevel[3].count) * this._timeCalc()).toFixed(8);
            let countRewardDay41 = (countRewardDay40).toString();
            return "" + countRewardDay41;
        } else if (this.addressInfo.level === 5) {
            let countRewardDay50 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[4].count + this.addressLevel[5].count) * this._timeCalc()).toFixed(8);
            let countRewardDay51 = (countRewardDay50).toString();
            return "" + countRewardDay51;
        } else if (this.addressInfo.level === 6) {
            let countRewardDay60 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[4].count + this.addressLevel[5].count) * this._timeCalc()).toFixed(8);
            let countRewardDay61 = (countRewardDay60).toString();
            return "" + countRewardDay61;
        } else if (this.addressInfo.level === 10) {
            let countRewardDay100 = ((this._blockReward() / 100 * this._tierPercent()) / (this.addressLevel[6].count) * this._timeCalc()).toFixed(8);
            let countRewardDay101 = (countRewardDay100).toString();
            return "" + countRewardDay101;
        }
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }

    isEmptyArray(arr) {
        if (!arr) return true;
        return arr.length === 0;
    }
}

window.customElements.define('minting-info', MintingInfo)
