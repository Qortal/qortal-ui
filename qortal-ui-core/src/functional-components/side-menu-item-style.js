import { css } from 'lit'

export const sideMenuItemStyle = css`
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

  :host(:not([selected])) #itemLink{
    color: var(--item-text-color);
  }

  :host([expanded]){
    background-color: var(--item-selected-color);
  }
  
  :host([hasSelectedChild]){
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
      padding: calc( var(--item-padding) / 2);
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
  
  @keyframes pop{
      0% {
        transform: translateX(-5px);
        opacity: 0.5;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
  }
`;
