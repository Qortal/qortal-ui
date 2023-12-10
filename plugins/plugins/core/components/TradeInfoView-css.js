import {css} from 'lit'

export const tradeInfoViewStyle = css`
  * {
    --mdc-theme-primary: rgb(3, 169, 244);
    --mdc-theme-secondary: var(--mdc-theme-primary);
    --mdc-theme-surface: var(--white);
    --mdc-dialog-content-ink-color: var(--black);
    box-sizing: border-box;
  }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--black);
  }

  p {
    margin: 0;
    padding: 0;
    color: var(--black);
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

  .decline {
    --mdc-theme-primary: var(--mdc-theme-error)
  }

  .warning {
    --mdc-theme-primary: #f0ad4e;
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
`