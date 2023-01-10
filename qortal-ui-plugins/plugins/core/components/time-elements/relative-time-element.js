import RelativeTime from './relative-time';
import ExtendedTimeElement from './extended-time-element';
import { localeFromElement } from './utils';
export default class RelativeTimeElement extends ExtendedTimeElement {
    getFormattedDate() {
        const date = this.date;
        if (!date)
            return;
        return new RelativeTime(date, localeFromElement(this)).toString();
    }
    connectedCallback() {
        nowElements.push(this);
        if (!updateNowElementsId) {
            updateNowElements();
            updateNowElementsId = window.setInterval(updateNowElements, 60 * 1000);
        }
        super.connectedCallback();
    }
    disconnectedCallback() {
        const ix = nowElements.indexOf(this);
        if (ix !== -1) {
            nowElements.splice(ix, 1);
        }
        if (!nowElements.length) {
            if (updateNowElementsId) {
                clearInterval(updateNowElementsId);
                updateNowElementsId = null;
            }
        }
    }
}
const nowElements = [];
let updateNowElementsId;
function updateNowElements() {
    let time, i, len;
    for (i = 0, len = nowElements.length; i < len; i++) {
        time = nowElements[i];
        time.textContent = time.getFormattedDate() || '';
    }
}
if (!window.customElements.get('relative-time')) {
    window.RelativeTimeElement = RelativeTimeElement;
    window.customElements.define('relative-time', RelativeTimeElement);
}
