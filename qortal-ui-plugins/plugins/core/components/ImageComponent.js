import { LitElement, html, css } from 'lit';
import { translate, get } from 'lit-translate';
import { render } from 'lit/html.js';

export class ImageComponent extends LitElement {

static get properties() {
return {
url: { type: String },
alt: { type: String },
style: { type: String },
attempts: { type: Number },
maxAttempts: { type: Number },
error: { type: Boolean }
}
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
`
}

constructor() {
  super();
  this.src = '';
  this.attempts = 0;
  this.maxAttempts = 5;
}

async _fetchImage() {
  this.attempts++;
  if (this.attempts > this.maxAttempts) return;

  try {
    const response = await fetch(`http://your-backend-api/image-src`);
    const data = await response.json();
    if (data.ok) {
    this.error = false;
    } else {
      this.error = true;
    }
    this.src = data.src;
  } catch (error) {
    this.error = true;
    console.error(error);
    this._fetchImage();
  }
}

render() {
console.log(19, "image component here");
return html`
${this.url && !this.error 
  ? html`
<img
.style=${this.style}
src=${this.url}
alt=${this.alt} 
@error=${this._fetchImage}
/>`
  : this.error && this.attempts <= this.maxAttempts ? html`
<p class='gif-error-msg'>${translate('chatpage.cchange94')}</p>
`
  : html`
  <p class='gif-error-msg'>${translate('chatpage.cchange95')}</p>
  `
}`
}
}

customElements.define('image-component', ImageComponent);
