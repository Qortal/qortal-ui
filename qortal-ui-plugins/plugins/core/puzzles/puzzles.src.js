import { LitElement, html, css } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'

// Not sure if these are imported in the proper way:
import nacl from '../../../../qortal-ui-crypto/api/deps/nacl-fast.js'
import Base58 from '../../../../qortal-ui-crypto/api/deps/Base58.js'
import publicKeyToAddress from '../../../../qortal-ui-crypto/api/wallet/publicKeyToAddress.js'
import '@material/mwc-icon'
import '@material/mwc-button'
import '@material/mwc-textfield'
import '@material/mwc-dialog'
import '@material/mwc-slider'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@vaadin/grid'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

const DEFAULT_FEE = 0.001
const PAYMENT_TX_TYPE = 2

class Puzzles extends LitElement {
    static get properties() {
        return {
            loading: { type: Boolean },
            invalid: { type: Boolean },
            puzzles: { type: Array },
            solved: { type: Object },
            selectedAddress: { type: Object },
            selectedPuzzle: { type: Object },
            error: { type: Boolean },
            message: { type: String }
        }
    }

    static get styles() {
        return css`
		* {
			--mdc-theme-primary: rgb(3, 169, 244);
			--mdc-theme-secondary: var(--mdc-theme-primary);
			--paper-input-container-focus-color: var(--mdc-theme-primary);
                        --lumo-primary-text-color: rgb(0, 167, 245);
                        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
                        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
                        --lumo-primary-color: hsl(199, 100%, 48%);
		}
		#puzzle-page {
			background: #fff;
			padding: 12px 24px;
		}

		h2 {
			margin:0;
		}

		h2, h3, h4, h5 {
			color:#333;
			font-weight: 400;
		}

		.red {
			--mdc-theme-primary: #F44336;
		}

		.clue {
			font-family: "Lucida Console", "Courier New", monospace;
			font-size: smaller;
		}
	`
    }

    constructor() {
        super()
        this.loading = false
        this.invalid = true
        this.puzzles = []
        this.solved = {}
        this.selectedAddress = {}
        this.selectedPuzzle = {}
        this.error = false
        this.message = ''
    }

    render() {
        return html`
			<div id="puzzle-page">
				<div style="min-height:48px; display: flex; padding-bottom: 6px;">
					<h3 style="margin: 0; flex: 1; padding-top: 8px; display: inline;">Puzzles</h3>
				</div>
                                <div class="divCard">
				    <vaadin-grid theme="compact, wrap-cell-content" id="puzzlesGrid" ?hidden="${this.isEmptyArray(this.puzzles)}" .items="${this.puzzles}" aria-label="Puzzles" all-rows-visible>
				        <vaadin-grid-column width="20em" header="Reward" .renderer=${(root, column, data) => {
                            			if (data.item.isSolved) {
                                			render(html`<span style="font-size: smaller;">SOLVED by<br>${data.item.winner}</span>`, root)
                            			} else {
                                			render(html`<span>${data.item.reward} QORT</span>`, root)
                            			}
                        		}}>
                                        </vaadin-grid-column>
					<vaadin-grid-column width="16em" path="name"></vaadin-grid-column>
					<vaadin-grid-column width="40%" path="description"></vaadin-grid-column>
					<vaadin-grid-column width="24em" header="Clue / Answer" .renderer=${(root, column, data) => {
							render(html`<span class="clue">${data.item.clue}</span>`, root)
						}}></vaadin-grid-column>
					<vaadin-grid-column width="10em" header="Action" .renderer=${(root, column, data) => {
                        			if (data.item.isSolved) {
                            				render(html``, root)
                        			} else {
                            				render(html`<mwc-button @click=${() => this.guessPuzzle(data.item)}><mwc-icon>queue</mwc-icon>Guess</mwc-button>`, root)
                        			}
                    			}}></vaadin-grid-column>
				    </vaadin-grid>

				    <mwc-dialog id="puzzleGuessDialog" scrimClickAction="${this.loading ? '' : 'close'}">
					<div>Enter your guess to solve this puzzle and win ${this.selectedPuzzle.reward} QORT:</div>
					<br>
					<div id="puzzleGuessName">Name: ${this.selectedPuzzle.name}</div>
					<div id="puzzleGuessDescription">Description: ${this.selectedPuzzle.description}</div>
					<div id="puzzleGuessClue" ?hidden=${!this.selectedPuzzle.clue}>Clue: <span class="clue">${this.selectedPuzzle.clue}</span></div>
					<br>
					<div id="puzzleGuessInputHint" style="font-size: smaller;">Your guess needs to be 43 or 44 characters and <b>not</b> include 0 (zero), I (upper i), O (upper o) or l (lower L).</div>
					<mwc-textfield style="width:100%" ?disabled="${this.loading}" label="Your Guess" id="puzzleGuess" pattern="[1-9A-HJ-NP-Za-km-z]{43,44}" style="font-family: monospace;" maxLength="44" charCounter="true" autoValidate="true"></mwc-textfield>
					<div style="text-align:right; height:36px;">
						<span ?hidden="${!this.loading}">
							<!-- loading message -->
							Checking your guess... &nbsp;
							<paper-spinner-lite
								style="margin-top:12px;"
								?active="${this.loading}"
								alt="Checking puzzle guess">
							</paper-spinner-lite>
						</span>
						<span ?hidden=${this.message === ''} style="${this.error ? 'color:red;' : ''}">
							${this.message}
						</span>
					</div>

					<mwc-button
						?disabled="${this.loading || this.invalid}"
						slot="primaryAction"
						@click=${this.submitPuzzleGuess}>
						Submit
					</mwc-button>
					<mwc-button
						?disabled="${this.loading}"
						slot="secondaryAction"
						dialogAction="cancel"
						class="red">
						Close
					</mwc-button>
				</mwc-dialog>
			</div>
		`
    }

    firstUpdated() {
        window.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            this._textMenu(event)
        });

        window.addEventListener("click", () => {
            parentEpml.request('closeCopyTextMenu', null)
        });

        window.onkeyup = (e) => {
            if (e.keyCode === 27) {
                parentEpml.request('closeCopyTextMenu', null)
            }
        }

        const textBox = this.shadowRoot.getElementById("puzzleGuess")

        // keep track of input validity so we can enabled/disable submit button
        textBox.validityTransform = (newValue, nativeValidity) => {
            this.invalid = !nativeValidity.valid
            return nativeValidity
        }

        const getPuzzleGroupMembers = async () => {
            return await parentEpml.request('apiCall', {
                url: `/groups/members/165`
            })
        }

        const getBalance = async (address) => {
            return await parentEpml.request('apiCall', {
                url: `/addresses/balance/${address}`
            })
        }

        const getName = async (memberAddress) => {
            let _names = await parentEpml.request('apiCall', {
                url: `/names/address/${memberAddress}`
            })

            if (_names.length === 0) return "";

            return _names[0].name
        }

        const getNameInfo = async (name) => {
            // We have to explicitly encode '#' to stop them being interpreted as in-page references
            name = name.replaceAll('#', '%23')

            return await parentEpml.request('apiCall', {
                url: `/names/${name}`
            })
        }

        const getFirstOutgoingPayment = async (sender) => {
            let _payments = await parentEpml.request('apiCall', {
                url: `/transactions/search?confirmationStatus=CONFIRMED&limit=20&txType=PAYMENT&address=${sender}`
            })

            return _payments.find(payment => payment.creatorAddress === sender)
        }

        const updatePuzzles = async () => {
            let _puzzleGroupMembers = await getPuzzleGroupMembers()

            let _puzzles = []

            await Promise.all(_puzzleGroupMembers.members
                .sort((a, b) => b.joined - a.joined)
                .map(async (member) => {
                    let _puzzleAddress = member.member

                    if (member.isAdmin) return

                    // Already solved? No need to refresh info
                    if (this.solved[_puzzleAddress]) {
                        _puzzles.push(this.solved[_puzzleAddress])
                        return
                    }

                    let _name = await getName(_puzzleAddress)
                    // No name???
                    if (_name === "") return

                    let _reward = await getBalance(_puzzleAddress)
                    let _isSolved = _reward < 1.0;
                    let _nameInfo = await getNameInfo(_name)

                    let _nameData = JSON.parse(_nameInfo.data)

                    let _puzzle = {
                        reward: _reward,
                        address: _puzzleAddress,
                        name: _name,
                        description: _nameData.description,
                        isSolved: _isSolved
                    }

                    if (_nameData.clue)
                        _puzzle.clue = _nameData.clue;

                    if (_isSolved) {
                        // Info on winner
                        let _payment = await getFirstOutgoingPayment(_puzzleAddress)
                        _puzzle.winner = _payment.recipient
                        // Does winner have a name?
                        let _winnerName = await getName(_puzzle.winner)
                        if (_winnerName) _puzzle.winner = _winnerName
                        // Add to 'solved' map to prevent info refresh as it'll never change
                        this.solved[_puzzleAddress] = _puzzle
                    }

                    _puzzles.push(_puzzle);
                }))

            this.puzzles = _puzzles;

            setTimeout(updatePuzzles, 20000)
        }

        let configLoaded = false

        parentEpml.ready().then(() => {
            parentEpml.subscribe('selected_address', async selectedAddress => {
                this.selectedAddress = {}
                selectedAddress = JSON.parse(selectedAddress)
                if (!selectedAddress || Object.entries(selectedAddress).length === 0) return
                this.selectedAddress = selectedAddress
            })

            parentEpml.subscribe('config', c => {
                if (!configLoaded) {
                    setTimeout(updatePuzzles, 1)
                    configLoaded = true
                }
                this.config = JSON.parse(c)
            })

            parentEpml.subscribe('copy_menu_switch', async value => {
                if (value === 'false' && window.getSelection().toString().length !== 0) {
                    this.clearSelection()
                }
            })

            parentEpml.subscribe('frame_paste_menu_switch', async res => {
                res = JSON.parse(res)

                if (res.isOpen === false && this.isPasteMenuOpen === true) {
                    this.pasteToTextBox(textBox)
                    this.isPasteMenuOpen = false
                }
            })
        })

        parentEpml.imReady()

        textBox.addEventListener('contextmenu', (event) => {
            const getSelectedText = () => {
                var text = "";

                if (typeof window.getSelection != "undefined") {
                    text = window.getSelection().toString();
                } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                    text = this.shadowRoot.selection.createRange().text;
                }

                return text;
            }

            const checkSelectedTextAndShowMenu = () => {
                let selectedText = getSelectedText();

                if (selectedText && typeof selectedText === 'string') {
                    // ...
                } else {
                    this.pasteMenu(event)
                    this.isPasteMenuOpen = true

                    // Prevent Default and Stop Event Bubbling
                    event.preventDefault()
                    event.stopPropagation()
                }
            }

            checkSelectedTextAndShowMenu()
        })
    }

    async guessPuzzle(puzzle) {
        this.selectedPuzzle = puzzle
        this.shadowRoot.getElementById("puzzleGuess").value = ''
        this.shadowRoot.getElementById("puzzleGuess").checkValidity()
        this.message = ''
        this.invalid = true

        this.shadowRoot.querySelector('#puzzleGuessDialog').show()
    }

    async submitPuzzleGuess(e) {
        this.loading = true
        this.error = false

        // Check for valid guess
        const guess = this.shadowRoot.getElementById("puzzleGuess").value

        let _rawGuess = Base58.decode(guess)
        let _keyPair = nacl.sign.keyPair.fromSeed(_rawGuess)

        let _guessAddress = publicKeyToAddress(_keyPair.publicKey)

        console.log("Guess '" + _guessAddress + "' vs puzzle's address '" + this.selectedPuzzle.address + "'")
        if (_guessAddress !== this.selectedPuzzle.address) {
            this.error = true
            this.message = 'Guess incorrect!'
            this.loading = false
            return
        }

        // Get Last Ref
        const getLastRef = async (address) => {
            let myRef = await parentEpml.request('apiCall', {
                url: `/addresses/lastreference/${address}`
            })
            return myRef
        }

        let lastRef = await getLastRef(_guessAddress)
        let amount = this.selectedPuzzle.reward - DEFAULT_FEE;
        let recipientAddress = this.selectedAddress.address
        let txnParams = {
            recipient: recipientAddress,
            amount: amount,
            lastReference: lastRef,
            fee: DEFAULT_FEE
        }

        // Mostly copied from qortal-ui-core/src/plugins/routes.js
        let txnResponse = await parentEpml.request('standaloneTransaction', {
            type: 2,
            keyPair: {
                publicKey: _keyPair.publicKey,
                privateKey: _keyPair.secretKey
            },
            params: txnParams
        })

        if (txnResponse.success) {
            this.message = 'Reward claim submitted - check wallet for reward!'
        } else {
            this.error = true
            if (txnResponse.data) {
                this.message = "Error while claiming reward: " + txnResponse.data.message
            } else {
                this.message = "Error while claiming reward: " + txnResponse.message
            }
        }

        this.loading = false
    }

    pasteToTextBox(textBox) {
        // Return focus to the window
        window.focus()

        navigator.clipboard.readText().then(clipboardText => {

            textBox.value += clipboardText
            textBox.focus()
        });
    }

    pasteMenu(event) {
        let eventObject = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
        parentEpml.request('openFramePasteMenu', eventObject)
    }

    _textMenu(event) {
        const getSelectedText = () => {
            var text = "";
            if (typeof window.getSelection != "undefined") {
                text = window.getSelection().toString();
            } else if (typeof this.shadowRoot.selection != "undefined" && this.shadowRoot.selection.type == "Text") {
                text = this.shadowRoot.selection.createRange().text;
            }
            return text;
        }

        const checkSelectedTextAndShowMenu = () => {
            let selectedText = getSelectedText();
            if (selectedText && typeof selectedText === 'string') {
                let _eve = { pageX: event.pageX, pageY: event.pageY, clientX: event.clientX, clientY: event.clientY }
                let textMenuObject = { selectedText: selectedText, eventObject: _eve, isFrame: true }
                parentEpml.request('openCopyTextMenu', textMenuObject)
            }
        }

        checkSelectedTextAndShowMenu()
    }

    isEmptyArray(arr) {
        if (!arr) { return true }
        return arr.length === 0
    }

    clearSelection() {
        window.getSelection().removeAllRanges()
        window.parent.getSelection().removeAllRanges()
    }
}

window.customElements.define('puzzles-info', Puzzles)
