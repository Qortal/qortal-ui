export class Loader {
    constructor() {
      this.loader = document.createElement("div");
      this.loader.className = "loader";
      this.loader.innerHTML = `
        <div class="loader-spinner"></div>
      `;
      this.styles = document.createElement("style");
      this.styles.innerHTML = `
        .loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000001
        }
  
        .loader-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          animation: spin 1s linear infinite;
        }
  
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
    }
  
    show() {
      document.head.appendChild(this.styles);
      document.body.appendChild(this.loader);
    }
  
    hide() {
      if (this.loader.parentNode) {
        this.loader.parentNode.removeChild(this.loader);
      }
      if (this.styles.parentNode) {
        this.styles.parentNode.removeChild(this.styles);
      }
    }
  }