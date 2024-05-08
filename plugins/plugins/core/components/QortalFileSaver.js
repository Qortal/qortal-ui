function saveFile({ data, debug, filename }) {
	if (debug) console.log("[qortal-file-saver] starting with ", { data, debug, filename })
	if (!data) throw new Error("[qortal-file-saver] You must pass in data")
	if (!filename) {
		if (typeof window !== "undefined" && typeof File !== undefined && data instanceof File) {
			filename = data.name
		}
		throw new Error("[qortal-file-saver] You must pass in filename")
	}

	const constructorName = (typeof data === "object" && typeof data.constructor === "function" && data.constructor.name) || null

	if (debug) console.log("constructorName:", constructorName)

	const ext = filename.substr(filename.lastIndexOf(".")).toLowerCase()

	const A = ({ href, download }) => {
		const a = document.createElement("a")
		a.href = href
		a.download = download
		return a
	}

	function convertImageToCanvas({ debug, img }) {
		if (debug) console.log("[qortal-file-saver] starting convertImageToCanvas")
		const height = img.height
		const width = img.width
		const canvas = document.createElement("canvas")
		canvas.height = height
		canvas.width = width
		const context = canvas.getContext("2d")
		context.drawImage(img, 0, 0, width, height)
		return canvas
	}

	function saveHTML({ data, debug, filename }) {
		if (typeof data === "object" && "outerHTML" in data) {
			if (debug) console.log("[qortal-file-saver] data appears to be an HTML element, so grabbing it's outer HTML")
			data = data.outerHTML
		}
		const url = "data:text/html," + encodeURIComponent(data)
		saveDataOrBlobURL({ url, debug, filename })
	}

	function saveCanvas({ data, debug, filename, imageType }) {
		const url = data.toDataURL("image/" + imageType)
		saveDataOrBlobURL({ url, debug, filename })
	}

	function saveDataOrBlobURL({ url, debug, filename }) {
		A({ href: url, download: filename }).click()
	}

	function saveImageAsJPG({ data: img, debug, filename }) {
		if (debug) console.log("starting saveImageAsJPG")
		const canvas = convertImageToCanvas({ debug, img })
		saveCanvasAsJPG({ data: canvas, debug, filename })
	}

	function saveImageAsPNG({ data: img, debug, filename }) {
		if (debug) console.log("starting saveImageAsPNG")
		const canvas = convertImageToCanvas({ debug, img })
		saveCanvasAsPNG({ data: canvas, debug, filename })
	}

	function saveImageAsWebP({ data: img, debug, filename }) {
		if (debug) console.log("starting saveImageAsWebP")
		const canvas = convertImageToCanvas({ debug, img })
		saveCanvasAsWebP({ data: canvas, debug, filename })
	}

	function saveCanvasAsJPG({ data, debug, filename }) {
		saveCanvas({ data, debug, filename, imageType: "jpeg" })
	}

	function saveCanvasAsPNG({ data, debug, filename }) {
		saveCanvas({ data, debug, filename, imageType: "png" })
	}

	function saveCanvasAsWebP({ data, debug, filename }) {
		saveCanvas({ data, debug, filename, imageType: "webp" })
	}

	function saveDSV({ data, debug, delimiter, filename, mediatype }) {
		if (!Array.isArray(data)) throw new Error("[qortal-saver] data must be an array to save as a CSV")
		if (!delimiter) throw new Error("[qortal-saver] delimiter must be set")
		if (!mediatype) throw new Error("[qortal-saver] mediatype must be set")
		let output = "data:" + mediatype + ";charset=utf-8,"
		const columns = Array.from(new Set(data.map(Object.keys).flat())).sort()
		const types = new Set(data.map(it => (Array.isArray(it) ? "array" : typeof it)))
		const includeHeader = types.has("object")
		if (debug) console.log("includeHeader:", includeHeader)
		if (includeHeader) output += columns.map(c => '"' + c.replace(/,/g, "\\,") + '"') + "\n"
		for (let i = 0; i < data.length; i++) {
			const row = data[i]
			if (i !== 0) output += "\n"
			output += columns.map(col => '"' + row[col].toString().replace(/,/g, "\\,") + '"')
		}
		const url = encodeURI(output)
		saveDataOrBlobURL({ url, debug, filename })
	}

	function saveCSV({ data, debug, filename }) {
		saveDSV({ data, debug, delimiter: ",", filename, mediatype: "text/csv" })
	}

	function saveTSV({ data, debug, filename }) {
		saveDSV({ data, debug, delimiter: "\t", filename, mediatype: "text/tab-separated-values" })
	}

	function saveJSON({ data, debug, filename }) {
		const url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, undefined, 2))
		saveDataOrBlobURL({ url, debug, filename })
	}

	function saveText({ data, debug, filename }) {
		const url = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
		saveDataOrBlobURL({ url, debug, filename })
	}

	function saveBlob({ data, debug, filename }) {
		const url = URL.createObjectURL(data)
		if (debug) console.log("[qortal-file-saver.saveBlob] url:", url)
		saveDataOrBlobURL({ url, debug, filename })
		URL.revokeObjectURL(url)
	}

	if (ext === ".csv") {
		saveCSV({ data, debug, filename })
	} else if (ext === ".tsv") {
		saveTSV({ data, debug, filename })
	} else if (ext === ".html") {
		saveHTML({ data, debug, filename })
	} else if (ext === ".json" || ext === ".geojson" || ext === ".topojson") {
		saveJSON({ data, debug, filename })
	} else if (ext === ".txt" || ext === ".js" || ext === ".py") {
		saveText({ data, debug, filename })
	} else if (constructorName === "HTMLCanvasElement" && ext === ".png") {
		saveCanvasAsPNG({ data, debug, filename })
	} else if (constructorName === "HTMLCanvasElement" && ext === ".jpg") {
		saveCanvasAsJPG({ data, debug, filename })
	} else if (constructorName === "HTMLCanvasElement" && ext === ".webp") {
		saveCanvasAsWebP({ data, debug, filename })
	} else if (constructorName === "HTMLImageElement" && ext === ".jpg") {
		saveImageAsJPG({ data, debug, filename })
	} else if (constructorName === "HTMLImageElement" && ext === ".png") {
		saveImageAsPNG({ data, debug, filename })
	} else if (constructorName === "HTMLImageElement" && ext === ".webp") {
		saveImageAsWebP({ data, debug, filename })
	} else if (constructorName === "Blob") {
		saveBlob({ data, debug, filename })
	} else {
		throw new Error('[qortal-file-saver] unrecognized extension "' + ext + '"')
	}
}

if (typeof define === "function" && define.amd) define(function () {return saveFile;})
if (typeof module === "object") module.exports = saveFile
if (typeof window === "object") window.saveFile = saveFile
if (typeof self === "object") self.saveFile = saveFile