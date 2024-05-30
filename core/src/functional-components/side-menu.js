import { html, LitElement } from 'lit'
import { sideMenuStyles } from '../styles/core-css'

class SideMenu extends LitElement {
	static get properties() {
		return {
			items: { type: Array },
			selectedValue: { type: String, reflect: true },
			compact: { type: Boolean, reflect: true }
		}
	}

	static get styles() {
		return [sideMenuStyles]
	}

	constructor() {
		super()
		this.compact = false
	}

	render() {
		return html`
			<nav @side-menu-item-select=${this._handleSelect}>
				<slot></slot>
			</nav>
		`
	}

	firstUpdated(_changedProperties) {
		this.items = [...this.querySelectorAll("side-menu-item")]
	}

	_handleSelect(event) {
		let targetItem = event.target
		this._deselectAllItems()
		targetItem.selected = true
		this.selectedValue = targetItem.label
	}

	_deselectAllItems() {
		this.items.forEach(element => {
			if (this.compact) {
				element.expanded = false
			}

			element.selected = false
			element.hasChildren() ? element.removeAttribute('hasSelectedChild') : undefined
		})
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === "compact") {
				this.items.forEach(item => (item.compact = this.compact))

				let evt = new CustomEvent("side-menu-compact-change", {
					bubbles: true,
					cancelable: true
				})

				this.dispatchEvent(evt)
			}
		})
	}
}

window.customElements.define("side-menu", SideMenu)