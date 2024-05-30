import { directive } from 'lit/directive.js'
import { get } from '../util.js'
import { LangChangedDirectiveBase } from './lang-changed-base.js'

export class TranslateDirective extends LangChangedDirectiveBase {
	render(key, values, config) {
		return this.renderValue(() => get(key, values, config))
	}
}

export const translate = directive(TranslateDirective)