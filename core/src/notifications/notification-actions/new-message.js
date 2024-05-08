import { store } from '../../store'
import { doPageUrl, setNewTab } from '../../redux/app/app-actions'
import isElectron from 'is-electron'
import ShortUniqueId from 'short-unique-id'

const uid = new ShortUniqueId()

export const newMessage = (data) => {
	const alert = playSound(data.sound)

	// Should I show notification ?
	if (store.getState().user.notifications.q_chat.showNotification) {
		// Yes, I can but should I play sound ?
		if (store.getState().user.notifications.q_chat.playSound) {
			const notify = new Notification(data.title, data.options)

			notify.onshow = (e) => {
				alert.play()
			}

			notify.onclick = (e) => {
				const pageUrl = `/app/q-chat/?chat=${data.req.url}`
				store.dispatch(doPageUrl(pageUrl))
			}
		} else {
			const notify = new Notification(data.title, data.options)

			notify.onclick = (e) => {
				const pageUrl = `/app/q-chat/?chat=${data.req.url}`
				store.dispatch(doPageUrl(pageUrl))
			}
		}
	// If sounds are enabled, but notifications are not
	} else if (store.getState().user.notifications.q_chat.playSound) {
		alert.play()
	}
}

export const newMessageNotificationQapp = (data) => {
	const alert = playSound(data.sound)

	// Should I show notification ?
	if (store.getState().user.notifications.q_chat.showNotification) {
		// Yes, I can but should I play sound ?
		if (store.getState().user.notifications.q_chat.playSound) {
			const notify = new Notification(data.title, data.options)

			notify.onshow = (e) => {
				alert.play()
			}

			notify.onclick = (e) => {
				const query = `?service=APP&name=Q-Mail`

				store.dispatch(setNewTab({
					url: `qdn/browser/index.html${query}`,
					id: 'q-mail-notification',
					myPlugObj: {
						"url": "qapps",
						"domain": "core",
						"page": `qdn/browser/index.html${query}`,
						"title": "Q-Mail",
						"icon": "vaadin:desktop",
						"menus": [],
						"parent": false
					}
				}))

				if (!isElectron()) {
					window.focus();
				} else {
					window.electronAPI.focusApp()
				}
			}
		} else {
			const notify = new Notification(data.title, data.options)

			notify.onclick = (e) => {
				const query = `?service=APP&name=Q-Mail`

				store.dispatch(setNewTab({
					url: `qdn/browser/index.html${query}`,
					id: 'q-mail-notification',
					myPlugObj: {
						"url": "qapps",
						"domain": "core",
						"page": `qdn/browser/index.html${query}`,
						"title": "Q-Mail",
						"icon": "vaadin:desktop",
						"menus": [],
						"parent": false
					}
				}))

				if (!isElectron()) {
					window.focus();
				} else {
					window.electronAPI.focusApp()
				}
			}
		}
	// If sounds are enabled, but notifications are not
	} else if (store.getState().user.notifications.q_chat.playSound) {
		alert.play()
	}
}

const extractComponents = async (url) => {
	if (!url.startsWith("qortal://")) {
		return null
	}

	url = url.replace(/^(qortal\:\/\/)/, "")

	if (url.includes("/")) {
		let parts = url.split("/")

		const service = parts[0].toUpperCase()

		parts.shift()

		const name = parts[0]

		parts.shift()

		let identifier

		if (parts.length > 0) {
			// Do not shift yet
			identifier = parts[0]

			// Check if a resource exists with this service, name and identifier combination
			let responseObj = await parentEpml.request('apiCall', {
				url: `/arbitrary/resource/status/${service}/${name}/${identifier}?apiKey=${this.getApiKey()}`
			})

			if (responseObj.totalChunkCount > 0) {
				// Identifier exists, so don't include it in the path
				parts.shift()
			} else {
				identifier = null
			}
		}

		const path = parts.join("/")
		const components = {}

		components["service"] = service
		components["name"] = name
		components["identifier"] = identifier
		components["path"] = path

		return components
	}

	return null
}

export const newMessageNotificationQappLocal = (data) => {
	const alert = playSound(data.sound)

	// Should I show notification ?
	if (store.getState().user.notifications.q_chat.showNotification) {
		// Yes, I can but should I play sound ?
		if (store.getState().user.notifications.q_chat.playSound) {
			const notify = new Notification(data.title, data.options)

			notify.onshow = (e) => {
				alert.play()
			}

			notify.onclick = async (e) => {
				let newQuery = data?.url

				if (newQuery.endsWith('/')) {
					newQuery = newQuery.slice(0, -1)
				}

				const res = await extractComponents(newQuery)

				if (!res) return

				const { service, name, identifier, path } = res

				let query = `?service=${service}`

				if (name) {
					query = query + `&name=${name}`
				}

				if (identifier) {
					query = query + `&identifier=${identifier}`
				}

				if (path) {
					query = query + `&path=${path}`
				}

				const tab = {
					url: `qdn/browser/index.html${query}`,
					id: uid.rnd(),
					myPlugObj: {
						"url": service === 'WEBSITE' ? "websites" : "qapps",
						"domain": "core",
						"page": `qdn/browser/index.html${query}`,
						"title": name,
						"icon": service === 'WEBSITE' ? 'vaadin:desktop' : 'vaadin:external-browser',
						"mwcicon": service === 'WEBSITE' ? 'desktop_mac' : 'open_in_browser',
						"menus": [],
						"parent": false
					}
				}

				store.dispatch(setNewTab(tab))

				if (!isElectron()) {
					window.focus()
				} else {
					window.electronAPI.focusApp()
				}
			}
		} else {
			const notify = new Notification(data.title, data.options)

			notify.onclick = async (e) => {
				let newQuery = data?.url

				if (newQuery.endsWith('/')) {
					newQuery = newQuery.slice(0, -1)
				}

				const res = await extractComponents(newQuery)

				if (!res) return

				const { service, name, identifier, path } = res

				let query = `?service=${service}`

				if (name) {
					query = query + `&name=${name}`
				}

				if (identifier) {
					query = query + `&identifier=${identifier}`
				}

				if (path) {
					query = query + `&path=${path}`
				}

				const tab = {
					url: `qdn/browser/index.html${query}`,
					id: uid.rnd(),
					myPlugObj: {
						"url": service === 'WEBSITE' ? "websites" : "qapps",
						"domain": "core",
						"page": `qdn/browser/index.html${query}`,
						"title": name,
						"icon": service === 'WEBSITE' ? 'vaadin:desktop' : 'vaadin:external-browser',
						"mwcicon": service === 'WEBSITE' ? 'desktop_mac' : 'open_in_browser',
						"menus": [],
						"parent": false
					}
				}

				store.dispatch(setNewTab(tab))

				if (!isElectron()) {
					window.focus()
				} else {
					window.electronAPI.focusApp()
				}
			}
		}
	// If sounds are enabled, but notifications are not
	} else if (store.getState().user.notifications.q_chat.playSound) {
		alert.play()
	}
}

const playSound = (soundUrl) => {
	return new Audio(soundUrl)
}