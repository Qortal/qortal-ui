import { LitElement, html } from 'lit';
import { render } from 'lit/html.js';
import { wrapperModalStyles } from './WrapperModal-css.js'

export class WrapperModal extends LitElement {
  static get properties() {
		return {
      onClickFunc: { attribute: false },
    }
	}

  static styles = [wrapperModalStyles]

  render() {
    return html`
      <div>
        <div class="backdrop" @click=${() => {
            this.onClickFunc();
        }}></div>
          <div class="modal-body">
            <slot></slot>
          </div>
      </div>
    `;
  }
}
customElements.define('wrapper-modal', WrapperModal);
