import {css} from 'lit'

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
        color: black;
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
      0%, 100% {
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
            color: black;
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
          0%, 100% {
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
                text-align:right;
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
            margin:0px;
            padding:0px;
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

  .attachment-name {
    font-family: Work Sans, sans-serif;
    font-size: 20px;
    color: var(--chat-bubble-msg-color);
    margin: 0px;
    letter-spacing: 1px;
    padding: 5px 0px;
  }
`
