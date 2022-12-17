import { css } from 'lit'

export const chatSearchResultsStyles = css`
  .chat-results-card {
    padding: 10px 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: 300px;
    min-height: 200px;
    height: auto;
    border-radius: 5px;
    background-color: var(--white);
  }

  .chat-result-container {
    padding: 5px;
    margin-bottom: 5px;
    transition: box-shadow 0.1s ease-in-out;
    box-shadow: none;
  }

  .chat-result-container:hover {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    -webkit-box-shadow: 0px 0px 6px -1px rgba(0, 0, 0, 0.397);
    box-shadow: 0px 0px 6px -1px rgba(0, 0, 0, 0.397);
  }

  .chat-result {
    font-family: Roboto, sans-serif;
    font-weight: 300;
    letter-spacing: 0.3px;
    font-size: 14px;
    color: var(--chat-bubble-msg-color);
  }

  .spinner-container {
		display: flex;
		width: 100%;
		justify-content: center
	}
`