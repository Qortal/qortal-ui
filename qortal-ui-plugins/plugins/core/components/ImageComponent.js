import { LitElement, html, css } from 'lit';
import { translate, get } from 'lit-translate';
import { render } from 'lit/html.js';

export class ImageComponent extends LitElement {

static get properties() {
return {
class: { type: String },
url: { type: String },
alt: { type: String },
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

.gif-image {
border-radius: 15px;
background-color: transparent;
cursor: pointer;
width: 100%;
height: 150px;
object-fit: cover;
border: 1px solid transparent;
transition: all 0.2s cubic-bezier(0, 0.55, 0.45, 1);
box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px, rgb(0 0 0 / 30%) 0px 3px 7px -3px;
}

.gif-image:hover {
border: 1px solid var(--mdc-theme-primary );
}
`
}

constructor() {
  super();
  this.attempts = 0;
  this.maxAttempts = 5;
}

async _fetchImage() {
  this.attempts++;
  if (this.attempts > this.maxAttempts) return;

  try {
    const response = await fetch(this.url);
    const data = await response.json();
    console.log({data});
    if (data.ok) {
    this.error = false;
    this.url = data.src;
    this.requestUpdate();
    } else if (!data.ok || data.error) {
      this.error = true;
    } else {
      this.error = false;
    }
  } catch (error) {
    this.error = true;
    console.error(error);
    this._fetchImage();
  }
}

render() {
console.log(5, "Image Component here");
console.log(this.url)
if (this.error && this.attempts <= this.maxAttempts) {
  setTimeout(() => {
    this._fetchImage();
  }, 1000);
}
return html`
${this.url && !this.error 
  ? html`
<img
class=${this.class}
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
