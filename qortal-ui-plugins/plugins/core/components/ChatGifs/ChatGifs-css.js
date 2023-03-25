import { css } from 'lit';

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
		max-height: calc(95vh - 90px);
		min-width: 370px;
		max-width: 370px;
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
		box-shadow: 0px 4px 5px 0px hsla(0, 0%, 0%, 0.14),
			0px 1px 10px 0px hsla(0, 0%, 0%, 0.12),
			0px 2px 4px -1px hsla(0, 0%, 0%, 0.2);
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
		font-family: 'Maven Pro', sans-serif;
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
		font-family: 'Maven Pro', sans-serif;
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
		box-shadow: rgb(0 0 0 / 14%) 0px 1px 1px 0px,
			rgb(0 0 0 / 12%) 0px 2px 1px -1px, rgb(0 0 0 / 20%) 0px 1px 3px 0px;
		transition: all 0.3s ease-in-out;
		cursor: auto;
	}

	.collection-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
	}

	.collection-gifs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 10px;
		margin-top: 10px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.collection-gifs::-webkit-scrollbar-track {
		background-color: whitesmoke;
		border-radius: 7px;
	}

	.collection-gifs::-webkit-scrollbar {
		width: 6px;
		border-radius: 7px;
		background-color: whitesmoke;
	}

	.collection-gifs::-webkit-scrollbar-thumb {
		background-color: rgb(180, 176, 176);
		border-radius: 7px;
		transition: all 0.3s ease-in-out;
	}

	.collection-gif {
		border-radius: 15px;
		background-color: transparent;
		cursor: pointer;
		width: 100%;
		height: 150px;
		object-fit: cover;
		border: 1px solid transparent;
		transition: all 0.2s cubic-bezier(0, 0.55, 0.45, 1);
		box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px,
			rgb(0 0 0 / 30%) 0px 3px 7px -3px;
	}

	.collection-gif:hover {
		border: 1px solid var(--mdc-theme-primary);
	}

	.new-collection-row {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
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

	.new-collection-container {
		display: flex;
		margin: 15px 20px;
		border: 3.5px dashed #b898c1;
		border-radius: 10px;
		background-color: #d7d3db2e;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.new-collection-icon {
		font-size: 30px;
		color: var(--mdc-theme-primary);
	}

	.gifs-added-col {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		flex: 1 1 0%;
		margin-top: 10px;
		overflow-y: auto;
		max-height: 300px;
	}

	.gifs-added-row {
		display: flex;
		flex-direction: column;
		gap: 5px;
		overflow-y: auto;
	}

	.gifs-added-row .gif-input:last-child {
		border-bottom: none;
	}

	.gifs-added-row::-webkit-scrollbar-track {
		background-color: whitesmoke;
		border-radius: 7px;
	}

	.gifs-added-row::-webkit-scrollbar {
		width: 6px;
		border-radius: 7px;
		background-color: whitesmoke;
	}

	.gifs-added-row::-webkit-scrollbar-thumb {
		background-color: rgb(180, 176, 176);
		border-radius: 7px;
		transition: all 0.3s ease-in-out;
	}

	.gif-input {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		background-color: transparent;
		padding: 15px 5px;
		border-bottom: 1px solid #7b787888;
	}

	.gif-input-img {
		width: 70px;
		height: 70px;
		border-radius: 10px;
	}

	.gif-input-field {
		height: 30px;
		background-color: transparent;
		border: none;
		color: var(--chat-bubble-msg-color);
		border-bottom: 1px solid var(--chat-bubble-msg-color);
		width: 100%;
		padding: 0;
		margin: 0;
		outline: 0;
		font-size: 16px;
		font-family: Roboto, sans-serif;
		letter-spacing: 0.3px;
		font-weight: 300;
	}

	.upload-collection-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		margin-top: 10px;
	}

	.upload-collection-name {
		display: block;
		padding: 8px 10px;
		font-size: 16px;
		font-family: Montserrat, sans-serif;
		font-weight: 600;
		background-color: #ebeaea21;
		border: 1px solid var(--mdc-theme-primary);
		border-radius: 5px;
		color: var(--chat-bubble-msg-color);
		outline: none;
	}

	.upload-collection-name::placeholder {
		font-size: 16px;
		font-family: Montserrat, sans-serif;
		font-weight: 600;
		opacity: 0.6;
		color: var(--chat-bubble-msg-color);
	}

	.collection-back-button {
		display: flex;
		font-family: Roboto, sans-serif;
		font-weight: 300;
		letter-spacing: 0.3px;
		font-size: 16px;
		width: fit-content;
		gap: 10px;
		color: var(--chat-bubble-msg-color);
		flex-direction: row;
		align-items: center;
		transition: box-shadow 0.2s ease-in-out;
		background-color: var(--gif-button-row-bg);
		border-radius: 3px;
		box-shadow: rgb(0 0 0 / 20%) 0px 0px 0px;
		padding: 8px 10px;
		cursor: pointer;
	}

	.collection-back-button:hover {
		border: none;
		box-sizing: border-box;
		box-shadow: rgb(0 0 0 / 14%) 0px 4px 5px 0px,
			rgb(0 0 0 / 12%) 0px 1px 10px 0px, rgb(0 0 0 / 20%) 0px 2px 4px -1px;
	}

	.collection-back-button-arrow {
		font-size: 10px;
	}

	.no-collections {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: var(--chat-bubble-msg-color);
		font-size: 20px;
		font-family: Paytone One, sans-serif;
		margin-top: 20px;
		user-select: none;
	}

	.collection-card {
		display: flex;
		font-family: Roboto, sans-serif;
		font-weight: 300;
		letter-spacing: 0.3px;
		font-size: 19px;
		color: var(--chat-bubble-msg-color);
		flex-direction: row;
		align-items: center;
		transition: all 0.3s ease-in-out;
		box-shadow: none;
		padding: 10px;
		cursor: pointer;
	}

	.collection-card:hover {
		border: none;
		border-radius: 5px;
		background-color: var(--gif-collection-hover-bg);
	}

	.upload-button {
		font-family: Roboto, sans-serif;
		font-size: 16px;
		color: var(--mdc-theme-primary);
		background-color: transparent;
		padding: 8px 10px;
		border-radius: 5px;
		border: none;
		transition: all 0.4s ease-in-out;
	}

	.upload-back-button {
		font-family: Roboto, sans-serif;
		font-size: 16px;
		color: #f44336;
		background-color: transparent;
		padding: 8px 10px;
		border-radius: 5px;
		border: none;
		transition: all 0.3s ease-in-out;
	}

	.upload-back-button:hover {
		cursor: pointer;
		background-color: #f4433663;
	}

	.upload-button:hover {
		cursor: pointer;
		background-color: #03a8f475;
	}

	.lds-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 70px;
	}

	.lds-circle > div {
		display: inline-block;
		width: 80px;
		height: 80px;
		margin: 8px;
		border-radius: 50%;
		background: var(--mdc-theme-primary);
		animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
	}

	@keyframes lds-circle {
		0%,
		100% {
			animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
		}
		0% {
			transform: rotateY(0deg);
		}
		50% {
			transform: rotateY(1800deg);
			animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
		}
		100% {
			transform: rotateY(3600deg);
		}
	}

	.gifs-loading-message {
		font-family: Montserrat, sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: var(--chat-bubble-msg-color);
		margin: 0 0 10px 0;
		text-align: center;
		user-select: none;
	}

	.subscribe-button {
		position: absolute;
		bottom: 3px;
		left: 50%;
		transform: translateX(-50%);
		font-family: Raleway, sans-serif;
		font-weight: 500;
		font-size: 14px;
		background-color: var(--mdc-theme-primary);
		border: none;
		border-radius: 8px;
		outline: none;
		padding: 5px 10px;
		transition: all 0.3s cubic-bezier(0.5, 1, 0.89, 1);
	}

	.subscribe-button:hover {
		cursor: pointer;
		box-shadow: 0px 3px 4px 0px hsla(0, 0%, 0%, 0.14),
			0px 3px 3px -2px hsla(0, 0%, 0%, 0.12),
			0px 1px 8px 0px hsla(0, 0%, 0%, 0.2);
	}

	.unsubscribe-button {
		position: absolute;
		width: max-content;
		bottom: 3px;
		left: 50%;
		transform: translateX(-50%);
		font-family: Raleway, sans-serif;
		font-weight: 500;
		font-size: 14px;
		background-color: #f44336;
		border: none;
		border-radius: 8px;
		outline: none;
		padding: 5px 10px;
		transition: all 0.3s cubic-bezier(0.5, 1, 0.89, 1);
	}

	.unsubscribe-button:hover {
		cursor: pointer;
		box-shadow: 0px 3px 4px 0px hsla(0, 0%, 0%, 0.14),
			0px 3px 3px -2px hsla(0, 0%, 0%, 0.12),
			0px 1px 8px 0px hsla(0, 0%, 0%, 0.2);
	}
`;
