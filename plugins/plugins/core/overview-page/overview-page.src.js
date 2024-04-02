import {css, html, LitElement} from 'lit'
import {Epml} from '../../../epml.js'
import {get, registerTranslateConfig, translate, use} from '../../../../core/translate'
import {overviewStyle} from './overview-page-css.js'
import {asyncReplace} from 'lit/directives/async-replace.js'
import isElectron from 'is-electron'

import "@material/mwc-button"
import '@material/mwc-dialog'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/button'

registerTranslateConfig({
    loader: lang => fetch(`/language/${lang}.json`).then(res => res.json())
})

async function* countDown(count, callback) {
	while (count > 0) {
		yield count--
		await new Promise((r) => setTimeout(r, 1000))
		if (count === 0) {
			callback()
		}
	}
}

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

class OverviewPage extends LitElement {
    static get properties() {
        return {
            theme: { type: String, reflect: true },
            nodeConfig: { type: Object },
            accountInfo: { type: Object },
            nodeInfo: { type: Array },
            coreInfo: { type: Array },
            imageUrl: { type: String },
            myBalance: { type: Number },
            listAccounts: { type: Array },
            check1: { type: Boolean },
            check2: { type: Boolean }
        }
    }

    static styles = [overviewStyle]

    constructor() {
        super()
        this.theme = localStorage.getItem('qortalTheme') ? localStorage.getItem('qortalTheme') : 'light'
        this.nodeConfig = {}
        this.accountInfo = {
            names: [],
            addressInfo: {}
        }
        this.nodeInfo = []
        this.coreInfo = []
        this.imageUrl = ''
        this.myBalance = 0
        this.listAccounts = []
        this.check1 = false
        this.check2 = false
    }

    render() {
        return html`
            <div class="main-content">
                <div class="container mt-7">
                    <div class="row">
                        <div class="col-xl-8 m-auto order-xl-2 mb-5 mb-xl-0">
                            <div class="card card-profile shadow">
                                <div class="row justify-content-center">
                                    <div class="col-lg-3 order-lg-2">
                                        <div class="card-profile-image">
                                            ${this.getAvatar()}
                                        </div>
                                    </div>
                                </div>
                                <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                                    <div class="d-flex justify-content-between">
                                        <span class="btn btn-sm btn-info mr-4">${translate("walletprofile.minterlevel")} ${this.accountInfo.addressInfo.level}</span>
                                        ${this.renderMintingStatus()}
                                    </div>
                                </div>
                                <div class="card-body pt-0 pt-md-4">
                                    <div class="text-center pt-0 mt-md-3">
                                        <h2>${this.accountInfo.names.length !== 0 ? this.accountInfo.names[0].name : ''}</h2>
                                        <div class="h3 font-weight-400">
                                            ${this.accountInfo.addressInfo.address}
                                        </div>
                                        <div class="h3 font-weight-400">
                                            ${translate("explorerpage.exp2")}: <span style="color: #03a9f4">${this.myBalance}</span> QORT
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="card-profile-stats d-flex justify-content-center">
                                                <div>
                                                    <span class="heading">${this.accountInfo.addressInfo.blocksMinted + this.accountInfo.addressInfo.blocksMintedAdjustment}</span>
                                                    <span class="description">${translate("walletprofile.blocksminted")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <hr class="my-4" style="color: var(--black)">
                                        <h2>${translate("walletprofile.wp3")}</h2>
                                        <div class="row">
                                            <div class="col">
                                                <div class="card-profile-stats d-flex justify-content-center">
                                                    <div>
                                                        <span class="heading">${this.coreInfo.buildVersion ? this.coreInfo.buildVersion : ''}</span>
                                                        <span class="description">${translate("appinfo.coreversion")}</span>
                                                    </div>
                                                    <div>
                                                        <span class="heading">${this.nodeInfo.height ? this.nodeInfo.height : ''}</span>
                                                        <span class="description">${translate("appinfo.blockheight")}</span>
                                                    </div>
                                                    <div>
                                                        <span class="heading">${this.nodeInfo.numberOfConnections ? this.nodeInfo.numberOfConnections : ''}</span>
                                                        <span class="description">${translate("appinfo.peers")}</span>
                                                    </div>
                                                    <div>
                                                        <span class="heading"><span class="${this.cssStatus2}">${this.renderSyncStatus()}</span></span>
                                                        <span class="description">${translate("walletprofile.wp5")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="h5 float-right opacity06">
                                        ${translate("appinfo.uiversion")}: <span style="color: #03a9f4">${this.nodeConfig.version ? this.nodeConfig.version : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    async firstUpdated() {
        this.changeTheme()
        this.changeLanguage()

        this.nodeConfig = window.parent.reduxStore.getState().app.nodeConfig
        this.accountInfo = window.parent.reduxStore.getState().app.accountInfo

        await this.getNodeInfo()
        await this.getCoreInfo()
        await this.getBalanceInfo()
        await this.getMintingKeysList()

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

        setInterval(() => {
            this.refreshItems()
        }, 60000)

        setInterval(() => {
            this.getAvatar()
        }, 180000)

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

    renderMyErrorMsg1() {
        return html`${translate("startminting.smchange1")}`
    }

    async refreshItems() {
        this.nodeConfig = window.parent.reduxStore.getState().app.nodeConfig
        this.accountInfo = window.parent.reduxStore.getState().app.accountInfo
        await this.getNodeInfo()
        await this.getCoreInfo()
        await this.getBalanceInfo()
        await this.getMintingKeysList()
    }

    async getMintingKeysList() {
        this.check1 = false
        this.check2 = false
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const nodeStatus = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
        const statusUrl = `${nodeStatus}/admin/mintingaccounts`

        try {
            const res = await fetch(statusUrl)
			this.listAccounts = await res.json()

            const addressInfo = window.parent.reduxStore.getState().app.accountInfo.addressInfo
            const address = window.parent.reduxStore.getState().app.selectedAddress.address
            const findMyMintingAccount = this.listAccounts.find((myKey) => myKey.mintingAccount === address)
            const findMyMintingRecipient = this.listAccounts.find((myKey) => myKey.recipientAccount === address)
            const findRemovedSponsorsKey = this.listAccounts.filter((my) => my.address)

            this.check1 = findMyMintingAccount !== undefined;

            this.check2 = findMyMintingRecipient !== undefined;

            if (findRemovedSponsorsKey.length > 0) {
                this.removeBlankKey(findRemovedSponsorsKey.publicKey)
            } else {
            }
        } catch (error) {
            this.errorMsg = this.renderMyErrorMsg1()
        }
    }

    removeBlankKey(myPublicKey) {
        parentEpml.request("apiCall", {
            url: `/admin/mintingaccounts?apiKey=${this.getApiKey()}`,
            method: "DELETE",
            body: myPublicKey,
        }).then((res) => {
            if (res === true) {
                console.log('REMOVED BLANK KEY')
            } else {
            }
        })
    }

    renderMintingStatus() {
        const addressInfo = window.parent.reduxStore.getState().app.accountInfo.addressInfo
        const myMintingKey = addressInfo?.error !== 124 && +addressInfo?.level > 0

        if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === true && this.check1 === true && this.check2 === true && addressInfo.level > 0) {
            this.cssStatus = ''
            return html`<span class="btn btn-sm btn-info float-right">${translate("walletprofile.wp1")}</span>`
        } else if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === false && this.check1 === true && this.check2 === true && addressInfo.level > 0) {
            this.cssStatus = ''
            return html`<span class="btn btn-sm btn-info float-right">${translate("walletprofile.wp1")}</span>`
        } else if (this.nodeInfo.isMintingPossible === true && this.nodeInfo.isSynchronizing === false && this.check1 === false && this.check2 === true && addressInfo.level == 0 && addressInfo.blocksMinted < 7200) {
            this.cssStatus = ''
            return html`<span class="btn btn-sm btn-info float-right">${translate("becomeMinterPage.bchange12")}</span>`
        } else if (this.check1 === false && this.check2 === false && myMintingKey === true) {
            return html`<span class="float-right"><start-minting-now></start-minting-now></span>`
        } else if (myMintingKey === false) {
            return html`<span class="float-right"><start-minting-now></start-minting-now></span>`
        }
    }

    renderSyncStatus() {
        if (this.nodeInfo.isSynchronizing === true) {
            this.cssStatus2 = 'red'
            return html`${translate("appinfo.synchronizing")}... ${this.nodeInfo.syncPercent !== undefined ? this.nodeInfo.syncPercent + '%' : ''}`
        } else if (this.nodeInfo.isSynchronizing === false) {
            this.cssStatus2 = ''
            return html`${translate("walletprofile.wp4")}`
        }
    }

    getAvatar() {
        if (this.accountInfo.names.length === 0) {
            return html`<img class="rounded-circle" src="/img/incognito.png">`
        } else {
            const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
            const avatarUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
            const url = `${avatarUrl}/arbitrary/THUMBNAIL/${this.accountInfo.names[0].name}/qortal_avatar?async=true}`
            return html`<img class="rounded-circle" src="${url}" onerror="this.src='/img/incognito.png';" />`
        }
    }

    async getNodeInfo() {
        const infoNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const infoNodeUrl = infoNode.protocol + '://' + infoNode.domain + ':' + infoNode.port
        const nodeUrl = `${infoNodeUrl}/admin/status`
        await fetch(nodeUrl).then(response => {
            return response.json()
        })
        .then(data => {
            this.nodeInfo = data
        })
        .catch(err => {
            console.error('Request failed', err)
        })
    }

    async getCoreInfo() {
        const infoCore = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const infoCoreUrl = infoCore.protocol + '://' + infoCore.domain + ':' + infoCore.port
        const coreUrl = `${infoCoreUrl}/admin/info`
        await fetch(coreUrl).then(response => {
            return response.json()
        })
        .then(data => {
            this.coreInfo = data
        })
        .catch(err => {
        })
    }

    async getBalanceInfo() {
        const infoBalance = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
        const infoBalanceUrl = infoBalance.protocol + '://' + infoBalance.domain + ':' + infoBalance.port
        const balanceUrl = `${infoBalanceUrl}/addresses/balance/${this.accountInfo.addressInfo.address}`
        await fetch(balanceUrl).then(response => {
            return response.json()
        })
        .then(data => {
            this.myBalance = data
        })
        .catch(err => {
        })
    }

    getApiKey() {
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		return myNode.apiKey
    }
}
window.customElements.define('overview-page', OverviewPage)

class StartMintingNow extends LitElement {
	static get properties() {
		return {
			mintingAccountData: { type: Array },
			errorMsg: { type: String },
			openDialogRewardShare: { type: Boolean },
			status: { type: Number },
			timer: { type: Number },
			privateRewardShareKey: { type: String }
		}
	}

	static get styles() {
		return [css`
			p, h1 {
				color: var(--black)
			}
			.dialogCustom {
				position: fixed;
    				z-index: 10000;
    				display: flex;
    				justify-content: center;
    				flex-direction: column;
    				align-items: center;
    				top: 0px;
    				bottom: 0px;
    				left: 0px;
    				width: 100vw;
			}
			.dialogCustomInner {
				width: 300px;
				min-height: 400px;
				background-color: var(--white);
				box-shadow: var(--mdc-dialog-box-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
				padding: 20px 24px;
				border-radius: 4px;
			}
			.dialogCustomInner ul {
				padding-left: 0px
			}
			.dialogCustomInner li {
				margin-bottom: 10px;
			}
			.start-minting-wrapper {
				z-index: 10;
			}
			.dialog-header h1 {
				font-size: 18px;
			}
			.row {
				display: flex;
				width: 100%;
				align-items: center;
			}
			.modalFooter {
				width: 100%;
				display: flex;
				justify-content: flex-end;
			}
			.hide {
				visibility: hidden
			}
			.inactiveText {
				opacity: .60
			}
			.column {
				display: flex;
				flex-direction: column;
				width: 100%;
			}
			.smallLoading,
			.smallLoading:after {
				border-radius: 50%;
				width: 2px;
				height: 2px;
			}
			.smallLoading {
				border-width: 0.6em;
				border-style: solid;
				border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
				rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
				font-size: 10px;
				position: relative;
				text-indent: -9999em;
				transform: translateZ(0px);
				animation: 1.1s linear 0s infinite normal none running loadingAnimation;
			}
			@-webkit-keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			@keyframes loadingAnimation {
				0% {
					-webkit-transform: rotate(0deg);
					transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
					transform: rotate(360deg);
				}
			}
			.word-break {
				word-break:break-all;
			}
			.dialog-container {
				width: 300px;
				min-height: 300px;
				max-height: 75vh;
				padding: 5px;
				display: flex;
				align-items: flex-start;
				flex-direction: column;
			}
			.between {
				justify-content: space-between;
			}
			.no-width {
				width: auto
			}
			.between p {
				margin: 0;
				padding: 0;
				color: var(--black);
			}
			.marginLoader {
				margin-left: 10px;
			}
			.marginRight {
				margin-right: 10px;
			}
			.warning{
				display: flex;
				flex-grow: 1
			}
			.message-error {
				color: var(--error);
			}
		`]
	}

	constructor() {
		super()
		this.mintingAccountData = []
		this.errorMsg = ''
		this.openDialogRewardShare = false
		this.status = 0
		this.privateRewardShareKey = ""
	}

	render() {
		return html`${this.renderStartMintingButton()}`
	}

	firstUpdated() {
		this.getMintingAcccounts()
	}

	renderErrorMsg1() {
		return html`${translate("startminting.smchange1")}`
	}

	renderErrorMsg2() {
		return html`${translate("startminting.smchange2")}`
	}

	renderErrorMsg3() {
		return html`${translate("startminting.smchange3")}`
	}

	renderErrorMsg4() {
		return html`${translate("startminting.smchange4")}`
	}

	async getMintingAcccounts() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const url = `${nodeUrl}/admin/mintingaccounts`
		try {
			const res = await fetch(url)
			this.mintingAccountData = await res.json()
		} catch (error) {
			this.errorMsg = this.renderErrorMsg1()
		}
	}

	async changeStatus(value) {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		this.status = value
		const address = window.parent.reduxStore.getState().app?.selectedAddress?.address

		const findMintingAccountFromOtherUser = this.mintingAccountData.find((ma) => ma.recipientAccount === address && ma.mintingAccount !== address)

		const removeMintingAccount = async (publicKey) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`
			return await fetch(url, {
				method: 'DELETE',
				body: publicKey,
			})
		}

		const addMintingAccount = async (sponsorshipKeyValue) => {
			const url = `${nodeUrl}/admin/mintingaccounts?apiKey=${myNode.apiKey}`
			return await fetch(url, {
				method: 'POST',
				body: sponsorshipKeyValue,
			})
		}

		try {
			if (
				findMintingAccountFromOtherUser &&
				findMintingAccountFromOtherUser?.publicKey[0]
			) {
				await removeMintingAccount(
					findMintingAccountFromOtherUser?.publicKey[0]
				)
			}
		} catch (error) {
			this.errorMsg = this.renderErrorMsg2()
			return
		}

		try {
			await addMintingAccount(this.privateRewardShareKey)
			let snack1 = get('becomeMinterPage.bchange19')
			parentEpml.request('showSnackBar', `${snack1}`)
			this.status = 5
			await this.getMintingAcccounts()
		} catch (error) {
			this.errorMsg = this.renderErrorMsg3()

		}
	}

	async confirmRelationship() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port

		let interval = null
		let stop = false
		this.status = 2
		const getAnswer = async () => {
			const rewardShares = async (minterAddr) => {
				const url = `${nodeUrl}/addresses/rewardshares?minters=${minterAddr}&recipients=${minterAddr}`
				const res = await fetch(url)
				return await res.json()
			}

			if (!stop) {
				stop = true
				try {
					const address = window.parent.reduxStore.getState().app?.selectedAddress?.address
					const myRewardShareArray = await rewardShares(address)
					if (myRewardShareArray.length > 0) {
						clearInterval(interval)
						this.status = 3
						this.timer = countDown(180, () => this.changeStatus(4))
					}

				} catch (error) {
				}
				stop = false
			}
		}
		interval = setInterval(getAnswer, 5000)
	}

	renderStartMintingButton() {
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = myNode.protocol + '://' + myNode.domain + ':' + myNode.port
		const mintingAccountData = this.mintingAccountData
		const addressInfo = window.parent.reduxStore.getState().app.accountInfo.addressInfo
		const address = window.parent.reduxStore.getState().app.selectedAddress.address
		const nonce = window.parent.reduxStore.getState().app.selectedAddress.nonce
		const publicAddress = window.parent.reduxStore.getState().app.selectedAddress.base58PublicKey
		const findMintingAccount = mintingAccountData.find((ma) => ma.mintingAccount === address)
		const isMinterButKeyMintingKeyNotAssigned = addressInfo.error !== 124 && addressInfo.level >= 1 && !findMintingAccount

		const makeTransactionRequest = async (lastRef) => {
			let mylastRef = lastRef
			let rewarddialog1 = get('transactions.rewarddialog1')
			let rewarddialog2 = get('transactions.rewarddialog2')
			let rewarddialog3 = get('transactions.rewarddialog3')
			let rewarddialog4 = get('transactions.rewarddialog4')

			return await parentEpml.request('transaction', {
				type: 38,
				nonce: nonce,
				params: {
					recipientPublicKey: publicAddress,
					percentageShare: 0,
					lastReference: mylastRef,
					rewarddialog1: rewarddialog1,
					rewarddialog2: rewarddialog2,
					rewarddialog3: rewarddialog3,
					rewarddialog4: rewarddialog4
				},
				disableModal: true
			})
		}

		const getTxnRequestResponse = (txnResponse) => {
			let err6string = get('rewardsharepage.rchange21')
			if (txnResponse.extraData.rewardSharePrivateKey && (txnResponse.data.message.includes('multiple') || txnResponse.data.message.includes('SELF_SHARE_EXISTS'))) {
				return err6string
			}
			if (txnResponse.success === false && txnResponse.message) {
				throw (txnResponse)
			} else if (txnResponse.success === true && !txnResponse.data.error) {
				return err6string
			} else {
				throw (txnResponse)
			}
		}

		const createSponsorshipKey = async () => {
			this.status = 1
			let lastRef = await getLastRef()

			let myTransaction = await makeTransactionRequest(lastRef)

			getTxnRequestResponse(myTransaction)
			return myTransaction.extraData.rewardSharePrivateKey
		}

		const getLastRef = async () => {
			return await parentEpml.request('apiCall', {
				type: 'api',
				url: `/addresses/lastreference/${address}`
			})
		}

		const startMinting = async () => {
			this.openDialogRewardShare = true
			this.errorMsg = ''

			const findMintingAccountsFromUser = this.mintingAccountData.filter((ma) => ma.recipientAccount === address && ma.mintingAccount === address)

			if(findMintingAccountsFromUser.length > 2) {
				this.errorMsg = translate("startminting.smchange10")
				return
			}

			try {
				this.privateRewardShareKey = await createSponsorshipKey()
				await this.confirmRelationship(publicAddress)
			} catch (error) {
				this.errorMsg = error.data.message || this.renderErrorMsg4()

			}
		}

		return html`
			${isMinterButKeyMintingKeyNotAssigned ? html`
				<div class="start-minting-wrapper">
					<my-button label="${translate('becomeMinterPage.bchange18')}"
						?isLoading=${false}
						.onClick=${async () => {
							await startMinting()
							if (this.errorMsg) {
								parentEpml.request('showSnackBar', `${this.errorMsg}`)
							}
						}}
					>
					</my-button>
				</div>

				<!-- Dialog for tracking the progress of starting minting -->

				${this.openDialogRewardShare ? html`
					<div class="dialogCustom">
						<div class="dialogCustomInner">
                    					<div class="dialog-header">
								<div class="row">
								<h1>In progress</h1>
								<div class=${`smallLoading marginLoader ${this.status > 3 && 'hide'}`}></div>
							</div>
							<hr />
						</div>
						<div class="dialog-container">
							<ul>
								<li class="row between">
									<p>
										1. ${translate("startminting.smchange5")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 1 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 2 && 'inactiveText'}`}>
									<p>
										2. ${translate("startminting.smchange6")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 2 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 3 && 'inactiveText'}`}>
									<p>
										3. ${translate("startminting.smchange7")}
									</p>
									<div class="row no-width">
										<div class=${`smallLoading marginLoader marginRight ${this.status !== 3 && 'hide'}`} ></div> <p>${asyncReplace(this.timer)}</p>
									</div>
								</li>

								<li class=${`row between ${this.status < 4 && 'inactiveText'}`}>
									<p>
										4. ${translate("startminting.smchange8")}
									</p>
									<div class=${`smallLoading marginLoader ${this.status !== 4 && 'hide'}`}></div>
								</li>

								<li class=${`row between ${this.status < 5 && 'inactiveText'}`}>
									<p>
										5. ${translate("startminting.smchange9")}
									</p>
								</li>
							</ul>
							<div class="warning column">
								<p>
									Warning: do not close the Qortal UI until completion!
								</p>
								<p class="message-error">${this.errorMsg}</p>
							</div>
						</div>
						<div class="modalFooter">
							${this.errorMsg || this.status === 5 ? html`
								<mwc-button
									slot="primaryAction"
									@click=${() => {
										this.openDialogRewardShare = false
										this.errorMsg = ''
									}}
									class="red"
								>
									${translate("general.close")}
								</mwc-button>
							` : '' }
						</div>
					</div>
				` : ""}
			` : html`
				<div class="start-minting-wrapper">
					<a href="../become-minter/index.html">
						<my-button label="${translate('tabmenu.tm2')}"></my-button>
					</a>
				</div>
			`}
		`
	}
}
window.customElements.define('start-minting-now', StartMintingNow)

class MyButton extends LitElement {
	static properties = {
		onClick: { type: Function },
		isLoading: { type: Boolean },
		label: { type: String }
	}

	static styles = css`
		vaadin-button {
			font-size: 1rem;
			font-weight: 600;
			height: 35px;
			margin: 0;
			cursor: pointer;
			min-width: 80px;
			min-height: 35px;
			background-color: #03a9f4;
			color: white;
		}

		vaadin-button:hover {
			opacity: 0.9;
		}
	`

	constructor() {
		super()
		this.onClick = () => {}
		this.isLoading = false
		this.label = ''
	}

	render() {
		return html`
			<vaadin-button
				?disabled="${this.isLoading}"
				@click="${this.onClick}"
			>
				${this.isLoading === false
					? html`${this.label}`
					: html`<paper-spinner-lite active></paper-spinner-lite>`}
			</vaadin-button>
		`
	}
}
customElements.define('my-button', MyButton)
