import { get } from '../../../core/translate'

const getApiKey = () => {
	const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
	return myNode.apiKey
}

export class RequestQueue {
	constructor(maxConcurrent = 5) {
		this.queue = []
		this.maxConcurrent = maxConcurrent
		this.currentConcurrent = 0
	}

	push(request) {
		return new Promise((resolve, reject) => {
			this.queue.push({ request, resolve, reject })
			this.checkQueue()
		})
	}

	checkQueue() {
		if (this.queue.length === 0 || this.currentConcurrent >= this.maxConcurrent) {
			return
		}

		const { request, resolve, reject } = this.queue.shift()

		this.currentConcurrent++

		request().then(resolve).catch(reject).finally(() => {
			this.currentConcurrent--
			this.checkQueue()
		})
	}
}

export class RequestQueueWithPromise {
	constructor(maxConcurrent = 5) {
		this.queue = []
		this.maxConcurrent = maxConcurrent
		this.currentlyProcessing = 0
	}

	// Add a request to the queue and return a promise
	enqueue(request) {
		return new Promise((resolve, reject) => {
			// Push the request and its resolve and reject callbacks to the queue
			this.queue.push({ request, resolve, reject })
			this.process()
		})
	}

	// Process requests in the queue
	async process() {
		while (this.queue.length > 0 && this.currentlyProcessing < this.maxConcurrent) {
			this.currentlyProcessing++

			const { request, resolve, reject } = this.queue.shift()

			try {
				const response = await request()
				resolve(response)
			} catch (error) {
				reject(error)
			} finally {
				this.currentlyProcessing--
				await this.process()
			}
		}
	}
}

export class Loader {
	constructor() {
		this.loader = document.createElement("div")
		this.loader.className = "loader"
		this.loader.innerHTML = `<div class="loader-spinner"></div>`
		this.styles = document.createElement("style")
		this.styles.innerHTML = `
			.loader {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: rgba(0, 0, 0, 0.5);
				display: flex;
				justify-content: center;
				align-items: center;
				z-index: 1000001;
			}
  
			.loader-spinner {
				border: 4px solid #f3f3f3;
				border-top: 4px solid #3498db;
				border-radius: 50%;
				width: 32px;
				height: 32px;
				animation: spin 1s linear infinite;
			}
  
			@keyframes spin {
				from { transform: rotate(0deg); }
				to { transform: rotate(360deg); }
			}
		`
	}

	show() {
		document.head.appendChild(this.styles)
		document.body.appendChild(this.loader)
	}

	hide() {
		if (this.loader.parentNode) {
			this.loader.parentNode.removeChild(this.loader)
		}
		if (this.styles.parentNode) {
			this.styles.parentNode.removeChild(this.styles)
		}
	}
}

export class ModalHelper {
	constructor() {
		this.initializeStyles()
	}

	async getArbitraryFee() {
		const timestamp = Date.now()
		const myNode = window.parent.reduxStore.getState().app.nodeConfig.knownNodes[window.parent.reduxStore.getState().app.nodeConfig.node]
		const nodeUrl = `${myNode.protocol}://${myNode.domain}:${myNode.port}`
		const url = `${nodeUrl}/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error('Error when fetching arbitrary fee')
		}

		const data = await response.json()
		const arbitraryFee = (Number(data) / 1e8).toFixed(8)

		return {
			timestamp,
			fee: Number(data),
			feeToShow: arbitraryFee
		}
	}

	async showModalAndWaitPublish(data) {
		return new Promise((resolve) => {
			const modal = this.createModal(data)
			document.body.appendChild(modal)
			this.addModalEventListeners(modal, resolve)
		})
	}

	createModal(data) {
		const modal = document.createElement('div')
		modal.id = "backdrop"
		modal.classList.add("backdrop")

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
		`

		return modal
	}

	addModalEventListeners(modal, resolve) {
		// Event listener for the 'OK' button
		const okButton = modal.querySelector('#ok-button')
		okButton.addEventListener('click', () => {
			const userData = { isWithFee: true }
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'accept', userData })
		})

		// Prevent modal content from closing the modal
		const modalContent = modal.querySelector('.modal-content')
		modalContent.addEventListener('click', e => {
			e.stopPropagation()
		})

		// Event listener for 'Backdrop' button
		const backdropClick = document.getElementById('backdrop')
		backdropClick.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'reject' })
		})

		// Event listener for 'Cancel' button
		const cancelButton = modal.querySelector('#cancel-button')
		cancelButton.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'reject' })
		})
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
		`

		const styleSheet = new CSSStyleSheet()

		styleSheet.replaceSync(styles)

		document.adoptedStyleSheets = [styleSheet]
	}

	static getInstance() {
		if (!ModalHelper.instance) {
			ModalHelper.instance = new ModalHelper()
		}

		return ModalHelper.instance
	}
}

export class WarningModal {
	constructor() {
		this.initializeStyles()
	}

	async showModalAndWaitPublish(data) {
		return new Promise((resolve) => {
			const modal = this.createModal(data)
			document.body.appendChild(modal)
			this.addModalEventListeners(modal, resolve)
		})
	}

	createModal(data) {
		const modal = document.createElement('div')

		modal.id = "backdrop"
		modal.classList.add("backdrop")

		modal.innerHTML = `
			<div class="modal my-modal-class">
				<div class="modal-content">
					<div class="modal-body">
						<div class="modal-subcontainer">
							<div class="checkbox-row">
								<p style="font-size: 16px;overflow-wrap: anywhere;" class="modal-paragraph">${data.message}
							</div>
						</div>
					</div>
					<div class="modal-buttons">
						<button id="cancel-button">${get("general.close")}</button>
						<button id="ok-button">${get("general.continue")}</button>
					</div>
				</div>
			</div>
		`

		return modal
	}

	addModalEventListeners(modal, resolve) {
		// Event listener for the 'OK' button
		const okButton = modal.querySelector('#ok-button')
		okButton.addEventListener('click', () => {
			const userData = { isWithFee: true }

			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'accept', userData })
		})

		// Prevent modal content from closing the modal
		const modalContent = modal.querySelector('.modal-content')
		modalContent.addEventListener('click', e => {
			e.stopPropagation()
		})

		// Event listener for 'Backdrop' button
		const backdropClick = document.getElementById('backdrop')
		backdropClick.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'reject' })
		})

		// Event listener for 'Cancel' button
		const cancelButton = modal.querySelector('#cancel-button')
		cancelButton.addEventListener('click', () => {
			if (modal.parentNode === document.body) {
				document.body.removeChild(modal)
			}

			resolve({ action: 'reject' })
		})
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
				max-width: 650px;
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
		`

		const styleSheet = new CSSStyleSheet()

		styleSheet.replaceSync(styles)

		document.adoptedStyleSheets = [styleSheet]
	}

	static getInstance() {
		if (!WarningModal.instance) {
			WarningModal.instance = new WarningModal()
		}

		return WarningModal.instance
	}
}

export const modalHelper = ModalHelper.getInstance()
export const warningModal = WarningModal.getInstance()

export const publishData = async ({
	registeredName,
	path,
	file,
	service,
	identifier,
	parentEpml,
	uploadType,
	selectedAddress,
	worker,
	isBase64,
	filename,
	apiVersion,
	withFee,
	title,
	description,
	category,
	tag1,
	tag2,
	tag3,
	tag4,
	tag5,
	feeAmount
}) => {
	const validateName = async (receiverName) => {
		return await parentEpml.request('apiCall', {
			type: 'api',
			url: `/names/${receiverName}`
		})
	}

	const convertBytesForSigning = async (transactionBytesBase58) => {
		return await parentEpml.request('apiCall', {
			type: 'api',
			method: 'POST',
			url: `/transactions/convert`,
			body: `${transactionBytesBase58}`
		})
	}

	const getArbitraryFee = async () => {
		const timestamp = Date.now()

		let fee = await parentEpml.request('apiCall', {
			url: `/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
		})

		return {
			timestamp,
			fee: Number(fee),
			feeToShow: (Number(fee) / 1e8).toFixed(8)
		}
	}

	const signAndProcess = async (transactionBytesBase58) => {
		let convertedBytesBase58 = await convertBytesForSigning(
			transactionBytesBase58
		)

		if (convertedBytesBase58.error) {
			throw new Error('Error when signing')
		}

		const convertedBytes = window.parent.Base58.decode(convertedBytesBase58)

		let nonce = null

		const computPath = window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'

		await new Promise((res, rej) => {
			worker.postMessage({ convertedBytes, path: computPath })

			worker.onmessage = e => {
				worker.terminate()
				nonce = e.data.nonce
				res()
			}
		})

		let response = await parentEpml.request('sign_arbitrary', {
			nonce: selectedAddress.nonce,
			arbitraryBytesBase58: transactionBytesBase58,
			arbitraryBytesForSigningBase58: convertedBytesBase58,
			arbitraryNonce: nonce,
			apiVersion: apiVersion ? apiVersion : null
		})

		let myResponse = { error: '' }

		if (response === false) {
			throw new Error('Error when signing')
		} else {
			myResponse = response
		}

		return myResponse
	}

	const signAndProcessWithFee = async (transactionBytesBase58) => {
		let convertedBytesBase58 = await convertBytesForSigning(
			transactionBytesBase58
		)

		if (convertedBytesBase58.error) {
			throw new Error('Error when signing')
		}

		let response = await parentEpml.request('sign_arbitrary_with_fee', {
			nonce: selectedAddress.nonce,
			arbitraryBytesBase58: transactionBytesBase58,
			arbitraryBytesForSigningBase58: convertedBytesBase58,
			apiVersion: apiVersion ? apiVersion : null
		})

		let myResponse = { error: '' }

		if (response === false) {
			throw new Error('Error when signing')
		} else {
			myResponse = response
		}

		return myResponse
	}

	const validate = async () => {
		let validNameRes = await validateName(registeredName)

		if (validNameRes.error) {
			throw new Error('Name not found')
		}

		let fee = null

		if (withFee && feeAmount) {
			fee = feeAmount
		} else if (withFee) {
			const res = await getArbitraryFee()

			if (res.fee) {
				fee = res.fee
			} else {
				throw new Error('unable to get fee')
			}
		}

		let transactionBytes = await uploadData(registeredName, path, file, fee)

		if (transactionBytes.error) {
			throw new Error(transactionBytes.message || 'Error when uploading')
		} else if (transactionBytes.includes('Error 500 Internal Server Error')) {
			throw new Error('Error when uploading')
		}

		let signAndProcessRes

		if (withFee) {
			signAndProcessRes = await signAndProcessWithFee(transactionBytes)
		}

		if (!withFee) {
			signAndProcessRes = await signAndProcess(transactionBytes)
		}

		if (signAndProcessRes.error) {
			throw new Error('Error when signing')
		}

		return signAndProcessRes
	}

	const uploadData = async (registeredName, path, file, fee) => {
		if (identifier != null && identifier.trim().length > 0) {
			let postBody = path
			let urlSuffix = ''

			if (file != null) {
				// If we're sending zipped data, make sure to use the /zip version of the POST /arbitrary/* API
				if (uploadType === 'zip') {
					urlSuffix = '/zip'
				}

				// If we're sending file data, use the /base64 version of the POST /arbitrary/* API
				else if (uploadType === 'file') {
					urlSuffix = '/base64'
				}

				// Base64 encode the file to work around compatibility issues between javascript and java byte arrays
				if (isBase64) {
					postBody = file
				}

				if (!isBase64) {
					let fileBuffer = new Uint8Array(await file.arrayBuffer())
					postBody = Buffer.from(fileBuffer).toString("base64")
				}

			}

			let uploadDataUrl = `/arbitrary/${service}/${registeredName}${urlSuffix}?apiKey=${getApiKey()}`

			if (identifier.trim().length > 0) {
				uploadDataUrl = `/arbitrary/${service}/${registeredName}/${identifier}${urlSuffix}?apiKey=${getApiKey()}`
			}

			if (withFee) {
				uploadDataUrl = uploadDataUrl + `&fee=${fee}`
			}

			if (filename != null && filename != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&filename=' + encodeURIComponent(filename)
			}

			if (title != null && title != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&title=' + encodeURIComponent(title)
			}

			if (description != null && description != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&description=' + encodeURIComponent(description)
			}

			if (category != null && category != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&category=' + encodeURIComponent(category)
			}

			if (tag1 != null && tag1 != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag1)
			}

			if (tag2 != null && tag2 != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag2)
			}

			if (tag3 != null && tag3 != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag3)
			}

			if (tag4 != null && tag4 != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag4)
			}

			if (tag5 != null && tag5 != 'undefined') {
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag5)
			}

			return await parentEpml.request('apiCall', {
				type: 'api',
				method: 'POST',
				url: `${uploadDataUrl}`,
				body: `${postBody}`
			})
		}
	}

	try {
		return await validate()
	} catch (error) {
		throw new Error(error.message)
	}
}