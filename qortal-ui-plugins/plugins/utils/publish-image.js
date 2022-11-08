const getApiKey = () => {
	const myNode =
		window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
		]
	let apiKey = myNode.apiKey
	return apiKey
}

export const publishData = async ({
	registeredName,
	path,
	file,
	service,
	identifier,
	parentEpml,
	metaData,
	uploadType,
	selectedAddress,
}) => {
	const validateName = async (receiverName) => {
		let nameRes = await parentEpml.request("apiCall", {
			type: "api",
			url: `/names/${receiverName}`,
		})

		return nameRes
	}

    const convertBytesForSigning = async (transactionBytesBase58) => {
        let convertedBytes = await parentEpml.request("apiCall", {
            type: "api",
            method: "POST",
            url: `/transactions/convert`,
            body: `${transactionBytesBase58}`,
        })
        return convertedBytes
    }

    const signAndProcess = async (transactionBytesBase58) => {
        let convertedBytesBase58 = await convertBytesForSigning(
            transactionBytesBase58
        )
        if (convertedBytesBase58.error) {
            return
        }

        const convertedBytes =
            window.parent.Base58.decode(convertedBytesBase58)
        const _convertedBytesArray = Object.keys(convertedBytes).map(
            function (key) {
                return convertedBytes[key]
            }
        )
        const convertedBytesArray = new Uint8Array(_convertedBytesArray)
        const convertedBytesHash = new window.parent.Sha256()
            .process(convertedBytesArray)
            .finish().result
        const hashPtr = window.parent.sbrk(32, window.parent.heap)
        const hashAry = new Uint8Array(
            window.parent.memory.buffer,
            hashPtr,
            32
        )
        
        hashAry.set(convertedBytesHash)
        const difficulty = 14
        const workBufferLength = 8 * 1024 * 1024
        const workBufferPtr = window.parent.sbrk(
            workBufferLength,
            window.parent.heap
        )
        let nonce = window.parent.computePow(
            hashPtr,
            workBufferPtr,
            workBufferLength,
            difficulty
        )
        let response = await parentEpml.request("sign_arbitrary", {
            nonce: selectedAddress.nonce,
            arbitraryBytesBase58: transactionBytesBase58,
            arbitraryBytesForSigningBase58: convertedBytesBase58,
            arbitraryNonce: nonce,
        })
        let myResponse = { error: "" }
        if (response === false) {
            return
        } else {
            myResponse = response
        }

        return myResponse
    }

	const validate = async () => {
		let validNameRes = await validateName(registeredName)
		if (validNameRes.error) {
			return
		}
		let transactionBytes = await uploadData(registeredName, path, file)
		if (transactionBytes.error) {
			return
		} else if (
			transactionBytes.includes("Error 500 Internal Server Error")
		) {
			return
		}

		let signAndProcessRes = await signAndProcess(transactionBytes)
		if (signAndProcessRes.error) {
			return
		}
	}

	const uploadData = async (registeredName, path, file) => {
		if (identifier != null && identifier.trim().length > 0) {
			let postBody = path
			let urlSuffix = ""
			if (file != null) {
				// If we're sending zipped data, make sure to use the /zip version of the POST /arbitrary/* API
				if (uploadType === "zip") {
					urlSuffix = "/zip"
				}
				// If we're sending file data, use the /base64 version of the POST /arbitrary/* API
				else if (uploadType === "file") {
					urlSuffix = "/base64"
				}

				// Base64 encode the file to work around compatibility issues between javascript and java byte arrays
				let fileBuffer = new Uint8Array(await file.arrayBuffer())
				postBody = Buffer.from(fileBuffer).toString("base64")
			}

			// Optional metadata

			// let title = encodeURIComponent(metaData.title || "")
			// let description = encodeURIComponent(metaData.description || "")
			// let category = encodeURIComponent(metaData.category || "")
			// let tag1 = encodeURIComponent(metaData.tag1 || "")
			// let tag2 = encodeURIComponent(metaData.tag2 || "")
			// let tag3 = encodeURIComponent(metaData.tag3 || "")
			// let tag4 = encodeURIComponent(metaData.tag4 || "")
			// let tag5 = encodeURIComponent(metaData.tag5 || "")

			// let metadataQueryString = `title=${title}&description=${description}&category=${category}&tags=${tag1}&tags=${tag2}&tags=${tag3}&tags=${tag4}&tags=${tag5}`
		
			let uploadDataUrl = `/arbitrary/${service}/${registeredName}${urlSuffix}?apiKey=${getApiKey()}`
			if (identifier != null && identifier.trim().length > 0) {
				uploadDataUrl = `/arbitrary/${service}/${registeredName}/${identifier}${urlSuffix}?apiKey=${getApiKey()}`
			}
			let uploadDataRes = await parentEpml.request("apiCall", {
				type: "api",
				method: "POST",
				url: `${uploadDataUrl}`,
				body: `${postBody}`,
			})
			return uploadDataRes
		}
	}
    await validate()
}
