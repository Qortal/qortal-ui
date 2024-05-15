import { LANG_CHANGED_EVENT } from './config.js'
import { extract, interpolate, lookup } from './helpers.js'

export const defaultTranslateConfig = () => {
	return {
		loader: () => Promise.resolve({}),
		empty: key => `[${key}]`,
		lookup: lookup,
		interpolate: interpolate,
		translationCache: {}
	}
}

export let translateConfig = defaultTranslateConfig()

export function registerTranslateConfig(config) {
	return (translateConfig = Object.assign(Object.assign({}, translateConfig), config))
}

export function dispatchLangChanged(detail) {
	window.dispatchEvent(new CustomEvent(LANG_CHANGED_EVENT, { detail }))
}

export function updateLang(newLang, newStrings, config = translateConfig) {
	dispatchLangChanged({
		previousStrings: config.strings,
		previousLang: config.lang,
		lang: (config.lang = newLang),
		strings: (config.strings = newStrings)
	})
}

export function listenForLangChanged(callback, options) {
	const handler = (e) => callback(e.detail)
	window.addEventListener(LANG_CHANGED_EVENT, handler, options)
	return () => window.removeEventListener(LANG_CHANGED_EVENT, handler)
}

export async function use(lang, config = translateConfig) {
	const strings = await config.loader(lang, config)
	config.translationCache = {}
	updateLang(lang, strings, config)
}

export function get(key, values, config = translateConfig) {
	let translation = config.translationCache[key] || (config.translationCache[key] = config.lookup(key, config) || config.empty(key, config))
	values = values != null ? extract(values) : null
	return values != null ? config.interpolate(translation, values, config) : translation
}