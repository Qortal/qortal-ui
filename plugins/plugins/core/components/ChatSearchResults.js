import { LitElement, html } from 'lit'
import { render } from 'lit/html.js'
import { Epml } from '../../../epml.js'
import { chatSearchResultsStyles } from './ChatSearchResults-css.js'
import { use, get, translate, translateUnsafeHTML, registerTranslateConfig } from 'lit-translate'
import '@vaadin/icon'
import '@vaadin/icons'

const parentEpml = new Epml({ type: 'WINDOW', source: window.parent })

export class ChatSearchResults extends LitElement {
  static get properties() {
    return {
      onClickFunc: { attribute: false },
      closeFunc: { attribute: false },
      searchResults: { type: Array },
      isOpen: { type: Boolean },
      loading: { type: Boolean }
    }
  }

  static styles = [chatSearchResultsStyles]

  render() {
    return html`
      <div class="chat-results-card" style=${this.isOpen ? "display: block;" : "display: none;"}>
        <vaadin-icon 
          @click=${() => this.closeFunc()} 
          icon="vaadin:close-small" 
          slot="icon"
          class="close-icon"
      >
      </vaadin-icon>
        ${this.loading ? (
          html`
            <div class="spinner-container">
              <paper-spinner-lite active></paper-spinner-lite>
            </div>
          `
        ) : (
          html`
          <p class="chat-result-header">${translate("chatpage.cchange36")}</p>
          <div class="divider"></div>
          <div class="chat-result-container">
            ${this.searchResults.length === 0 ? (
              html`<p class="no-results">${translate("chatpage.cchange37")}</p>`
            ) : (
              html`
                ${this.searchResults.map((result) => {
                  return (
                    html`
                      <div class="chat-result-card" @click=${() => {
                        this.shadowRoot.querySelector(".chat-result-card").classList.add("active");
                          this.onClickFunc(result);
                      }}>
                        <p class="chat-result">
                          ${result.name}
                        </p>
                      </div>
                    `
                  )}
                )}
                `
              )}
            </div>
          `
        )}
      </div>
    `
  }
}
customElements.define('chat-search-results', ChatSearchResults)
