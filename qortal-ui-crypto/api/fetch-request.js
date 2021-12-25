import { watchConfig, waitForConfig } from '../config.js'

let config = {}
watchConfig((c) => {
	config = c
})

export async function request(url, options) {
	options = options || {}
	const body = options.body
	const method = options.method || 'GET'
	const headers = options.headers || {}

	await waitForConfig()

	const n = config.nodeConfig.knownNodes[config.nodeConfig.node]
	const node = n.protocol + '://' + n.domain + ':' + n.port
	return fetch(node + url, {
		method,
		headers,
		body,
	}).then(async (response) => {
		try {
			const json = await response.clone().json()
			return json
		} catch (e) {
			return await response.text()
		}
	})
}
