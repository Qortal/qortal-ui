import {css} from 'lit'

export const friendsViewStyles = css`
    * {
        box-sizing: border-box;
    }

    .top-bar-icon {
        cursor: pointer;
        height: 18px;
        width: 18px;
        transition: 0.2s all;
    }

    .top-bar-icon:hover {
        color: var(--black);
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

    .close-row {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        height: 50px;
        flex: 0
    }

    .container-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
        align-items: center;
        gap: 10px;
    }

    .container-body::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .container-body::-webkit-scrollbar {
        width: 6px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .container-body::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .container-body::-webkit-scrollbar-thumb:hover {
        background-color: rgb(148, 146, 146);
        cursor: pointer;
    }

    p {
        color: var(--black);
        margin: 0px;
        padding: 0px;
        word-break: break-all;
    }

    .container {
        display: flex;
        width: 100%;
        flex-direction: column;
        height: 100%;
    }

    .chat-right-panel-label {
        font-family: Montserrat, sans-serif;
        color: var(--group-header);
        padding: 5px;
        font-size: 13px;
        user-select: none;
    }

    .group-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 10px;
    }

    .group-name {
        font-family: Raleway, sans-serif;
        font-size: 20px;
        color: var(--chat-bubble-msg-color);
        text-align: center;
        user-select: none;
    }

    .group-description {
        font-family: Roboto, sans-serif;
        color: var(--chat-bubble-msg-color);
        letter-spacing: 0.3px;
        font-weight: 300;
        font-size: 14px;
        margin-top: 15px;
        word-break: break-word;
        user-select: none;
    }

    .group-subheader {
        font-family: Montserrat, sans-serif;
        font-size: 14px;
        color: var(--chat-bubble-msg-color);
    }

    .group-data {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        font-size: 14px;
        color: var(--chat-bubble-msg-color);
    }

    .search-results-div {
        position: absolute;
        top: 25px;
        right: 25px;
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
        transition: hover 0.3s ease-in-out;
        background: none;
        border-radius: 50%;
        padding: 6px 3px;
        font-size: 21px;
    }

    .search-icon:hover {
        cursor: pointer;
        background: #d7d7d75c;
    }
`

export const feedItemStyles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
        box-sizing: border-box;
    }

    :host {
        width: 100%;
        box-sizing: border-box;
    }

    img {
        width: 100%;
        max-height: 30vh;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
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
        border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
        font-size: 30px;
        position: relative;
        text-indent: -9999em;
        transform: translateZ(0px);
        animation: 1.1s linear 0s infinite normal none running loadingAnimation;
    }

    .defaultSize {
        width: 100%;
        height: 160px;
    }

    .parent-feed-item {
        position: relative;
        display: flex;
        background-color: var(--chat-bubble-bg);
        flex-grow: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        border-radius: 5px;
        padding: 12px 15px 4px 15px;
        min-width: 150px;
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 16px;
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .avatarApp {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .feed-item-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .app-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    mwc-menu {
        position: absolute;
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

export const profileModalUpdateStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
        box-sizing: border-box;
    }

    .input {
        width: 90%;
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

    .input::selection {
        background-color: var(--mdc-theme-primary);
        color: white;
    }

    .input::placeholder {
        opacity: 0.6;
        color: var(--black);
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
        color: #f44336;
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

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }

    .modal-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        /* Semi-transparent backdrop */
        z-index: 1000;
    }

    .modal-content {
        position: fixed;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        background-color: var(--mdc-theme-surface);
        width: 80vw;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
        z-index: 1001;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    .modal-overlay.hidden {
        display: none;
    }

    .avatar {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
    }

    .app-name {
        display: flex;
        gap: 20px;
        align-items: center;
        width: 100%;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .inner-content {
        display: flex;
        flex-direction: column;
        max-height: 75vh;
        flex-grow: 1;
        overflow: auto;
    }

    .inner-content::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .inner-content::-webkit-scrollbar {
        width: 12px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .inner-content::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }
`

export const friendsSidePanelParentStyles = css`
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content {
        padding: 16px;
    }

    .close {
        visibility: hidden;
        position: fixed;
        z-index: -100;
        right: -1000px;
    }

    .parent-side-panel {
        transform: translateX(100%);
        /* start from outside the right edge */
        transition: transform 0.3s ease-in-out;
    }

    .parent-side-panel.open {
        transform: translateX(0);
        /* slide in to its original position */

    }
`

export const friendsSidePanelStyles = css`
    :host {
        display: block;
        position: fixed;
        top: 55px;
        right: 0px;
        width: 420px;
        max-width: 95%;
        height: calc(100vh - 55px);
        background-color: var(--white);
        border-left: 1px solid rgb(224, 224, 224);
        z-index: 1;
        transform: translateX(100%);
        /* start from outside the right edge */
        transition: transform 0.3s ease-in-out;
    }

    :host([isOpen]) {
        transform: unset;
        /* slide in to its original position */
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;
    }

    .content::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .content::-webkit-scrollbar {
        width: 12px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .content::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .parent {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .active {
        font-size: 16px;
        background: var(--black);
        color: var(--white);
        padding: 5px;
        border-radius: 2px;
        cursor: pointer;
    }

    .default {
        font-size: 16px;
        color: var(--black);
        padding: 5px;
        border-radius: 2px;
        cursor: pointer;
    }

    .default-content {
        visibility: hidden;
        position: absolute;
        z-index: -50;
    }
`

export const friendItemActionsStyles = css`
    :host {
        display: none;
        position: absolute;
        background-color: var(--white);
        border: 1px solid #ddd;
        padding: 8px;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        color: var(--black);
        max-width: 250px;
    }

    .close-icon {
        cursor: pointer;
        float: right;
        margin-left: 10px;
        color: var(--black);
    }

    .send-message-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: var(--mdc-theme-primary);
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .send-message-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
    }

    .action-parent {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    div[tabindex='0']:focus {
        outline: none;
    }
`

export const coreSyncStatusStyles = css`
    .lineHeight {
        line-height: 33%;
    }

    .tooltip {
        display: inline-block;
        position: relative;
        text-align: left;
    }

    .tooltip .bottom {
        min-width: 200px;
        max-width: 250px;
        top: 35px;
        left: 50%;
        transform: translate(-50%, 0);
        padding: 10px 10px;
        color: var(--black);
        background-color: var(--white);
        font-weight: normal;
        font-size: 13px;
        border-radius: 8px;
        position: absolute;
        z-index: 99999999;
        box-sizing: border-box;
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--black);
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.8s;
    }

    .tooltip:hover .bottom {
        visibility: visible;
        opacity: 1;
    }

    .tooltip .bottom i {
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -12px;
        width: 24px;
        height: 12px;
        overflow: hidden;
    }

    .tooltip .bottom i::after {
        content: '';
        position: absolute;
        width: 12px;
        height: 12px;
        left: 50%;
        transform: translate(-50%, 50%) rotate(45deg);
        background-color: var(--white);
        border: 1px solid var(--black);
        box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
    }
`

export const chatSideNavHeadsStyles = css`
    :host {
        width: 100%;
    }

    ul {
        list-style-type: none;
    }

    li {
        padding: 10px 2px 10px 5px;
        cursor: pointer;
        width: 100%;
        display: flex;
        box-sizing: border-box;
        font-size: 14px;
        transition: 0.2s background-color;
    }

    li:hover {
        background-color: var(--lightChatHeadHover);
    }

    .active {
        background: var(--menuactive);
        border-left: 4px solid #3498db;
    }

    .img-icon {
        font-size: 40px;
        color: var(--chat-group);
    }

    .status {
        color: #92959e;
    }

    .clearfix {
        display: flex;
        align-items: center;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
`

export const beginnerChecklistStyles = css`
    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .count {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 12px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nocount {
        display: none;
    }

    .popover-panel {
        position: absolute;
        width: 200px;
        padding: 10px;
        background-color: var(--white);
        border: 1px solid var(--black);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        top: 40px;
        max-height: 350px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #6a6c75 #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar {
        width: 11px;
    }

    .popover-panel::-webkit-scrollbar-track {
        background: #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar-thumb {
        background-color: #6a6c75;
        border-radius: 6px;
        border: 3px solid #a1a1a1;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .task-list-item {
        display: flex;
        gap: 15px;
        justify-content: space-between;
        align-items: center;
    }

    .checklist-item {
        padding: 5px;
        border-bottom: 1px solid;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        transition: 0.2s all;
    }

    .checklist-item:hover {
        background: var(--nav-color-hover);
    }

    p {
        font-size: 16px;
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }
`

export const addFriendsModalStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
        box-sizing: border-box;
    }

    .input {
        width: 90%;
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

    .input::selection {
        background-color: var(--mdc-theme-primary);
        color: white;
    }

    .input::placeholder {
        opacity: 0.6;
        color: var(--black);
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
        color: #f44336;
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

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }

    .modal-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        /* Semi-transparent backdrop */
        z-index: 1000;
    }

    .modal-content {
        position: fixed;
        top: 50vh;
        left: 50vw;
        transform: translate(-50%, -50%);
        background-color: var(--mdc-theme-surface);
        width: 80vw;
        max-width: 600px;
        padding: 20px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px;
        z-index: 1001;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    }

    .modal-overlay.hidden {
        display: none;
    }

    .avatar {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
    }

    .app-name {
        display: flex;
        gap: 20px;
        align-items: center;
        width: 100%;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .inner-content {
        display: flex;
        flex-direction: column;
        max-height: 75vh;
        flex-grow: 1;
        overflow: auto;
    }

    .inner-content::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .inner-content::-webkit-scrollbar {
        width: 12px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .inner-content::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }
`

export const saveSettingsQdnStyles = css`
    :host {
        margin-right: 20px;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content {
        padding: 16px;
    }

    .close {
        visibility: hidden;
        position: fixed;
        z-index: -100;
        right: -1000px;
    }

    .parent-side-panel {
        transform: translateX(100%);
        /* start from outside the right edge */
        transition: transform 0.3s ease-in-out;
    }

    .parent-side-panel.open {
        transform: translateX(0);
        /* slide in to its original position */
    }

    .notActive {
        opacity: 0.5;
        cursor: default;
        color: var(--black);
    }

    .active {
        opacity: 1;
        cursor: pointer;
        color: green;
    }

    .accept-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: var(--mdc-theme-primary);
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
    }

    .accept-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
    }

    .undo-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: #f44336;
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
    }

    .undo-button:hover {
        cursor: pointer;
        background-color: #f4433663;
    }
`

export const profileQdnStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        box-sizing: border-box;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
    }

    .content {
        padding: 16px;
    }

    .close {
        visibility: hidden;
        position: fixed;
        z-index: -100;
        right: -1000px;
    }

    .parent-side-panel {
        transform: translateX(100%);
        /* start from outside the right edge */
        transition: transform 0.3s ease-in-out;
    }

    .parent-side-panel.open {
        transform: translateX(0);
        /* slide in to its original position */
    }

    .notActive {
        opacity: 0.5;
        cursor: default;
        color: var(--black);
    }

    .active {
        opacity: 1;
        cursor: pointer;
        color: green;
    }

    .accept-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: var(--mdc-theme-primary);
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
    }

    .accept-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
    }

    .undo-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: #f44336;
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
    }

    .undo-button:hover {
        cursor: pointer;
        background-color: #f4433663;
    }

    .full-info-wrapper {
        width: 100%;
        min-width: 600px;
        max-width: 600px;
        text-align: center;
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
        display: block !important;
    }

    .full-info-logo {
        width: 120px;
        height: 120px;
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 50%;
        position: relative;
        top: -110px;
        left: 210px;
    }

    .data-info {
        margin-top: 10px;
        margin-right: 25px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-height: 55vh;
        max-height: 55vh;
        overflow: auto;
    }

    .data-info::-webkit-scrollbar-track {
        background: #a1a1a1;
    }

    .data-info::-webkit-scrollbar-thumb {
        background-color: #6a6c75;
        border-radius: 6px;
        border: 3px solid #a1a1a1;
    }

    .data-info>* {
        flex-shrink: 0;
    }

    .decline {
        --mdc-theme-primary: var(--mdc-theme-error);
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .buttons {
        display: inline;
        float: right;
        margin-bottom: 5px;
    }

    .paybutton {
        display: inline;
        float: left;
        margin-bottom: 5px;
    }

    .round-fullinfo {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        right: 25px;
        top: -1px;
    }

    h2 {
        margin: 10px 0;
    }

    h3 {
        margin-top: -80px;
        color: #03a9f4;
        font-size: 18px;
    }

    h4 {
        margin: 5px 0;
    }

    p {
        margin-top: 5px;
        line-height: 1.2;
        font-size: 16px;
        color: var(--black);
        text-align: start;
        overflow: hidden;
        word-break: break-word;
    }

    .send-message-button {
        cursor: pointer;
        transition: all 0.2s;
    }

    .send-message-button:hover {
        transform: scale(1.1);
    }
`

export const avatarComponentStyles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
        box-sizing: border-box;
    }

    :host {
        width: 100%;
        box-sizing: border-box;
    }

    img {
        width: 100%;
        max-height: 30vh;
        border-radius: 5px;
        cursor: pointer;
        position: relative;
    }

    .smallLoading,
    .smallLoading:after {
        border-radius: 50%;
        width: 2px;
        height: 2px;
    }

    .defaultSize {
        width: 100%;
        height: 160px;
    }

    .parent-feed-item {
        position: relative;
        display: flex;
        background-color: var(--chat-bubble-bg);
        flex-grow: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        border-radius: 5px;
        padding: 12px 15px 4px 15px;
        min-width: 150px;
        width: 100%;
        box-sizing: border-box;
        cursor: pointer;
        font-size: 16px;
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .avatarApp {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .feed-item-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .app-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    mwc-menu {
        position: absolute;
    }
`

export const fragFileInputStyles = css`
    #drop-area {
        border: 2px dashed #ccc;
        font-family: "Roboto", sans-serif;
        padding: 20px;
    }

    #trigger:hover {
        cursor: pointer;
    }

    #drop-area.highlight {
        border-color: var(--mdc-theme-primary, #000);
    }

    p {
        margin-top: 0;
    }

    form {
        margin-bottom: 10px;
    }

    #fileInput {
        display: none;
    }
`

export const confirmTransactionDialogStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
    }

    .decline {
        --mdc-theme-primary: var(--mdc-theme-error)
    }

    #txInfo {
        text-align: left;
        max-width: 520px;
        color: var(--black);
    }

    .buttons {
        text-align: right;
    }

    table td,
    th {
        padding: 4px;
        text-align: left;
        font-size: 14px;
        color: var(--black);
    }
`

export const loadingRippleStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --paper-spinner-color: var(--mdc-theme-secondary);
    }

    #rippleWrapper {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 0;
        width: 0;
        z-index: 999;
        overflow: visible;
        --ripple-activating-transition: transform 0.3s cubic-bezier(0.6, 0.0, 1, 1), opacity 0.3s cubic-bezier(0.6, 0.0, 1, 1);
        --ripple-disable-transition: opacity 0.5s ease;
    }

    #ripple {
        border-radius: 50%;
        border-width: 0;
        margin-left: -100vmax;
        margin-top: -100vmax;
        height: 200vmax;
        width: 200vmax;
        overflow: hidden;
        background: var(--black);
        transform: scale(0);
        overflow: hidden;
    }

    #ripple.error {
        transition: var(--ripple-activating-transition);
        background: var(--mdc-theme-error)
    }

    #rippleShader {
        background: var(--white);
        opacity: 0;
        height: 100%;
        width: 100%;
    }

    #ripple.activating {
        transition: var(--ripple-activating-transition);
        transform: scale(1)
    }

    .activating #rippleShader {
        transition: var(--ripple-activating-transition);
        opacity: 1;
    }

    #ripple.disabling {
        transition: var(--ripple-disable-transition);
        opacity: 0;
    }

    #rippleContentWrapper {
        position: absolute;
        top: 100vmax;
        left: 100vmax;
        height: var(--window-height);
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #rippleContent {
        opacity: 0;
        text-align: center;
    }

    .activating-done #rippleContent {
        opacity: 1;
        transition: var(--ripple-activating-transition);
    }
`

export const myButtonStyle = css`
    vaadin-button {
        height: 100%;
        margin: 0;
        cursor: pointer;
        min-width: 80px;
        background-color: #03a9f4;
        color: white;
    }

    vaadin-button:hover {
        opacity: 0.8;
    }
`

export const mykeyPageStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-heading-ink-color: var(--black);
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

    .red {
        --mdc-theme-primary: red;
    }
`

export const settingsPageStyles = css`
    * {
        --mdc-theme-primary: var(--login-button);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-theme-surface: var(--white);
        --mdc-theme-text-primary-on-background: var(--black);
        --mdc-dialog-min-width: 300px;
        --mdc-dialog-max-width: 650px;
        --mdc-dialog-max-height: 700px;
        --mdc-list-item-text-width: 100%;
    }

    #main {
        width: 210px;
        display: flex;
        align-items: center;
    }

    .globe {
        color: var(--black);
        --mdc-icon-size: 36px;
    }

    span.name {
        display: inline-block;
        width: 150px;
        font-weight: 600;
        color: var(--general-color-blue);
        border: 1px solid transparent;
    }

    .red {
        --mdc-theme-primary: red;
    }

    .buttonred {
        color: #f44336;
    }

    .buttongreen {
        color: #03c851;
    }

    .buttonBlue {
        color: var(--general-color-blue);
    }

    .floatleft {
        float: left;
    }

    .floatright {
        float: right;
    }

    .list-parent {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    #customSelect {
        position: relative;
        border: 1px solid #ccc;
        cursor: pointer;
        background: var(--plugback);
    }

    #customSelect .selected {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #customSelect ul {
        position: absolute;
        top: 100%;
        left: 0;
        list-style: none;
        margin: 0;
        padding: 0;
        border: 1px solid #ccc;
        display: none;
        background: var(--plugback);
        width: 100%;
        box-sizing: border-box;
        z-index: 10;
    }

    #customSelect ul.open {
        display: block;
    }

    #customSelect ul li {
        padding: 10px;
        transition: 0.2s all;
    }

    #customSelect ul li:hover {
        background-color: var(--graylight);
    }

    .selected-left-side {
        display: flex;
        align-items: center;
    }
`

export const sideMenuStyles = css`
    nav {
        padding: 0;
    }

    :host {
        list-style: none;
        width: 100%;
        position: relative;
    }

    :host([compact]) {
        width: auto;
    }
`

export const sideMenuItemStyles = css`
    :host {
        --font-family: "Roboto", sans-serif;
        --item-font-size: 0.9375rem;
        --sub-item-font-size: 0.75rem;
        --item-padding: 0.875rem;
        --item-content-padding: 0.875rem;
        --icon-height: 1.125rem;
        --icon-width: 1.125rem;
        --item-border-radius: 5px;
        --item-selected-color: #dddddd;
        --item-selected-color-text: #333333;
        --item-color-active: #d1d1d1;
        --item-color-hover: #eeeeee;
        --item-text-color: #080808;
        --item-icon-color: #080808;
        --item-border-color: #eeeeee;
        --item-border-selected-color: #333333;

        --overlay-box-shadow: 0 2px 4px -1px hsla(214, 53%, 23%, 0.16), 0 3px 12px -1px hsla(214, 50%, 22%, 0.26);
        --overlay-background-color: #ffffff;

        --spacing: 4px;

        font-family: var(--font-family);
        display: flex;
        overflow: hidden;
        flex-direction: column;
        border-radius: var(--item-border-radius);
    }

    #itemLink {
        align-items: center;
        font-size: var(--item-font-size);
        font-weight: 400;
        height: var(--icon-height);
        transition: background-color 200ms;
        padding: var(--item-padding);
        cursor: pointer;
        display: inline-flex;
        flex-grow: 1;
        align-items: center;
        overflow: hidden;
        text-decoration: none;
        border-bottom: 1px solid var(--item-border-color);
        text-transform: uppercase;
    }

    .hideItem {
        display: none !important;
    }

    #itemLink:hover {
        background-color: var(--item-color-hover);
    }

    #itemLink:active {
        background-color: var(--item-color-active);
    }

    #content {
        padding-left: var(--item-content-padding);
        flex: 1;
    }

    :host([compact]) #content {
        padding-left: 0;
        display: none;
    }

    :host([selected]) #itemLink {
        background-color: var(--item-selected-color);
        color: var(--item-selected-color-text);
        border-left: 3px solid var(--item-border-selected-color);
    }

    :host([selected]) slot[name="icon"]::slotted(*) {
        color: var(--item-selected-color-text);
    }

    :host(:not([selected])) #itemLink {
        color: var(--item-text-color);
    }

    :host([expanded]) {
        background-color: var(--item-selected-color);
    }

    :host([hasSelectedChild]) {
        background-color: var(--item-selected-color);
    }

    :host span {
        cursor: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        -webkit-user-select: none;
        white-space: nowrap;
    }

    slot[name="icon"]::slotted(*) {
        flex-shrink: 0;
        color: var(--item-icon-color);
        height: var(--icon-height);
        width: var(--icon-width);
        pointer-events: none;
    }

    #collapse-button {
        float: right;
    }

    :host([compact]) #itemLink[level]:not([level="0"]) {
        padding: calc(var(--item-padding) / 2);
    }

    :host(:not([compact])) #itemLink[level]:not([level="0"]) {
        padding-left: calc(var(--icon-width) + var(--item-content-padding));
    }

    #itemLink[level]:not([level="0"]) #content {
        display: block;
        visibility: visible;
        width: auto;
        font-weight: 400;
        font-size: var(--sub-item-font-size)
    }

    #overlay {
        display: block;
        left: 101%;
        min-width: 200px;
        padding: 4px 2px;
        background-color: var(--overlay-background-color);
        background-image: var(--overlay-background-image, none);
        box-shadow: var(--overlay-box-shadow);
        border: 1px solid var(--overlay-background-color);
        border-left: 0;
        border-radius: 0 3px 3px 0;
        position: absolute;
        z-index: 1;
        animation: pop 200ms forwards;
    }

    @keyframes pop {
        0% {
            transform: translateX(-5px);
            opacity: 0.5;
        }

        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }
`

export const appInfoStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
    }

    .normal {
        --mdc-theme-primary: rgb(3, 169, 244);
    }

    #profileInMenu {
        flex: 0 0 100px;
        padding: 12px;
        border-top: 1px solid var(--border);
        background: var(--sidetopbar);
    }

    .info {
        margin: 0;
        font-size: 14px;
        font-weight: 100;
        display: inline-block;
        width: 100%;
        padding-bottom: 8px;
        color: var(--black);
    }

    .blue {
        color: #03a9f4;
        margin: 0;
        font-size: 14px;
        font-weight: 200;
        display: inline;
    }

    .black {
        color: var(--black);
        margin: 0;
        font-size: 14px;
        font-weight: 200;
        display: inline;
    }
`

export const languageSelectorStyles = css`
    select {
        width: 175px;
        height: 34px;
        padding: 5px 0px 5px 5px;
        font-size: 16px;
        border: 1px solid var(--black);
        border-radius: 3px;
        color: var(--black);
        background:
            linear-gradient(45deg, transparent 50%, white 50%),
            linear-gradient(135deg, white 50%, transparent 50%),
            linear-gradient(to right, #03a9f4, #03a9f4);
        background-position:
            calc(100% - 17px) calc(0.5em + 4px),
            calc(100% - 7px) calc(0.5em + 4px),
            100% 0;
        background-size:
            10px 10px,
            10px 10px,
            2.2em 2.2em;
        background-repeat: no-repeat;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-appearance: none;
        -moz-appearance: none;
    }

    *:focus {
        outline: none;
    }

    select option {
        color: var(--black);
        background: var(--white);
        line-height: 34px;
    }

`

export const newSelectorStyles = css`
    select {
        width: auto;
        height: auto;
        position: absolute;
        top: 50px;
        padding: 5px 5px 5px 5px;
        font-size: 16px;
        border: 1px solid var(--black);
        border-radius: 3px;
        color: var(--black);
        background: var(--white);
        overflow: auto;
    }

    *:focus {
        outline: none;
    }

    select option {
        color: var(--black);
        background: var(--white);
        line-height: 34px;
    }

    select option:hover {
        color: var(--white);
        background: var(--black);
        line-height: 34px;
        cursor: pointer;
    }
`

export const qortThemeToggleStyles = css`
    :host {
        display: inline-block;
        position: relative;
        width: 54px;
        height: 32px;
        transform: translateY(-2px);
    }

    svg {
        width: 32px;
        height: 32px;
    }

    input {
        cursor: pointer;
        position: absolute;
        z-index: 1;
        opacity: 0;
        width: 100%;
        height: 100%;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 16px;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--switchbackground);
        border: 2px solid var(--switchborder);
        border-radius: 1rem;
        transition: all .4s ease;
    }

    .icon {
        width: 32px;
        height: 32px;
        display: inline-block;
        position: absolute;
        top: 50%;
        background: var(--switchbackground);
        border: 2px solid var(--switchborder);
        border-radius: 50%;
        transition: transform 300ms ease;
    }

    :host([theme="light"]) .icon {
        transform: translate(0, -50%);
    }

    input:checked~.icon,
    :host([theme="dark"]) .icon {
        transform: translate(calc(100% - 12px), -50%);
    }

    .moon {
        display: none;
    }

    .moon svg {
        transform: scale(0.6);
    }

    :host([theme="dark"]) .sun {
        display: none;
    }

    :host([theme="dark"]) .moon {
        display: inline-block;
    }
`

export const searchModalStyles = css`
    * {
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --item-selected-color: var(--nav-selected-color);
        --item-selected-color-text: var(--nav-selected-color-text);
        --item-color-active: var(--nav-color-active);
        --item-color-hover: var(--nav-color-hover);
        --item-text-color: var(--nav-text-color);
        --item-icon-color: var(--nav-icon-color);
        --item-border-color: var(--nav-border-color);
        --item-border-selected-color: var(--nav-border-selected-color);
    }

    paper-dialog.searchSettings {
        min-width: 525px;
        max-width: 525px;
        min-height: auto;
        max-height: 150px;
        background-color: var(--white);
        color: var(--black);
        line-height: 1.6;
        overflow: hidden;
        border: 1px solid var(--black);
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    }

    .search {
        display: inline;
        width: 50%;
        align-items: center;
    }
`

export const startMintingStyles = css`
    p,
    h1 {
        color: var(--black)
    }

    .dialogCustom {
        position: fixed;
        z-index: 10000;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        top: 0px;
        bottom: 0px;
        left: 0px;
        width: 100vw;
    }

    .dialogCustomInner {
        width: 300px;
        min-height: 400px;
        background-color: var(--white);
        box-shadow: var(--mdc-dialog-box-shadow, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
        padding: 20px 24px;
        border-radius: 4px;
    }

    .dialogCustomInner ul {
        padding-left: 0px
    }

    .dialogCustomInner li {
        margin-bottom: 10px;
    }

    .start-minting-wrapper {
        position: absolute;
        transform: translate(50%, 20px);
        z-index: 10;
    }

    .dialog-header h1 {
        font-size: 18px;
    }

    .row {
        display: flex;
        width: 100%;
        align-items: center;
    }

    .modalFooter {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .hide {
        visibility: hidden
    }

    .inactiveText {
        opacity: .60
    }

    .column {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .smallLoading,
    .smallLoading:after {
        border-radius: 50%;
        width: 2px;
        height: 2px;
    }

    .smallLoading {
        border-width: 0.6em;
        border-style: solid;
        border-color: rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgba(3, 169, 244, 0.2) rgb(3, 169, 244);
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

    .word-break {
        word-break: break-all;
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

    .between {
        justify-content: space-between;
    }

    .no-width {
        width: auto
    }

    .between p {
        margin: 0;
        padding: 0;
        color: var(--black);
    }

    .marginLoader {
        margin-left: 10px;
    }

    .marginRight {
        margin-right: 10px;
    }

    .warning {
        display: flex;
        flex-grow: 1
    }

    .message-error {
        color: var(--error);
    }
`

export const themeToggleStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-error: rgb(255, 89, 89);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --item-selected-color: var(--nav-selected-color);
        --item-selected-color-text: var(--nav-selected-color-text);
        --item-color-active: var(--nav-color-active);
        --item-color-hover: var(--nav-color-hover);
        --item-text-color: var(--nav-text-color);
        --item-icon-color: var(--nav-icon-color);
        --item-border-color: var(--nav-border-color);
        --item-border-selected-color: var(--nav-border-selected-color);
    }

    paper-icon-button {
        -ms-transform: rotate(120deg);
        transform: rotate(120deg);
    }

    :host([theme="light"]) .light-mode {
        display: inline-block;
    }

    :host([theme="light"]) .dark-mode {
        display: none;
    }

    :host([theme="dark"]) .light-mode {
        display: none;
    }

    :host([theme="dark"]) .dark-mode {
        display: inline-block;
    }
`

export const walletProfileStyles = css`
    #profileInMenu {
        padding: 12px;
        border-top: var(--border);
        background: var(--sidetopbar);
        color: var(--black);
    }

    #accountName {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        width: 100%;
        padding-bottom: 8px;
        display: flex;
    }

    #blocksMinted {
        margin: 0;
        margin-top: 0;
        font-size: 12px;
        color: #03a9f4;
    }

    #address {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0;
        margin-top: 8px;
        font-size: 11px;
    }

    .round-fullinfo {
        position: relative;
        width: 68px;
        height: 68px;
        border-radius: 50%;
    }

    .full-info-logo {
        width: 68px;
        height: 68px;
        border-radius: 50%;
    }

    .inline-block-child {
        flex: 1;
    }
`

export const appViewStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-error: rgb(255, 89, 89);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --item-selected-color: var(--nav-selected-color);
        --item-selected-color-text: var(--nav-selected-color-text);
        --item-color-active: var(--nav-color-active);
        --item-color-hover: var(--nav-color-hover);
        --item-text-color: var(--nav-text-color);
        --item-icon-color: var(--nav-icon-color);
        --item-border-color: var(--nav-border-color);
        --item-border-selected-color: var(--nav-border-selected-color);
    }

    :host {
        --app-drawer-width: 260px;
    }

    app-drawer-layout:not([narrow]) [drawer-toggle]:not(side-menu-item) {
        display: none;
    }

    app-drawer {
        box-shadow: var(--shadow-2);
    }

    app-header {
        box-shadow: var(--shadow-2);
    }

    app-toolbar {
        background: var(--sidetopbar);
        color: var(--black);
        border-top: var(--border);
        height: 48px;
        padding: 3px;
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .s-menu {
        list-style: none;
        padding: 0px 0px;
        background: var(--sidetopbar);
        border-radius: 2px;
        width: 100%;
        border-top: 1px solid var(--border);
        outline: none;
    }

    .search {
        display: inline;
        width: 50%;
        align-items: center;
    }

    #sideBar {
        height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--sidetopbar);
    }

    .sideBarMenu {
        overflow-y: auto;
        flex: 1 1;
    }

    .sideBarMenu::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .sideBarMenu::-webkit-scrollbar {
        width: 6px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .sideBarMenu::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .sideBarMenu::-webkit-scrollbar-thumb:hover {
        background-color: rgb(148, 146, 146);
        cursor: pointer;
    }

    .red {
        --mdc-theme-primary: #C6011F;
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
`

export const showPluginStyles = css`
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
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-disabled-ink-color: var(--black);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-select-ink-color: var(--black);
        --mdc-select-fill-color: var(--black);
        --mdc-select-label-ink-color: var(--black);
        --mdc-select-idle-line-color: var(--black);
        --mdc-select-hover-line-color: var(--black);
        --mdc-select-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-select-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-shape-radius: 25px;
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 700px;
    }

    *::-webkit-scrollbar-track {
        background: var(--scrollbarBG);
    }

    *::-webkit-scrollbar-thumb {
        background-color: var(--thumbBG);
        border-radius: 6px;
        border: 3px solid var(--scrollbarBG);
    }

    .hideIframe {
        display: none;
        position: absolute;
        z-Index: -10;
    }

    .showIframe {
        display: flex;
        position: relative;
        z-Index: 1;
    }

    .tabs {
        display: flex;
        width: 100%;
        max-width: 100%;
        justify-content: flex-start;
        padding-top: 0.5em;
        padding-left: 0.5em;
        background: var(--sidetopbar);
        border-bottom: 1px solid var(--black);
        height: 48px;
        box-sizing: border-box;
    }

    .tab {
        padding: 0.5em;
        background: var(--white);
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top: 1px solid grey;
        border-left: 1px solid grey;
        border-right: 1px solid grey;
        color: grey;
        cursor: pointer;
        transition: background 0.3s;
        position: relative;
        width: auto;
        min-width: 110px;
        max-width: 220px;
        overflow: hidden;
        z-index: 2;
    }

    .tabCard {
        display: inline-block;
    }

    .tabTitle {
        display: inline-block;
        position: relative;
        width: auto;
        min-width: 1px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .tab:hover {
        background: var(--nav-color-hover);
        color: var(--black);
        min-width: fit-content;
    }

    .tab.active {
        display: inline-block;
        min-width: fit-content;
        max-width: 200px;
        margin-bottom: -1px;
        background: var(--white);
        color: var(--black);
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top: 1px solid var(--black);
        border-left: 1px solid var(--black);
        border-right: 1px solid var(--black);
        border-bottom: 1px solid var(--white);
        z-index: 1;
    }

    .close {
        position: absolute;
        top: 8px;
        right: 5px;
        color: var(--black);
        --mdc-icon-size: 20px;
    }

    .close:hover {
        color: #C6011F;
        font-weight: bold;
    }

    .tab .close,
    .tab .show {
        display: none;
    }

    .tab.active .close,
    .tab.active .show {
        display: inline-block;
        color: var(--black);
    }

    .tab:hover .close,
    .tab:hover .show {
        display: inline-block;
        color: var(--black);
    }

    .tab .close:hover,
    .tab.active .close:hover {
        color: #C6011F;
        font-weight: bold;
    }

    .add-tab-button {
        margin-left: 10px;
        font-weight: bold;
        background: none;
        border: none;
        color: var(--general-color-blue);
        font-size: 2em;
        cursor: pointer;
        transition: color 0.3s;
    }

    .add-tab-button:hover {
        color: var(--black);
    }

    .add-dev-button {
        position: fixed;
        right: 20px;
        margin-left: 10px;
        margin-top: 4px;
        max-height: 28px;
        padding: 5px 5px;
        font-size: 14px;
        background-color: var(--general-color-blue);
        color: white;
        border: 1px solid transparent;
        border-radius: 3px;
        cursor: pointer;
    }

    .add-dev-button:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .iconActive {
        position: absolute;
        top: 5px;
        color: var(--general-color-blue);
        --mdc-icon-size: 24px;
    }

    .iconInactive {
        position: absolute;
        top: 5px;
        color: #999;
        --mdc-icon-size: 24px;
    }

    .tab:hover .iconInactive {
        color: var(--general-color-blue);
    }

    .count {
        position: relative;
        top: -5px;
        font-weight: bold;
        background-color: #C6011F;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        text-align: center;
        border-radius: 5px;
        animation: pulse 1500ms infinite;
        animation-duration: 6s;
    }

    .ml-5 {
        margin-left: 5px;
    }

    .ml-10 {
        margin-left: 10px;
    }

    .ml-15 {
        margin-left: 15px;
    }

    .ml-20 {
        margin-left: 20px;
    }

    .ml-25 {
        margin-left: 25px;
    }

    .ml-30 {
        margin-left: 30px;
    }

    .ml-35 {
        margin-left: 35px;
    }

    .ml-40 {
        margin-left: 40px;
    }

    @keyframes pulse {
        0% {
            box-shadow: #C6011F 0 0 0 0;
        }

        75% {
            box-shadow: #ff69b400 0 0 0 16px;
        }
    }
`

export const navBarStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-shape-radius: 25px;
        --mdc-dialog-min-width: 300px;
        --mdc-dialog-max-width: 700px;
    }

    .parent {
        display: flex;
        flex-direction: column;
        flex-flow: column;
        align-items: center;
        padding: 20px;
        height: calc(100vh - 120px);
        overflow-y: auto;
    }

    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--white);
        padding: 10px 20px;
        max-width: 750px;
        width: 80%;
    }

    .navbar input {
        font-size: 16px;
        color: #000;
        padding: 5px;
        flex-grow: 1;
        margin-right: 10px;
        border: 1px solid var(--black);
    }

    .navbar button {
        padding: 5px 10px;
        font-size: 18px;
        background-color: var(--app-background-1);
        background-image: linear-gradient(315deg, var(--app-background-1) 0%, var(--app-background-2) 74%);
        color: var(--app-icon);
        border: 1px solid transparent;
        border-radius: 3px;
        cursor: pointer;
    }

    .navbar button:hover {
        background-color: #45a049;
    }

    .app-list {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        gap: 10px;
        flex-wrap: wrap;
    }

    .app-list .app-icon {
        position: relative;
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        color: var(--black);
        width: 175px;
        height: 110px;
        background: transparent;
        padding: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        width: 100%;
        min-width: 1px;
    }

    .app-list .app-icon span {
        display: block;
    }

    .app-icon-box {
        display: flex;
        align-items: center;
        padding-left: 14px;
        width: 80px;
        min-width: 80px;
        height: 80px;
        min-height: 80px;
        background-color: var(--app-background-1);
        background-image: linear-gradient(315deg, var(--app-background-1) 0%, var(--app-background-2) 74%);
        border-top-left-radius: 10px;
        border-top-right-radius: 20px;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 10px;
        position: relative;
    }

    .app-list .app-icon:hover .removeIcon {
        display: inline;
    }

    .menuIcon {
        color: var(--app-icon);
        --mdc-icon-size: 64px;
        cursor: pointer;
    }

    .menuIconPos {
        right: -2px;
    }

    .removeIconPos {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 1;
    }

    .menuIconPos:hover .removeIcon {
        display: inline;
    }

    .removeIcon {
        display: none;
        color: var(--black);
        --mdc-icon-size: 28px;
        cursor: pointer;
        position: relative;
        z-index: 1;
    }

    .removeIcon:hover {
        color: #C6011F;
        font-weight: bold;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    select {
        padding: 10px 10px 10px 10px;
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        background: var(--white);
        color: var(--black);
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url('/img/arrow.png');
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 20px;
    }

    .resetIcon {
        position: fixed;
        right: 20px;
        top: 116px;
        color: #666;
        --mdc-icon-size: 32px;
        cursor: pointer;
    }

    .resetIcon:hover {
        color: var(--general-color-blue);
        font-weight: bold;
    }

    .searchIcon {
        position: fixed;
        left: 20px;
        top: 116px;
        color: #666;
        --mdc-icon-size: 32px;
        cursor: pointer;
    }

    .searchIcon:hover {
        color: var(--general-color-blue);
        font-weight: bold;
    }

    .importIcon {
        position: fixed;
        left: 20px;
        bottom: 16px;
        color: #666;
        --mdc-icon-size: 32px;
        cursor: pointer;
    }

    .importIcon:hover {
        color: var(--general-color-blue);
        font-weight: bold;
    }

    .exportIcon {
        position: fixed;
        right: 20px;
        bottom: 16px;
        color: #666;
        --mdc-icon-size: 32px;
        cursor: pointer;
    }

    .exportIcon:hover {
        color: var(--general-color-blue);
        font-weight: bold;
    }

    paper-dialog.searchSettings {
        width: 100%;
        max-width: 550px;
        height: auto;
        max-height: 600px;
        background-color: var(--white);
        color: var(--black);
        line-height: 1.6;
        overflow: hidden;
        border: 1px solid var(--black);
        border-radius: 10px;
        padding: 15px;
    }

    paper-dialog button {
        padding: 5px 10px;
        font-size: 18px;
        background-color: var(--general-color-blue);
        color: white;
        border: 1px solid transparent;
        border-radius: 5px;
        cursor: pointer;
    }

    paper-dialog button:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    .search {
        display: inline;
        width: 50%;
        align-items: center;
    }

    .divCard {
        height: auto;
        max-height: 500px;
        border: 1px solid var(--border);
        padding: 1em;
        margin-bottom: 1em;
    }

    img {
        border-radius: 25%;
        max-width: 32px;
        height: 100%;
        max-height: 32px;
    }

    vaadin-text-field[focused]::part(input-field) {
        border-color: var(--general-color-blue);
    }
`

export const appAvatarStyles = css`
    :host {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
    }

    .menuIcon {
        color: var(--app-icon);
        --mdc-icon-size: 64px;
        cursor: pointer;
    }
`

export const syncIndicator2Styles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
        box-sizing: border-box;
    }

    :host {
        box-sizing: border-box;
        position: fixed;
        bottom: 50px;
        right: 25px;
        z-index: 50000;
    }

    .parent {
        width: 360px;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--black);
        display: flex;
        align-items: center;
        gap: 10px;
        user-select: none;
        background: var(--white);
    }

    .row {
        display: flex;
        gap: 10px;
        width: 100%;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .bootstrap-button {
        font-family: Roboto, sans-serif;
        font-size: 16px;
        color: var(--mdc-theme-primary);
        background-color: transparent;
        padding: 8px 10px;
        border-radius: 5px;
        border: none;
        transition: all 0.3s ease-in-out;
    }

    .bootstrap-button:hover {
        cursor: pointer;
        background-color: #03a8f475;
    }
`

export const tourComponentStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        box-sizing: border-box;
        color: var(--black);
        background: var(--white);
    }

    :host {
        box-sizing: border-box;
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 50000;
    }

    .full-info-wrapper {
        width: 100%;
        min-width: 600px;
        max-width: 600px;
        text-align: center;
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
        display: block !important;
    }

    .buttons {
        display: inline;
    }

    .accept-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: var(--black);
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        justify-content: center;
        outline: 1px solid var(--black);
    }

    .accept-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
    }

    .close-button {
        font-family: Roboto, sans-serif;
        letter-spacing: 0.3px;
        font-weight: 300;
        padding: 8px 5px;
        border-radius: 3px;
        text-align: center;
        color: #f44336;
        transition: all 0.3s ease-in-out;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        width: auto;
    }

    .close-button:hover {
        cursor: pointer;
        background-color: #f4433663;
    }

    .driver-popover.driverjs-theme {
        background-color: var(--white);
        color: var(--black);
        max-width: 500px;
        width: auto;
    }

    .driver-popover.driverjs-theme .driver-popover-title {
        font-size: 20px;
        text-align: center;
    }

    .driver-popover.driverjs-theme .driver-popover-title,
    .driver-popover.driverjs-theme .driver-popover-description,
    .driver-popover.driverjs-theme .driver-popover-progress-text {
        color: var(--black);
        font-family: Roboto, sans-serif;
    }

    .driver-popover.driverjs-theme .driver-popover-description {
        font-size: 16px;
    }

    .driver-popover.driverjs-theme button {
        flex: 1;
        text-align: center;
        background-color: #000;
        color: #ffffff;
        border: 2px solid #000;
        text-shadow: none;
        font-size: 14px;
        padding: 5px 8px;
        border-radius: 6px;
    }

    .driver-popover.driverjs-theme .test-span {
        color: green;
    }

    .driver-popover.driverjs-theme button:hover {
        background-color: #000;
        color: #ffffff;
    }

    .driver-popover.driverjs-theme .driver-popover-navigation-btns {
        justify-content: space-between;
        gap: 3px;
    }

    .driver-popover.driverjs-theme .driver-popover-close-btn {
        color: #9b9b9b;
    }

    .driver-popover.driverjs-theme .driver-popover-close-btn:hover {
        color: #000;
    }

    .driver-popover.driverjs-theme .driver-popover-footer {
        gap: 20px;
    }

    .driver-popover.driverjs-theme .driver-popover-footer button {
        background-color: #000 !important;
    }

    .driver-popover.driverjs-theme .driver-popover-arrow-side-left.driver-popover-arrow {
        border-left-color: #fde047;
    }

    .driver-popover.driverjs-theme .driver-popover-arrow-side-right.driver-popover-arrow {
        border-right-color: #fde047;
    }

    .driver-popover.driverjs-theme .driver-popover-arrow-side-top.driver-popover-arrow {
        border-top-color: #fde047;
    }

    .driver-popover.driverjs-theme .driver-popover-arrow-side-bottom.driver-popover-arrow {
        border-bottom-color: #fde047;
    }
`

export const createAccountSectionStyles = css`
    * {
        --mdc-theme-primary: var(--login-button);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-checkbox-unchecked-color: var(--black);
        --lumo-primary-text-color: var(--login-border);
        --lumo-primary-color-50pct: var(--login-border-50pct);
        --lumo-primary-color-10pct: var(--login-border-10pct);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --_lumo-grid-border-color: var(--border);
        --_lumo-grid-secondary-border-color: var(--border2);
    }

    .red {
        --mdc-theme-primary: red;
    }

    mwc-formfield {
        color: var(--black);
    }
`

export const welcomePageStyles = css`
    * {
        --mdc-theme-primary: var(--login-button);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-button-outline-color: var(--general-color-blue);
    }

    .button-outline {
        margin: 6px;
        width: 90%;
        max-width:90vw;
        border-top: 0;
        border-bottom: 0;
    }

    .welcome-page {
        padding: 12px 0;
        overflow: hidden;
    }
`

export const logoutViewStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
    }

    .decline {
        --mdc-theme-primary: var(--mdc-theme-error)
    }

    .buttons {
        text-align:right;
    }
`

export const notificationBellStyles = css`
    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .count {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 12px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
    }

    .nocount {
        display: none;
    }

    .popover-panel {
        position: absolute;
        width: 200px;
        padding: 10px;
        background-color: var(--white);
        border: 1px solid var(--black);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        top: 40px;
        max-height: 350px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #6a6c75 #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar {
        width: 11px;
    }

    .popover-panel::-webkit-scrollbar-track {
        background: #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar-thumb {
        background-color: #6a6c75;
        border-radius: 6px;
        border: 3px solid #a1a1a1;
    }

    .notifications-list {
        display: flex;
        flex-direction: column;
    }

    .notification-item {
        padding: 5px;
        border-bottom: 1px solid;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        transition: 0.2s all;
    }

    .notification-item:hover {
        background: var(--nav-color-hover);
    }

    p {
        font-size: 14px;
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }
`

export const notificationBellGeneralStyles = css`
    .layout {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .count {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 12px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nocount {
        display: none;
    }

    .popover-panel {
        position: absolute;
        width: 200px;
        padding: 10px;
        background-color: var(--white);
        border: 1px solid var(--black);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        top: 40px;
        max-height: 350px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #6a6c75 #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar {
        width: 11px;
    }

    .popover-panel::-webkit-scrollbar-track {
        background: #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar-thumb {
        background-color: #6a6c75;
        border-radius: 6px;
        border: 3px solid #a1a1a1;
    }

    .notifications-list {
        display: flex;
        flex-direction: column;
    }

    .notification-item {
        padding: 5px;
        border-bottom: 1px solid;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        transition: 0.2s all;
    }

    .notification-item:hover {
        background: var(--nav-color-hover);
    }

    p {
        font-size: 14px;
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }
`

export const notificationItemTxStyles = css`
    .centered {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .layout {
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .count {
        position: absolute;
        top: -5px;
        right: -5px;
        font-size: 12px;
        background-color: red;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nocount {
        display: none;
    }

    .popover-panel {
        position: absolute;
        width: 200px;
        padding: 10px;
        background-color: var(--white);
        border: 1px solid var(--black);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        top: 40px;
        max-height: 350px;
        overflow: auto;
        scrollbar-width: thin;
        scrollbar-color: #6a6c75 #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar {
        width: 11px;
    }

    .popover-panel::-webkit-scrollbar-track {
        background: #a1a1a1;
    }

    .popover-panel::-webkit-scrollbar-thumb {
        background-color: #6a6c75;
        border-radius: 6px;
        border: 3px solid #a1a1a1;
    }

    .notifications-list {
        display: flex;
        flex-direction: column;
    }

    .notification-item {
        padding: 5px;
        border-bottom: 1px solid;
        display: flex;
        flex-direction: column;
        cursor: default;
    }

    .notification-item:hover {
        background: var(--nav-color-hover);
    }

    p {
        font-size: 14px;
        color: var(--black);
        margin: 0px;
        padding: 0px;
    }

    .loader,
    .loader:before,
    .loader:after {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation: load7 1.8s infinite ease-in-out;
        animation: load7 1.8s infinite ease-in-out;
    }

    .loader {
        color: var(--black);
        font-size: 5px;
        margin-bottom: 20px;
        position: relative;
        text-indent: -9999em;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    .loader:before,
    .loader:after {
        content: '';
        position: absolute;
        top: 0;
    }

    .loader:before {
        left: -3.5em;
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .loader:after {
        left: 3.5em;
    }

    @-webkit-keyframes load7 {

        0%,
        80%,
        100% {
            box-shadow: 0 2.5em 0 -1.3em;
        }

        40% {
            box-shadow: 0 2.5em 0 0;
        }
    }

    @keyframes load7 {

        0%,
        80%,
        100% {
            box-shadow: 0 2.5em 0 -1.3em;
        }

        40% {
            box-shadow: 0 2.5em 0 0;
        }
    }
`

export const popoverComponentStyles = css`
    :host {
        display: none;
        position: absolute;
        background-color: var(--white);
        border: 1px solid #ddd;
        padding: 8px;
        z-index: 10;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        color: var(--black);
        max-width: 250px;
    }

    .close-icon {
        cursor: pointer;
        float: right;
        margin-left: 10px;
        color: var(--black)
    }
`

export const accountViewStyles = css`
    .sub-main {
        position: relative;
        text-align: center;
    }

    .center-box {
        position: relative;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    .img-icon {
        display: block;
        margin-top: 10px;
    }

    .content-box {
        border: 1px solid #a1a1a1;
        padding: 10px 25px;
        text-align: left;
        display: inline-block;
    }

    .title {
        font-weight: 600;
        font-size: 15px;
        display: block;
        line-height: 32px;
        opacity: 0.66;
    }

    .value {
        font-size: 16px;
        display: inline-block;
    }

    #accountName {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        display: inline-block;
        width: 100%;
    }
`

export const exportKeysStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 500px;
        --mdc-dialog-max-width: 750px;
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
    }

    .center-box {
        position: relative;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    .sub-main {
        position: relative;
        text-align: center;
        height: auto;
        width: 100%;
    }

    .content-box {
        text-align: center;
        display: inline-block;
        min-width: 400px;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-top: 20px;
    }

    .export-button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        border: none;
        border-radius: 20px;
        padding-left: 10px;
        padding-right: 10px;
        color: white;
        background: #03a9f4;
        width: 75%;
        font-size: 16px;
        cursor: pointer;
        height: 40px;
        margin-top: 1rem;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .2s;
        position: relative;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .button-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
        margin-top: 20px;
    }

    .repair-button {
        height: 40px;
        padding: 10px 10px;
        font-size: 16px;
        font-weight: 500;
        background-color: #03a9f4;
        color: white;
        border: 1px solid transparent;
        border-radius: 20px;
        text-decoration: none;
        text-transform: uppercase;
        cursor: pointer;
    }

    .repair-button:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    .lds-roller {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
    }

    .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }

    .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--black);
        margin: -4px 0 0 -4px;
    }

    .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }

    .lds-roller div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }

    .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }

    .lds-roller div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }

    .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }

    .lds-roller div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }

    .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }

    .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }

    .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }

    .lds-roller div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }

    .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }

    .lds-roller div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }

    .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }

    .lds-roller div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }

    .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }

    .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }

    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }
`

export const notificationsViewStyles = css`
    .sub-main {
        position: relative;
        text-align: center;
    }

    .notification-box {
        display: block;
        position: relative;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    @media(min-width: 1400px) {
        .notification-box {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 30px;
        }
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }

    .content-box {
        border: 1px solid #a1a1a1;
        padding: 10px 25px;
        text-align: left;
        display: inline-block;
        min-width: 350px;
        min-height: 150px;
        margin: 20px 0;
    }

    h4 {
        margin-bottom: 0;
    }

    mwc-checkbox::shadow .mdc-checkbox::after,
    mwc-checkbox::shadow .mdc-checkbox::before {
        background-color: var(--mdc-theme-primary)
    }

    label:hover {
        cursor: pointer;
    }

    .title {
        font-weight: 600;
        font-size: 15px;
        display: block;
        line-height: 32px;
        opacity: 0.66;
    }

    .value {
        font-size: 16px;
        display: inline-block;
    }

    .q-button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        border: none;
        border-radius: 20px;
        padding-left: 25px;
        padding-right: 25px;
        color: white;
        background: #03a9f4;
        width: 50%;
        font-size: 17px;
        cursor: pointer;
        height: 50px;
        margin-top: 1rem;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .2s;
        position: relative;
    }

    .remove-button {
        font-family: Roboto, sans-serif;
        font-size: 16px;
        color: var(--mdc-theme-primary);
        background-color: transparent;
        padding: 8px 10px;
        border-radius: 5px;
        border: none;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
    }
`

export const qrLoginViewStyles = css`
    * {
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
    }

    .center-box {
        position: relative;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    .q-button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        border: none;
        border-radius: 20px;
        padding-left: 25px;
        padding-right: 25px;
        color: white;
        background: #03a9f4;
        width: 50%;
        font-size: 17px;
        cursor: pointer;
        height: 50px;
        margin-top: 1rem;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .2s;
        position: relative;
    }

    .q-button.outlined {
        background: unset;
        border: 1px solid #03a9f4;
    }

    :host([theme="light"]) .q-button.outlined {
        color: #03a9f4;
    }

    #qr-toggle-button {
        margin-left: 12px;
    }

    #login-qr-code {
        margin: auto;
    }
`

export const securityViewStyles = css`
    * {
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --mdc-checkbox-unchecked-color: var(--black);
        --mdc-theme-on-surface: var(--black);
        --mdc-checkbox-disabled-color: var(--black);
        --mdc-checkbox-ink-color: var(--black);
    }

    .center-box {
        position: relative;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }

    .q-button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        border: none;
        border-radius: 20px;
        padding-left: 25px;
        padding-right: 25px;
        color: white;
        background: #03a9f4;
        width: 50%;
        font-size: 17px;
        cursor: pointer;
        height: 50px;
        margin-top: 1rem;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .2s;
        position: relative;
    }

    .add-dev-button {
        margin-top: 4px;
        max-height: 28px;
        padding: 5px 5px;
        font-size: 14px;
        background-color: #03a9f4;
        color: white;
        border: 1px solid transparent;
        border-radius: 3px;
        cursor: pointer;
    }

    .add-dev-button:hover {
        opacity: 0.8;
        cursor: pointer;
    }
`

export const userSettingsStyles = css`
    :host {
        margin: 0;
        width: 100%;
        max-width: 100vw;
        height: 100%;
        max-height: 100vh;
        background-color: var(--white);
        color: var(--black);
        line-height: 1.6;
    }

    .decline {
        --mdc-theme-primary: var(--mdc-theme-error)
    }

    paper-dialog.userSettings {
        width: 100%;
        max-width: 100vw;
        height: 100%;
        max-height: 100vh;
        background-color: var(--white);
        color: var(--black);
        line-height: 1.6;
        overflow-y: auto;
    }

    .actions {
        display: flex;
        justify-content: space-between;
        padding: 0 4em;
        margin: 15px 0 -2px 0;
    }

    .close-icon {
        font-size: 36px;
    }

    .close-icon:hover {
        cursor: pointer;
        opacity: .6;
    }

    .buttons {
        text-align: right;
    }

    .container {
        max-width: 90vw;
        margin-left: auto;
        margin-right: auto;
        margin-top: 20px;
        padding: .6em;
    }

    ul {
        list-style: none;
        padding: 0;
        margin-bottom: 0;
    }

    .leftBar {
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--border);
        padding: 20px 0 0 0;
        border-radius: 5px;
    }

    .leftBar img {
        margin: 0 auto;
        width: 75%;
        height: 75%;
        text-align: center;
    }

    .leftBar .slug {
        text-align: center;
        margin-top: 20px;
        color: var(--black);
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 7px;
    }

    .leftBar ul li {
        border-bottom: 1px solid var(--border);
    }

    .leftBar ul li:last-child {
        border-bottom: none;
    }

    .leftBar ul li a {
        color: var(--black);
        font-size: 16px;
        font-weight: 400;
        text-decoration: none;
        padding: .9em;
        display: block;
    }

    .leftBar ul li a i {
        margin-right: 8px;
        font-size: 16px;
    }

    .leftBar ul li a:hover {
        background-color: var(--menuhover);
        color: #515151;
    }

    .leftBar ul li:active {
        border-bottom: none;
    }

    .leftBar ul li a.active {
        color: #515151;
        background-color: var(--menuactive);
        border-left: 2px solid #515151;
        margin-left: -2px;
    }

    .mainPage {
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--border);
        padding: 20px 0 10px 0;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        min-height: 460px;
        height: auto;
        overflow: auto;

    }

    @media(max-width:700px) {
        .mainPage {
            margin-top: 30px;
        }
    }

    @media(min-width:765px) {
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            padding: 0 4em;
            margin: 15px 0 -25px 0;
        }

        .container {
            padding: 2em;
        }

        .wrapper {
            display: grid;
            grid-template-columns: 1fr 3fr;
            grid-gap: 30px;
        }

        .wrapper>.mainPage {
            padding: 2em;
        }

        .leftBar {
            text-align: left;
            max-height: 403px;
            max-width: 400px;
            font-size: 16px;
        }

        .mainPage {
            font-size: 16px;
        }
    }
`

export const userInfoViewStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        box-sizing: border-box;
    }

    h2 {
        margin: 10px 0;
    }

    h3 {
        margin-top: -80px;
        color: #03a9f4;
        font-size: 18px;
    }

    h4 {
        margin: 5px 0;
    }

    p {
        margin-top: 5px;
        font-size: 14px;
        line-height: 16px;
    }

    ul {
        list-style: none;
        display: flex;
    }

    ul li {
        margin: 15px auto;
        font-size: 15px;
        font-weight: 600;
        color: #03a9f4;
    }

    .btn-info {
        color: #03a9f4;
        --mdc-icon-size: 16px;
        padding-top: 3px;
    }

    .data-info {
        margin-top: 10px;
        margin-right: 25px;
    }

    .data-items {
        font-weight: 600;
        color: var(--black);
        display: block;
        text-align: center;
    }

    .title {
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    #transactionList {
        color: var(--black);
        padding: 15px;
    }

    .color-in {
        color: #02977e;
        background-color: rgba(0, 201, 167, 0.2);
        font-weight: 700;
        font-size: 0.60938rem;
        border-radius: 0.25rem !important;
        padding: 0.2rem 0.5rem;
        margin-left: 4px;
    }

    .color-out {
        color: #b47d00;
        background-color: rgba(219, 154, 4, 0.2);
        font-weight: 700;
        font-size: 0.60938rem;
        border-radius: 0.25rem !important;
        padding: 0.2rem 0.5rem;
        margin-left: 4px;
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

    .card-container-button {
        background-color: var(--white);
        border-radius: 5px;
        color: var(--black);
        padding-top: 30px;
        position: relative;
        width: 500px;
        max-width: 100%;
        text-align: center;
    }

    .card-explorer-container {
        background-color: var(--white);
        border-radius: 5px;
        color: var(--black);
        padding-top: 10px;
        position: relative;
        width: 900px;
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

    .decline {
        --mdc-theme-primary: var(--mdc-theme-error)
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .buttons {
        display: inline;
        float: right;
        margin-bottom: 5px;
    }

    .paybutton {
        display: inline;
        float: left;
        margin-bottom: 5px;
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

    .explorer-trades {
        text-align: center;
    }

    .box {
        margin: 0;
        padding: 0;
        display: flex;
        flex-flow: column;
        height: 100%;
    }

    .box-info {
        margin: 0;
        padding: 0;
        display: flex;
        flex-flow: column;
        height: 250px;
    }

    .box-info-full {
        margin: 0;
        padding: 0;
        display: flex;
        flex-flow: column;
        height: 450px;
        width: 450px;
    }

    header {
        display: flex;
        flex: 0 1 auto;
        align-items: center;
        justify-content: center;
        padding: 0px 10px;
        font-size: 16px;
        color: var(--black);
        background-color: var(--tradehead);
        border-left: 1px solid var(--tradeborder);
        border-top: 1px solid var(--tradeborder);
        border-right: 1px solid var(--tradeborder);
        min-height: 40px;
    }

    .border-wrapper {
        border: 1px var(--tradeborder) solid;
        overflow: hidden;
    }


    #first-explorer-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max(250px);
        column-gap: 0.5em;
        row-gap: 0.4em;
        justify-items: stretch;
        align-items: stretch;
        margin-bottom: 10px;
    }

    #second-explorer-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max(250px);
        column-gap: 0.5em;
        row-gap: 0.4em;
        justify-items: stretch;
        align-items: stretch;
        margin-bottom: 10px;
    }

    #third-explorer-section {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: max(250px);
        column-gap: 0.5em;
        row-gap: 0.4em;
        justify-items: stretch;
        align-items: stretch;
        margin-bottom: 10px;
    }

    #first-explorer-section>div {}

    #second-explorer-section>div {}

    #third-explorer-section>div {}

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

    .full-info {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #1da1f2;
    }

    .full-info-wrapper {
        width: 100%;
        min-width: 600px;
        max-width: 600px;
        text-align: center;
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    }

    .full-info-logo {
        width: 120px;
        height: 120px;
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 50%;
        position: relative;
        top: -110px;
        left: 210px;
    }

    .round-fullinfo {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        right: 25px;
        top: -1px;
    }
`