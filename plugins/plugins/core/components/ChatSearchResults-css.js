import {css} from 'lit'

export const chatSearchResultsStyles = css`
  .chat-results-card {
    position: relative;
    padding: 25px 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: 300px;
    min-height: 200px;
    height: auto;
    border-radius: 5px;
    background-color: var(--white);
  }

  .chat-result-header {
    color: var(--chat-bubble-msg-color);
    font-size: 18px;
    font-family: Montserrat, sans-serif;
    text-align: center;
    margin: 0 0 10px 0;
    user-select: none;
  }

  .divider {
    height: 1px;
    background: var(--chat-bubble-msg-color);
    margin: 0 40px;
    user-select: none;
  }

  .no-results {
    font-family: Roboto, sans-serif;
    font-weight: 300;
    letter-spacing: 0.3px;
    font-size: 16px;
    color: var(--chat-bubble-msg-color);
    text-align: center;
    margin: 20px 0 0 0;
    user-select: none;
  }

  .chat-result-container {
    height: 200px;
    overflow-y: auto;
    padding: 0 10px;
  }

  .chat-result-container::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
  }

  .chat-result-container::-webkit-scrollbar {
        width: 6px;
        border-radius: 7px;
        background-color: whitesmoke;
  }

    .chat-result-container::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
  }

    .chat-result-container::-webkit-scrollbar-thumb:hover {
        background-color: rgb(148, 146, 146);
        cursor: pointer;
  }

  .chat-result-card {
    padding: 12px;
    margin-bottom: 15px;
    margin-top: 15px;
    transition: all 0.2s ease-in-out;
    box-shadow: none;
  }

  .chat-result-card:active {
    background-color: #09b814;
  }

  .chat-result-card:hover {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    -webkit-box-shadow: rgba(132, 132, 132, 40%) 0px 0px 6px -1px;
    box-shadow: rgba(132, 132, 132, 40%) 0px 0px 6px -1px;
  }

  .chat-result {
    font-family: Roboto, sans-serif;
    font-weight: 300;
    letter-spacing: 0.3px;
    font-size: 15px;
    color: var(--chat-bubble-msg-color);
    margin: 0;
    user-select: none;
  }

  .spinner-container {
		display: flex;
		width: 100%;
		justify-content: center
	}

  .close-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: var(--chat-bubble-msg-color);
    font-size: 14px;
    transition: all 0.1s ease-in-out;
  }

  .close-icon:hover {
   cursor: pointer;
   font-size: 15px;
  }
`
