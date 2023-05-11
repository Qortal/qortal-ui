import { css } from 'lit'

export const userInfoStyles = css`
.user-info-header {
font-family: Montserrat, sans-serif;
text-align: center;
font-size: 28px;
color: var(--chat-bubble-msg-color);
margin-bottom: 10px;
padding: 10px 0;
user-select: none;
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
border-radius:50%;
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
