import { strftime, makeFormatter, isDayFirst } from './utils';
import ExtendedTimeElement from './extended-time-element';
const formatters = new WeakMap();
export default class LocalTimeElement extends ExtendedTimeElement {
    attributeChangedCallback(attrName, oldValue, newValue) {
        if (attrName === 'hour' || attrName === 'minute' || attrName === 'second' || attrName === 'time-zone-name') {
            formatters.delete(this);
        }
        super.attributeChangedCallback(attrName, oldValue, newValue);
    }
    getFormattedDate() {
        const d = this.date;
        if (!d)
            return;
        const date = formatDate(this, d) || '';
        const time = formatTime(this, d) || '';
        return `${date} ${time}`.trim();
    }
}
function formatDate(el, date) {
    const props = {
        weekday: {
            short: '%a',
            long: '%A'
        },
        day: {
            numeric: '%e',
            '2-digit': '%d'
        },
        month: {
            short: '%b',
            long: '%B'
        },
        year: {
            numeric: '%Y',
            '2-digit': '%y'
        }
    };
    let format = isDayFirst() ? 'weekday day month year' : 'weekday month day, year';
    for (const prop in props) {
        const value = props[prop][el.getAttribute(prop) || ''];
        format = format.replace(prop, value || '');
    }
    format = format.replace(/(\s,)|(,\s$)/, '');
    return strftime(date, format).replace(/\s+/, ' ').trim();
}
function formatTime(el, date) {
    const options = {};
    const hour = el.getAttribute('hour');
    if (hour === 'numeric' || hour === '2-digit')
        options.hour = hour;
    const minute = el.getAttribute('minute');
    if (minute === 'numeric' || minute === '2-digit')
        options.minute = minute;
    const second = el.getAttribute('second');
    if (second === 'numeric' || second === '2-digit')
        options.second = second;
    const tz = el.getAttribute('time-zone-name');
    if (tz === 'short' || tz === 'long')
        options.timeZoneName = tz;
    if (Object.keys(options).length === 0) {
        return;
    }
    let factory = formatters.get(el);
    if (!factory) {
        factory = makeFormatter(options);
        formatters.set(el, factory);
    }
    const formatter = factory();
    if (formatter) {
        return formatter.format(date);
    }
    else {
        const timef = options.second ? '%H:%M:%S' : '%H:%M';
        return strftime(date, timef);
    }
}
if (!window.customElements.get('local-time')) {
    window.LocalTimeElement = LocalTimeElement;
    window.customElements.define('local-time', LocalTimeElement);
}
