import {get} from '../../../core/translate'

export class ModalHelper {
    constructor() {
        this.initializeStyles();
    }

    async getArbitraryFee() {
        const timestamp = Date.now();
        const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node];
        const nodeUrl = `${myNode.protocol}://${myNode.domain}:${myNode.port}`;
        const url = `${nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error when fetching arbitrary fee');
        }

        const data = await response.json();
        const arbitraryFee = (Number(data) / 1e8).toFixed(8);
        return {
            timestamp,
            fee: Number(data),
            feeToShow: arbitraryFee
        };
    }

    async showModalAndWaitPublish(data) {
        return new Promise((resolve) => {
            const modal = this.createModal(data);
            document.body.appendChild(modal);
            this.addModalEventListeners(modal, resolve);
        });
    }

    createModal(data) {
        const modal = document.createElement('div');
        modal.id = "backdrop";
        modal.classList.add("backdrop");
        modal.innerHTML = `
			<div class="modal my-modal-class">
				<div class="modal-content">
					<div class="modal-body">
							<div class="modal-subcontainer">
								<div class="checkbox-row">
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${get('browserpage.bchange47')} <span style="font-weight: bold">${data.feeAmount} QORT fee</span></p>
								</div>
							</div>
					</div>
					<div class="modal-buttons">
						<button id="cancel-button">${get("browserpage.bchange27")}</button>
						<button id="ok-button">${get("browserpage.bchange28")}</button>
					</div>
				</div>
			</div>
		`;
        return modal;
    }

    addModalEventListeners(modal, resolve) {
        // Event listener for the 'OK' button
        const okButton = modal.querySelector('#ok-button');
        okButton.addEventListener('click', () => {
            const userData = { isWithFee: true };
            if (modal.parentNode === document.body) {
                document.body.removeChild(modal);
            }
            resolve({ action: 'accept', userData });
        });

        // Prevent modal content from closing the modal
        const modalContent = modal.querySelector('.modal-content');
        modalContent.addEventListener('click', e => {
            e.stopPropagation();
        });

        // Event listeners for backdrop and 'Cancel' button
        const backdropClick = document.getElementById('backdrop');
        backdropClick.addEventListener('click', () => {
            if (modal.parentNode === document.body) {
                document.body.removeChild(modal);
            }
            resolve({ action: 'reject' });
        });

        const cancelButton = modal.querySelector('#cancel-button');
        cancelButton.addEventListener('click', () => {
            if (modal.parentNode === document.body) {
                document.body.removeChild(modal);
            }
            resolve({ action: 'reject' });
        });
    }

    initializeStyles() {
        const styles = `
        * {
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-secondary: var(--mdc-theme-primary);
            --paper-input-container-focus-color: var(--mdc-theme-primary);
            --mdc-checkbox-unchecked-color: var(--black);
            --mdc-theme-on-surface: var(--black);
            --mdc-checkbox-disabled-color: var(--black);
            --mdc-checkbox-ink-color: var(--black);
        }

        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgb(186 186 186 / 26%);
            overflow: hidden;
            animation: backdrop_blur cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
            z-index: 1000000;
        }

        @keyframes backdrop_blur {
            0% {
                backdrop-filter: blur(0px);
                background: transparent;
            }
            100% {
                backdrop-filter: blur(5px);
                background: rgb(186 186 186 / 26%);
            }
        }

        @keyframes modal_transition {
            0% {
                visibility: hidden;
                opacity: 0;
        }
            100% {
                visibility: visible;
                opacity: 1;
            }
        }

        .modal {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            animation: 0.1s cubic-bezier(0.22, 1, 0.36, 1) 0s 1 normal forwards running modal_transition;
            z-index: 1000001;
        }

        @keyframes modal_transition {
            0% {
                visibility: hidden;
                opacity: 0;
            }
            100% {
                visibility: visible;
                opacity: 1;
            }
        }

        .modal-content {
            background-color: var(--white);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            max-width: 80%;
            min-width: 300px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .modal-body {
            padding: 25px;
        }

        .modal-subcontainer {
            color: var(--black);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }

        .modal-subcontainer-error {
            color: var(--black);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }

        .modal-paragraph-error {
            font-family: Roboto, sans-serif;
            font-size: 20px;
            letter-spacing: 0.3px;
            font-weight: 700;
            color: var(--black);
            margin: 0;
        }

        .modal-paragraph {
            font-family: Roboto, sans-serif;
            font-size: 18px;
            letter-spacing: 0.3px;
            font-weight: 300;
            color: var(--black);
            margin: 0;
            word-wrap: break-word;
              overflow-wrap: break-word;
        }

        .capitalize-first {
            text-transform: capitalize;
        }

        .checkbox-row {
            display: flex;
            align-items: center;
            font-family: Montserrat, sans-serif;
            font-weight: 600;
            color: var(--black);
        }

        .modal-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .modal-buttons button {
            background-color: #4caf50;
            border: none;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .modal-buttons button:hover {
            background-color: #3e8e41;
        }

        #cancel-button {
            background-color: #f44336;
        }

        #cancel-button:hover {
            background-color: #d32f2f;
        }
    `;

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(styles);

        document.adoptedStyleSheets = [styleSheet];
    }

    static getInstance() {
        if (!ModalHelper.instance) {
          ModalHelper.instance = new ModalHelper();
        }
        return ModalHelper.instance;
      }
}

export const modalHelper = ModalHelper.getInstance();
