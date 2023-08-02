import { css } from 'lit'

export const overviewStyle = css`
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

  @ page {
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
  @ keyframes show-navbar-dropdown {
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