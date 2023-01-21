import { LitElement, html } from 'lit';
import { render } from 'lit/html.js';
import { wrapperModalStyles } from './WrapperModal-css.js'

export class WrapperModal extends LitElement {
  static get properties() {
		return {
      customStyle: {type: String},
      onClickFunc: { attribute: false },
      zIndex: {type: Number}
    }
	}

  static styles = [wrapperModalStyles]

  render() {
    return html`
      <div>
        <div 
          style="z-index: ${this.zIndex || 50}" 
          class="backdrop" 
          @click=${() => {
              this.onClickFunc();
          }}>
        </div>
          <div class="modal-body" style=${this.customStyle ? this.customStyle : ""}>
            <slot></slot>
          </div>
      </div>
    `;
  }
}
customElements.define('wrapper-modal', WrapperModal);
