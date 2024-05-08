import { directive } from 'lit/directive.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { TranslateDirective } from './translate.js'
import { get } from '../util.js'

export class TranslateUnsafeHTMLDirective extends TranslateDirective {
	render(key, values, config) {
		return this.renderValue(() => unsafeHTML(get(key, values, config)))
	}
}

export const translateUnsafeHTML = directive(TranslateUnsafeHTMLDirective)