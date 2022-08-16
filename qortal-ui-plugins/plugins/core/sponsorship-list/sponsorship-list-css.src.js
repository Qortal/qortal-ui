import { css } from "lit"

export const pageStyles = css`
	* {
		--mdc-theme-surface: var(--white);
		--mdc-dialog-content-ink-color: var(--black);
		box-sizing: border-box;
	}

	.header-title {
		font-size: 40px;
		color: var(--black);
		font-weight: 400;
		text-align: center;
	}
	.divider {
		color: #eee;
		border-radius: 80%;
		margin-bottom: 2rem;
	}
	.fullWidth {
		width: 100%;
	}
	.page-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		margin-bottom: 75px;
	}
	.inner-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 95%;
		max-width: 1100px;
	}



	.message {
		color: var(--gray);
	}


	
	.form-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 700px;
		height: 50px;
		flex-wrap: wrap;
	}

	.sponsor-minter-text {
		color: var(--black);
    font-weight: bold;
    margin-right: 15px;
    font-size: 18px;
	}

	.row {
		display: flex;
		width: 100%;
	}
	.column {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.column-center {
		align-items: center;
	}
	.no-margin {
		margin: 0;
	}
	.no-wrap {
		flex-wrap: nowrap !important;
	}

	.row-center {
		justify-content: center;
		flex-wrap: wrap;
	}
	.form-item {
		display: flex;
		height: 100%;
	}

	.form-item--button {
		flex-grow: 0;
	}

	.form-item--input {
		flex-grow: 1;
		margin-right: 25px;
		min-width: 275px;
	}

	

	
	.gap {
		gap: 10px;
	}

	.title {
		font-weight: 600;
		font-size: 20px;
		line-height: 28px;
		opacity: 0.66;
		color: var(--switchborder);
	}

	.address {
		overflow-wrap: anywhere;
		color: var(--black);
	}

	h4 {
		font-weight: 600;
		font-size: 20px;
		line-height: 28px;
		color: var(--black);
	}
	mwc-textfield {
		width: 100%;
	}
	vaadin-button {
		height: 100%;
		margin: 0;
		cursor: pointer;
		outline: 1px var(--black) solid;
		min-width: 80px;
	}
	.loader,
	.loader:after {
		border-radius: 50%;
		width: 10em;
		height: 10em;
	}
	.loadingContainer {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
	}

	.backdrop {
		height: 100vh;
		width: 100vw;
		opacity: 0.6;
		background-color: var(--border);
		z-index: 9;
		position: fixed;
	}

	.loading,
	.loading:after {
		border-radius: 50%;
		width: 5em;
		height: 5em;
	}

	.loading {
		margin: 10px auto;
		border-width: 0.6em;
		border-style: solid;
		border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2)
			rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
		font-size: 10px;
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

	.tableGrid {
		display: grid;
		grid-template-columns: minmax(0, 1fr)  minmax(0, 1fr) minmax(
				0,
				1fr
			) minmax(0, 1fr);
		align-items: center;
		gap: 5px;
		width: 100%;
		margin-bottom: 15px;
	
		padding: 5px;
		
	}


	.grid-item {
		text-align: center;
		color: var(--black);
		word-break: break-all;
		overflow: hidden;
	}

	.text {
		color: var(--black)
	}
	.text--bold {
		font-weight: bold;
	}

	.summary-box {
	
		display: flex;
		margin-top: 25px;
		width: 100%;
		flex-wrap: wrap;
	}

	.summary-box p:first-child {
		margin-right: 30px;
	}

	.text--normal {
		font-weight: normal;
	}

	.grid-item p {
		text-decoration: underline;
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.red {
		--mdc-theme-primary: #f44336;
		border-radius: 2px;
		
	}
	 .btn--sponsorshipfinished  {
		background-color: var(--menuactive);
		transition: all .2s;
		animation: onOff 2s infinite;
		--mdc-theme-primary: var(--black);
	}

	

	.dialog-container {
		width: 300px;
		min-height: 300px;
		max-height: 75vh;
		padding: 5px;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
	
		
	}

	.dialog-paragraph {
		word-break: break-all;
		color: var(--black)
	}



	.dialog-header h1 {
		font-size: 18px;
	}

	@keyframes onOff {
  from {opacity: 1}
  to {opacity: .5}
}
	.grid-item-text {
		display: none;
	}

	.sub-title {
		margin-bottom: 10px;
	}

	.sub-title p {
		font-size: 18px;
		color: var(--black);
	}

	@media (max-width: 610px) {
		.sponsor-minter-wrapper {
			width: 100%;
			margin-bottom: 10px;
		}

		.form-item--input {
		flex-grow: 1;
		margin-right: 25px;
		min-width: unset;
	}
	}

	@media (max-width: 710px) {
		.table-header {
			display: none;
		}
		.grid-item-text {
			display: inline;
			color: var(--black);
			text-decoration: none;
			margin: 0px;
			margin-right: 10px;
		}

		.grid-item {
			text-align: start;
			align-items: center;
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		}

		.grid-item p {
			text-decoration: none;
		}

		.tableGrid {
			grid-template-columns: minmax(0, 1fr);
			border-radius: 5px;
			border: 1px solid var(--black);
			padding: 10px;
			margin-bottom: 20px;
		}

		mwc-button {
			grid-column: 1 / -1;
		}
	}
`
