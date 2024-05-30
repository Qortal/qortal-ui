// Author: irontiga <irontiga@gmail.com>

import { html, LitElement } from 'lit'
import * as WORDLISTS from './wordlists'

class RandomSentenceGenerator extends LitElement {
	static get properties() {
		return {
			template: { type: String, attribute: 'template' },
			parsedString: { type: String },
			fetchedWordlistCount: { type: Number, value: 0 },
			capitalize: { type: Boolean },
			partsOfSpeechMap: { type: Object },
			templateEntropy: { type: Number, reflect: true, attribute: 'template-entropy' },
			maxWordLength: { type: Number, attribute: 'max-word-length' }
		}
	}

	constructor() {
		super()
		this.template = 'adjective noun verb adverb.'
		this.maxWordLength = 0
		this.parsedString = ''
		this.fetchedWordlistCount = 0
		this.capitalize = true
		this.partsOfSpeechMap = {
			'noun': 'nouns',
			'adverb': 'adverbs',
			'adv': 'adverbs',
			'verb': 'verbs',
			'interjection': 'interjections',
			'adjective': 'adjectives',
			'adj': 'adjectives',
			'verbed': 'verbed'
		}
		this.partsOfSpeech = Object.keys(this.partsOfSpeechMap)
		this._wordlists = WORDLISTS
	}

	render() {
		return html`
			${this.parsedString}
		`
	}

	firstUpdated() {
		// ...
	}

	updated(changedProperties) {
		let regen = false

		if (changedProperties.has('template')) {
			regen = true
		}

		if (changedProperties.has('maxWordLength')) {
			console.dir(this.maxWordLength)

			if (this.maxWordLength) {
				const wl = { ...this._wordlists }

				for (const partOfSpeech in this._wordlists) {
					console.log(this._wordlists[partOfSpeech])
					if (Array.isArray(this._wordlists[partOfSpeech])) {
						wl[partOfSpeech] = this._wordlists[partOfSpeech].filter(word => word.length <= this.maxWordLength)
					}
				}

				this._wordlists = wl
			}

			regen = true
		}

		if (regen) this.generate()
	}

	_RNG(entropy) {
		if (entropy > 1074) {
			throw new Error('Javascript can not handle that much entropy!')
		}

		let randNum = 0

		const crypto = window.crypto || window.msCrypto

		if (crypto) {
			const entropy256 = Math.ceil(entropy / 8)

			let buffer = new Uint8Array(entropy256)

			crypto.getRandomValues(buffer)

			randNum = buffer.reduce((num, value) => {
				return num * value
			}, 1) / Math.pow(256, entropy256)
		} else {
			console.warn('Secure RNG not found. Using Math.random')

			randNum = Math.random()
		}

		return randNum
	}

	setRNG(fn) {
		this._RNG = fn
	}

	_captitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}

	getWord(partOfSpeech) {
		const words = this._wordlists[this.partsOfSpeechMap[partOfSpeech]]
		const requiredEntropy = Math.log(words.length) / Math.log(2)
		const index = this._RNG(requiredEntropy) * words.length

		return {
			word: words[Math.round(index)],
			entropy: words.length
		}
	}

	generate() {
		this.parsedString = this.parse(this.template)
	}

	parse(template) {
		const split = template.split(/[\s]/g)

		let entropy = 1

		const final = split.map(word => {
			const lower = word.toLowerCase()

			this.partsOfSpeech.some(partOfSpeech => {
				const partOfSpeechIndex = lower.indexOf(partOfSpeech) // Check it exists
				const nextChar = word.charAt(partOfSpeech.length)

				if (partOfSpeechIndex === 0 && !(nextChar && (nextChar.match(/[a-zA-Z]/g) != null))) {
					const replacement = this.getWord(partOfSpeech)
					word = replacement.word + word.slice(partOfSpeech.length) // Append the rest of the "word" (punctuation)
					entropy = entropy * replacement.entropy

					return true
				}
			})

			return word
		})

		this.templateEntropy = Math.floor(Math.log(entropy) / Math.log(8))

		return final.join(' ')
	}
}

window.customElements.define('random-sentence-generator', RandomSentenceGenerator)

export default RandomSentenceGenerator