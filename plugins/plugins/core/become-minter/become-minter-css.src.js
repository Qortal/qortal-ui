import {css} from 'lit';

export const pageStyles = css`
	* {
		box-sizing: border-box;
            --mdc-theme-primary: rgb(3, 169, 244);
            --mdc-theme-secondary: var(--mdc-theme-primary);
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
		width: 100%;
	}

	.inner-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 100%;
	}

	.description {
		color: var(--black);
	}

	.message {
		color: var(--gray);
	}

	.sub-main {
		width: 95%;
		display: flex;

		flex-direction: column;
		max-width: 800px;
	}

	.level-black {
		font-size: 32px;
		color: var(--black);
		font-weight: 400;
		text-align: center;
		margin-top: 2rem;
	}

	.form-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
		height: 50px;
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
	}

	.center-box {
		position: absolute;
		width: 100%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, 0%);
		text-align: center;
	}

	.content-box {
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 10px 25px;
		text-align: center;
		display: inline-block;
		margin-bottom: 15px;
		flex-basis: 600px;
	}

	.gap {
		gap: 10px;
	}

	.level-black {
		font-size: 32px;
		color: var(--black);
		font-weight: 400;
		text-align: center;
		margin-top: 2rem;
		text-align: center;
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
`;
