import {css} from 'lit'

export const chatStyles = css`
	html {
		--scrollbarBG: #a1a1a1;
		--thumbBG: #6a6c75;
	}

	*::-webkit-scrollbar {
		width: 11px;
	}

	* {
		scrollbar-width: thin;
		scrollbar-color: var(--thumbBG) var(--scrollbarBG);
		--mdc-theme-primary: rgb(3, 169, 244);
		--mdc-theme-secondary: var(--mdc-theme-primary);
		--mdc-dialog-max-width: 85vw;
		--mdc-dialog-max-height: 95vh;
	}

	* :focus-visible {
		outline: none;
	}

	*::-webkit-scrollbar-track {
		background: var(--scrollbarBG);
	}

	*::-webkit-scrollbar-thumb {
		background-color: var(--thumbBG);
		border-radius: 6px;
		border: 3px solid var(--scrollbarBG);
	}

	a {
		color: var(--black);
		text-decoration: none;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 20px 17px;
	}
	.message-sending {
  opacity: 0.5;
  cursor: progress;
}

	.chat-list {
		overflow-y: auto;
		overflow-x: hidden;
		height: 96%;
		box-sizing: border-box;
	}

	.message-data {
		width: 92%;
		margin-bottom: 15px;
		margin-left: 55px;
	}

	.message-data-name {
		user-select: none;
		color: var(--qchat-name);
		margin-bottom: 5px;
	}

	.forwarded-text {
		user-select: none;
		color: var(--general-color-blue);
		margin-bottom: 5px;
	}

	.message-data-forward {
		user-select: none;
		color: var(--mainmenutext);
		margin-bottom: 5px;
		font-size: 12px;
	}

	.message-data-my-name {
		color: var(--qchat-my-name);
		font-weight: bold;
	}

	.message-data-time {
		color: #888888;
		font-size: 13px;
		user-select: none;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding-top: 2px;
	}

	.message-data-time-hidden {
		visibility: hidden;
		transition: all 0.1s ease-in-out;
		color: #888888;
		font-size: 13px;
		user-select: none;
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding-top: 2px;
	}

	.message-user-info {
		display: flex;
		justify-content: space-between;
		width: 100%;
		gap: 10px;
	}

	.chat-bubble-container {
		display:flex;
		gap: 7px;
	}

	.message-container {
		position: relative;
	}

	.message-subcontainer1 {
		position: relative;
		display: flex;
		align-items: flex-end;
	}

	.message-subcontainer2 {
		position: relative;
    display: flex;
		background-color: var(--chat-bubble-bg);
    flex-grow: 0;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 5px;
    padding: 12px 15px 4px 15px;
		width: fit-content;
    min-width: 150px;
	}


	.message-myBg {
		background-color: var(--chat-bubble-myBg) !important;
	}

	.message-triangle {
		position: relative;
	}

	.message-triangle:after {
		content: "";
		position: absolute;
		bottom: 0px;
    left: -9px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0px 0px 7px 9px;
		border-color: transparent transparent var(--chat-bubble-bg) transparent;
	}

	.message-myTriangle {
		position: relative;
	}

	.message-myTriangle:after {
		content: "";
		position: absolute;
		bottom: 0px;
    left: -9px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0px 0px 7px 9px;
		border-color: transparent transparent var(--chat-bubble-myBg) transparent;
	}

	.message-reactions {
    background-color: transparent;
    width: calc(100% - 54px);
    margin-left: 54px;
    display: flex;
    flex-flow: row wrap;
    justify-content: left;
    gap: 8px;
	}

	.original-message {
    position: relative;
		display: flex;
		flex-direction: column;
    color: var(--chat-bubble-msg-color);
    line-height: 19px;
    user-select: text;
    font-size: 15px;
    width: 90%;
    border-radius: 5px;
    padding: 8px 5px 8px 25px;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.original-message:before {
		content: "";
    position: absolute;
    top: 5px;
    left: 10px;
    height: 75%;
    width: 2.6px;
    background-color: var(--mdc-theme-primary);
	}

	.original-message-sender {
		color: var(--mdc-theme-primary);
	}

	.replied-message {
		margin: 0;
		padding: 0;
	}

	.replied-message p {
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 500px;
		max-height: 40px;
		margin: 0;
		padding: 0;
	}

	.message {
		display: flex;
		flex-direction: column;
		color: var(--chat-bubble-msg-color);
		line-height: 19px;
		overflow-wrap: anywhere;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
		font-size: 16px;
		width: 100%;
		position: relative;
	}

	.message-data-avatar {
		margin: 0px 10px 0px 3px;
		width: 42px;
		height: 42px;
		float: left;
	}

	.message-parent {
		padding: 3px;
		background: rgba(245, 245, 245, 0);
	}

	.message-parent:hover {
		background: var(--chat-bubble);
    border-radius: 8px;
	}

	.message-parent:hover .chat-hover {
		display: block;
	}

	.message-parent:hover .message-data-time-hidden {
		visibility: visible;
	}

	.chat-hover {
		display: none;
		position: absolute;
		top: -25px;
		right: 5px;
	}

	.emoji {
		width: 1.7em;
		height: 1.5em;
		margin-bottom: -2px;
		vertical-align: bottom;
		object-fit: contain;
	}

	.align-left {
		text-align: left;
	}

	.align-right {
		text-align: right;
	}

	.float-left {
		float: left;
	}

	.float-right {
		float: right;
	}

	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}

	img {
		border-radius: 25%;
	}

	.container {
		display: flex;
		flex-direction: row;
		align-items: center;
		background-color: var(--chat-menu-bg);
		border: 1px solid var(--chat-menu-outline);
		border-radius: 5px;
		height:100%;
		position: relative;
	}

	.container:focus-visible {
		outline: none;
	}

	.menu-icon {
		width: 100%;
		padding: 5px 7px;
		display: flex;
		align-items: center;
		font-size: 13px;
		color: var(--chat-menu-icon);
	}

	.menu-icon:hover {
		border-radius: 5px;
		background-color: var(--chat-menu-icon-hover);
		transition: all 0.1s ease-in-out;
		cursor: pointer;
	}

	.tooltip {
		position: relative;
	}

	.tooltip:before {
		content: attr(data-text);
		display: none;
		position: absolute;
		top: -47px;
		left: 50%;
		transform: translateX(-50%);
		width: auto;
		padding: 10px;
		border-radius: 10px;
		background:#fff;
		color: #000;
		text-align: center;
		font-size: 12px;
		z-index: 5;
		white-space: nowrap;
  	overflow: hidden;
	}

	.tooltip:hover:before {
		display: block;
	}

	.tooltip:after {
		content: "";
		position: absolute;
		margin-top: -7px;
		top: -7px;
		border: 10px solid #fff;
		border-color: white transparent transparent transparent;
		z-index: 5;
		display: none;
	}

	.tooltip:hover:before, .tooltip:hover:after {
		display: block;
	}

	.block-user-container {
		display: block;
		position: absolute;
		left: -5px;
	}

	.block-user {
		width: 100%;
		padding: 5px 7px;
		display: flex;
		align-items: center;
		font-size: 13px;
		color: var(--chat-menu-icon);
		justify-content: space-evenly;
		border: 1px solid rgb(218, 217, 217);
		border-radius: 5px;
		background-color: var(--chat-menu-bg);
		width: 150px;
		height: 32px;
		padding: 3px 8px;
	}

	.block-user:hover {
		cursor:pointer;
		background-color: var(--block-user-bg-hover);
		transition: all 0.1s ease-in-out 0s;
	}

	.reactions-bg {
		position: relative;
		background-color: #d5d5d5;
		border-radius: 10px;
		padding: 5px;
		color: black;
		transition: all 0.1s ease-in-out;
		border: 0.5px solid transparent;
		cursor: pointer;
	}

	.reactions-bg:hover {
		border: 0.5px solid var(--reaction-bubble-outline);
	}

	.image-container {
		display: flex;
	}

	.message-data-level  {
		height: 21px;
		width: auto;
		overflow: hidden;
	}

	.defaultSize {
		width: 45vh;
		height: 40vh;
	}

	.hideImg {
		visibility: hidden;
	}

	.image-deleted-msg {
		font-family: Roboto, sans-serif;
		font-size: 14px;
		font-style: italic;
		color: var(--chat-bubble-msg-color);
		margin: 0;
		padding-top: 10px;
	}

	.image-delete-icon {
		margin-left: 5px;
    height: 20px;
		cursor: pointer;
		visibility: hidden;
		transition: .2s all;
		opacity: 0.8;
		color: rgb(228, 222, 222);
    padding-left: 7px;
	}

	.image-delete-icon:hover {
		opacity: 1;
	}

	.message-parent:hover .image-delete-icon {
		visibility: visible;
	}

	.imageContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	.spinnerContainer {
		display: flex;
		width: 100%;
		justify-content: center
	}

	.delete-image-msg {
		font-family: Livvic, sans-serif;
		font-size: 20px;
		color: var(--chat-bubble-msg-color);
		letter-spacing: 0.3px;
		font-weight: 300;
		text-align: center;
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

  #messageContent p {
	margin: 0px;
	padding: 0px;
  }

  #messageContent p mark {
	background-color: #ffe066;
  border-radius: 0.25em;
  box-decoration-break: clone;
  padding: 0.125em 0;
  }

  #messageContent > * + * {
    outline: none;
  }

  #messageContent ul,
  ol {
    padding: 0 1rem;
  }

  #messageContent h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  #messageContent code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  #messageContent pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
	white-space: pre-wrap;
  }
  #messageContent pre code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }


  #messageContent img {
    width: 1.7em;
    height: 1.5em;
    margin: 0px;

  }

  #messageContent blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  #messageContent hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  .replied-message p {
	margin: 0px;
	padding: 0px;
  }

  .replied-message > * + * {
    margin-top: 0.75em;
    outline: none;
  }

  .replied-message ul,
  ol {
    padding: 0 1rem;
  }

  .replied-message h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  .replied-message code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  .replied-message pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
	white-space: pre-wrap;
	margin: 0px;
  }

  .replied-message pre code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }

  .replied-message img {
    width: 1.7em;
    height: 1.5em;
    margin: 0px;
  }

  .replied-message blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  .replied-message hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

	.attachment-container {
		display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 5px 0 10px 0;
    gap: 20px;
		cursor: pointer;
	}


	.attachment-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    border: none;
    background-color: var(--mdc-theme-primary);
  }

  .attachment-icon {
    width: 70%;
  }

	.attachment-info {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

  .attachment-name {
    font-family: Work Sans, sans-serif;
    font-size: 16px;
    color: var(--chat-bubble-msg-color);
    margin: 0;
    letter-spacing: 0.4px;
    padding: 5px 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
  }

	.attachment-size {
		font-family: Roboto, sans-serif;
		font-size: 16px;
		color: var(--chat-bubble-msg-color);
		margin: 0;
		letter-spacing: 0.3px;
		font-weight: 300;
	}

	.download-icon {
		position: relative;
		color: var(--chat-bubble-msg-color);
    width: 19px;
		background-color: transparent;
	}

	.download-icon:hover::before {
    background-color: rgb(161 158 158 / 41%);
	}


	.download-icon::before {
		content: "";
		position: absolute;
		border-radius: 50%;
		padding: 18px;
		background-color: transparent;
		transition: all 0.3s ease-in-out;
	}

	.edited-message-style {
		font-family: "Work Sans", sans-serif;
    font-style: italic;
    font-size: 13px;
    visibility: visible;
	}

	.unread-divider {
		width: 100%;
    padding: 5px;
    color: var(--black);
	border-bottom: 1px solid var(--black);
    display: flex;
    justify-content: center;
    border-radius: 2px;
	margin-top: 5px;
	}

  .blink-bg{
	border-radius: 8px;
		animation: blinkingBackground 3s;
	}
	@keyframes blinkingBackground{
		0%		{ background-color: rgba(var(--menuactivergb), 1)}

		100%	        { background-color:rgba(var(--menuactivergb), 0)}
	}

	.smallLoading,
  .smallLoading:after {
      border-radius: 50%;
      width: 2px;
      height: 2px;
  }

  .smallLoading {
      border-width: 0.8em;
      border-style: solid;
      border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
      rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
      font-size: 30px;
      position: relative;
      text-indent: -9999em;
      transform: translateZ(0px);
      animation: 1.1s linear 0s infinite normal none running loadingAnimation;
  }

  @-webkit-keyframes loadingAnimation {
      0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
      }
      100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }

  @keyframes loadingAnimation {
      0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
      }
      100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
      }
  }

`
