import { css } from 'lit';

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
overflow: hidden;
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

`
