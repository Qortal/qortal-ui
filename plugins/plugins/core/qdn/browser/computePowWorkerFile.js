import { Sha256 } from 'asmcrypto.js'

function sbrk(size, heap) {
	let brk = 512 * 1024 // stack top
	let old = brk
	brk += size
	if (brk > heap.length) throw new Error('heap exhausted')
	return old
}

self.addEventListener('message', async e => {
	const response = await computePow(e.data.convertedBytes, e.data.path)
	postMessage(response)
})

const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const heap = new Uint8Array(memory.buffer)

const computePow = async (convertedBytes, path) => {
	let response = null
	await new Promise((resolve, reject) => {
		const _convertedBytesArray = Object.keys(convertedBytes).map(
			function (key) {
				return convertedBytes[key]
			}
		)
		const convertedBytesArray = new Uint8Array(_convertedBytesArray)
		const convertedBytesHash = new Sha256()
			.process(convertedBytesArray)
			.finish().result
		const hashPtr = sbrk(32, heap)
		const hashAry = new Uint8Array(
			memory.buffer,
			hashPtr,
			32
		)
		hashAry.set(convertedBytesHash)
		const difficulty = 14
		const workBufferLength = 8 * 1024 * 1024
		const workBufferPtr = sbrk(
			workBufferLength,
			heap
		)
		const importObject = {
			env: {
				memory: memory
			}
		}
		function loadWebAssembly(filename, imports) {
			return fetch(filename)
				.then(response => response.arrayBuffer())
				.then(buffer => WebAssembly.compile(buffer))
				.then(module => {
					return new WebAssembly.Instance(module, importObject)
				})
		}
		loadWebAssembly(path).then(wasmModule => {
			response = {
				nonce: wasmModule.exports.compute2(hashPtr, workBufferPtr, workBufferLength, difficulty),
			}
			resolve()
		})
	})
	return response
}