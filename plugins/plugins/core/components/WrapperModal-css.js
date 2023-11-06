import {css} from 'lit'

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
