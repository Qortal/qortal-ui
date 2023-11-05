import {css} from 'lit'

export const tipUserStyles = css`
  .tip-user-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid whitesmoke;
    gap: 25px;
    user-select: none;
  }

  .tip-user-header-font {
    font-family: Montserrat, sans-serif;
    font-size: 20px;
    color: var(--chat-bubble-msg-color);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tip-user-body {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
    flex-direction: column;
    gap: 25px;
  }

  .tip-input {
    width: 300px;
    margin-bottom: 15px;
    outline: 0;
    border-width: 0 0 2px;
    border-color: var(--mdc-theme-primary);
    background-color: transparent;
    padding: 10px;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    color: var(--chat-bubble-msg-color);
  }

  .tip-input::selection {
    background-color: var(--mdc-theme-primary);
    color: white;
  }

  .tip-input::placeholder {
    opacity: 0.9;
    color: var(--black);
  }

  .tip-available {
    font-family: Roboto, sans-serif;
    font-size: 17px;
    color: var(--chat-bubble-msg-color);
    font-weight: 300;
    letter-spacing: 0.3px;
    margin: 0;
    user-select: none;
  }

  .success-msg {
    font-family: Roboto, sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.3px;
    margin: 0;
    user-select: none;
    color: #10880b;
  }

  .error-msg {
    font-family: Roboto, sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0.3px;
    margin: 0;
    user-select: none;
    color: #f30000;
  }
`
