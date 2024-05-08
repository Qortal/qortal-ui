export function interpolate(text, values, config) {
	return Object.entries(extract(values || {})).reduce((text, [key, value]) => text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`, `gm`), String(extract(value))), text)
}

export function lookup(key, config) {
	const parts = key.split(".")
	let string = config.strings

	while (string != null && parts.length > 0) {
		string = string[parts.shift()]
	}

	return string != null ? string.toString() : null
}

export function extract(obj) {
	return (typeof obj === "function") ? obj() : obj
}