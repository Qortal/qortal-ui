import { Sha256 } from 'asmcrypto.js'

function sbrk(size, heap) {
	let brk = 512 * 1024 // stack top
	let old = brk
	brk += size
	if (brk > heap.length) throw new Error('heap exhausted')
	return old
}

self.addEventListener('message', async e => {
	const response = await computePow(e.data.chatBytes, e.data.path, e.data.difficulty)
	postMessage(response)
})

const memory = new WebAssembly.Memory({ initial: 256, maximum: 256 })
const heap = new Uint8Array(memory.buffer)

const computePow = async (chatBytes, path, difficulty) => {
	let response = null
	await new Promise((resolve, reject) => {
		const _chatBytesArray = Object.keys(chatBytes).map(function (key) { return chatBytes[key]; })
		const chatBytesArray = new Uint8Array(_chatBytesArray)
		const chatBytesHash = new Sha256().process(chatBytesArray).finish().result
		const hashPtr = sbrk(32, heap);
		const hashAry = new Uint8Array(memory.buffer, hashPtr, 32)
		hashAry.set(chatBytesHash)
		const workBufferLength = 8 * 1024 * 1024
		const workBufferPtr = sbrk(workBufferLength, heap)
		const importObject = {
			env: {
				memory: memory
			}
		}
		function loadWebAssembly(filename, imports) {
			// Fetch the file and compile it
			return fetch(filename)
				.then(response => response.arrayBuffer())
				.then(buffer => WebAssembly.compile(buffer))
				.then(module => {
					// Create the instance.
					return new WebAssembly.Instance(module, importObject)
				})
		}
		loadWebAssembly(path).then(wasmModule => {
			response = {
				nonce: wasmModule.exports.compute2(hashPtr, workBufferPtr, workBufferLength, difficulty),
				chatBytesArray
			}
			resolve()
		})
	})
	return response
}