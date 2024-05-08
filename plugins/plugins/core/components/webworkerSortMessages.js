self.addEventListener('message', async e => {
	const response = e.data.list.sort(function (a, b) {
		return a.timestamp
		- b.timestamp
	})
	postMessage(response)
})