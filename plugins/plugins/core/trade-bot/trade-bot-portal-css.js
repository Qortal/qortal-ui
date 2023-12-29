import {css} from 'lit'

export const tradebotStyles = css`
  * {
    --mdc-theme-primary: rgb(3, 169, 244);
    --mdc-theme-secondary: var(--mdc-theme-primary);
    --mdc-theme-error: rgb(255, 89, 89);
    --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
    --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
    --mdc-text-field-label-ink-color: var(--black);
    --mdc-text-field-ink-color: var(--black);
    --mdc-select-outlined-idle-border-color: var(--txtfieldborder);
    --mdc-select-outlined-hover-border-color: var(--txtfieldhoverborder);
    --mdc-select-label-ink-color: var(--black);
    --mdc-select-ink-color: var(--black);
    --mdc-theme-surface: var(--white);
    --mdc-dialog-content-ink-color: var(--black);
    --mdc-dialog-shape-radius: 25px;
    --paper-input-container-focus-color: var(--mdc-theme-primary);
    --lumo-primary-text-color: rgb(0, 167, 245);
    --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
    --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
    --lumo-primary-color: hsl(199, 100%, 48%);
    --lumo-base-color: var(--white);
    --lumo-body-text-color: var(--black);
    --lumo-secondary-text-color: var(--sectxt);
    --lumo-contrast-60pct: var(--vdicon);
    --_lumo-grid-border-color: var(--border);
    --_lumo-grid-secondary-border-color: var(--border2);
  }

  paper-spinner-lite {
    height: 30px;
    width: 30px;
    --paper-spinner-color: var(--mdc-theme-primary);
    --paper-spinner-stroke-width: 3px;
  }

  mwc-tab-bar {
    --mdc-text-transform: none;
    --mdc-tab-color-default: var(--black);
    --mdc-tab-text-label-color-default: var(--black);
  }

  #tabs-1 {
    --mdc-tab-height: 42px;
    border-left: 1px solid var(--tradeborder);
    border-top: 1px solid var(--tradeborder);
    border-right: 1px solid var(--tradeborder);
    color: var(--black);
  }

  #tab-buy[active] {
    --mdc-theme-primary: rgba(55, 160, 51, 0.9);
  }

  #tabs-1-content {
    height: 100%;
    padding-bottom: 10px;
  }

  #tabs-1-content>div {
    height: 100%;
    border: 1px solid var(--tradeborder);
  }

  #tabs-1-content .card {
    border: none;
  }

  #tabs-1-content .btn-clear {
    --mdc-icon-button-size: 32px;
    color: var(--black);
  }

  .btn-clear-bot {
    --mdc-icon-button-size: 32px;
    color: var(--black);
    float: right;
  }

  .btn-info {
    color: #03a9f4;
    --mdc-icon-size: 16px;
    padding-top: 3px;
  }

  #tab-sell[active] {
    --mdc-theme-primary: rgb(255, 89, 89);
  }

  #trade-portal-page {
    background: var(--white);
    padding: 12px 24px;
  }

  .divCard {
    border: 1px solid var(--black);
    padding: 1em;
    box-shadow: 0 0.3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  }

  h2 {
    margin: 10px 0;
  }

  h4 {
    margin: 5px 0;
  }

  p {
    font-size: 14px;
    line-height: 21px;
  }

  .card-body {
    background-color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
    margin: 0;
  }

  .card-container {
    background-color: var(--white);
    border-radius: 5px;
    color: var(--black);
    padding-top: 30px;
    position: relative;
    width: 350px;
    max-width: 100%;
    text-align: center;
  }

  .card-container .level {
    color: #ffffff;
    background-color: #03a9f4;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    padding: 3px 7px;
    position: absolute;
    top: 30px;
    left: 30px;
  }

  .card-container .founder {
    color: #ffffff;
    background-color: #03a9f4;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    padding: 3px 7px;
    position: absolute;
    top: 30px;
    right: 30px;
  }

  .card-container .round {
    width: 96px;
    height: 96px;
    border: 1px solid #03a9f4;
    border-radius: 50%;
    padding: 2px;
  }

  .card-container .badge {
    width: 200px;
    height: 135px;
    border: 1px solid transparent;
    border-radius: 10%;
    padding: 2px;
  }

  .userdata {
    background-color: #1F1A36;
    text-align: left;
    padding: 15px;
    margin-top: 30px;
  }

  .userdata ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .userdata ul li {
    border: 1px solid #2D2747;
    border-radius: 2px;
    display: inline-block;
    font-size: 12px;
    margin: 0 7px 7px 0;
    padding: 7px;
  }

  h2,
  h3,
  h4,
  h5 {
    color: var(--black);
    font-weight: 400;
  }

  header {
    display: flex;
    flex: 0 1 auto;
    align-items: center;
    justify-content: center;
    padding: 0px 10px;
    font-size: 16px;
    color: var(--white);
    background-color: var(--tradehead);
    border-left: 1px solid var(--tradeborder);
    border-top: 1px solid var(--tradeborder);
    border-right: 1px solid var(--tradeborder);
    min-height: 40px;
  }

  p {
    margin-bottom: 12px;
  }

  #trade-portal {
    max-width: 100vw;
    margin-left: auto;
    margin-right: auto;
  }

  .box {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    height: 100%;
  }

  .box-bot {
    margin: 0;
    padding: 0;
    display: flex;
    flex-flow: column;
    height: 150px;
  }

  #first-trade-section {
    margin-bottom: 10px;
  }

  #first-trade-section>div {}

  #second-trade-section {
    margin-bottom: 10px;
  }

  #second-trade-section>div {}

  #third-trade-section {
    margin-bottom: 10px;
  }

  #third-trade-section>div {}

  .trade-chart {
    background-color: var(--white);
    border: 2px #ddd solid;
    text-align: center;
  }

  .open-trades {
    text-align: center;
  }

  .open-market-container {
    text-align: center;
  }

  .trade-bot-container {
    text-align: center;
  }

  .no-last-seen {
    background: rgb(255, 89, 89);
    padding: 9px 1.3px;
    border-radius: 50%;
    width: 1rem;
    margin: 0 auto;
  }

  .card {
    padding: 1em;
    border: 1px var(--tradeborder) solid;
    flex: 1 1 auto;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    min-height: inherit;
  }

  .card-bot {
    padding: 1em;
    flex: 1 1 auto;
    display: flex;
    flex-flow: column;
    justify-content: space-evenly;
    width: 350px;
    min-height: inherit;
  }

  .cancel {
    --mdc-theme-primary: rgb(255, 89, 89);
  }

  .border-wrapper {
    border: 1px var(--tradeborder) solid;
    overflow: hidden;
  }

  .amt-text {
    color: var(--tradehave);
    font-size: 15px;
    margin-top: 5px;
    margin-bottom: 12px;
  }

  .exchange {
    color: var(--black);
    font-size: 18px;
    font-weight: bold;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .clear-button {
    display: inline;
    float: right;
    margin-bottom: 5px;
  }

  .exhcnage-text {
    display: inline;
    float: left;
    margin-bottom: 5px;
  }

  .balance-text {
    display: inline;
    float: right;
    margin-bottom: 5px;
  }

  .fee-text {
    display: inline;
    float: left;
    margin-bottom: 5px;
  }

  .tab-text {
    color: var(--tradehave);
    font-size: 12px;
    text-align: left;
    margin-top: 2px;
    margin-bottom: -12px;
  }

  .historic-trades {
    text-align: center;
  }

  .my-open-orders {
    text-align: center;
  }

  .my-historic-trades {
    text-align: center;
  }

  .buttons {
    width: auto !important;
  }

  .buy-button {
    --mdc-theme-primary: rgba(55, 160, 51, 0.9);
  }

  .sell-button {
    --mdc-theme-primary: rgb(255, 89, 89);
  }

  .trade-bot-button {
    margin-top: 20px;
    margin-bottom: 20px;
    --mdc-theme-primary: rgba(55, 160, 51, 0.9);
  }

  .full-width {
    background-color: var(--white);
    border: 2px var(--black);
    height: 200px;
    text-align: center;
  }

  vaading-grid {
    font-size: .8em;
  }

  vaadin-grid-column {
    flex-grow: 1;
  }

  .loadingContainer {
    height: 100%;
    width: 100%;
  }

  .loading,
  .loading:after {
    border-radius: 50%;
    width: 5em;
    height: 5em;
  }

  .loading {
    margin: 10px auto;
    border-width: .6em;
    border-style: solid;
    border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    transform: translateZ(0px);
    animation: 1.1s linear 0s infinite normal none running loadingAnimation;
  }

  mwc-select#coinSelectionMenu {
    font-size: 24px;
    width: 220px;
  }

  mwc-select#coinSelectionMenu mwc-list-item {
    line-height: 30px;
  }

  .coinName::before {
    content: "";
    display: inline-block;
    height: 26px;
    width: 45px;
    position: absolute;
    background-repeat: no-repeat;
    background-size: cover;
    left: 10px;
    top: 10px;
  }

  .btc.coinName:before {
    background-image: url('/img/qortbtc.png');
  }

  .ltc.coinName:before {
    background-image: url('/img/qortltc.png');
  }

  .doge.coinName:before {
    background-image: url('/img/qortdoge.png');
  }

  .dgb.coinName:before {
    background-image: url('/img/qortdgb.png');
  }

  .rvn.coinName:before {
    background-image: url('/img/qortrvn.png');
  }

  .arrr.coinName:before {
    background-image: url('/img/qortarrr.png');
  }

  .coinName {
    display: inline-block;
    height: 26px;
    padding-left: 45px;
  }

  .warning-text {
    animation: blinker 1.5s linear infinite;
    display: inline;
    float: left;
    margin-bottom: 5px;
    color: rgb(255, 89, 89);
  }

  .warning-bot-text {
    animation: blinker 1.5s linear infinite;
    display: inline;
    text-align: center;
    color: rgb(255, 89, 89);
  }

  .red {
    --mdc-theme-primary: #F44336;
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

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  paper-dialog.info {
    width: 75%;
    max-width: 75vw;
    height: 50%;
    max-height: 50vh;
    background-color: var(--white);
    color: var(--black);
    border: 1px solid var(--black);
    border-radius: 15px;
    line-height: 1.6;
    overflow-y: auto;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    padding: 0 1em;
    margin: 12px 0 -6px 0;
  }

  .close-icon {
    font-size: 36px;
  }

  .close-icon:hover {
    cursor: pointer;
    opacity: .6;
  }

  .setpass-wrapper {
    width: 100%;
    min-width: 400px;
    max-width: 450px;
    text-align: center;
    background: var(--white);
    border: 1px solid var(--black);
    border-radius: 15px;
    padding: 10px 10px 0px;
    box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
  }

  .lock-wrapper {
    width: 100%;
    height: 100%;
    min-width: 600px;
    max-width: 600px;
    min-height: 400px;
    max-height: 400px;
    text-align: center;
    background: url("/img/qortal-lock.jpg");
    border: 1px solid var(--black);
    border-radius: 25px;
    padding: 10px 10px 0px;
  }

  .text-wrapper {
    width: 100%;
    height: 100%;
    min-width: 280px;
    max-width: 280px;
    min-height: 64px;
    max-height: 64px;
    text-align: center;
    margin-left: 35px;
    margin-top: 125px;
    overflow: hidden;
  }

  .lock-title-white {
    font-family: 'magistralbold';
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    color: #ffffff;
  }

  .lock-title-red {
    font-family: 'magistralbold';
    font-weight: 700;
    font-size: 26px;
    line-height: 32px;
    color: #df3636;
  }

  @media (min-width: 701px) {
    * {}

    #trade-bot-portal {
      display: grid;
      grid-template-columns: 2fr 4fr 2fr;
      grid-auto-rows: max(80px);
      column-gap: 0.5em;
      row-gap: 0.4em;
      justify-items: stretch;
      align-items: stretch;
      margin-bottom: 20px;
    }

    #first-trade-section {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr;
      grid-auto-rows: max(250px);
      column-gap: 0.5em;
      row-gap: 0.4em;
      justify-items: stretch;
      align-items: stretch;
      margin-bottom: 10px;
    }

    #second-trade-section {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr;
      grid-auto-rows: max(250px);
      column-gap: 0.5em;
      row-gap: 0.4em;
      justify-items: stretch;
      align-items: stretch;
      margin-bottom: 10px;
    }

    #third-trade-section {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr;
      grid-auto-rows: max(150px);
      column-gap: 0.5em;
      row-gap: 0.4em;
      justify-items: stretch;
      align-items: stretch;
      margin-bottom: 10px;
    }

    #fourth-trade-section {
      display: grid;
      grid-template-columns: 1fr 4fr 1fr;
      grid-auto-rows: max(150px);
      column-gap: 0.5em;
      row-gap: 0.4em;
      justify-items: stretch;
      align-items: stretch;
      margin-bottom: 10px;
    }
  }
`