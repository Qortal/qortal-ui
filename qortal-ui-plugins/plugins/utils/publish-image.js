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
	uploadType,
	selectedAddress,
	worker,
	isBase64
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
		let nonce = null
		const computPath =window.parent.location.origin + '/memory-pow/memory-pow.wasm.full'
			await new Promise((res, rej) => {
       
                worker.postMessage({convertedBytes, path: computPath});
            
                worker.onmessage = e => {
                    
                  worker.terminate()
              
                    nonce = e.data.nonce
                    res()
                 
                }
              })
     
  
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
				if(isBase64){
					postBody = file
				}
				if(!isBase64){
				let fileBuffer = new Uint8Array(await file.arrayBuffer())
				postBody = Buffer.from(fileBuffer).toString("base64")
				}
				
			}

			console.log({postBody})
		
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
	try {
		await validate()
	} catch (error) {
		throw new Error(error.message)
	}
   
}
