import {css} from 'lit';

export const chatGifsExploreStyles = css`
	.container-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 100%;
		height: 100%;
	}

	.collection-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		max-height: 500px;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.collection-wrapper::-webkit-scrollbar-track {
		background-color: whitesmoke;
		border-radius: 7px;
	}

	.collection-wrapper::-webkit-scrollbar {
		width: 6px;
		border-radius: 7px;
		background-color: whitesmoke;
	}

	.collection-wrapper::-webkit-scrollbar-thumb {
		background-color: rgb(180, 176, 176);
		border-radius: 7px;
		transition: all 0.3s ease-in-out;
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

	.search-collection-name {
		display: block;
		padding: 8px 10px;
		font-size: 16px;
		font-family: Montserrat, sans-serif;
		font-weight: 600;
		background-color: #ebeaea21;
		border: 1px solid var(--mdc-theme-primary);
		border-radius: 5px;
		color: var(--chat-bubble-msg-color);
		width: 90%;
		margin: 10px 0;
		outline: none;
	}

	.search-collection-name::placeholder {
		font-size: 16px;
		font-family: Montserrat, sans-serif;
		font-weight: 600;
		opacity: 0.6;
		color: var(--chat-bubble-msg-color);
	}

	.search-collection-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		position: relative;
	}

	.explore-collections-icon {
		position: absolute;
		right: 20px;
		font-size: 13px;
		color: var(--chat-group);
		cursor: pointer;
	}

	.clear-search-icon {
		position: absolute;
		right: 15px;
		font-size: 16px;
		color: var(--chat-group);
		padding: 1px;
		border-radius: 50%;
		background-color: transparent;
		transition: all 0.3s ease-in-out;
	}

	.clear-search-icon:hover {
		cursor: pointer;
		background-color: #e4e3e389;
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

	.lds-circle {
		display: flex;
		align-items: center;
		justify-content: center;
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
`;
