import {css, html, LitElement} from 'lit';
import {translate,} from '../../../../core/translate'

export class ImageComponent extends LitElement {
  static get properties() {
    return {
      class: { type: String },
      gif: { type: Object },
      alt: { type: String },
      attempts: { type: Number },
      maxAttempts: { type: Number },
      error: { type: Boolean },
      sendMessage: { attribute: false },
      setOpenGifModal: { attribute: false },
    };
  }

  static get styles() {
    return css`
			.gif-error-msg {
				margin: 0;
				font-family: Roboto, sans-serif;
				font-size: 17px;
				letter-spacing: 0.3px;
				color: var(--chat-bubble-msg-color);
				font-weight: 300;
				padding: 10px 10px;
			}

			.gif-image {
				border-radius: 15px;
				background-color: transparent;
				cursor: pointer;
				width: 100%;
				height: 150px;
				object-fit: cover;
				border: 1px solid transparent;
				transition: all 0.2s cubic-bezier(0, 0.55, 0.45, 1);
				box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px,
					rgb(0 0 0 / 30%) 0px 3px 7px -3px;
			}

			.gif-image:hover {
				border: 1px solid var(--mdc-theme-primary);
			}
		`;
  }

  constructor() {
    super();
    this.attempts = 0;
    this.maxAttempts = 5;
  }
  getApiKey() {
    const myNode =
      window.parent.reduxStore.getState().app.nodeConfig.knownNodes[
      window.parent.reduxStore.getState().app.nodeConfig.node
      ]
	  return myNode.apiKey
  }

  async _fetchImage() {
    this.attempts++;
    if (this.attempts > this.maxAttempts) return;
    await new Promise((res) => {
      setTimeout(() => {
        res();
      }, 1000);
    });
    try {
      const response = await fetch(this.gif.url);
      const data = await response.json();
      if (data.ok) {
        this.error = false;
        this.gif = {
          ...this.gif,
          url: data.src,
        };
        this.requestUpdate();
      } else this.error = !data.ok || data.error;
    } catch (error) {
      this.error = true;
      console.error(error);
      await this._fetchImage();
    }
  }

  render() {
    if (this.error && this.attempts <= this.maxAttempts) {
      setTimeout(() => {
        this._fetchImage();
      }, 1000);
    }
    return html` ${this.gif && !this.error
      ? html` <img
					class=${this.class}
					src=${this.gif.url}
					alt=${this.alt}
					@click=${() => {
          this.sendMessage({
            type: 'gif',
            identifier: this.gif.identifier,
            name: this.gif.name,
            filePath: this.gif.filePath,
            service: 'GIF_REPOSITORY',
          });
          this.setOpenGifModal(false);
        }}
					@error=${this._fetchImage}
			  />`
      : this.error && this.attempts <= this.maxAttempts
        ? html`
					<p class="gif-error-msg">${translate('gifs.gchange15')}</p>
			  `
        : html`
					<p class="gif-error-msg">${translate('gifs.gchange16')}</p>
			  `}`;
  }
}

customElements.define('image-component', ImageComponent);
