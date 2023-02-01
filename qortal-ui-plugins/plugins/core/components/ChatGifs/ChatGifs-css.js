import { css } from 'lit'

export const gifExplorerStyles = css`
  .gif-explorer-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    align-items: center;
    gap: 15px;
  }

  .title-row {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }

  .gif-explorer-title {
    flex: 1;
    text-align: center;
    font-family: Roboto, sans-serif;
    letter-spacing: 0.8px;
    font-size: 25px;
    color: var(--chat-bubble-msg-color);
    margin: 0;
  }

  .explore-collections-icon {
    margin-left: auto;
    text-align: right;
    font-size: 20px;
    color: var(--chat-bubble-msg-color);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    padding: 5px;
    background-color: var(--chat-menu-bg);
    border: none;
    border-radius: 12px;
  }
`
