import { AsyncDirective } from 'lit/async-directive.js'
import { listenForLangChanged } from '../util.js'

export class LangChangedDirectiveBase extends AsyncDirective {
	constructor() {
		super(...arguments)
		this.langChangedSubscription = null
		this.getValue = (() => '')
	}

	renderValue(getValue) {
		this.getValue = getValue
		this.subscribe()
		return this.getValue()
	}

	langChanged(e) {
		this.setValue(this.getValue(e))
	}

	subscribe() {
		if (this.langChangedSubscription == null) {
			this.langChangedSubscription = listenForLangChanged(this.langChanged.bind(this))
		}
	}

	unsubscribe() {
		if (this.langChangedSubscription != null) {
			this.langChangedSubscription()
		}
	}

	disconnected() {
		this.unsubscribe()
	}

	reconnected() {
		this.subscribe()
	}
}