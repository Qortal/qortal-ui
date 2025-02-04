
export const int32ToBytes = (word) => {
	var byteArray = []
	for (var b = 0; b < 32; b += 8) {
		byteArray.push((word >>> (24 - b % 32)) & 0xFF)
	}
	return byteArray
}

export const stringtoUTF8Array = (message) => {
	if (typeof message === 'string') {
		var s = unescape(encodeURIComponent(message))
		message = new Uint8Array(s.length)
		for (var i = 0; i < s.length; i++) {
			message[i] = s.charCodeAt(i) & 0xff
		}
	}
	return message
}

export const appendBuffer = (buffer1, buffer2) => {
	buffer1 = new Uint8Array(buffer1)
	buffer2 = new Uint8Array(buffer2)
	let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
	tmp.set(buffer1, 0)
	tmp.set(buffer2, buffer1.byteLength)
	return tmp
}

export const int64ToBytes = (int64) => {
	var byteArray = [0, 0, 0, 0, 0, 0, 0, 0]
	for (var index = 0; index < byteArray.length; index++) {
		var byte = int64 & 0xff
		byteArray[byteArray.length - index - 1] = byte
		int64 = (int64 - byte) / 256
	}
	return byteArray
}

export const hexToBytes = (hexString) => {
	return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
}

export const stringToHex = (bytes) => {
	return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
}

export const equal = (buf1, buf2) => {
	if (buf1.byteLength != buf2.byteLength) return false
	var dv1 = new Uint8Array(buf1)
	var dv2 = new Uint8Array(buf2)
	for (var i = 0; i != buf1.byteLength; i++) {
		if (dv1[i] != dv2[i]) return false
	}
	return true
}

export const bytesToHex = (byteArray) => {
	var _byteArrayToHex = []
	for (var index = 0; index < byteArray.length; index++) {
		_byteArrayToHex.push((byteArray[index] >>> 4).toString(16))
		_byteArrayToHex.push((byteArray[index] & 15).toString(16));
	}
	return _byteArrayToHex.join("")
}
