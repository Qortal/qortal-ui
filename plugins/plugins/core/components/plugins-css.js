import { css } from 'lit'

export const chatpageStyles = css`
    html {
        scroll-behavior: smooth;
    }

    .chat-head-container {
        display: flex;
        justify-content: flex-start;
        flex-direction: column;
        height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
    }

    .repliedTo-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 8px 10px;
    }

    .senderName {
        margin: 0;
        color: var(--mdc-theme-primary);
        font-weight: bold;
        user-select: none;
    }

    .original-message {
        color: var(--chat-bubble-msg-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0;
        width: 800px;
    }

    .close-icon {
        color: #676b71;
        width: 18px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        color: #494c50;
    }

    .chat-text-area .typing-area .chatbar {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: auto;
        padding: 5px 5px 5px 7px;
        overflow: hidden;
    }

    .chat-text-area .typing-area .emoji-button {
        width: 45px;
        height: 40px;
        padding-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        max-height: 40px;
        color: var(--black);
    }

    .emoji-button-caption {
        width: 45px;
        height: 40px;
        padding-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        max-height: 40px;
        color: var(--black);
    }

    .caption-container {
        width: 100%;
        display: flex;
        height: auto;
        overflow: hidden;
        justify-content: center;
        background-color: var(--white);
        padding: 5px;
        border-radius: 1px;
    }

    .chatbar-caption {
        font-family: Roboto, sans-serif;
        width: 70%;
        margin-right: 10px;
        outline: none;
        align-items: center;
        font-size: 18px;
        resize: none;
        border-top: 0;
        border-right: 0;
        border-left: 0;
        border-bottom: 1px solid #cac8c8;
        padding: 3px;
    }

    .message-size-container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    .message-size {
        font-family: Roboto, sans-serif;
        font-size: 12px;
        color: var(--black);
    }

    .lds-grid {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 40%;
    }

    img {
        border-radius: 25%;
    }

    .dialogCustom {
        position: fixed;
        z-index: 10000;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        top: 10px;
        right: 20px;
        user-select: none;
    }

    .dialogCustomInner {
        min-width: 300px;
        height: 40px;
        background-color: var(--white);
        box-shadow: rgb(119 119 119 / 32%) 0px 4px 12px;
        padding: 10px;
        border-radius: 4px;
    }

    .dialogCustomInner ul {
        padding-left: 0px
    }

    .dialogCustomInner li {
        margin-bottom: 10px;
    }

    .marginLoader {
        margin-right: 8px;
    }

    .last-message-ref {
        position: absolute;
        font-size: 18px;
        top: -40px;
        right: 30px;
        width: 50;
        height: 50;
        z-index: 5;
        color: black;
        background-color: white;
        border-radius: 50%;
        transition: all 0.1s ease-in-out;
    }

    .last-message-ref:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    .arrow-down-icon {
        transform: scale(1.15);
    }

    .chat-container {
        display: grid;
        max-height: 100%;
    }

    .chat-text-area {
        display: flex;
        position: relative;
        justify-content: center;
        min-height: 60px;
        max-height: 100%;
    }

    .chat-text-area .typing-area {
        display: flex;
        flex-direction: column;
        width: 98%;
        box-sizing: border-box;
        margin-bottom: 8px;
        border: 1px solid var(--chat-bubble-bg);
        border-radius: 10px;
        background: var(--chat-bubble-bg);
    }

    .chat-text-area .typing-area textarea {
        display: none;
    }

    .chat-text-area .typing-area .chat-editor {
        display: flex;
        max-height: -webkit-fill-available;
        width: 100%;
        border-color: transparent;
        margin: 0;
        padding: 0;
        border: none;
    }

    .repliedTo-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 8px 10px;
    }

    .repliedTo-subcontainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
        width: 100%;
    }

    .repliedTo-message {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        max-height: 60px;
    }

    .repliedTo-message p {
        margin: 0px;
        padding: 0px;
    }

    .repliedTo-message pre {
        white-space: pre-wrap;
    }

    .repliedTo-message p mark {
        background-color: #ffe066;
        border-radius: 0.25em;
        box-decoration-break: clone;
        padding: 0.125em 0;
    }

    .reply-icon {
        width: 20px;
        color: var(--mdc-theme-primary);
    }

    .close-icon {
        color: #676b71;
        width: 18px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        color: #494c50;
    }

    .chatbar-container {
        width: 100%;
        display: flex;
        height: auto;
        overflow: hidden;
    }

    .lds-grid {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 40%;
    }

    .lds-grid div {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #03a9f4;
        animation: lds-grid 1.2s linear infinite;
    }

    .lds-grid div:nth-child(1) {
        top: 4px;
        left: 4px;
        animation-delay: 0s;
    }

    .lds-grid div:nth-child(2) {
        top: 4px;
        left: 48px;
        animation-delay: -0.4s;
    }

    .lds-grid div:nth-child(3) {
        top: 4px;
        left: 90px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(4) {
        top: 50px;
        left: 4px;
        animation-delay: -0.4s;
    }

    .lds-grid div:nth-child(5) {
        top: 50px;
        left: 48px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(6) {
        top: 50px;
        left: 90px;
        animation-delay: -1.2s;
    }

    .lds-grid div:nth-child(7) {
        top: 95px;
        left: 4px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(8) {
        top: 95px;
        left: 48px;
        animation-delay: -1.2s;
    }

    .lds-grid div:nth-child(9) {
        top: 95px;
        left: 90px;
        animation-delay: -1.6s;
    }

    @keyframes lds-grid {

        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0.5;
        }
    }

    .float-left {
        float: left;
    }

    img {
        border-radius: 25%;
    }

    paper-dialog.warning {
        width: 50%;
        max-width: 50vw;
        height: 30%;
        max-height: 30vh;
        text-align: center;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        line-height: 1.6;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%;
    }

    .repliedTo-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 8px 10px;
    }

    .senderName {
        margin: 0;
        color: var(--mdc-theme-primary);
        font-weight: bold;
        user-select: none;
    }

    .original-message {
        color: var(--chat-bubble-msg-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 0;
        width: 800px;
    }

    .close-icon {
        color: #676b71;
        width: 18px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        color: #494c50;
    }

    .chat-text-area .typing-area .chatbar {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: auto;
        padding: 5px 5px 5px 7px;
        overflow: hidden;
    }

    .chat-text-area .typing-area .emoji-button {
        width: 45px;
        height: 40px;
        padding-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        max-height: 40px;
        color: var(--black);
    }

    .emoji-button-caption {
        width: 45px;
        height: 40px;
        padding-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        max-height: 40px;
        color: var(--black);
    }

    .caption-container {
        width: 100%;
        display: flex;
        height: auto;
        overflow: hidden;
        justify-content: center;
        background-color: var(--white);
        padding: 5px;
        border-radius: 1px;
    }

    .chatbar-caption {
        font-family: Roboto, sans-serif;
        width: 70%;
        margin-right: 10px;
        outline: none;
        align-items: center;
        font-size: 18px;
        resize: none;
        border-top: 0;
        border-right: 0;
        border-left: 0;
        border-bottom: 1px solid #cac8c8;
        padding: 3px;
    }

    .message-size-container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    .message-size {
        font-family: Roboto, sans-serif;
        font-size: 12px;
        color: var(--black);
    }

    .lds-grid {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 40%;
    }

    img {
        border-radius: 25%;
    }

    .dialogCustom {
        position: fixed;
        z-index: 10000;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        top: 10px;
        right: 20px;
        user-select: none;
    }

    .dialogCustomInner {
        min-width: 300px;
        height: 40px;
        background-color: var(--white);
        box-shadow: rgb(119 119 119 / 32%) 0px 4px 12px;
        padding: 10px;
        border-radius: 4px;
    }

    .dialogCustomInner ul {
        padding-left: 0px
    }

    .dialogCustomInner li {
        margin-bottom: 10px;
    }

    .marginLoader {
        margin-right: 8px;
    }

    .last-message-ref {
        position: absolute;
        font-size: 18px;
        top: -40px;
        right: 30px;
        width: 50;
        height: 50;
        z-index: 5;
        color: black;
        background-color: white;
        border-radius: 50%;
        transition: all 0.1s ease-in-out;
    }

    .last-message-ref:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    .arrow-down-icon {
        transform: scale(1.15);
    }

    .chat-container {
        display: grid;
        max-height: 100%;
    }

    .chat-text-area {
        display: flex;
        position: relative;
        justify-content: center;
        min-height: 60px;
        max-height: 100%;
    }

    .chat-text-area .typing-area {
        display: flex;
        flex-direction: column;
        width: 98%;
        box-sizing: border-box;
        margin-bottom: 8px;
        border: 1px solid var(--chat-bubble-bg);
        border-radius: 10px;
        background: var(--chat-bubble-bg);
    }

    .chat-text-area .typing-area textarea {
        display: none;
    }

    .chat-text-area .typing-area .chat-editor {
        display: flex;
        max-height: -webkit-fill-available;
        width: 100%;
        border-color: transparent;
        margin: 0;
        padding: 0;
        border: none;
    }

    .repliedTo-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 8px 10px;
    }

    .repliedTo-subcontainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15px;
        width: 100%;
    }

    .repliedTo-message {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        max-height: 60px;
    }

    .repliedTo-message p {
        margin: 0px;
        padding: 0px;
    }

    .repliedTo-message pre {
        white-space: pre-wrap;
    }

    .repliedTo-message p mark {
        background-color: #ffe066;
        border-radius: 0.25em;
        box-decoration-break: clone;
        padding: 0.125em 0;
    }

    .reply-icon {
        width: 20px;
        color: var(--mdc-theme-primary);
    }

    .close-icon {
        color: #676b71;
        width: 18px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        color: #494c50;
    }

    .chatbar-container {
        width: 100%;
        display: flex;
        height: auto;
        overflow: hidden;
    }

    .lds-grid {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 40%;
    }

    .lds-grid div {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #03a9f4;
        animation: lds-grid 1.2s linear infinite;
    }

    .lds-grid div:nth-child(1) {
        top: 4px;
        left: 4px;
        animation-delay: 0s;
    }

    .lds-grid div:nth-child(2) {
        top: 4px;
        left: 48px;
        animation-delay: -0.4s;
    }

    .lds-grid div:nth-child(3) {
        top: 4px;
        left: 90px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(4) {
        top: 50px;
        left: 4px;
        animation-delay: -0.4s;
    }

    .lds-grid div:nth-child(5) {
        top: 50px;
        left: 48px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(6) {
        top: 50px;
        left: 90px;
        animation-delay: -1.2s;
    }

    .lds-grid div:nth-child(7) {
        top: 95px;
        left: 4px;
        animation-delay: -0.8s;
    }

    .lds-grid div:nth-child(8) {
        top: 95px;
        left: 48px;
        animation-delay: -1.2s;
    }

    .lds-grid div:nth-child(9) {
        top: 95px;
        left: 90px;
        animation-delay: -1.6s;
    }

    @keyframes lds-grid {

        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0.5;
        }
    }

    .float-left {
        float: left;
    }

    img {
        border-radius: 25%;
    }

    paper-dialog.warning {
        width: 50%;
        max-width: 50vw;
        height: 30%;
        max-height: 30vh;
        text-align: center;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        line-height: 1.6;
        overflow-y: auto;
    }

    .buttons {
        text-align: right;
    }

    .dialogCustom {
        position: fixed;
        z-index: 10000;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        top: 10px;
        right: 20px;
        user-select: none;
    }

    .dialogCustom p {
        color: var(--black)
    }

    .dialogCustomInner {
        min-width: 300px;
        height: 40px;
        background-color: var(--white);
        box-shadow: rgb(119 119 119 / 32%) 0px 4px 12px;
        padding: 10px;
        border-radius: 4px;
    }

    .dialogCustomInner ul {
        padding-left: 0px
    }

    .dialogCustomInner li {
        margin-bottom: 10px;
    }

    .marginLoader {
        margin-right: 8px;
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

    /* Add Image Modal Dialog Styling */

    .dialog-container {
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 0 10px;
        gap: 10px;
        height: 100%;
    }

    .dialog-container-title {
        font-family: Montserrat;
        color: var(--black);
        font-size: 20px;
        margin: 15px 0 0 0;
    }

    .divider {
        height: 1px;
        background-color: var(--chat-bubble-msg-color);
        user-select: none;
        width: 70%;
        margin-bottom: 20px;
    }

    .dialog-container-loader {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 10px;
        gap: 10px;
        height: 100%;
    }

    .dialog-image {
        width: 100%;
        max-height: 300px;
        border-radius: 0;
        object-fit: contain;
    }

    .chat-right-panel {
        flex: 0;
        border-left: 3px solid rgb(221, 221, 221);
        height: 100%;
        overflow-y: auto;
        background: transparent;
    }

    .movedin {
        flex: 1 !important;
        background: transparent;
    }

    .main-container {
        display: flex;
        height: 100%;
    }

    .group-nav-container {
        display: flex;
        height: 40px;
        padding: 5px;
        margin: 0px;
        background-color: var(--chat-bubble-bg);
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;
        box-shadow: var(--group-drop-shadow);
        z-index: 1;
    }

    .top-bar-icon {
        border-radius: 50%;
        color: var(--chat-bubble-msg-color);
        transition: 0.3s all ease-in-out;
        padding: 5px;
        background-color: transparent;
    }

    .top-bar-icon:hover {
        background-color: #e6e6e69b;
        cursor: pointer;
        color: var(--black)
    }

    .group-name {
        font-family: Raleway, sans-serif;
        font-size: 16px;
        color: var(--black);
        margin: 0px;
        padding: 0px;
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
        margin-bottom: 15px;
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

    .search-results-div {
        position: absolute;
        top: 25px;
        right: 25px;
    }

    .search-field {
        width: 100%;
        position: relative;
        margin-bottom: 5px;
    }

    .search-icon {
        position: absolute;
        right: 3px;
        top: 0;
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

    .user-selected {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px, rgb(0 0 0 / 23%) 0px 3px 6px;
        padding: 18px 20px;
        color: var(--chat-bubble-msg-color);
        border-radius: 5px;
        background-color: #ececec96;
    }

    .user-selected-name {
        font-family: Roboto, sans-serif;
        margin: 0;
        font-size: 16px;
    }

    .forwarding-container {
        display: flex;
        gap: 15px;
    }

    .user-selected-forwarding {
        font-family: Livvic, sans-serif;
        margin: 0;
        font-size: 16px;
    }

    .close-forwarding {
        color: #676b71;
        width: 14px;
        transition: all 0.1s ease-in-out;
    }

    .close-forwarding:hover {
        cursor: pointer;
        color: #4e5054;
    }

    .chat-gifs {
        position: absolute;
        right: 15px;
        bottom: 100px;
        justify-self: flex-end;
        width: fit-content;
        height: auto;
        transform: translateY(30%);
        animation: smooth-appear 0.5s ease forwards;
        z-index: 5;
    }

    @keyframes smooth-appear {
        to {
            transform: translateY(0);
        }
    }

    .gifs-backdrop {
        top: 0;
        height: 100vh;
        width: 100vw;
        background: transparent;
        position: fixed;
    }

    .modal-button-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .attachment-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120px;
        width: 120px;
        border-radius: 50%;
        border: none;
        background-color: var(--mdc-theme-primary);
    }

    .attachment-icon {
        width: 70%;
    }

    .file-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 128px;
        width: 128px;
        border-radius: 50%;
        border: none;
        background-color: transparent;
    }

    .file-icon {
        height: 128px;
        width: 128px;
    }

    .attachment-name {
        font-family: Work Sans, sans-serif;
        font-size: 20px;
        color: var(--chat-bubble-msg-color);
        margin: 0px;
        letter-spacing: 1px;
        padding: 5px 0px;
    }
`

export const wrapperModalStyles = css`
    .backdrop {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgb(186 186 186 / 26%);
        overflow: hidden;
        animation: backdrop_blur cubic-bezier(0.22, 1, 0.36, 1) 1s forwards;
        z-index: 50
    }

    .modal-body {
        height: auto;
        position: fixed;
        box-shadow: rgb(60 64 67 / 30%) 0px 1px 2px 0px, rgb(60 64 67 / 15%) 0px 2px 6px 2px;
        width: 500px;
        z-index: 5;
        display: flex;
        flex-direction: column;
        padding: 15px;
        background-color: var(--white);
        left: 50%;
        top: 0px;
        transform: translate(-50%, 10%);
        border-radius: 12px;
        overflow-y: auto;
        animation: 1s cubic-bezier(0.22, 1, 0.36, 1) 0s 1 normal forwards running modal_transition;
        max-height: 80%;
        z-index: 60
    }

    @keyframes backdrop_blur {
        0% {
            backdrop-filter: blur(0px);
            background: transparent;
        }

        100% {
            backdrop-filter: blur(5px);
            background: rgb(186 186 186 / 26%);
        }
    }

    @keyframes modal_transition {
        0% {
            visibility: hidden;
            opacity: 0;
        }

        100% {
            visibility: visible;
            opacity: 1;
        }
    }
`

export const tipUserStyles = css`
    .tip-user-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px;
        border-bottom: 1px solid whitesmoke;
        gap: 25px;
        user-select: none;
    }

    .tip-user-header-font {
        font-family: Montserrat, sans-serif;
        font-size: 20px;
        color: var(--chat-bubble-msg-color);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tip-user-body {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 10px;
        flex-direction: column;
        gap: 25px;
    }

    .tip-input {
        width: 300px;
        margin-bottom: 15px;
        outline: 0;
        border-width: 0 0 2px;
        border-color: var(--mdc-theme-primary);
        background-color: transparent;
        padding: 10px;
        font-family: Roboto, sans-serif;
        font-size: 15px;
        color: var(--chat-bubble-msg-color);
    }

    .tip-input::selection {
        background-color: var(--mdc-theme-primary);
        color: white;
    }

    .tip-input::placeholder {
        opacity: 0.9;
        color: var(--black);
    }

    .tip-available {
        font-family: Roboto, sans-serif;
        font-size: 17px;
        color: var(--chat-bubble-msg-color);
        font-weight: 300;
        letter-spacing: 0.3px;
        margin: 0;
        user-select: none;
    }

    .success-msg {
        font-family: Roboto, sans-serif;
        font-size: 18px;
        font-weight: 400;
        letter-spacing: 0.3px;
        margin: 0;
        user-select: none;
        color: #10880b;
    }

    .error-msg {
        font-family: Roboto, sans-serif;
        font-size: 18px;
        font-weight: 400;
        letter-spacing: 0.3px;
        margin: 0;
        user-select: none;
        color: #f30000;
    }
`

export const chatSearchResultsStyles = css`
    .chat-results-card {
        position: relative;
        padding: 25px 20px;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        width: 300px;
        min-height: 200px;
        height: auto;
        border-radius: 5px;
        background-color: var(--white);
    }

    .chat-result-header {
        color: var(--chat-bubble-msg-color);
        font-size: 18px;
        font-family: Montserrat, sans-serif;
        text-align: center;
        margin: 0 0 10px 0;
        user-select: none;
    }

    .divider {
        height: 1px;
        background: var(--chat-bubble-msg-color);
        margin: 0 40px;
        user-select: none;
    }

    .no-results {
        font-family: Roboto, sans-serif;
        font-weight: 300;
        letter-spacing: 0.3px;
        font-size: 16px;
        color: var(--chat-bubble-msg-color);
        text-align: center;
        margin: 20px 0 0 0;
        user-select: none;
    }

    .chat-result-container {
        height: 200px;
        overflow-y: auto;
        padding: 0 10px;
    }

    .chat-result-container::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .chat-result-container::-webkit-scrollbar {
        width: 6px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .chat-result-container::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .chat-result-container::-webkit-scrollbar-thumb:hover {
        background-color: rgb(148, 146, 146);
        cursor: pointer;
    }

    .chat-result-card {
        padding: 12px;
        margin-bottom: 15px;
        margin-top: 15px;
        transition: all 0.2s ease-in-out;
        box-shadow: none;
    }

    .chat-result-card:active {
        background-color: #09b814;
    }

    .chat-result-card:hover {
        cursor: pointer;
        border: none;
        border-radius: 4px;
        box-sizing: border-box;
        -webkit-box-shadow: rgba(132, 132, 132, 40%) 0px 0px 6px -1px;
        box-shadow: rgba(132, 132, 132, 40%) 0px 0px 6px -1px;
    }

    .chat-result {
        font-family: Roboto, sans-serif;
        font-weight: 300;
        letter-spacing: 0.3px;
        font-size: 15px;
        color: var(--chat-bubble-msg-color);
        margin: 0;
        user-select: none;
    }

    .spinner-container {
        display: flex;
        width: 100%;
        justify-content: center
    }

    .close-icon {
        position: absolute;
        top: 5px;
        right: 5px;
        color: var(--chat-bubble-msg-color);
        font-size: 14px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        font-size: 15px;
    }
`

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
        display: flex;
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
        height: 85%;
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
        max-height: 80px;
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
        height: 100%;
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
        background: #fff;
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

    .tooltip:hover:before,
    .tooltip:hover:after {
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
        cursor: pointer;
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

    .message-data-level {
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

    #messageContent>*+* {
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
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        white-space: pre-wrap;
        margin-top: 10px;
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

    .replied-message>*+* {
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
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        white-space: pre-wrap;
        margin: 0px;
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

    .file-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px 0 10px 0;
        gap: 20px;
    }

    .file-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        border: none;
        background-color: transparent;
    }

    .file-icon {
        height: 50px;
        width: 50px;
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
	cursor: pointer;
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

    .blink-bg {
        border-radius: 8px;
        animation: blinkingBackground 3s;
    }

    @keyframes blinkingBackground {
        0% {
            background-color: rgba(var(--menuactivergb), 1)
        }

        100% {
            background-color: rgba(var(--menuactivergb), 0)
        }
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

    paper-dialog.progress {
        width: auto;
        max-width: 50vw;
        height: auto;
        max-height: 30vh;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        line-height: 1.6;
        overflow: hidden;
    }

    paper-dialog.close-progress {
        min-width: 550px;
        max-width: 550px;
        height: auto;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        overflow: hidden;
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

    .close-download {
        color: var(--black);
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        top: -15px;
        right: -15px;
    }

    .close-download:hover {
        color: #df3636;
    }
`

export const toolTipStyles = css`
    .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
    }

    .tooltiptext {
        margin-bottom: 100px;
        display: inline;
        visibility: visible;
        width: 120px;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 1;
        transition: opacity 0.3s;
    }

    .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .hide-tooltip {
        display: none;
        visibility: hidden;
        opacity: 0;
    }
`

export const reusableImageStyles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
        --mdc-dialog-max-width: 85vw;
        --mdc-dialog-max-height: 95vh;
    }

    img {
        width: 100%;
        height: auto;
        object-fit: contain;
        border-radius: 5px;
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

    .imageContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
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

export const nameMenuStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-theme-surface: var(--white);
        --mdc-theme-text-primary-on-background: var(--black);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
    }

    a {
        background-color: transparent;
        color: var(--black);
        text-decoration: none;
        display: inline;
        position: relative;
    }

    a:hover {
        background-color: transparent;
        color: var(--black);
        text-decoration: none;
        display: inline;
        position: relative;
    }

    a:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: #03a9f4;
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
    }

    a:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }

    .block {}

    .red {
        --mdc-theme-primary: red;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .custom {
        --paper-tooltip-background: #03a9f4;
        --paper-tooltip-text-color: #fff;
    }

    .dropdown {
        position: relative;
        display: inline;
    }

    .dropdown a:hover {
        background-color: transparent;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        bottom: 25px;
        left: 10px;
        background-color: var(--white);
        min-width: 200px;
        overflow: auto;
        border: 1px solid transparent;
        border-radius: 10px;
        box-shadow: var(--qchatshadow);
        z-index: 1;
    }

    .dropdown-content span {
        color: var(--nav-text-color);
        text-align: center;
        padding-top: 12px;
        display: block;
    }

    .dropdown-content a {
        color: var(--nav-text-color);
        padding: 12px 12px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {
        background-color: var(--nav-color-hover);
    }

    .showList {
        display: block;
    }

    .input {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        resize: none;
        background: #eee;
    }

    .textarea {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        height: 120px;
        resize: none;
        background: #eee;
    }
`

export const levelFounderStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-theme-surface: var(--white);
        --mdc-theme-text-primary-on-background: var(--black);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .custom {
        --paper-tooltip-background: #03a9f4;
        --paper-tooltip-text-color: #fff;
    }

    .level-img-tooltip {
        --paper-tooltip-background: #000000;
        --paper-tooltip-text-color: #fff;
        --paper-tooltip-delay-in: 300;
        --paper-tooltip-delay-out: 3000;
    }

    .message-data {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
    }

    .message-data-level {
        width: 20px;
        height: 20px;
    }

    .badge {
        align-items: center;
        background: rgb(3, 169, 244);
        border: 1px solid transparent;
        border-radius: 50%;
        color: rgb(255, 255, 255);
        display: flex;
        font-size: 10px;
        font-weight: 400;
        height: 12px;
        width: 12px;
        justify-content: center;
        cursor: pointer;
    }
`

export const chatRightPanelSettingsStyles = css`
    .top-bar-icon {
        cursor: pointer;
        height: 18px;
        width: 18px;
        color: var(--black);
        transition: 0.2s all;
    }

    .top-bar-icon:hover {
        color: #F44336;
    }

    .red {
        color: #F44336;
    }

    .green {
        color: #198754;
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
        flex: 0;
        align-items: center;
    }

    .container-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
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
        font-weight: 500;
        font-size: 16px;
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

    .message-myBg {
        background-color: var(--chat-bubble-myBg) !important;
        margin-bottom: 15px;
        border-radius: 5px;
        padding: 5px;
    }

    .message-data-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .message-user-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .hideImg {
        visibility: hidden;
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
        padding-left: 5px;
    }
`

export const chatRightPanelResourcesStyles = css`
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
        flex: 0;
        align-items: center;
    }

    .container-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
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

    .message-myBg {
        background-color: var(--chat-bubble-myBg) !important;
        margin-bottom: 15px;
        border-radius: 5px;
        padding: 5px;
    }

    .message-data-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .message-user-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .hideImg {
        visibility: hidden;
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
        padding-left: 5px;
    }
`

export const imageParentStyles = css`
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
        flex: 0;
        gap: 20px;
        align-items: center;
    }

    .container-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
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

    .message-myBg {
        background-color: var(--chat-bubble-myBg) !important;
        margin-bottom: 15px;
        border-radius: 5px;
        padding: 5px;
    }

    .message-data-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .message-user-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .hideImg {
        visibility: hidden;
    }

    .image-container {
        display: flex;
    }

    .repost-btn {
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
`

export const chatRightPanelStyles = css`
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
        overflow: auto;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
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
`

export const chatGroupStyles = css`
    .top-bar-icon {
        cursor: pointer;
        height: 18px;
        width: 18px;
        transition: .2s all;
    }

    .top-bar-icon:hover {
        color: var(--black)
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
`

export const chatGroupsManagerStyles = css`
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
        flex: 0;
        align-items: center;
    }

    .container-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow: auto;
        margin-top: 5px;
        padding: 0px 6px;
        box-sizing: border-box;
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

    .message-myBg {
        background-color: var(--chat-bubble-myBg) !important;
        margin-bottom: 15px;
        border-radius: 5px;
        padding: 5px;
    }

    .message-data-name {
        user-select: none;
        color: #03a9f4;
        margin-bottom: 5px;
    }

    .message-user-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .hideImg {
        visibility: hidden;
    }

    .checkbox-row {
        position: relative;
        display: flex;
        align-items: center;
        align-content: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
        padding-left: 5px;
    }
`

export const chatWelcomePageStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
    }

    @keyframes moveInBottom {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            transform: translate(0);
        }
    }

    paper-spinner-lite {
        height: 24px;
        width: 24px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 2px;
    }

    .welcome-title {
        display: block;
        overflow: hidden;
        font-size: 40px;
        color: var(--black);
        font-weight: 400;
        text-align: center;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        cursor: inherit;
        margin-top: 2rem;
    }

    .sub-main {
        position: relative;
        text-align: center;
    }

    .center-box {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, 0%);
        text-align: center;
    }

    .img-icon {
        font-size: 150px;
        color: var(--black);
    }

    .start-chat {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        border: none;
        border-radius: 20px;
        padding-left: 25px;
        padding-right: 25px;
        color: var(--white);
        background: var(--tradehead);
        width: 50%;
        font-size: 17px;
        cursor: pointer;
        height: 50px;
        margin-top: 1rem;
        text-transform: uppercase;
        text-decoration: none;
        transition: all .2s;
        position: relative;
        animation: moveInBottom .3s ease-out .50s;
        animation-fill-mode: backwards;
    }

    .start-chat:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, .2);
    }

    .start-chat::after {
        content: "";
        display: inline-flex;
        height: 100%;
        width: 100%;
        border-radius: 100px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        transition: all .4s;
    }

    .red {
        --mdc-theme-primary: red;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
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
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    .input {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        resize: none;
        background: #eee;
    }

    .textarea {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        height: 120px;
        resize: none;
        background: #eee;
    }
`

export const chatHeadStyles = css`
    li {
        width: 100%;
        padding: 10px 5px 10px 5px;
        cursor: pointer;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
    }

    li:hover {
        background-color: var(--menuhover);
    }

    .active {
        background: var(--menuactive);
        border-left: 4px solid #3498db;
    }

    .img-icon {
        float: left;
        font-size: 40px;
        color: var(--chat-group);
    }

    .about {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin: 0;
    }

    .inner-container {
        display: flex;
        width: calc(100% - 45px);
        flex-direction: column;
        justify-content: center;
    }

    .status {
        color: #92959e;
    }

    .clearfix:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }

    .name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
`

export const chatGroupsModalStyles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
        --mdc-dialog-max-width: 85vw;
        --mdc-dialog-max-height: 95vh;
    }

    .imageContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
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

export const chatTextEditorStyles = css`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: auto;
        width: 100%;
        overflow: hidden;
    }

    * {
        --mdc-checkbox-unchecked-color: var(--black);
    }

    .chatbar-container {
        width: 100%;
        display: flex;
        height: auto;
        overflow: hidden;
    }

    .chatbar-caption {
        border-bottom: 2px solid var(--mdc-theme-primary);
    }

    .privateMessageMargin {
        margin-bottom: 12px;
    }

    .emoji-button {
        width: 45px;
        height: 40px;
        padding-top: 4px;
        border: none;
        outline: none;
        background: transparent;
        cursor: pointer;
        max-height: 40px;
        color: var(--black);
        margin-bottom: 5px;
    }

    .message-size-container {
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    .message-size {
        font-family: Roboto, sans-serif;
        font-size: 12px;
        color: var(--black);
    }

    .paperclip-icon {
        color: var(--paperclip-icon);
        width: 25px;
    }

    .paperclip-icon:hover {
        cursor: pointer;
    }

    .send-icon {
        width: 30px;
        margin-left: 5px;
        transition: all 0.1s ease-in-out;
        cursor: pointer;
    }

    .send-icon:hover {
        filter: brightness(1.1);
    }

    .file-picker-container {
        position: relative;
        height: 25px;
        width: 25px;
        margin-bottom: 10px;
    }

    .file-picker-input-container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        z-index: 10;
        opacity: 0;
        overflow: hidden;
    }

    input[type=file]::-webkit-file-upload-button {
        cursor: pointer;
    }

    .chatbar-container textarea {
        display: none;
    }

    .chatbar-container .chat-editor {
        display: flex;
        max-height: -webkit-fill-available;
        width: 100%;
        border-color: transparent;
        margin: 0;
        padding: 0;
        border: none;
    }

    .checkmark-icon {
        width: 30px;
        color: var(--mdc-theme-primary);
        margin-bottom: 6px;
    }

    .checkmark-icon:hover {
        cursor: pointer;
    }

    .element {
        width: 100%;
        max-height: 100%;
        overflow: auto;
        color: var(--black);
        padding: 0px 10px;
        height: 100%;
        display: flex;
        align-items: safe center;
    }

    .element::-webkit-scrollbar-track {
        background-color: whitesmoke;
        border-radius: 7px;
    }

    .element::-webkit-scrollbar {
        width: 6px;
        border-radius: 7px;
        background-color: whitesmoke;
    }

    .element::-webkit-scrollbar-thumb {
        background-color: rgb(180, 176, 176);
        border-radius: 7px;
        transition: all 0.3s ease-in-out;
    }

    .element::-webkit-scrollbar-thumb:hover {
        background-color: rgb(148, 146, 146);
        cursor: pointer;
    }

    .ProseMirror:focus {
        outline: none;
    }

    .is-active {
        background-color: var(--white)
    }

    .ProseMirror>*+* {
        margin-top: 0.75em;
        outline: none;
    }

    .ProseMirror ul,
    ol {
        padding: 0 1rem;
    }

    .ProseMirror h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
    }

    .ProseMirror code {
        background-color: rgba(#616161, 0.1);
        color: #616161;
    }

    .ProseMirror pre {
        background: #0D0D0D;
        color: #FFF;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        white-space: pre-wrap;
    }

    .ProseMirror pre code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
    }

    .ProseMirror img {
        width: 1.7em;
        height: 1.5em;
        margin: 0px;
    }

    .ProseMirror blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0D0D0D, 0.1);
    }

    .ProseMirror hr {
        border: none;
        border-top: 2px solid rgba(#0D0D0D, 0.1);
        margin: 2rem 0;
    }

    .chatbar-button-single {
        background: var(--white);
        outline: none;
        border: none;
        color: var(--black);
        padding: 4px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 2px;
        filter: brightness(100%);
        transition: all 0.2s;
        display: none;
    }

    .removeBg {
        background: none;
    }

    .chatbar-button-single label {
        font-size: 13px;
    }

    .chatbar-button-single:hover {
        filter: brightness(120%);
    }

    .chatbar-buttons {
        margin-bottom: 5px;
        flex-shrink: 0;
    }

    .show-chatbar-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :host(:hover) .chatbar-button-single {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .ProseMirror p.is-editor-empty:first-child::before {
        color: #adb5bd;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }

    .ProseMirror p {
        font-size: 18px;
        margin-block-start: 0px;
        margin-block-end: 0px;
        overflow-wrap: anywhere;
    }

    .ProseMirror {
        width: 100%;
        box-sizing: border-box;
        word-break: break-word;
    }

    .ProseMirror mark {
        background-color: #ffe066;
        border-radius: 0.25em;
        box-decoration-break: clone;
        padding: 0.125em 0;
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        /* Preferred icon size */
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
    }

    .material-symbols-outlined {
        font-family: 'Material Icons Outlined';
        font-weight: normal;
        font-style: normal;
        font-size: 18px;
        /* Preferred icon size */
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
    }

    .hide-styling {
        display: none;
    }

    mwc-checkbox::shadow .mdc-checkbox::after,
    mwc-checkbox::shadow .mdc-checkbox::before {
        background-color: var(--mdc-theme-primary)
    }

    --mdc-checkbox-unchecked-color
`

export const chatMessageStyles = css`
    .message-data {
        margin-bottom: 15px;
    }

    .message-data-time {
        color: #a8aab1;
        font-size: 13px;
        padding-left: 6px;
    }

    .message {
        color: black;
        padding: 12px 10px;
        line-height: 19px;
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
        pointer-events: none;
        border-bottom-color: #ddd;
        border-width: 10px;
        margin-left: -10px;
    }

    .my-message {
        background: #ddd;
        border: 2px #ccc solid;
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
`

export const chatModalsStyles = css`
    .input {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        resize: none;
        background: #eee;
    }

    .textarea {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        height: 120px;
        resize: none;
        background: #eee;
    }

    .close-button {
        display: block;
        --mdc-theme-primary: red;
    }
`

export const chatImageStyles = css`
    * {
        --mdc-theme-text-primary-on-background: var(--black);
    }

    img {
        max-width: 45vh;
        max-height: 40vh;
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
        width: 45vh;
        height: 40vh;
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

export const chatSelectStyles = css`
    ul {
        list-style-type: none;
    }

    li {
        padding: 10px 2px 20px 5px;
        cursor: pointer;
        width: 100%;
        display: flex;
        box-sizing: border-box;
    }

    li:hover {
        background-color: var(--menuhover);
    }

    .active {
        background: var(--menuactive);
        border-left: 4px solid #3498db;
    }

    .img-icon {
        font-size: 40px;
        color: var(--chat-group);
    }

    .about {
        margin-top: 8px;
    }

    .about {
        padding-left: 8px;
    }

    .status {
        color: #92959e;
    }

    .name {
        user-select: none;
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

export const chatSideNavHeadsStyles = css`
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

export const imageComponentStyles = css`
    .gif-error-msg {
        margin: 0;
        font-family: Roboto, sans-serif;
        font-size: 17px;
        letter-spacing: 0.3px;
        color: var(--chat-bubble-msg-color);
        font-weight: 300;
        padding: 10px 10px;
    }

    .gif-image {
        border-radius: 15px;
        background-color: transparent;
        cursor: pointer;
        width: 100%;
        height: 150px;
        object-fit: cover;
        border: 1px solid transparent;
        transition: all 0.2s cubic-bezier(0, 0.55, 0.45, 1);
        box-shadow: rgb(50 50 93 / 25%) 0px 6px 12px -2px, rgb(0 0 0 / 30%) 0px 3px 7px -3px;
    }

    .gif-image:hover {
        border: 1px solid var(--mdc-theme-primary);
    }
`

export const qortalInfoViewStyles = css`
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
        --mdc-theme-primary: #F44336;
    }

    .buttons {
        text-align: right;
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

export const qortalQrcodeGeneratorStyles = css`
    :host {
        display: block;
    }
`

export const tradeInfoViewStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        box-sizing: border-box;
    }

    p {
        margin: 0;
        padding: 0;
        color: var(--black);
    }

    .get-user-info {
        margin: 0;
        padding: 0;
        color: var(--black);
    }

    .get-user-info:hover {
        cursor: pointer;
        color: #03a9f4;
    }

    .pds {
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 5px;
    }

    .card {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
        height: calc(100% - 1rem);
        word-wrap: break-word;
        background-color: var(--white);
        background-clip: border-box;
        margin-bottom: 1rem;
    }

    .card-header {
        padding: 0.5rem 1rem;
        margin-bottom: 0;
        background-color: rgba(0, 0, 0, 0.03);
        border-bottom: 2px solid rgba(0, 0, 0, 0.125);
    }

    .card-header {
        background: none;
        border-width: 0;
        padding: 10px;
        padding-bottom: 0rem;
    }

    .card-title {
        font-size: 1.2rem;
        color: var(--black);
        margin-bottom: 0.5rem;
    }

    .card-body {
        flex: 1 1 auto;
        padding: 1rem 1rem;
    }

    .card-body {
        padding: 20px;
    }

    .d-sm-flex {
        display: flex !important;
    }

    .align-items-center {
        align-items: center !important;
    }

    .justify-content-between {
        justify-content: space-between !important;
    }

    .d-flex {
        display: flex !important;
    }

    .mb-3 {
        margin-bottom: 1rem !important;
    }

    .cwh-64 {
        width: 64px !important;
        height: 64px !important;
    }

    .cwh-80 {
        width: 80px !important;
        height: 80px !important;
    }

    .rounded {
        border-radius: 25% !important;
    }

    .ms-3 {
        margin-left: 1rem !important;
    }

    .cfs-12 {
        font-size: 12px !important;
    }

    .cfs-14 {
        font-size: 14px !important;
    }

    .cfs-16 {
        font-size: 16px !important;
    }

    .cfs-18 {
        font-size: 18px !important;
    }

    .me-sm-3 {
        margin-right: 1rem !important;
    }

    .ms-sm-0 {
        margin-left: 0 !important;
    }

    .text-sm-end {
        text-align: right !important;
    }

    .order-0 {
        order: 0 !important;
    }

    .order-1 {
        order: 1 !important;
    }

    .order-sm-0 {
        order: 0 !important;
    }

    .order-sm-1 {
        order: 1 !important;
    }

    .red {
        color: #F44336;
    }

    .green {
        color: #198754;
    }

    .buttons {
        display: inline;
        float: right;
        margin-bottom: 5px;
        margin-right: 5px;
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

    table {
        caption-side: bottom;
        border-collapse: collapse;
    }

    caption {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        color: #6c757d;
        text-align: left;
    }

    th {
        text-align: inherit;
        text-align: -webkit-match-parent;
    }

    thead,
    tbody,
    tfoot,
    tr,
    td,
    th {
        border-color: inherit;
        border-style: solid;
        border-width: 0;
    }

    .table {
        --bs-table-bg: transparent;
        --bs-table-striped-color: #212529;
        --bs-table-striped-bg: rgba(255, 255, 255, 0.2);
        --bs-table-active-color: #212529;
        --bs-table-active-bg: rgba(0, 0, 0, 0.1);
        --bs-table-hover-color: #212529;
        --bs-table-hover-bg: rgba(0, 0, 0, 0.075);
        width: 100%;
        margin-bottom: 1rem;
        color: var(--black);
        vertical-align: top;
        border-color: #edeff4;
    }

    .table> :not(caption)>*>* {
        padding: 0.75rem 0.75rem;
        background-color: var(--bs-table-bg);
        background-image: linear-gradient(var(--bs-table-accent-bg), var(--bs-table-accent-bg));
        border-bottom-width: 2px;
    }

    .table>tbody {
        vertical-align: inherit;
    }

    .table>thead {
        vertical-align: bottom;
    }

    .table> :not(:last-child)> :last-child>* {
        border-bottom-color: currentColor;
    }

    .caption-top {
        caption-side: top;
    }

    .table-sm> :not(caption)>*>* {
        padding: 0.5rem 0.5rem;
    }

    .table-bordered> :not(caption)>* {
        border-width: 2px 0;
    }

    .table-bordered> :not(caption)>*>* {
        border-width: 0 2px;
    }

    .table-borderless> :not(caption)>*>* {
        border-bottom-width: 0;
    }

    .table-striped>tbody>tr:nth-of-type(odd) {
        --bs-table-accent-bg: var(--bs-table-striped-bg);
        color: var(--black);
    }

    .table-active {
        --bs-table-accent-bg: var(--bs-table-active-bg);
        color: var(--bs-table-active-color);
    }

    .table-hover>tbody>tr:hover {
        --bs-table-accent-bg: var(--bs-table-hover-bg);
        color: var(--bs-table-hover-color);
    }

    .table-primary {
        --bs-table-bg: #cfe2ff;
        --bs-table-striped-bg: #c5d7f2;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #bacbe6;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #bfd1ec;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #bacbe6;
    }

    .table-secondary {
        --bs-table-bg: #e2e3e5;
        --bs-table-striped-bg: #d7d8da;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #cbccce;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #d1d2d4;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #cbccce;
    }

    .table-success {
        --bs-table-bg: #e1f5d4;
        --bs-table-striped-bg: #d6e9c9;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #cbddbf;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #d0e3c4;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #cbddbf;
    }

    .table-info {
        --bs-table-bg: #cff4fc;
        --bs-table-striped-bg: #c5e8ef;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #badce3;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #bfe2e9;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #badce3;
    }

    .table-warning {
        --bs-table-bg: #fff3cd;
        --bs-table-striped-bg: #f2e7c3;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #e6dbb9;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #ece1be;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #e6dbb9;
    }

    .table-danger {
        --bs-table-bg: #f8d7da;
        --bs-table-striped-bg: #eccccf;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #dfc2c4;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #e5c7ca;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #dfc2c4;
    }

    .table-light {
        --bs-table-bg: #f8f9fa;
        --bs-table-striped-bg: #ecedee;
        --bs-table-striped-color: #000;
        --bs-table-active-bg: #dfe0e1;
        --bs-table-active-color: #000;
        --bs-table-hover-bg: #e5e6e7;
        --bs-table-hover-color: #000;
        color: #000;
        border-color: #dfe0e1;
    }

    .table-dark {
        --bs-table-bg: #212529;
        --bs-table-striped-bg: #2c3034;
        --bs-table-striped-color: #fff;
        --bs-table-active-bg: #373b3e;
        --bs-table-active-color: #fff;
        --bs-table-hover-bg: #323539;
        --bs-table-hover-color: #fff;
        color: #fff;
        border-color: #373b3e;
    }

    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 359.98px) {
        .table-responsive-xxs {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 499.98px) {
        .table-responsive-xsm {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 575.98px) {
        .table-responsive-sm {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 767.98px) {
        .table-responsive-md {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 991.98px) {
        .table-responsive-lg {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 1199.98px) {
        .table-responsive-xl {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    @media (max-width: 1399.98px) {
        .table-responsive-xxl {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
    }

    th {
        font-weight: 500;
    }

    tbody::-webkit-scrollbar,
    tbody::-webkit-scrollbar-thumb,
    tbody::-webkit-scrollbar-track {
        opacity: 0;
        width: 5px;
        border-radius: 6px;
        position: absolute;
        right: 0;
        top: 0;
    }

    tbody:hover::-webkit-scrollbar,
    tbody:hover::-webkit-scrollbar-thumb,
    tbody:hover::-webkit-scrollbar-track {
        opacity: 0.9;
        width: 5px;
        border-radius: 6px;
        right: 2px;
        position: absolute;
        transition: background-color 0.2s linear, width 0.2s ease-in-out;
    }

    tbody:hover::-webkit-scrollbar-thumb {
        background-color: #eee;
    }

    .mt-0 {
        margin-top: 0 !important;
    }

    .mt-1 {
        margin-top: 0.25rem !important;
    }

    .mt-2 {
        margin-top: 0.5rem !important;
    }

    .mt-3 {
        margin-top: 1rem !important;
    }

    .mt-4 {
        margin-top: 1.5rem !important;
    }

    .mt-5 {
        margin-top: 3rem !important;
    }

    .mt-auto {
        margin-top: auto !important;
    }

    .w-25 {
        width: 25% !important;
    }

    .w-50 {
        width: 50% !important;
    }

    .w-75 {
        width: 75% !important;
    }

    .w-100 {
        width: 100% !important;
    }

    .w-auto {
        width: auto !important;
    }

    .cmw-30 {
        min-width: 30rem;
    }

    .fst-normal {
        font-style: normal !important;
    }

    .fw-light {
        font-weight: 300 !important;
    }

    .fw-lighter {
        font-weight: lighter !important;
    }

    .fw-normal {
        font-weight: 400 !important;
    }

    .fw-bold {
        font-weight: 500 !important;
    }

    .fw-bolder {
        font-weight: bolder !important;
    }

    .text-lowercase {
        text-transform: lowercase !important;
    }

    .text-uppercase {
        text-transform: uppercase !important;
    }

    .text-capitalize {
        text-transform: capitalize !important;
    }

    .text-start {
        text-align: left !important;
    }

    .text-end {
        text-align: right !important;
    }

    .text-center {
        text-align: center !important;
    }

    .text-primary {
        color: #0e6eff !important;
    }

    .text-secondary {
        color: #6c757d !important;
    }

    .text-success {
        color: #68cf29 !important;
    }

    .text-info {
        color: #03a9f4 !important;
    }

    .text-warning {
        color: #ffc107 !important;
    }

    .text-danger {
        color: #dc3545 !important;
    }

    .text-light {
        color: #f8f9fa !important;
    }

    .text-dark {
        color: #212529 !important;
    }

    .text-white {
        color: #fff !important;
    }

    .btn {
        display: inline-block;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        background-color: transparent;
        border: 2px solid transparent;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        border-radius: 5px;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
        .btn {
            transition: none;
        }
    }

    .btn:hover {
        color: #212529;
    }

    .btn-check:focus+.btn,
    .btn:focus {
        outline: 0;
        box-shadow: 0 0 0 0.25rem rgba(14, 110, 255, 0.25);
    }

    .btn:disabled,
    .btn.disabled,
    fieldset:disabled .btn {
        pointer-events: none;
        opacity: 0.65;
    }

    .btn-primary {
        color: #fff;
        background-color: #0e6eff;
        border-color: #edeff4;
    }

    .btn-primary:hover {
        color: #ddd;
        background-color: #3284ff;
        border-color: #267dff;
    }

    .btn-check:focus+.btn-primary,
    .btn-primary:focus {
        color: #ddd;
        background-color: #3284ff;
        border-color: #267dff;
        box-shadow: 0 0 0 0.25rem rgba(12, 94, 217, 0.5);
    }

    .btn-check:checked+.btn-primary,
    .btn-check:active+.btn-primary,
    .btn-primary:active,
    .btn-primary.active,
    .show>.btn-primary.dropdown-toggle {
        color: #ddd;
        background-color: #3e8bff;
        border-color: #267dff;
    }

    .btn-check:checked+.btn-primary:focus,
    .btn-check:active+.btn-primary:focus,
    .btn-primary:active:focus,
    .btn-primary.active:focus,
    .show>.btn-primary.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(12, 94, 217, 0.5);
    }

    .btn-primary:disabled,
    .btn-primary.disabled {
        color: #ddd;
        background-color: #0e6eff;
        border-color: #0e6eff;
    }

    .btn-secondary {
        color: #fff;
        background-color: #6c757d;
        border-color: #edeff4;
    }

    .btn-secondary:hover {
        color: #ddd;
        background-color: #5c636a;
        border-color: #565e64;
    }

    .btn-check:focus+.btn-secondary,
    .btn-secondary:focus {
        color: #ddd;
        background-color: #5c636a;
        border-color: #565e64;
        box-shadow: 0 0 0 0.25rem rgba(130, 138, 145, 0.5);
    }

    .btn-check:checked+.btn-secondary,
    .btn-check:active+.btn-secondary,
    .btn-secondary:active,
    .btn-secondary.active,
    .show>.btn-secondary.dropdown-toggle {
        color: #ddd;
        background-color: #565e64;
        border-color: #51585e;
    }

    .btn-check:checked+.btn-secondary:focus,
    .btn-check:active+.btn-secondary:focus,
    .btn-secondary:active:focus,
    .btn-secondary.active:focus,
    .show>.btn-secondary.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(130, 138, 145, 0.5);
    }

    .btn-secondary:disabled,
    .btn-secondary.disabled {
        color: #ddd;
        background-color: #6c757d;
        border-color: #6c757d;
    }

    .btn-success {
        color: #fff;
        background-color: #68cf29;
        border-color: #edeff4;
    }

    .btn-success:hover {
        color: #ddd;
        background-color: #7fd649;
        border-color: #77d43e;
    }

    .btn-check:focus+.btn-success,
    .btn-success:focus {
        color: #ddd;
        background-color: #7fd649;
        border-color: #77d43e;
        box-shadow: 0 0 0 0.25rem rgba(88, 176, 35, 0.5);
    }

    .btn-check:checked+.btn-success,
    .btn-check:active+.btn-success,
    .btn-success:active,
    .btn-success.active,
    .show>.btn-success.dropdown-toggle {
        color: #ddd;
        background-color: #86d954;
        border-color: #77d43e;
    }

    .btn-check:checked+.btn-success:focus,
    .btn-check:active+.btn-success:focus,
    .btn-success:active:focus,
    .btn-success.active:focus,
    .show>.btn-success.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(88, 176, 35, 0.5);
    }

    .btn-success:disabled,
    .btn-success.disabled {
        color: #ddd;
        background-color: #68cf29;
        border-color: #68cf29;
    }

    .btn-info {
        color: #fff;
        background-color: #0dcaf0;
        border-color: #edeff4;
    }

    .btn-info:hover {
        color: #ddd;
        background-color: #31d2f2;
        border-color: #25cff2;
    }

    .btn-check:focus+.btn-info,
    .btn-info:focus {
        color: #ddd;
        background-color: #31d2f2;
        border-color: #25cff2;
        box-shadow: 0 0 0 0.25rem rgba(11, 172, 204, 0.5);
    }

    .btn-check:checked+.btn-info,
    .btn-check:active+.btn-info,
    .btn-info:active,
    .btn-info.active,
    .show>.btn-info.dropdown-toggle {
        color: #ddd;
        background-color: #3dd5f3;
        border-color: #25cff2;
    }

    .btn-check:checked+.btn-info:focus,
    .btn-check:active+.btn-info:focus,
    .btn-info:active:focus,
    .btn-info.active:focus,
    .show>.btn-info.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(11, 172, 204, 0.5);
    }

    .btn-info:disabled,
    .btn-info.disabled {
        color: #000;
        background-color: #0dcaf0;
        border-color: #0dcaf0;
    }

    .btn-warning {
        color: #fff;
        background-color: #ffc107;
        border-color: #edeff4;
    }

    .btn-warning:hover {
        color: #ddd;
        background-color: #ffca2c;
        border-color: #ffc720;
    }

    .btn-check:focus+.btn-warning,
    .btn-warning:focus {
        color: #ddd;
        background-color: #ffca2c;
        border-color: #ffc720;
        box-shadow: 0 0 0 0.25rem rgba(217, 164, 6, 0.5);
    }

    .btn-check:checked+.btn-warning,
    .btn-check:active+.btn-warning,
    .btn-warning:active,
    .btn-warning.active,
    .show>.btn-warning.dropdown-toggle {
        color: #ddd;
        background-color: #ffcd39;
        border-color: #ffc720;
    }

    .btn-check:checked+.btn-warning:focus,
    .btn-check:active+.btn-warning:focus,
    .btn-warning:active:focus,
    .btn-warning.active:focus,
    .show>.btn-warning.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(217, 164, 6, 0.5);
    }

    .btn-warning:disabled,
    .btn-warning.disabled {
        color: #ddd;
        background-color: #ffc107;
        border-color: #ffc107;
    }

    .btn-danger {
        color: #fff;
        background-color: #dc3545;
        border-color: #edeff4;
    }

    .btn-danger:hover {
        color: #ddd;
        background-color: #bb2d3b;
        border-color: #b02a37;
    }

    .btn-check:focus+.btn-danger,
    .btn-danger:focus {
        color: #ddd;
        background-color: #bb2d3b;
        border-color: #b02a37;
        box-shadow: 0 0 0 0.25rem rgba(225, 83, 97, 0.5);
    }

    .btn-check:checked+.btn-danger,
    .btn-check:active+.btn-danger,
    .btn-danger:active,
    .btn-danger.active,
    .show>.btn-danger.dropdown-toggle {
        color: #ddd;
        background-color: #b02a37;
        border-color: #a52834;
    }

    .btn-check:checked+.btn-danger:focus,
    .btn-check:active+.btn-danger:focus,
    .btn-danger:active:focus,
    .btn-danger.active:focus,
    .show>.btn-danger.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(225, 83, 97, 0.5);
    }

    .btn-danger:disabled,
    .btn-danger.disabled {
        color: #ddd;
        background-color: #dc3545;
        border-color: #dc3545;
    }

    .btn-light {
        color: #000;
        background-color: #f8f9fa;
        border-color: #edeff4;
    }

    .btn-light:hover {
        color: #000;
        background-color: #f9fafb;
        border-color: #f9fafb;
    }

    .btn-check:focus+.btn-light,
    .btn-light:focus {
        color: #000;
        background-color: #f9fafb;
        border-color: #f9fafb;
        box-shadow: 0 0 0 0.25rem rgba(211, 212, 213, 0.5);
    }

    .btn-check:checked+.btn-light,
    .btn-check:active+.btn-light,
    .btn-light:active,
    .btn-light.active,
    .show>.btn-light.dropdown-toggle {
        color: #000;
        background-color: #f9fafb;
        border-color: #f9fafb;
    }

    .btn-check:checked+.btn-light:focus,
    .btn-check:active+.btn-light:focus,
    .btn-light:active:focus,
    .btn-light.active:focus,
    .show>.btn-light.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(211, 212, 213, 0.5);
    }

    .btn-light:disabled,
    .btn-light.disabled {
        color: #000;
        background-color: #f8f9fa;
        border-color: #f8f9fa;
    }

    .btn-dark {
        color: #fff;
        background-color: #212529;
        border-color: #edeff4;
    }

    .btn-dark:hover {
        color: #ddd;
        background-color: #1c1f23;
        border-color: #1a1e21;
    }

    .btn-check:focus+.btn-dark,
    .btn-dark:focus {
        color: #ddd;
        background-color: #1c1f23;
        border-color: #1a1e21;
        box-shadow: 0 0 0 0.25rem rgba(66, 70, 73, 0.5);
    }

    .btn-check:checked+.btn-dark,
    .btn-check:active+.btn-dark,
    .btn-dark:active,
    .btn-dark.active,
    .show>.btn-dark.dropdown-toggle {
        color: #ddd;
        background-color: #1a1e21;
        border-color: #191c1f;
    }

    .btn-check:checked+.btn-dark:focus,
    .btn-check:active+.btn-dark:focus,
    .btn-dark:active:focus,
    .btn-dark.active:focus,
    .show>.btn-dark.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(66, 70, 73, 0.5);
    }

    .btn-dark:disabled,
    .btn-dark.disabled {
        color: #ddd;
        background-color: #212529;
        border-color: #212529;
    }

    .btn-white {
        color: #000;
        background-color: #fff;
        border-color: #edeff4;
    }

    .btn-white:hover {
        color: #000;
        background-color: white;
        border-color: white;
    }

    .btn-check:focus+.btn-white,
    .btn-white:focus {
        color: #000;
        background-color: white;
        border-color: white;
        box-shadow: 0 0 0 0.25rem rgba(217, 217, 217, 0.5);
    }

    .btn-check:checked+.btn-white,
    .btn-check:active+.btn-white,
    .btn-white:active,
    .btn-white.active,
    .show>.btn-white.dropdown-toggle {
        color: #000;
        background-color: white;
        border-color: white;
    }

    .btn-check:checked+.btn-white:focus,
    .btn-check:active+.btn-white:focus,
    .btn-white:active:focus,
    .btn-white.active:focus,
    .show>.btn-white.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.25rem rgba(217, 217, 217, 0.5);
    }

    .btn-white:disabled,
    .btn-white.disabled {
        color: #000;
        background-color: #fff;
        border-color: #fff;
    }

    .btn-lg>.btn {
        padding: 0.5rem 1rem;
        font-size: 1.25rem;
        border-radius: 0.3rem;
    }

    .btn-sm>.btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
        border-radius: 0.2rem;
    }

    .border-0 {
        border: 0 !important;
    }

    .px-0 {
        padding-right: 0 !important;
        padding-left: 0 !important;
    }

    .px-1 {
        padding-right: 0.25rem !important;
        padding-left: 0.25rem !important;
    }

    .px-2 {
        padding-right: 0.5rem !important;
        padding-left: 0.5rem !important;
    }

    .px-3 {
        padding-right: 1rem !important;
        padding-left: 1rem !important;
    }

    .px-4 {
        padding-right: 1.5rem !important;
        padding-left: 1.5rem !important;
    }

    .px-5 {
        padding-right: 3rem !important;
        padding-left: 3rem !important;
    }
`

export const traderInfoViewStyles = css`
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

export const userInfoStyles = css`
    .user-info-header {
        font-family: Montserrat, sans-serif;
        text-align: center;
        font-size: 28px;
        color: var(--chat-bubble-msg-color);
        margin-bottom: 10px;
        padding: 10px 0;
    }

    .avatar-container {
        display: flex;
        justify-content: center;
    }

    .user-info-avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 10px 0;
    }

    .user-info-no-avatar {
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: capitalize;
        font-size: 50px;
        font-family: Roboto, sans-serif;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: var(--chatHeadBg);
        color: var(--chatHeadText);
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
    }

    .send-message-button:hover {
        cursor: pointer;
        background-color: #03a8f485;
    }

    .close-icon {
        position: absolute;
        top: 3px;
        right: 5px;
        color: #676b71;
        width: 14px;
        transition: all 0.1s ease-in-out;
    }

    .close-icon:hover {
        cursor: pointer;
        color: #494c50;
    }
`

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
        box-shadow: 0px 4px 5px 0px hsla(0, 0%, 0%, 0.14), 0px 1px 10px 0px hsla(0, 0%, 0%, 0.12), 0px 2px 4px -1px hsla(0, 0%, 0%, 0.2);
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
        box-shadow: rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px, rgb(0 0 0 / 20%) 0px 1px 3px 0px;
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
        box-shadow: rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px, rgb(0 0 0 / 20%) 0px 2px 4px -1px;
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

    .lds-circle>div {
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
        box-shadow: 0px 3px 4px 0px hsla(0, 0%, 0%, 0.14), 0px 3px 3px -2px hsla(0, 0%, 0%, 0.12), 0px 1px 8px 0px hsla(0, 0%, 0%, 0.2);
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
        box-shadow: 0px 3px 4px 0px hsla(0, 0%, 0%, 0.14), 0px 3px 3px -2px hsla(0, 0%, 0%, 0.12), 0px 1px 8px 0px hsla(0, 0%, 0%, 0.2);
    }
`

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

    .lds-circle>div {
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
`

export const qchatStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 750px;
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --item-selected-color: var(--nav-selected-color);
        --lumo-base-color: var(--white);
        --lumo-body-text-color: var(--black);
        --_lumo-grid-border-color: var(--border);
        --_lumo-grid-secondary-border-color: var(--border2);
        --item-selected-color-text: var(--nav-selected-color-text);
        --item-color-active: var(--nav-color-active);
        --item-color-hover: var(--nav-color-hover);
        --item-text-color: var(--nav-text-color);
        --item-icon-color: var(--nav-icon-color);
        --item-border-color: var(--nav-border-color);
        --item-border-selected-color: var(--nav-border-selected-color);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
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
        border-right: 2px #ddd solid;
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

    .groups-button-notif:hover+.groups-button-notif-number {
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

    .green {
        --mdc-theme-primary: #198754;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
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
        font-weight: 600;
        font-size: 12px;
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

    .close-check {
        color: var(--black);
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        top: -15px;
        right: -15px;
    }

    .close-check:hover {
        color: #df3636;
    }

    paper-dialog.check {
        width: auto;
        max-width: 50vw;
        height: auto;
        max-height: 30vh;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        line-height: 1.6;
        overflow: hidden;
    }

    paper-dialog.close-check {
        min-width: 550px;
        max-width: 550px;
        height: auto;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        overflow: hidden;
    }

    .view-grid {
        width: 120px;
        height: 120px;
        position: absolute;
        left: 50%;
        top: 50%;
    }

    .view-grid div {
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #03a9f4;
        animation: view-grid 1.2s linear infinite;
    }

    .view-grid div:nth-child(1) {
        top: 4px;
        left: 4px;
        animation-delay: 0s;
    }

    .view-grid div:nth-child(2) {
        top: 4px;
        left: 48px;
        animation-delay: -0.4s;
    }

    .view-grid div:nth-child(3) {
        top: 4px;
        left: 90px;
        animation-delay: -0.8s;
    }

    .view-grid div:nth-child(4) {
        top: 50px;
        left: 4px;
        animation-delay: -0.4s;
    }

    .view-grid div:nth-child(5) {
        top: 50px;
        left: 48px;
        animation-delay: -0.8s;
    }

    .view-grid div:nth-child(6) {
        top: 50px;
        left: 90px;
        animation-delay: -1.2s;
    }

    .view-grid div:nth-child(7) {
        top: 95px;
        left: 4px;
        animation-delay: -0.8s;
    }

    .view-grid div:nth-child(8) {
        top: 95px;
        left: 48px;
        animation-delay: -1.2s;
    }

    .view-grid div:nth-child(9) {
        top: 95px;
        left: 90px;
        animation-delay: -1.6s;
    }

    @keyframes view-grid {

        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0.5;
        }
    }

    paper-dialog.viewSettings {
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

    .view {
        display: inline;
        width: 50%;
        align-items: center;
    }
`

export const becomeMinterStyles = css`
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
`

export const groupManagementStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
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

    [part="input-field"] {
        background-color: #fff;
    }

    #group-management-page {
        background: var(--white);
        padding: 12px 24px;
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    paper-dialog.nanage-group {
        width: 80%;
        max-width: 80vw;
        height: 80%;
        max-height: 80vh;
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

    .actions-chat {
        display: flex;
        justify-content: space-between;
        padding: 0 1em;
        margin: 12px 0 -6px 0;
    	position: fixed;
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

    .error-icon {
        font-size: 48px;
        color: red;
    }

    .success-icon {
        font-size: 48px;
        color: #198754;
    }

    .close-icon {
        font-size: 36px;
    }

    .close-icon:hover {
        cursor: pointer;
        opacity: .6;
    }

    .close-icon-chat {
        font-size: 36px;
	margin-top: -8px;
    }

    .close-icon-chat:hover {
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
        border-radius: 10px;
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
        padding: 10px 0 10px 0;
        border-radius: 10px;
        font-size: 16px;
        text-align: center;
        min-height: 460px;
    }

    @media(max-width:700px) {
        .mainPage {
            margin-top: 30px;
        }
    }

    @media(min-width:765px) {
        .container {
            padding: 2em;
        }

        .wrapper {
            display: grid;
            grid-template-columns: 1fr 5fr;
            grid-gap: 20px;
        }

        .wrapper>.mainPage {
            padding: 2em;
        }

        .leftBar {
            text-align: left;
            max-height: 320px;
            max-width: 250px;
            font-size: 16px;
        }

        .mainPage {
            font-size: 16px;
        }
    }

    mwc-textfield {
        width: 100%;
    }

    .red {
        --mdc-theme-primary: red;
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }

    mwc-button.red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 2em;
    }

    h2 {
        margin: 0;
    }

    h6 {
        color: var(--black);
        font-weight: 500;
        font-size: 14px;
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
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

    span {
        font-size: 18px;
        word-break: break-all;
    }

    select {
        padding: 13px 20px;
        width: 100%;
        font-size: 14px;
        color: #555;
        font-weight: 400;
    }

    .title {
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    .itemList {
        padding: 0;
    }

    img {
        border-radius: 25%;
        max-width: 32px;
        height: 100%;
        max-height: 32px;
    }

    .successBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid green;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .errorBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid red;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .manage-group-dialog {
        min-height: 300px;
        min-width: 350px;
        box-sizing: border-box;
        position: relative;
    }

    .btn-clear-success {
        --mdc-icon-button-size: 32px;
        color: red;
    }

    .btn-clear-error {
        --mdc-icon-button-size: 32px;
        color: green;
    }

    select {
        background: var(--white);
        color: var(--black);
    }

    #search {
        width: 100%;
        display: flex;
        margin: auto;
        align-items: center;
    }

    .message-container {
        position: relative;
    }

    .message-subcontainer1 {
        position: relative;
        display: flex;
        align-items: flex-end;
        margin-top: 10px;
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

    .message-subcontainer2-mybg {
        position: relative;
        display: flex;
        background-color: var(--chat-bubble-myBg);
        flex-grow: 0;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        border-radius: 5px;
        padding: 12px 15px 4px 15px;
        width: fit-content;
        min-width: 150px;
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

    .message-triangle-mybg {
        position: relative;
    }

    .message-triangle-mybg:after {
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

    .message-user-info {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .message-data-name {
        user-select: none;
        color: var(--qchat-name);
        margin-bottom: 5px;
    }

    .message-data-my-name {
        user-select: none;
        color: var(--qchat-my-name);
        margin-bottom: 5px;
    }

    .message-avatar {
        margin: 0px 5px 0px 0px;
        width: 42px;
        height: 42px;
        border-radius: 25%;
        float: left;
    }

    .message {
        display: flex;
        flex-direction: column;
        color: var(--chat-bubble-msg-color);
        line-height: 19px;
        overflow-wrap: anywhere;
        margin-top: 5px;
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
        font-size: 16px;
        width: 100%;
        position: relative;
    }

    .message p {
        margin: 0px;
        padding: 0px;
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
        height: 85%;
        width: 2.6px;
        background-color: var(--mdc-theme-primary);
    }

    .original-message-sender {
        color: var(--mdc-theme-primary);
    }

    .original-message-sender-wasme {
        color: var(--qchat-my-name);
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
        max-height: 80px;
        margin: 0;
        padding: 0;
    }

    .image-container {
        display: flex;
    }

    .chat-img {
        max-width: 45vh;
        max-height: 40vh;
        border-radius: 5px;
        position: relative;
    }

    .chat-replied-img {
        max-width: 30vh;
        max-height: 25vh;
        border-radius: 5px;
        position: relative;
    }

    .defaultSize {
        width: 45vh;
        height: 40vh;
    }

    .attachment-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px 0 10px 0;
        gap: 20px;
    }

    .attachment-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 52px;
        border-radius: 50%;
        border: none;
        background-color: var(--mdc-theme-primary);
    }

    .attachment-icon {
        height: 42px;
        width: 42px;
    }

    .file-container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        padding: 5px 0 10px 0;
        gap: 20px;
    }

    .file-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 52px;
        border-radius: 50%;
        border: none;
        background-color: transparent;
    }

    .file-icon {
        height: 52px;
        width: 52px;
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
        letter-spacing: 0.3px;
        padding: 5px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .attachment-deleted {
        font-family: Work Sans, sans-serif;
	font-style: italic;
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
        font-family: Work Sans, sans-serif;
	font-style: italic;
        font-size: 16px;
        color: var(--chat-bubble-msg-color);
        margin: 0;
        letter-spacing: 0.3px;
        font-weight: 300;
    }

    .message-data-time {
        color: #888888;
        font-size: 13px;
        user-select: none;
        display: flex;
        justify-content: flex-end;
        width: 100%;
        padding-top: 2px;
    }

    .message-data-time-edited {
        color: #888888;
        font-size: 13px;
        user-select: none;
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding-top: 2px;
    }

    .message-data-forward {
        user-select: none;
        color: var(--general-color-blue);
        margin-bottom: 5px;
        font-size: 12px;
    }

    .message-data-edited {
        font-family: "Work Sans", sans-serif;
        font-style: italic;
        font-size: 13px;
        visibility: visible;
    }

    .no-messages {
        color: var(--black);
        font-weight: 500;
        font-size: 32px;
	text-align: center;
        margin: 0;
    }

    paper-dialog.info {
        width: 100%;
        max-width: 75vw;
        height: 100%;
        max-height: 75vh;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        overflow: hidden;
    }

    paper-dialog.progress {
        width: auto;
        max-width: 50vw;
        height: auto;
        max-height: 30vh;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        line-height: 1.6;
        overflow: hidden;
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

export const mintingInfoStyles = css`
    * {
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
    }

    @keyframes moveInBottom {
        0% {
            opacity: 0;
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            transform: translate(0);
        }
    }

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    h4 {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        color: var(--black);
    }

    .header-title {
        display: block;
        overflow: hidden;
        font-size: 40px;
        color: var(--black);
        font-weight: 400;
        text-align: center;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        cursor: inherit;
        margin-top: 2rem;
    }

    .level-black {
        font-size: 32px;
        color: var(--black);
        font-weight: 400;
        text-align: center;
        margin-top: 2rem;
    }

    .level-blue {
        display: inline-block;
        font-size: 32px;
        color: #03a9f4;
        font-weight: 400;
        text-align: center;
        margin-top: 2rem;
    }

    .sub-main {
        position: relative;
        text-align: center;
        width: 100%;
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
        min-width: 250px;
        margin-left: 10px;
        margin-bottom: 5px;
    }

    .help-icon {
        color: #f44336;
    }

    .details {
        display: flex;
        font-size: 18px;
    }

    .title {
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        opacity: 0.66;
        color: #03a9f4;
    }

    .sub-title {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        opacity: 0.66;
    }

    .input {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        resize: none;
        background: #eee;
    }

    .textarea {
        width: 90%;
        border: none;
        display: inline-block;
        font-size: 16px;
        padding: 10px 20px;
        border-radius: 5px;
        height: 120px;
        resize: none;
        background: #eee;
    }

    .not-minter {
        display: inline-block;
        font-size: 32px;
        color: #03a9f4;
        font-weight: 400;
        margin-top: 2rem;
    }

    .blue {
        color: #03a9f4;
    }

    .black {
        color: var(--black);
    }

    .red {
        color: #f44336;
    }

    .red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }

    mwc-button.red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }
`

export const nameRegistrationStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
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

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    #name-registration-page {
        background: var(--white);
        padding: 12px 24px;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    img {
        border-radius: 25%;
        max-width: 42px;
        height: 100%;
        max-height: 42px;
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .buttons {
        text-align: right;
    }

    paper-spinner-lite {
        height: 30px;
        width: 30px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #pages {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pages>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pages>button:not([disabled]):hover,
    #pages>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pages>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pages>button[disabled] {
        opacity: 0.5;
        cursor: default;
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

    .successBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid green;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .errorBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid red;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .manage-group-dialog {
        min-height: 300px;
        min-width: 350px;
        box-sizing: border-box;
        position: relative;
    }

    .btn-clear-success {
        --mdc-icon-button-size: 32px;
        color: red;
    }

    .btn-clear-error {
        --mdc-icon-button-size: 32px;
        color: green;
    }

    .error-icon {
        font-size: 48px;
        color: red;
    }
`

export const namesMarketStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
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

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    #name-registration-page {
        background: var(--white);
        padding: 12px 24px;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 10px;
        margin-top: 10px;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    img {
        border-radius: 25%;
        max-width: 42px;
        height: 100%;
        max-height: 42px;
    }

    #tabs-height {
        --mdc-tab-height: 50px;
    }

    #tabs-1-content {
        height: 100%;
        padding-bottom: 10px;
    }

    mwc-tab-bar {
        --mdc-text-transform: none;
        --mdc-tab-color-default: var(--black);
        --mdc-tab-text-label-color-default: var(--black);
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .sellerAddress {
        color: var(--mdc-theme-primary);
        cursor: pointer;
    }

    .buyerAddress {
        color: #198754;
        cursor: pointer;
    }

    .sold {
        color: #F44336;
        --mdc-icon-size: 16px;
        padding-top: 10px;
    }

    .buttons {
        text-align: right;
    }

    paper-spinner-lite {
        height: 30px;
        width: 30px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    #pages {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pages>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pages>button:not([disabled]):hover,
    #pages>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pages>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pages>button[disabled] {
        opacity: 0.5;
        cursor: default;
    }

    #pagesSold {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pagesSold>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pagesSold>button:not([disabled]):hover,
    #pagesSold>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pagesSold>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pagesSold>button[disabled] {
        opacity: 0.5;
        cursor: default;
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

    .successBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid green;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .errorBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid red;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .manage-group-dialog {
        min-height: 300px;
        min-width: 350px;
        box-sizing: border-box;
        position: relative;
    }

    .btn-clear-success {
        --mdc-icon-button-size: 32px;
        color: red;
    }

    .btn-clear-error {
        --mdc-icon-button-size: 32px;
        color: green;
    }

    .error-icon {
        font-size: 48px;
        color: red;
    }
`

export const nodeManagementStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
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
        height: 24px;
        width: 24px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 2px;
    }

    #node-management-page {
        background: var(--white);
    }

    mwc-textfield {
        width: 100%;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }

    mwc-button.red-button {
        --mdc-theme-primary: red;
        --mdc-theme-on-primary: white;
    }

    .node-card {
        padding: 12px 24px;
        background: var(--white);
        border-radius: 2px;
        box-shadow: 11;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .sblack {
        color: var(--black);
    }

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    .details {
        display: flex;
        font-size: 18px;
    }
`

export const overviewPageStyles = css`
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    @-ms-viewport {
        width: device-width;
    }

    figcaption,
    footer,
    main,
    nav,
    section {
        display: block;
    }

    [tabindex='-1']:focus {
        outline: 0 !important;
    }

    hr {
        overflow: visible;
        box-sizing: content-box;
        height: 0;
    }

    h2,
    h3,
    h5 {
        margin-top: 0;
        margin-bottom: .5rem;
    }

    p {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    dfn {
        font-style: italic;
    }

    strong {
        font-weight: bolder;
    }

    a {
        text-decoration: none;
        color: #5e72e4;
        background-color: transparent;
        -webkit-text-decoration-skip: objects;
    }

    a:hover {
        text-decoration: none;
        color: #233dd2;
    }

    a:not([href]):not([tabindex]) {
        text-decoration: none;
        color: inherit;
    }

    a:not([href]):not([tabindex]):hover,
    a:not([href]):not([tabindex]):focus {
        text-decoration: none;
        color: inherit;
    }

    a:not([href]):not([tabindex]):focus {
        outline: 0;
    }

    img {
        vertical-align: middle;
        border-style: none;
        height: 128px;
        width: 128px;
    }

    caption {
        padding-top: 1rem;
        padding-bottom: 1rem;
        caption-side: bottom;
        text-align: left;
        color: #8898aa;
    }

    button {
        border-radius: 0;
    }

    button:focus {
        outline: 1px dotted;
        outline: 5px auto -webkit-focus-ring-color;
    }

    input,
    button {
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        margin: 0;
    }

    button,
    input {
        overflow: visible;
    }

    button {
        text-transform: none;
    }

    button,
    [type='reset'],
    [type='submit'] {
        -webkit-appearance: button;
    }

    button::-moz-focus-inner,
    [type='button']::-moz-focus-inner,
    [type='reset']::-moz-focus-inner,
    [type='submit']::-moz-focus-inner {
        padding: 0;
        border-style: none;
    }

    input[type='radio'],
    input[type='checkbox'] {
        box-sizing: border-box;
        padding: 0;
    }

    input[type='date'],
    input[type='time'],
    input[type='datetime-local'],
    input[type='month'] {
        -webkit-appearance: listbox;
    }

    legend {
        font-size: 1.5rem;
        line-height: inherit;
        display: block;
        width: 100%;
        max-width: 100%;
        margin-bottom: .5rem;
        padding: 0;
        white-space: normal;
        color: inherit;
    }

    [type='number']::-webkit-inner-spin-button,
    [type='number']::-webkit-outer-spin-button {
        height: auto;
    }

    [type='search'] {
        outline-offset: -2px;
        -webkit-appearance: none;
    }

    [type='search']::-webkit-search-cancel-button,
    [type='search']::-webkit-search-decoration {
        -webkit-appearance: none;
    }

    ::-webkit-file-upload-button {
        font: inherit;
        -webkit-appearance: button;
    }

    [hidden] {
        display: none !important;
    }

    h2,
    h3,
    h4,
    h5,
    .h2,
    .h3,
    .h4,
    .h5 {
        font-family: inherit;
        font-weight: 600;
        line-height: 1.5;
        margin-bottom: .5rem;
        color: var(--black);
    }

    h2,
    .h2 {
        font-size: 1.25rem;
    }

    h3,
    .h3 {
        font-size: 1.0625rem;
    }

    h4,
    .h4 {
        font-size: 1.0625rem;
    }

    h5,
    .h5 {
        font-size: .8125rem;
    }

    hr {
        margin-top: 2rem;
        margin-bottom: 2rem;
        border: 0;
        border-top: 1px solid var(--app-hr);
    }

    .btn {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.5;
        display: inline-block;
        padding: .625rem 1.25rem;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        border: 1px solid transparent;
        border-radius: .375rem;
        cursor: none;
    }

    @media screen and (prefers-reduced-motion: reduce) {
        .btn {
            transition: none;
        }
    }

    .btn:hover,
    .btn:focus {
        text-decoration: none;
        cursor: none;
    }

    .btn:focus {
        outline: 0;
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    }

    .btn:disabled {
        opacity: .65;
        box-shadow: none;
    }

    .opacity06 {
        opacity: .6;
    }

    .btn:not(:disabled):not(.disabled) {
        cursor: none;
    }

    .btn:not(:disabled):not(.disabled):active {
        box-shadow: none;
    }

    .btn:not(:disabled):not(.disabled):active:focus {
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08), none;
    }

    .btn-info {
        color: #fff;
        border-color: #03a9f4;
        background-color: #03a9f4;
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08);
    }

    .btn-info:hover {
        color: #fff;
        border-color: #03a9f4;
        background-color: #03a9f4;
    }

    .btn-info:focus {
        box-shadow: 0 4px 6px rgba(50, 50, 93, .11), 0 1px 3px rgba(0, 0, 0, .08), 0 0 0 0 rgba(17, 205, 239, .5);
    }

    .btn-info:disabled {
        color: #fff;
        border-color: #03a9f4;
        background-color: #03a9f4;
    }

    .btn-info:not(:disabled):not(.disabled):active {
        color: #fff;
        border-color: #03a9f4;
        background-color: #03a9f4;
    }

    .btn-info:not(:disabled):not(.disabled):active:focus {
        box-shadow: none, 0 0 0 0 rgba(17, 205, 239, .5);
    }

    .btn-sm {
        font-size: 2rem;
        line-height: 1.5;
        padding: .25rem .5rem;
        border-radius: .375rem;
    }

    .card {
        position: relative;
        margin: auto;
        display: flex;
        flex-direction: column;
        min-width: 0;
        max-width: 60%;
        word-wrap: break-word;
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
        border: 1px solid var(--black);
        background-color: var(--white);

    }

    .card>hr {
        margin-right: 0;
        margin-left: 0;
    }

    .card-body {
        padding: 1rem;
        flex: 1 1 auto;
    }

    .card-header {
        margin-bottom: 0;
        padding: 1.25rem 1.5rem;
        border-left: 1px solid var(--black);
        border-top: 1px solid var(--black);
        border-right: 1px solid var(--black);
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        background-color: var(--white);
    }


    @keyframes progress-bar-stripes {
        from {
            background-position: 1rem 0;
        }

        to {
            background-position: 0 0;
        }
    }

    .bg-default {
        background-color: #172b4d !important;
    }

    a.bg-default:hover,
    a.bg-default:focus,
    button.bg-default:hover,
    button.bg-default:focus {
        background-color: #0b1526 !important;
    }

    .border-0 {
        border: 0 !important;
    }

    .rounded-circle {
        border-radius: 50% !important;
    }

    .d-flex {
        display: flex !important;
    }

    .justify-content-center {
        justify-content: center !important;
    }

    .justify-content-between {
        justify-content: space-between !important;
    }

    .align-items-center {
        align-items: center !important;
    }

    @media (min-width: 1200px) {
        .justify-content-xl-between {
            justify-content: space-between !important;
        }
    }

    .float-right {
        float: right !important;
    }

    .shadow,
    .card-profile-image img {
        box-shadow: 0 0 2rem 0 rgba(136, 152, 170, .15) !important;
    }

    .mr-2 {
        margin-right: .5rem !important;
    }

    .mt-4,
    .my-4 {
        margin-top: 1.5rem !important;
    }

    .mr-4 {
        margin-right: 1.5rem !important;
    }

    .my-4 {
        margin-bottom: 1.5rem !important;
    }

    .mb-5 {
        margin-bottom: 3rem !important;
    }

    .mt-7 {
        margin-top: 6rem !important;
    }

    .pt-0 {
        padding-top: 0 !important;
    }

    .pb-0 {
        padding-bottom: 0 !important;
    }

    .pt-8 {
        padding-top: 8rem !important;
    }

    .m-auto {
        margin: auto !important;
    }

    @media (min-width: 768px) {
        .mt-md-5 {
            margin-top: 3rem !important;
        }

        .mt-md-3 {
            margin-top: 1.5rem !important;
        }

        .mt-md-1 {
            margin-top: 0.5rem !important;
        }

        .pt-md-4 {
            padding-top: 1rem !important;
        }

        .pb-md-4 {
            padding-bottom: 1rem !important;
        }
    }

    @media (min-width: 1200px) {
        .mb-xl-0 {
            margin-bottom: 0 !important;
        }
    }

    .text-center {
        text-align: center !important;
    }

    .font-weight-light {
        font-weight: 300 !important;
    }

    @media print {

        *,
        *::before,
        *::after {
            box-shadow: none !important;
            text-shadow: none !important;
        }

        a:not(.btn) {
            text-decoration: underline;
        }

        img {
            page-break-inside: avoid;
        }

        p,
        h2,
        h3 {
            orphans: 3;
            widows: 3;
        }

        h2,
        h3 {
            page-break-after: avoid;
        }

        @page {
            size: a3;
        }
    }

    @keyframes floating-lg {
        0% {
            transform: translateY(0px);
        }

        50% {
            transform: translateY(15px);
        }

        100% {
            transform: translateY(0px);
        }
    }

    @keyframes floating {
        0% {
            transform: translateY(0px);
        }

        50% {
            transform: translateY(10px);
        }

        100% {
            transform: translateY(0px);
        }
    }

    @keyframes floating-sm {
        0% {
            transform: translateY(0px);
        }

        50% {
            transform: translateY(5px);
        }

        100% {
            transform: translateY(0px);
        }
    }

    [class*='shadow'] {
        transition: all .15s ease;
    }

    .font-weight-300 {
        font-weight: 300 !important;
    }

    .btn {
        font-size: .875rem;
        position: relative;
        transition: all .15s ease;
        letter-spacing: .025em;
        text-transform: none;
        will-change: transform;
    }

    .btn:hover {
        cursor: none;
        box-shadow: 0 7px 14px rgba(50, 50, 93, .1), 0 3px 6px rgba(0, 0, 0, .08);
    }

    .btn:not(:last-child) {
        margin-right: .5rem;
    }

    .btn i:not(:first-child) {
        margin-left: .5rem;
    }

    .btn i:not(:last-child) {
        margin-right: .5rem;
    }

    .btn-sm {
        font-size: 1rem;
    }

    [class*='btn-outline-'] {
        border-width: 1px;
    }

    .card-profile-image {
        position: relative;
    }

    .card-profile-image img {
        position: absolute;
        left: 50%;
        max-width: 180px;
        transition: all .15s ease;
        transform: translate(-50%, -30%);
        border-radius: .375rem;
    }

    .card-profile-stats {
        padding: 0.5rem 0;
    }

    .card-profile-stats>div {
        margin-right: 1rem;
        padding: .875rem;
        text-align: center;
    }

    .card-profile-stats>div:last-child {
        margin-right: 0;
    }

    .card-profile-stats>div .heading {
        font-size: 1rem;
        font-weight: bold;
        display: block;
        color: var(--black);
    }

    .card-profile-stats>div .description {
        font-size: 1rem;
        color: #03a9f4;
    }

    .main-content {
        position: relative;
    }

    .footer {
        padding: 2.5rem 0;
        background: #f7fafc;
    }

    .footer .copyright {
        font-size: .875rem;
    }

    @media (min-width: 768px) {
        @keyframes show-navbar-dropdown {
            0% {
                transition: visibility .25s, opacity .25s, transform .25s;
                transform: translate(0, 10px) perspective(200px) rotateX(-2deg);
                opacity: 0;
            }

            100% {
                transform: translate(0, 0);
                opacity: 1;
            }
        }

        @keyframes hide-navbar-dropdown {
            from {
                opacity: 1;
            }

            to {
                transform: translate(0, 10px);
                opacity: 0;
            }
        }
    }

    @keyframes show-navbar-collapse {
        0% {
            transform: scale(.95);
            transform-origin: 100% 0;
            opacity: 0;
        }

        100% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes hide-navbar-collapse {
        from {
            transform: scale(1);
            transform-origin: 100% 0;
            opacity: 1;
        }

        to {
            transform: scale(.95);
            opacity: 0;
        }
    }

    p {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.7;
        color: var(--black);
    }

    .description {
        font-size: 1rem;
    }

    .heading {
        font-size: .95rem;
        font-weight: 600;
        letter-spacing: .025em;
        text-transform: uppercase;
    }

    @media (max-width: 768px) {
        .btn {
            margin-bottom: 10px;
        }
    }

    .red {
        color: #C6011F;
    }
`

export const startMintingNowStyles = css`
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

export const myButtonStyles = css`
    vaadin-button {
        font-size: 1rem;
        font-weight: 600;
        height: 35px;
        margin: 0;
        cursor: pointer;
        min-width: 80px;
        min-height: 35px;
        background-color: #03a9f4;
        color: white;
    }

    vaadin-button:hover {
        opacity: 0.9;
    }
`

export const puzzlesStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-content-ink-color: var(--black);
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

    #puzzle-page {
        background: var(--white);
        padding: 12px 24px;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .clue {
        font-family: "Lucida Console", "Courier New", monospace;
        font-size: smaller;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 2em;
    }

    paper-spinner-lite {
        height: 30px;
        width: 30px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const qAppsStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-button-disabled-fill-color: rgba(3, 169, 244, 0.5);
        --mdc-theme-surface: var(--white);
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

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    h2 {
        margin: 0;
    }

    h3 {
        margin: 10px 0;
    }

    h4 {
        margin: 0;
    }

    h5 {
        margin: 5px 0;
        font-size: 14px;
    }

    h6 {
        margin: 5px 0;
        text-transform: uppercase;
        color: var(--black);
        font-weight: 600;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    p {
        font-size: 14px;
        line-height: 21px;
        color: var(--black);
    }

    span {
        font-size: 14px;
        word-break: break-all;
    }

    #tabs-1 {
        --mdc-tab-height: 50px;
    }

    #tabs-1-content {
        height: 100%;
        padding-bottom: 10px;
    }

    mwc-tab-bar {
        --mdc-text-transform: none;
        --mdc-tab-color-default: var(--black);
        --mdc-tab-text-label-color-default: var(--black);
    }

    #apps-list-page {
        background: var(--white);
        padding: 12px 24px;
    }

    .search {
        display: inline;
        width: 50%;
        align-items: center;
    }

    paper-spinner-lite {
        height: 30px;
        width: 30px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    paper-dialog.progress {
        width: auto;
        max-width: 50vw;
        height: auto;
        max-height: 30vh;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        line-height: 1.6;
        overflow: hidden;
    }

    paper-dialog.close-progress {
        min-width: 550px;
        max-width: 550px;
        height: auto;
        background-color: var(--white);
        color: var(--black);
        border: 1px solid var(--black);
        border-radius: 15px;
        text-align: center;
        padding: 15px;
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        overflow: hidden;
    }

    paper-dialog.search {
        min-width: 550px;
        max-width: 550px;
        min-height: auto;
        max-height: 700px;
        background-color: var(--white);
        color: var(--black);
        line-height: 1.6;
        overflow: auto;
        border: 1px solid var(--black);
        border-radius: 10px;
        padding: 15px;
        box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
    }

    paper-dialog.appinfo {
        width: auto;
        max-width: 450px;
        height: auto;
        background-color: var(--white);
        border: 1px solid var(--black);
        border-radius: 15px;
        padding: 5px;
        overflow-y: auto;
    }

    .relay-mode-notice {
        margin: auto;
        margin-top: 20px;
        text-align: center;
        word-break: normal;
        font-size: 14px;
        line-height: 20px;
        color: var(--relaynodetxt);
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

    .grid-container {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
    }

    .grid-container-search {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    .container {
        height: 84px;
        width: 84px;
        overflow: hidden;
        margin: 10px auto;
        border-radius: 25%;
        border: 1px solid var(--black);
        transition: all 0.3s ease-in-out;
        box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.3);
        background: linear-gradient(315deg, #045de9 0%, #09c6f9 74%);
    }

    img {
        cursor: pointer;
        position: relative;
        border-radius: 25%;
        display: block;
        height: 64px;
        width: 64px;
        object-fit: cover;
        margin: 10px auto;
        transition: all 0.3s ease;
    }

    .round-icon {
        margin-top: -87px;
        margin-left: 69px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #64dd17;
        background-color: #76ff03;
    }

    .myapptitle {
        display: flex;
        justify-content: center;
        max-height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--black);
        font-size: 17px;
        font-weight: 500;
        padding: 10px;
        line-height: 20px;
        margin-top: -10px;
        text-align: center;
    }

    @media (min-width: 400px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 640px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 767px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 1024px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 1280px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 1600px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 10px;
        }
    }

    @media (min-width: 1920px) {
        .grid-container {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 10px;
        }
    }

    .card-container {
        background-color: var(--white);
        color: var(--black);
        position: relative;
        width: 350px;
        max-width: 100%;
        text-align: center;
    }

    .card-container .block {
        color: rgb(3, 169, 244);
        background-color: transparent;
        border-radius: 3px;
        border: 1px solid rgb(3, 169, 244);
        font-size: 14px;
        font-weight: bold;
        padding: 3px 7px;
        position: absolute;
        top: 30px;
        left: 30px;
    }

    .card-container .block:hover {
        color: #FFF;
        background-color: rgb(3, 169, 244);
        cursor: pointer;
    }

    .card-container .close {
        color: #df3636;
        background-color: transparent;
        border-radius: 3px;
        border: 1px solid #df3636;
        font-size: 14px;
        font-weight: bold;
        padding: 3px 7px;
        position: absolute;
        top: 30px;
        right: 30px;
    }

    .card-container .close:hover {
        color: #FFF;
        background-color: #df3636;
        cursor: pointer;
    }

    .card-container img {
        height: 96px;
        width: 96px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        margin: 10px;
    }

    button.primary {
        background-color: transparent;
        border: 1px solid rgb(3, 169, 244);
        border-radius: 3px;
        color: rgb(3, 169, 244);
        font-family: Montserrat, sans-serif;
        font-weight: 500;
        padding: 10px 25px;
    }

    button.primary:hover {
        background-color: rgb(3, 169, 244);
        color: #FFF;
        cursor: pointer;
    }

    button.secondary {
        background-color: transparent;
        border: 1px solid #198754;
        border-radius: 3px;
        color: #198754;
        font-family: Montserrat, sans-serif;
        font-weight: 500;
        padding: 10px 25px;
    }

    button.secondary:hover {
        background-color: #198754;
        color: #FFF;
        cursor: pointer;
    }

    .tags {
        background-color: var(--white);
        text-align: left;
        padding: 10px;
        margin-top: 10px;
    }

    .tags ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .tags ul li {
        border: 1px solid rgb(3, 169, 244);
        border-radius: 3px;
        display: inline-block;
        font-size: 12px;
        margin: 0 7px 7px 0;
        padding: 7px;
    }

    .close-download {
        color: var(--black);
        font-size: 14px;
        font-weight: bold;
        position: absolute;
        top: -15px;
        right: -15px;
    }

    .close-download:hover {
        color: #df3636;
    }
`

export const qWebsitesStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-button-disabled-fill-color: rgba(3, 169, 244, 0.5);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-shape-radius: 25px;
        --mdc-dialog-min-width: 300px;
        --mdc-dialog-max-width: auto;
        --mdc-dialog-max-height: 700px;
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

    #tabs-1 {
        --mdc-tab-height: 50px;
    }

    #tabs-1-content {
        height: 100%;
        padding-bottom: 10px;
    }

    mwc-tab-bar {
        --mdc-text-transform: none;
        --mdc-tab-color-default: var(--black);
        --mdc-tab-text-label-color-default: var(--black);
    }

    #pages {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pages>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pages>button:not([disabled]):hover,
    #pages>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pages>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pages>button[disabled] {
        opacity: 0.5;
        cursor: default;
    }

    #websites-list-page {
        background: var(--white);
        padding: 12px 24px;
    }

    #search {
        display: flex;
        width: 50%;
        align-items: center;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 2em;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    a.visitSite {
        color: var(--black);
        text-decoration: none;
    }

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    .details {
        display: flex;
        font-size: 18px;
    }

    span {
        font-size: 14px;
        word-break: break-all;
    }

    select {
        padding: 13px 20px;
        width: 100%;
        font-size: 14px;
        color: #555;
        font-weight: 400;
    }

    .title {
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    .resourceTitle {
        font-size: 15px;
        line-height: 32px;
    }

    .resourceDescription {
        font-size: 11px;
        padding-bottom: 5px;
    }

    .resourceCategoryTags {
        font-size: 11px;
        padding-bottom: 10px;
    }

    .resourceRegisteredName {
        font-size: 15px;
        line-height: 32px;
    }

    .resourceStatus,
    .resourceStatus span {
        font-size: 11px;
    }

    .itemList {
        padding: 0;
    }

    .relay-mode-notice {
        margin: auto;
        text-align: center;
        word-break: normal;
        font-size: 14px;
        line-height: 20px;
        color: var(--relaynodetxt);
    }

    img {
        border-radius: 25%;
        max-width: 65px;
        height: 100%;
        max-height: 65px;
    }
`

export const publishDataStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-theme-surface: var(--white);
        --mdc-dialog-min-width: 400px;
        --mdc-dialog-max-width: 1024px;
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

    input[type=text] {
        padding: 6px 6px 6px 6px;
        color: var(--black);
    }

    input[type=file]::file-selector-button {
        border: 1px solid transparent;
        padding: 6px 6px 6px 6px;
        border-radius: 5px;
        color: #fff;
        background-color: var(--mdc-theme-primary);
        transition: 1s;
    }

    input[type=file]::file-selector-button:hover {
        color: #000;
        background-color: #81ecec;
        border: 1px solid transparent;
    }

    #publishWrapper paper-button {
        float: right;
    }

    #publishWrapper .buttons {
        display: flex;
        justify-content: space-between;
        max-width: 100%;
        width: 100%;
    }

    mwc-textfield {
        margin: 0;
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .upload-text {
        display: block;
        font-size: 14px;
        color: var(--black);
    }

    .address-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100px;
        background-color: var(--white);
        height: 36px;
    }

    .address-bar-button mwc-icon {
        width: 30px;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }
`

export const dataManagementStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-text-field-outlined-idle-border-color: var(--txtfieldborder);
        --mdc-text-field-outlined-hover-border-color: var(--txtfieldhoverborder);
        --mdc-text-field-label-ink-color: var(--black);
        --mdc-text-field-ink-color: var(--black);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-max-width: 85vw;
        --mdc-dialog-max-height: 95vh;
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

    #pages {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pages>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pages>button:not([disabled]):hover,
    #pages>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pages>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pages>button[disabled] {
        opacity: 0.5;
        cursor: default;
    }

    paper-dialog.gif-repo {
        width: auto;
        max-width: 80vw;
        height: auto;
        max-height: 80vh;
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

    #websites-list-page {
        background: var(--white);
        padding: 12px 24px;
    }

    #search {
        display: flex;
        width: 50%;
        align-items: center;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
        margin-bottom: 2em;
    }

    .image-container {
        display: flex;
    }

    .image-display {
        height: auto;
        max-height: 80vh;
        width: auto;
        max-width: 80vw;
        object-fit: contain;
        border-radius: 5px;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .red {
        --mdc-theme-primary: #F44336;
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

    a.visitSite {
        text-decoration: none;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    a.visitSite {
        color: var(--black);
        text-decoration: none;
    }

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    .details {
        display: flex;
        font-size: 18px;
    }

    span {
        font-size: 18px;
        word-break: break-all;
    }

    select {
        padding: 13px 20px;
        width: 100%;
        font-size: 14px;
        color: #555;
        font-weight: 400;
    }

    .title {
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    .itemList {
        padding: 0;
    }

    .default-identifier {
        font-size: 14px;
        font-style: italic;
    }
`

export const webBrowserStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-checkbox-unchecked-color: var(--black);
        --mdc-theme-on-surface: var(--black);
        --mdc-checkbox-disabled-color: var(--black);
        --mdc-checkbox-ink-color: var(--black);
    }

    #websitesWrapper paper-button {
        float: right;
    }

    #websitesWrapper .buttons {
        width: auto !important;
    }

    .address-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100px;
        background-color: var(--white);
        height: 36px;
    }

    .address-bar-button mwc-icon {
        width: 20px;
    }

    .iframe-container {
        position: absolute;
        top: 36px;
        left: 0;
        right: 0;
        bottom: 0;
        border-top: 1px solid var(--black);
    }

    .iframe-container iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        background-color: var(--white);
    }

    input[type='text'] {
        margin: 0;
        padding: 2px 0 0 20px;
        border: 0;
        height: 34px;
        font-size: 16px;
        background-color: var(--white);
    }

    input {
        outline: none
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .float-right {
        float: right;
    }
`

export const qortalLotteryStyles = css`
    * {
        box-sizing: border-box;
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-theme-error: rgb(255, 89, 89);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 500px;
        --mdc-dialog-max-width: 1024px;
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --lumo-body-text-color: var(--black);
        --_lumo-grid-border-color: var(--border);
        --_lumo-grid-secondary-border-color: var(--border2);
    }

    [hidden] {
        display: hidden !important;
        visibility: none !important;
    }

    #qortal-lottery-page {
        background: var(--white);
        padding: 12px 24px;
    }

    .divCard {
        padding: 1em;
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .header-title {
        display: block;
        overflow: hidden;
        font-size: 32px;
        color: var(--black);
        font-weight: 400;
        text-align: center;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        cursor: inherit;
        margin-top: 1rem;
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        --mdc-theme-primary: #198754;
    }

    .warning {
        --mdc-theme-primary: #f0ad4e;
    }

    .buttons {
        text-align: right;
    }

    .successBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid green;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .errorBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid red;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .btn-clear-success {
        --mdc-icon-button-size: 32px;
        color: red;
    }

    .btn-clear-error {
        --mdc-icon-button-size: 32px;
        color: green;
    }

    .error-icon {
        font-size: 48px;
        color: red;
    }

    .warning-text {
        animation: blinker 1.5s linear infinite;
        text-align: center;
        margin-top: 10px;
        color: rgb(255, 89, 89);
    }

    @keyframes blinker {
        50% {
            opacity: 0;
        }
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

export const rewardShareStyles = css`
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
    }

    .myGridColor {
        background-color: var(--white) !important;
        color: var(--black);
    }

    #reward-share-page {
        background: var(--white);
        padding: 12px 24px;
    }

    .divCard {
        border: 1px solid var(--border);
        padding: 1em;
        box-shadow: 0 .3px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 1px -1px rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.20);
    }

    h2 {
        margin: 0;
    }

    h2,
    h3,
    h4,
    h5 {
        color: var(--black);
        font-weight: 400;
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    paper-spinner-lite {
        height: 30px;
        width: 30px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .spinner {
        width: 100%;
        display: flex;
        justify-content: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`

export const sponsorshipListStyles = css`
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

    .avatar-img {
        border-radius: 50%;
        height: 24px;
        width: 24px;
        margin-right: 10px;
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
        max-width: 1024px;
    }

    .message-error {
        color: var(--error);
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
        align-items: center;
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
        min-width: 80px;
    }

    mwc-icon-button {
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

    .marginLoader {
        margin-left: 10px;
    }

    .marginRight {
        margin-right: 10px;
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

    .tableGrid {
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 1fr) minmax(0, 2fr) minmax(0, 2fr);
        align-items: center;
        gap: 5px;
        width: 100%;
        margin-bottom: 15px;
        padding: 5px;
    }

    .header {
        align-self: flex-start;
    }

    .header p {
        word-break: break-word;
    }

    .grid-item {
        text-align: center;
        color: var(--black);
        word-break: break-all;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .name-container {
        text-align: center;
        color: var(--black);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .text {
        color: var(--black)
    }

    .text--bold {
        font-weight: bold;
    }

    .text--bold--green {
        font-weight: bold;
        color: var(--paper-green-500);
    }

    .summary-box {
        display: inline;
        text-align: center;
        margin-top: 25px;
        width: 100%;
    }

    .publicKeyLookupBtn {
        position: fixed;
        bottom: 15px;
        right: 15px;
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

    .btn--sponsorshipfinished {
        background-color: var(--menuactive);
        transition: all .2s;
        animation: onOff 2s infinite;
        --mdc-theme-primary: var(--black);
    }

    .word-break {
        word-break: break-all;
    }

    .dialog-container {
        width: 400px;
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
        text-align: center;
    }

    @keyframes onOff {
        from {
            opacity: 1
        }

        to {
            opacity: .5
        }
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
            word-break: break-word;
        }

        .grid-item {
            text-align: start;
            align-items: center;
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        }

        .name-container {
            justify-content: flex-start
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

    .between {
        justify-content: space-between;
    }

    .no-width {
        width: auto
    }

    .between p {
        margin: 0;
        padding: 0;
    }

    #showDialogRewardShareCreationStatus .dialog-container {
        width: 300px;
        min-height: 250px;
        max-height: 75vh;
        padding: 5px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        overflow-x: hidden;
    }

    .warning {
        display: flex;
        flex-grow: 1
    }

    #showDialogRewardShareCreationStatus li {
        margin-bottom: 15px;
    }
`

export const webBrowserModalStyles = css`
    * {
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --mdc-checkbox-unchecked-color: var(--black);
        --mdc-theme-on-surface: var(--black);
        --mdc-checkbox-disabled-color: var(--black);
        --mdc-checkbox-ink-color: var(--black);
    }

    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgb(186 186 186 / 26%);
        overflow: hidden;
        animation: backdrop_blur cubic-bezier(0.22, 1, 0.36, 1) 1s forwards;
        z-index: 1000000;
    }

    @keyframes backdrop_blur {
        0% {
            backdrop-filter: blur(0px);
            background: transparent;
        }
        100% {
            backdrop-filter: blur(5px);
            background: rgb(186 186 186 / 26%);
        }
    }

    @keyframes modal_transition {
        0% {
            visibility: hidden;
            opacity: 0;
        }
        100% {
            visibility: visible;
            opacity: 1;
        }
    }

    .modal {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        animation: 1s cubic-bezier(0.22, 1, 0.36, 1) 0s 1 normal forwards running modal_transition;
        z-index: 1000001;
    }

    .modal-body {
        padding: 25px;
    }

    @keyframes modal_transition {
        0% {
            visibility: hidden;
            opacity: 0;
        }
        100% {
            visibility: visible;
            opacity: 1;
        }
    }

    .modal-content {
        background-color: var(--white);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        max-width: 80%;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .modal-content-error {
        background-color: #ffdddd;
        border-radius: 15px;
	border: 1px solid var(--black);
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        max-width: 80%;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .modal-content-success {
        background-color: #ddffdd;
        border-radius: 15px;
	border: 1px solid var(--black);
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        max-width: 80%;
        min-width: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .modal-subcontainer {
        color: var(--black);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }

    .modal-subcontainer-error {
        color: 000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1ßpx;
        overflow: auto;
        max-height: calc(95vh - 250px);
    }

    .modal-subcontainer-success {
        color: 000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        overflow: auto;
        max-height: calc(95vh - 250px);
    }

    .modal-paragraph {
        font-family: Roboto, sans-serif;
        font-size: 18px;
        letter-spacing: 0.3px;
        font-weight: 300;
        color: var(--black);
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .modal-paragraph-error {
        font-family: Roboto, sans-serif;
        font-size: 16px;
        letter-spacing: 0.3px;
        font-weight: 600;
        color: 000;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-wor
    }

    .modal-paragraph-success {
        font-family: Roboto, sans-serif;
        font-size: 16px;
        letter-spacing: 0.3px;
        font-weight: 600;
        color: 000;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .modal-paragraph-error-header {
        font-family: Roboto, sans-serif;
        font-size: 18px;
        letter-spacing: 0.3px;
        font-weight: 700;
        color: 000;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .modal-paragraph-success-header {
        font-family: Roboto, sans-serif;
        font-size: 18px;
        letter-spacing: 0.3px;
        font-weight: 700;
        color: 000;
        margin: 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .capitalize-first {
        text-transform: capitalize;
    }

    .checkbox-row {
        display: flex;
        align-items: center;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        color: var(--black);
    }

    .modal-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .modal-buttons button {
        background-color: #4caf50;
        border: none;
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .modal-buttons button:hover {
        background-color: #3e8e41;
    }

    #cancel-button {
        background-color: #f44336;
    }

    #cancel-button:hover {
        background-color: #d32f2f;
    }
`

export const tradeBotStyles = css`
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

export const tradePortalStyles = css`
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

    .myhover vaadin-grid-cell-content {
        cursor: pointer;
    }

    .myhover vaadin-grid::part(selected-row) {
        color: green;
        cursor: pointer;
    }

    .myhover vaadin-grid::part(focused-selected-row) {
        color: green;
        cursor: pointer;
    }

    .myhover vaadin-grid::part(cell):hover {
        cursor: pointer;
    }

    .myhover vaadin-grid::part(row):hover {
        color: green;
        cursor: pointer;
    }

    .myhover vaadin-grid::part(selected-row-cell) {
        color: green;
        cursor: pointer;
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
        width: 100%;
        max-width: 75vw;
        height: 100%;
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

        #trade-portal {}

        #first-trade-section {
            display: grid;
            grid-template-columns: 1fr 1fr 2fr;
            grid-auto-rows: max(450px);
            column-gap: 0.5em;
            row-gap: 0.4em;
            justify-items: stretch;
            align-items: stretch;
            margin-bottom: 10px;
        }

        #second-trade-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            grid-auto-rows: max(450px);
            column-gap: 0.5em;
            row-gap: 0.4em;
            justify-items: stretch;
            align-items: stretch;
            margin-bottom: 10px;
        }

        #third-trade-section {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            grid-auto-rows: max(200px);
            column-gap: 0.5em;
            row-gap: 0.4em;
            justify-items: stretch;
            align-items: stretch;
            margin-bottom: 10px;
        }
    }
`

export const highChartStyles = css`
    .loadingContainer {
        height: 100%;
        width: 100%;
    }

    .trades-chart {
        color: var(--black);
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 25px;
        padding: 15px;
    }

    .chart-container {
        margin: auto;
        color: var(--black);
        text-align: center;
        padding: 15px;
        height: 30vh;
        width: 80vw;
    }

    .chart-info-wrapper {
        background: transparent;
        height: 38vh;
        width: 83vw;
        overflow: auto;
    }

    .chart-loading-wrapper {
        color: var(--black);
        background: var(--white);
        border: 1px solid var(--black);
        border-radius: 15px;
    }
`

export const multiWalletStyles = css`
    * {
        box-sizing: border-box;
        --mdc-theme-primary: rgb(3, 169, 244);
        --mdc-theme-secondary: var(--mdc-theme-primary);
        --mdc-theme-surface: var(--white);
        --mdc-theme-error: rgb(255, 89, 89);
        --mdc-dialog-content-ink-color: var(--black);
        --mdc-dialog-min-width: 500px;
        --mdc-dialog-max-width: 1024px;
        --paper-input-container-focus-color: var(--mdc-theme-primary);
        --lumo-primary-text-color: rgb(0, 167, 245);
        --lumo-primary-color-50pct: rgba(0, 167, 245, 0.5);
        --lumo-primary-color-10pct: rgba(0, 167, 245, 0.1);
        --lumo-primary-color: hsl(199, 100%, 48%);
        --lumo-base-color: var(--white);
        --lumo-secondary-text-color: var(--sectxt);
        --lumo-contrast-60pct: var(--vdicon);
        --lumo-body-text-color: var(--black);
        --_lumo-grid-border-color: var(--border);
        --_lumo-grid-secondary-border-color: var(--border2);
    }

    #pages {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px 5px 5px;
        margin: 0px 20px 20px 20px;
    }

    #pages>button {
        user-select: none;
        padding: 5px;
        margin: 0 5px;
        border-radius: 10%;
        border: 0;
        background: transparent;
        font: inherit;
        outline: none;
        cursor: pointer;
        color: var(--black);
    }

    #pages>button:not([disabled]):hover,
    #pages>button:focus {
        color: #ccc;
        background-color: #eee;
    }

    #pages>button[selected] {
        font-weight: bold;
        color: var(--white);
        background-color: #ccc;
    }

    #pages>button[disabled] {
        opacity: 0.5;
        cursor: default;
    }

    #tabs-height {
        --mdc-tab-height: 50px;
    }

    #tabs-1-content {
        height: 100%;
        padding-bottom: 10px;
    }

    mwc-tab-bar {
        --mdc-text-transform: none;
        --mdc-tab-color-default: var(--black);
        --mdc-tab-text-label-color-default: var(--black);
    }

    paper-slider.blue {
        --paper-slider-knob-color: var(--paper-light-blue-500);
        --paper-slider-active-color: var(--paper-light-blue-500);
        --paper-slider-pin-color: var(--paper-light-blue-500);
    }

    paper-progress {
        --paper-progress-active-color: var(--mdc-theme-primary);
    }

    .red {
        --mdc-theme-primary: #F44336;
    }

    .green {
        color: var(--paper-green-500);
    }

    paper-spinner-lite {
        height: 75px;
        width: 75px;
        --paper-spinner-color: var(--mdc-theme-primary);
        --paper-spinner-stroke-width: 3px;
    }

    .unconfirmed {
        font-style: italic;
    }

    .roboto {
        font-family: 'Roboto', sans-serif;
    }

    .mono {
        font-family: 'Roboto Mono', monospace;
    }

    .sans {
        font-family: 'Open Sans', sans-serif;
    }

    .magistral {
        font-family: 'magistralbold';
    }

    .montserrat {
        font-family: 'Montserrat', sans-serif;
    }

    .maven {
        font-family: 'MavenPro', sans-serif;
    }

    .weight-100 {
        font-weight: 100;
    }

    .text-white-primary {
        color: var(--white);
    }

    .text-white-secondary {
        color: var(--white-secondary);
    }

    .text-white-disabled {
        color: var(--white-disabled);
    }

    .text-white-hint {
        color: var(--white-divider);
    }

    .white-bg {
        height: 100vh;
        background: var(--white);
    }

    span {
        font-size: 18px;
        word-break: break-all;
    }

    .floatleft {
        float: left;
    }

    .floatright {
        float: right;
    }

    .title {
        font-weight: 600;
        font-size: 12px;
        line-height: 32px;
        opacity: 0.66;
    }

    #transactionList {
        padding: 0;
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

    body {
        margin: 0;
        padding: 0;
        background: var(--white);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    h2 {
        margin: 0;
        color: var(--black);
        font-weight: 400;
        font: 24px/24px 'Open Sans', sans-serif;
    }

    h3 {
        margin: 0 0 5px;
        color: var(--black);
        font-weight: 600;
        font-size: 18px;
        line-height: 18px;
    }

    .hrstyle {
        color: var(--border);
        border-radius: 80%;
        margin-bottom: 1rem;
    }

    .header-title {
        display: inlinr;
        font-size: 32px;
        color: var(--black);
        font-weight: 600;
        text-align: center;
        margin-top: 1rem;
    }

    .fullWidth {
        width: 100%;
    }

    .wrapper {
        margin: 0 auto;
        height: 100%;
        overflow: hidden;
        border-radius: 8px;
        background-color: var(--white);
    }

    .wallet {
        width: 200px;
        height: 100vh;
        border-top-left-radius: inherit;
        border-bottom-left-radius: inherit;
        border-right: 1px solid var(--border);
    }

    .transactions-wrapper {
        width: 100%;
        padding: 30px 0 0 0;
        height: 100%;
    }

    .wallet-header {
        margin: 0 20px;
        color: var(--black);
    }

    .wallet-address {
        display: flex;
        align-items: center;
        font-size: 18px;
        color: var(--black);
        margin: 4px 0 20px;
    }

    .wallet-balance {
        display: inline-block;
        font-weight: 600;
        font-size: 32px;
        color: var(--black);
    }

    #transactions {
        margin-top: 25px;
        margin-left: 20px;
        margin-right: 20px;
        border-top: 1px solid var(--border);
        padding-top: 0px;
        height: 100%;
    }

    .show {
        animation: fade-in 0.3s 1;
    }

    .transaction-item {
        display: flex;
        justify-content: space-between;
        position: relative;
        padding-left: 40px;
        margin-bottom: 45px;
        margin-right: 50px;
    }

    .transaction-item::before {
        position: absolute;
        content: '';
        border: 2px solid #e1e1e1;
        border-radius: 50%;
        height: 25px;
        width: 25px;
        left: 0;
        top: 10px;
        box-sizing: border-box;
        vertical-align: middle;
        color: #666666;
    }

    .credit::before {
        content: '+';
        font-size: 25px;
        line-height: 19px;
        padding: 0 4px 0;
    }

    .debit::before {
        content: '-';
        font-size: 20px;
        line-height: 21px;
        padding: 0 5px;
    }

    .transaction-item .details {
        font-size: 14px;
        line-height: 14px;
        color: #999;
    }

    .transaction-item_details {
        width: 270px;
    }

    .transaction-item_amount .amount {
        font-weight: 600;
        font-size: 18px;
        line-height: 45px;
        position: relative;
        margin: 0;
        display: inline-block;
    }

    .active {
        background: var(--menuactive);
    }

    .currency-image {
        display: inline-block;
        height: 42px;
        width: 42px;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 3px;
        filter: grayscale(100%);
    }

    .qort .currency-image {
        background-image: url('/img/qort.png');
    }

    .btc .currency-image {
        background-image: url('/img/btc.png');
    }

    .ltc .currency-image {
        background-image: url('/img/ltc.png');
    }

    .doge .currency-image {
        background-image: url('/img/doge.png');
    }

    .dgb .currency-image {
        background-image: url('/img/dgb.png');
    }

    .rvn .currency-image {
        background-image: url('/img/rvn.png');
    }

    .arrr .currency-image {
        background-image: url('/img/arrr.png');
    }

    .card-list {
        margin-top: 20px;
    }

    .card-list .currency-image {
        cursor: pointer;
        margin-right: 15px;
        transition: 0.1s;
    }

    .card-list .currency-image:hover {
        transform: scale(1.1);
    }

    .buttons {
        width: auto !important;
    }

    .send-coin-dialog {
        min-height: 300px;
        min-width: 300px;
        box-sizing: border-box;
        position: relative;
    }

    .unused-address-dialog {
        min-height: 150px;
        min-width: 550px;
        box-sizing: border-box;
        position: relative;
    }

    .btn-clear-success {
        --mdc-icon-button-size: 32px;
        color: red;
    }

    .btn-clear-error {
        --mdc-icon-button-size: 32px;
        color: green;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }

    .successBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid green;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .errorBox {
        height: 34px;
        min-width: 300px;
        width: 100%;
        border: 1px solid red;
        border-radius: 5px;
        background-color: transparent;
        margin-top: 15px;
    }

    .qrcode-pos {
        margin-top: -190px;
	margin-right: 20px;
        float: right;
	border: 1px solid var(--black);
    }

    .send-pos {
        margin-top: 20px;
        margin-left: 20px;
        width: 185px;
    }

    .book-pos {
        margin-top: -44px;
        margin-left: 215px;
        width: 185px;
    }

    @media (max-width: 863px) {
        .wallet {
            width: 100%;
            height: max-content;
            border-top-right-radius: inherit;
            padding-bottom: 25px;
        }

        .cards {
            margin-top: 25px;
        }
    }

    .checkboxLabel:hover {
        cursor: pointer;
    }

    .warning-text {
        animation: blinker 1.5s linear infinite;
        text-align: center;
        margin-top: 10px;
        color: rgb(255, 89, 89);
    }

    @keyframes blinker {
        50% {
            opacity: 0;
        }
    }

    @media (max-width: 764px) {
        .wallet {
            width: 100%;
            height: max-content;
            border-top-right-radius: inherit;
            padding-bottom: 25px;
        }

        .cards {
            margin-top: 25px;
        }
    }

    @media (max-width: 530px) {
        h3 {
            line-height: 24px;
        }

        .cards {
            text-align: center;
        }

        .wallet-balance {
            font-size: 22px;
        }
    }

    @media (max-width: 390px) {
        .wallet {
            height: max-content;
            padding: 50px 25px;
        }

        .transactions-wrapper {
            padding: 50px 25px;
        }

        h2 {
            font: 18px/24px 'Open Sans', sans-serif;
        }
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

export const snackQueueStyles = css``

export const timeAgoStyles = css``

export const buttonIconCopyStyles = css``