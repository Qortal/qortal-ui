import {css} from 'lit'

export const friendsViewStyles = css`
* {
    box-sizing: border-box;
}
      .top-bar-icon {
            cursor: pointer;
            height: 18px;
            width: 18px;
            transition: 0.2s all;
        }

        .top-bar-icon:hover {
            color: var(--black);
        }

        .modal-button {
            font-family: Roboto, sans-serif;
            font-size: 16px;
            color: var(--mdc-theme-primary);
            background-color: transparent;
            padding: 8px 10px;
            border-radius: 5px;
            border: none;
            transition: all 0.3s ease-in-out;
        }

        .close-row {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            height: 50px;
            flex:0

        }

        .container-body {
            width: 100%;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            margin-top: 5px;
            padding: 0px 6px;
            box-sizing: border-box;
            align-items: center;
            gap: 10px;
        }

        .container-body::-webkit-scrollbar-track {
            background-color: whitesmoke;
            border-radius: 7px;
        }

        .container-body::-webkit-scrollbar {
            width: 6px;
            border-radius: 7px;
            background-color: whitesmoke;
        }

        .container-body::-webkit-scrollbar-thumb {
            background-color: rgb(180, 176, 176);
            border-radius: 7px;
            transition: all 0.3s ease-in-out;
        }

        .container-body::-webkit-scrollbar-thumb:hover {
            background-color: rgb(148, 146, 146);
            cursor: pointer;
        }

        p {
            color: var(--black);
            margin: 0px;
            padding: 0px;
            word-break: break-all;
        }

        .container {
            display: flex;
            width: 100%;
            flex-direction: column;
            height: 100%;
        }

        .chat-right-panel-label {
            font-family: Montserrat, sans-serif;
            color: var(--group-header);
            padding: 5px;
            font-size: 13px;
            user-select: none;
        }

        .group-info {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: 10px;
        }

        .group-name {
            font-family: Raleway, sans-serif;
            font-size: 20px;
            color: var(--chat-bubble-msg-color);
            text-align: center;
            user-select: none;
        }

        .group-description {
            font-family: Roboto, sans-serif;
            color: var(--chat-bubble-msg-color);
            letter-spacing: 0.3px;
            font-weight: 300;
            font-size: 14px;
            margin-top: 15px;
            word-break: break-word;
            user-select: none;
        }

        .group-subheader {
            font-family: Montserrat, sans-serif;
            font-size: 14px;
            color: var(--chat-bubble-msg-color);
        }

        .group-data {
            font-family: Roboto, sans-serif;
            letter-spacing: 0.3px;
            font-weight: 300;
            font-size: 14px;
            color: var(--chat-bubble-msg-color);
        }
        .search-results-div {
    position: absolute;
    top: 25px;
    right: 25px;
  }

  .name-input {
    width: 100%;
    outline: 0;
    border-width: 0 0 2px;
    border-color: var(--mdc-theme-primary);
    background-color: transparent;
    padding: 10px;
    font-family: Roboto, sans-serif;
    font-size: 15px;
    color: var(--chat-bubble-msg-color);
    box-sizing: border-box;
  }

  .name-input::selection {
        background-color: var(--mdc-theme-primary);
        color: white;
  }

  .name-input::placeholder {
    opacity: 0.9;
    color: var(--black);
  }

  .search-field {
    width: 100%;
    position: relative;
  }

  .search-icon {
    position: absolute;
    right: 3px;
    color: var(--chat-bubble-msg-color);
    transition: hover 0.3s ease-in-out;
    background: none;
    border-radius: 50%;
    padding: 6px 3px;
    font-size: 21px;
  }

  .search-icon:hover {
    cursor: pointer;
    background: #d7d7d75c;
  }
`
