// popover-component.js
import {css, html, LitElement} from 'lit';
import {createPopper} from '@popperjs/core';
import '@material/mwc-icon'

export class PopoverComponent extends LitElement {
    static styles = css`
        :host {
            display: none;
            position: absolute;
            background-color: var(--white);
            border: 1px solid #ddd;
            padding: 8px;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            color: var(--black);
            max-width: 250px;
        }

        .close-icon {
            cursor: pointer;
            float: right;
            margin-left: 10px;
            color: var(--black)
        }


    `;

    static properties = {
        for: { type: String, reflect: true },
        message: { type: String }
    };

    constructor() {
        super();
        this.message = '';
    }

    firstUpdated() {
        // We'll defer the popper attachment to the openPopover() method to ensure target availability
    }

    attachToTarget(target) {
        if (!this.popperInstance && target) {
            this.popperInstance = createPopper(target, this, {
                placement: 'bottom',
                strategy: 'fixed'
            });
        }
    }

    openPopover(target) {
        this.attachToTarget(target);
        this.style.display = 'block';
    }

    closePopover() {
        this.style.display = 'none';
        if (this.popperInstance) {
            this.popperInstance.destroy();
            this.popperInstance = null;
        }
        this.requestUpdate();
    }

    render() {
        return html`
            <span class="close-icon" @click="${this.closePopover}"><mwc-icon style="color: var(--black)">close</mwc-icon></span>
            <div><mwc-icon style="color: var(--black)">info</mwc-icon> ${this.message} <slot></slot>
</div>
        `;
    }
}

customElements.define('popover-component', PopoverComponent);
