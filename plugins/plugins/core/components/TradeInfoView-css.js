import {css} from 'lit'

export const tradeInfoViewStyle = css`
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