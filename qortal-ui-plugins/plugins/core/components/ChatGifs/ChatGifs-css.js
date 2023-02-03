import { css } from 'lit'

export const gifExplorerStyles = css`
  .gifs-container {
      position: relative;
      display: flex;
      padding: 10px 15px;
      border-radius: 12px;
      box-shadow: rgba(0, 0, 0, 0.09) 0px 3px 12px;
      background-color: var(--chat-menu-bg);
      width: fit-content;
      justify-self: flex-end;
      place-self: end flex-end;
      min-height: 400px;
      min-width: 370px;
      margin-bottom: 8px;
      margin-right: 5px;
      box-shadow: var(--gifs-drop-shadow);
  }

  .gif-explorer-container {
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    user-select: none;
  }

  .explore-collections-icon {
    margin-left: auto;
    text-align: right;
    font-size: 20px;
    color: var(--chat-group);
    box-shadow: var(--gif-search-icon-bs);
    padding: 7px;
    background-color: var(--gif-search-icon);
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .create-collections-icon {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    padding: 4px;
    font-size: 22px;
    background-color: var(--mdc-theme-primary);
    color: white;
    border-radius: 8px;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.2); 
    transition: all 0.3s ease-in-out;
  }

  .create-collections-icon:hover {
    cursor: pointer;
    box-shadow: 0px 4px 5px 0px hsla(0,0%,0%,0.14), 0px 1px 10px 0px hsla(0,0%,0%,0.12), 0px 2px 4px -1px hsla(0,0%,0%,0.2);
  }

  .collections-button-row {
    width: auto;
    background-color: var(--gif-button-row-bg);
    border-radius: 35px;
    padding: 2px;
    margin-top: 10px;
  }

  .collections-button-innerrow {
    display: flex; 
    flex-direction: row;
    align-items: center;
  }

  .my-collections-button {
    font-size: 16px;
    font-family: "Maven Pro", sans-serif;
    letter-spacing: 0.5px;
    color: var(--gif-button-row-color);
    border-radius: 35px;
    padding: 8px 20px;
    margin: 2px 0;
    cursor: pointer;
    user-select: none;
  }

  .subscribed-collections-button {
    font-size: 16px;
    font-family: "Maven Pro", sans-serif;
    letter-spacing: 0.5px;
    color: var(--gif-button-row-color);
    border-radius: 35px;
    padding: 8px 20px;
    margin: 2px 0;
    cursor: pointer;
    user-select: none;
  }

  .collections-button-active {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: var(--mdc-theme-primary);
    border-radius: 25px;
    padding: 8px 20px;
    margin: 2px 0;
    box-shadow: rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px, rgb(0 0 0 / 20%) 0px 1px 3px 0px;
    /* box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px; */
    transition: all 0.3s ease-in-out;
    cursor: auto;
  }

  .new-collection-row {
    display: flex;
    flex-direction: column; 
    justify-content: center;
  }

  .new-collection-subrow {
    display: flex;
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .new-collection-title {
    font-family: Maven Pro, sans-serif;
    color: var(--chat-bubble-msg-color);
    font-size: 18px;
    letter-spacing: 0.6px;
    margin: 0;
    user-select: none;
  }

  .new-collection-subtitle {
    font-family: Roboto, sans-serif;
    color: var(--chat-bubble-msg-color);
    font-weight: 300;
    opacity: 0.9;
    font-size: 14px;
    letter-spacing: 0.3px;
    margin: 0;
    user-select: none;
  }
`
