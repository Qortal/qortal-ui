import { css } from 'lit'

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
		padding: 20px;
	}

	.last-message-ref {
		position: fixed;
		font-size: 20px;
		right: 40px;
		bottom: 100px;
		width: 50;
		height: 50;
		z-index: 5;
		opacity: 0;
		color: black;
		background-color: white;
		border-radius: 50%;
		transition: all 0.1s ease-in-out;
	}

	.last-message-ref:hover {
		cursor: pointer;
		transform: scale(1.1);
	}

	.chat-list {
		overflow-y: auto;
		overflow-x: hidden;
		height: 92vh;
		box-sizing: border-box;
	}

	.message-data {
		width: 92%;
		margin-bottom: 15px;
		margin-left: 50px;
	}

	.message-data-name {
		color: var(--black);
	}

	.message-data-time {
		color: #a8aab1;
		font-size: 13px;
		padding-left: 6px;
		padding-bottom: 4px;
	}

	.message-data-level {
		color: #03a9f4;
		font-size: 13px;
		padding-left: 8px;
		padding-bottom: 4px;
	}

	.message-container {
		position: relative;
	}

	.message {
		color: black;
		padding: 12px 10px;
		line-height: 19px;
		white-space: pre-line;
		word-wrap: break-word;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
		font-size: 16px;
		border-radius: 7px;
		margin-bottom: 20px;
		width: 90%;
		position: relative;
	}

	.message:after {
		bottom: 100%;
		left: 93%;
		border: solid transparent;
		content: " ";
		height: 0;
		width: 0;
		position: absolute;
		white-space: pre-line;
		word-wrap: break-word;
		pointer-events: none;
		border-bottom-color: #ddd;
		border-width: 10px;
		margin-left: -10px;
	}

	.message-parent:hover .chat-hover {
		display: block;
	}

	.message-parent:hover .message{
		filter:brightness(0.90);
	}

	.chat-hover {
		display: none;
		position: absolute;
		top: -38px;
		left: 88.2%;
	}

	.emoji {
		width: 1.7em;
		height: 1.5em;
		margin-bottom: -2px;
		vertical-align: bottom;
		object-fit: contain;
	}

	.my-message {
		background: #d1d1d1;
		border: 2px solid #eeeeee;
	}

	.my-message:after {
		border-bottom-color: #d1d1d1;
		left: 7%;
	}

	.other-message {
		background: #f1f1f1;
		border: 2px solid #dedede;
	}

	.other-message:after {
		border-bottom-color: #f1f1f1;
		left: 7%;
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
		gap: 5px;
		background-color: white;
		border: 1px solid #dad9d9;
		border-radius: 5px;
		height:100%;
		width: 100px;
		position: relative;
	}

	.menu-icon {
		width: 100%;
		padding: 5px;
		display: flex;
		align-items: center;
		font-size: 13px;
	}

	.menu-icon:hover {
		background-color: #dad9d9;
		transition: all 0.1s ease-in-out;
		cursor: pointer;
	}

	.tooltip {
		position: relative; 
	}

	.tooltip:before {
		content: attr(data-text); 
		position: absolute;
		top: -47px;
		left: 50%;
		transform: translateX(-50%);
		width: 90px;
		padding: 10px;
		border-radius: 10px;
		background:#fff;
		color: #000;
		text-align: center;
		box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
		font-size: 12px;
		z-index: 5;
		display: none; 
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
		left: -48px;
	}

	.block-user {
		justify-content: space-between;
		border: 1px solid rgb(218, 217, 217);
		border-radius: 5px;
		background-color: white;
		width: 100%;
		height: 32px;
		padding: 3px 8px;
		box-shadow: rgba(77, 77, 82, 0.2) 0px 7px 29px 0px;
	}
`
