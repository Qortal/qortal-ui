import CryptoJS from 'crypto-js'

export const encryptData = (data, salt) => CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString()

export const decryptData = (ciphertext, salt) => {
	const bytes = CryptoJS.AES.decrypt(ciphertext, salt)

	try {
		return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
	} catch (err) {
		return null
	}
}