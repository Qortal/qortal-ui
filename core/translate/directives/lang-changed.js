import { directive } from 'lit/directive.js'
import { LangChangedDirectiveBase } from './lang-changed-base.js'

export class LangChangedDirective extends LangChangedDirectiveBase {
	render(getValue) {
		return this.renderValue(getValue)
	}
}

export const langChanged = directive(LangChangedDirective)