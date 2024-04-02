import {css} from 'lit'

export const qchatStyles = css` 
	* {
		--mdc-theme-primary: rgb(3, 169, 244);
		--mdc-theme-secondary: var(--mdc-theme-primary);
		--paper-input-container-focus-color: var(--mdc-theme-primary);
		--mdc-theme-surface: var(--white);
		--mdc-dialog-content-ink-color: var(--black);
		--lumo-primary-text-color: rgb(0, 167, 245);
		--lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
		--lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
		--lumo-primary-color: hsl(199, 100%, 48%);
		--lumo-base-color: var(--white);
		--lumo-body-text-color: var(--black);
		--_lumo-grid-border-color: var(--border);
		--_lumo-grid-secondary-border-color: var(--border2);
		--mdc-dialog-min-width: 750px;
		scrollbar-width: thin;
		scrollbar-color: #6a6c75 #a1a1a1;
	}
	
	paper-spinner-lite {
		height: 24px;
		width: 24px;
		--paper-spinner-color: var(--mdc-theme-primary);
		--paper-spinner-stroke-width: 2px;
	}
	
	*, 
	*:before, 
	*:after {
		box-sizing: border-box;
	}
	
	ul {
		list-style: none;
		padding: 0;
	}
	
	.container {
		margin: 0 auto;
		width: 100%;
		background: var(--white);
	}
	
	.people-list {
		width: 20vw;
		float: left;
		height: 100vh;
		overflow-y: hidden;
		border-right: 3px #ddd solid;
	}
	
	.people-list .blockedusers {
		z-index: 1;
		position: absolute;
		bottom: 0;
		width: 20vw;
		background: var(--white);
		border-right: 3px #ddd solid;
		display: flex;
		justify-content: space-between;
		gap: 15px;
		flex-direction: column;
		padding: 5px 30px 0 30px;
	}
	
	.groups-button-container {
		position: relative;
	}
	
	.groups-button {
		width: 100%;
		background-color: rgb(116, 69, 240);
		border: none;
		color: white;
		font-weight: bold;
		font-family: Roboto, sans-serif;
		letter-spacing: 0.8px;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		gap: 10px;
		padding: 5px 8px;
		transition: all 0.1s ease-in-out;
	}
	
	.groups-button-notif {
		position: absolute;
		top: -10px;
		right: -8px;
		width: 25px;
		border-radius: 50%;
		height: 25px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: Montserrat, sans-serif;
		font-size: 16px;
		color: black;
		background-color: rgb(51, 213, 0);
		user-select: none;
		transition: all 0.3s ease-in-out 0s;
	}
	
	.groups-button-notif:hover {
		cursor: auto;
		box-shadow: rgba(99, 99, 99, 0.2) 0 2px 8px 0;
	}
	
	.groups-button-notif:hover + .groups-button-notif-number {
		display: block;
		opacity: 1;
		animation: fadeIn 0.6s;
	}
	
	@keyframes fadeIn { 
		from {
			opacity: 0;
			top: -10px;
		}
		
		to {
			opacity: 1;
			top: -60px;
		} 
	}
	
	.groups-button-notif-number {
		position: absolute;
		transform: translateX(-50%);
		left: 50%;
		width: 150px;
		text-align: center;
		border-radius: 3px;
		padding: 5px 10px;
		background-color: white;
		color: black;
		font-family: Roboto, sans-serif;
		letter-spacing: 0.3px;
		font-weight: 300;
		display: none;
		opacity: 0;
		top: -60px;
		box-shadow: rgb(216 216 216 / 25%) 0 6px 12px -2px, rgb(0 0 0 / 30%) 0 3px 7px -3px;
	}
	
	.groups-button:hover {
		cursor: pointer;
		filter: brightness(120%);
	}
	
	.people-list .search {
		padding-top: 20px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		align-items: center;
		gap: 10px;
		justify-content: space-between;
	}
	
	.center {
		margin: 0;
		position: absolute;
		padding-top: 12px;
		left: 50%;
		-ms-transform: translateX(-50%);
		transform: translateX(-50%);
	}
	
	.people-list .create-chat {
		border-radius: 5px;
		border: none;
		color: #fff;
		width: 100%;
		font-size: 15px;
		text-align: center;
		cursor: pointer;
		display: flex;
		flex: 0;
	}
	
	.people-list .create-chat:hover {
		opacity: .8;
		box-shadow: 0 3px 5px rgba(0, 0, 0, .2);
	}
	
	.people-list ul {
		padding: 0 0 60px 0;
		height: 85vh;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.people-list ul::-webkit-scrollbar-track {
		background: #a1a1a1;
    }

    .people-list ul::-webkit-scrollbar {
		width: 11px;
    }

    .people-list ul::-webkit-scrollbar-thumb {
		background-color: #6a6c75;
		border-radius: 6px;
		border: 3px solid #a1a1a1;
    }

	.chat {
		width: 80vw;
		height: 100vh;
      	float: left;
      	background: var(--white);
      	border-top-right-radius: 5px;
      	border-bottom-right-radius: 5px;
      	color: #434651;
      	box-sizing: border-box;
  	}

	.chat .new-message-bar {
		display: flex;
      	flex: 0 1 auto;
      	align-items: center;
      	justify-content: space-between;
      	padding: 0 25px;
      	font-size: 14px;
      	font-weight: 500;
      	top: 0;
      	position: absolute;
      	left: 20vw;
      	right: 0;
      	z-index: 5;
      	background: var(--tradehead);
      	color: var(--white);
      	border-radius: 0 0 8px 8px;
      	min-height: 25px;
      	transition: opacity .15s;
      	text-transform: capitalize;
      	opacity: .85;
      	cursor: pointer;
  	}
	
	.chat .new-message-bar:hover {
		opacity: .75;
		transform: translateY(-1px);
		box-shadow: 0 3px 7px rgba(0, 0, 0, .2);
	}
	
	.hide-new-message-bar {
		display: none !important;
	}
	
	.chat .chat-history {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 100%;
		left: 20vw;
		border-bottom: 2px solid var(--white);
		overflow-y: hidden;
		height: 100vh;
		box-sizing: border-box;
	}
	
	.chat .chat-message {
		padding: 10px;
		height: 10%;
		display: inline-block;
		width: 100%;
		background-color: #eee;
	}
	
	.chat .chat-message textarea {
		width: 90%;
		border: none;
		font-size: 16px;
		padding: 10px 20px;
		border-radius: 5px;
		resize: none;
	}
	
	.chat .chat-message button {
		float: right;
		color: #94c2ed;
		font-size: 16px;
		text-transform: uppercase;
		border: none;
		cursor: pointer;
		font-weight: bold;
		background: #f2f5f8;
		padding: 10px;
		margin-top: 4px;
		margin-right: 4px;
	}
	
	.chat .chat-message button:hover {
		color: #75b1e8;
	}
	
	.online, 
	.offline, 
	.me {
		margin-right: 3px;
		font-size: 10px;
	}
	
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}
	
	.red {
		--mdc-theme-primary: red;
	}
	
	h2 {
		margin:0;
	}
	
	h2, h3, h4, h5 {
		color: var(--black);
		font-weight: 400;
	}
	
	[hidden] {
		display: hidden !important;
		visibility: none !important;
	}
	
	.details {
		display: flex;
		font-size: 18px;
	}
	
	.title {
		font-weight:600;
		font-size:12px;
		line-height: 32px;
		opacity: 0.66;
	}
	
	.textarea {
		width: 100%;
		border: none;
		display: inline-block;
		font-size: 16px;
		padding: 10px 20px;
		border-radius: 5px;
		height: 120px;
		resize: none;
		background: #eee;
	}
	
	.dialog-container {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 0 10px;
		gap: 10px;
		height: 100%;
	}
	
	.dialog-header {
		color: var(--chat-bubble-msg-color);
	}
	
	.dialog-subheader {
		color: var(--chat-bubble-msg-color);
	}
	
	.modal-button-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
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
	
	.modal-button-red {
		font-family: Roboto, sans-serif;
		font-size: 16px;
		color: #F44336;
		background-color: transparent;
		padding: 8px 10px;
		border-radius: 5px;
		border: none;
		transition: all 0.3s ease-in-out;
	}
	
	.modal-button-red:hover {
		cursor: pointer;
		background-color: #f4433663;
	}
	
	.modal-button:hover {
		cursor: pointer;
		background-color: #03a8f475;
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
		transition: all 0.3s ease-in-out;
		background: none;
		border-radius: 50%;
		padding: 6px 3px;
		font-size: 21px;
	}
	
	.search-icon:hover {
		cursor: pointer;
		background: #d7d7d75c;
	}
	
	.search-results-div {
		position: absolute;
		top: 25px;
		right: 25px;
	}
	.user-verified {
		position: absolute;
		top: 0;
		right: 5px;
		display: flex;
		align-items: center;
		gap: 10px;
		color: #04aa2e;
		font-size: 13px;
	}
`