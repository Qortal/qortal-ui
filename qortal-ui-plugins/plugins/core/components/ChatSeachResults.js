import { LitElement, html } from 'lit';
import { render } from 'lit/html.js';
import { chatSearchResultsStyles } from './ChatSearchResults-css.js'

export class ChatSearchResults extends LitElement {
  static get properties() {
		return {
      onClickFunc: { attribute: false },
      searchResults: { type: Array },
      loading: { type: Boolean }
    }
	}

  static styles = [chatSearchResultsStyles]

  render() {
    console.log(this.searchResults, "search results here");
    return html`
      <div class="chat-results-card">
        ${this.loading ? (
          html`
            <div class="spinner-container">
              <paper-spinner-lite active></paper-spinner-lite>
            </div>
          `
        ) : (
          html`
          ${this.searchResults.map((result) => {
            return (
              html`
              <div class="chat-result-container" @click=${() => {
                  this.onClickFunc();
              }}>
                <p class="chat-result">
                  ${result}
                </p>
              </div>
              `
            )}
          )}
          `
        )}
      </div>
    `;
  }
}
customElements.define('chat-search-results', ChatSearchResults);
