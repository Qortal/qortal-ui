const getApiKey = () => {
	const myNode =
		window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
			window.parent.reduxStore.getState().app.nodeConfig.node
		]
	return myNode.apiKey
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
		return await parentEpml.request("apiCall", {
			type: "api",
			url: `/names/${receiverName}`,
		})
	}

    const convertBytesForSigning = async (transactionBytesBase58) => {
		return await parentEpml.request("apiCall", {
			type: "api",
			method: "POST",
			url: `/transactions/convert`,
			body: `${transactionBytesBase58}`,
		})
    }
	const getArbitraryFee = async () => {
		const timestamp = Date.now()
		let fee = await parentEpml.request('apiCall', {
			url: `/transactions/unitfee?txType=ARBITRARY&timestamp=${timestamp}`
		})
		return {
			timestamp,
			fee : Number(fee),
			feeToShow: (Number(fee) / 1e8).toFixed(8)
		}
    }

    const signAndProcess = async (transactionBytesBase58) => {
        let convertedBytesBase58 = await convertBytesForSigning(
            transactionBytesBase58
        )
        if (convertedBytesBase58.error) {
            throw new Error('Error when signing');
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
			apiVersion: apiVersion ? apiVersion : null
        })
        let myResponse = { error: "" }
        if (response === false) {
            throw new Error('Error when signing');
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
            throw new Error('Error when signing');
        }




        let response = await parentEpml.request("sign_arbitrary_with_fee", {
            nonce: selectedAddress.nonce,
            arbitraryBytesBase58: transactionBytesBase58,
            arbitraryBytesForSigningBase58: convertedBytesBase58,
			apiVersion: apiVersion ? apiVersion : null
        })
        let myResponse = { error: "" }
        if (response === false) {
            throw new Error('Error when signing');
        } else {
            myResponse = response
        }

        return myResponse
    }

	const validate = async () => {
		let validNameRes = await validateName(registeredName)
		if (validNameRes.error) {
			throw new Error('Name not found');
		}
		let fee = null
		if(withFee && feeAmount){
			fee= feeAmount
		} else if(withFee){
			const res = await getArbitraryFee()
			 if(res.fee){
				fee= res.fee
			} else {
				throw new Error('unable to get fee')
			}
		}
		let transactionBytes = await uploadData(registeredName, path, file, fee)
		if (transactionBytes.error) {
			throw new Error(transactionBytes.message || 'Error when uploading');
		} else if (
			transactionBytes.includes("Error 500 Internal Server Error")
		) {
			throw new Error('Error when uploading');
		}

		let signAndProcessRes
		if(withFee){
			signAndProcessRes = await signAndProcessWithFee(transactionBytes)

		}
		if(!withFee){
		 signAndProcessRes = await signAndProcess(transactionBytes)

		}
		if (signAndProcessRes.error) {
			throw new Error('Error when signing');
		}
		return signAndProcessRes
	}

	const uploadData = async (registeredName, path, file, fee) => {
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

			let uploadDataUrl = `/arbitrary/${service}/${registeredName}${urlSuffix}?apiKey=${getApiKey()}`
			if (identifier.trim().length > 0) {
				uploadDataUrl = `/arbitrary/${service}/${registeredName}/${identifier}${urlSuffix}?apiKey=${getApiKey()}`

			}

			if(withFee){
				uploadDataUrl = uploadDataUrl + `&fee=${fee}`
			}

			if(filename != null && filename != "undefined"){
				uploadDataUrl = uploadDataUrl + '&filename=' + encodeURIComponent(filename)
			}
			if(title != null && title != "undefined"){
				uploadDataUrl = uploadDataUrl + '&title=' + encodeURIComponent(title)
			}
			if(description != null && description != "undefined"){
				uploadDataUrl = uploadDataUrl + '&description=' + encodeURIComponent(description)
			}
			if(category != null && category != "undefined"){
				uploadDataUrl = uploadDataUrl + '&category=' + encodeURIComponent(category)
			}
			if(tag1 != null && tag1 != "undefined"){
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag1)
			}
			if(tag2 != null && tag2 != "undefined"){
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag2)
			}
			if(tag3 != null && tag3 != "undefined"){
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag3)
			}
			if(tag4 != null && tag4 != "undefined"){
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag4)
			}
			if(tag5 != null && tag5 != "undefined"){
				uploadDataUrl = uploadDataUrl + '&tags=' + encodeURIComponent(tag5)
			}

			return await parentEpml.request("apiCall", {
				type: "api",
				method: "POST",
				url: `${uploadDataUrl}`,
				body: `${postBody}`,
			})
		}
	}
	try {
		return await validate()
	} catch (error) {
		throw new Error(error.message)
	}

}
