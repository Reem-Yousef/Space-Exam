document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const mainContent = document.querySelector(".result-container");
      if (mainContent) mainContent.style.display = "none";

      const logoutMessage = document.createElement("div");
      logoutMessage.innerHTML = `
        <div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ff00ff;
          font-size: 1.5rem;
          text-align: center;
          z-index: 9999;
          text-shadow: 0 0 10px rgba(255, 0, 255, 0.7);
          background: rgba(0, 0, 0, 0.7);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #ff00ff;
          backdrop-filter: blur(5px);
        ">
          Logout successful. You can now close this page.
          <br><br>
          <button id="go-home" class="welcome-button primary">Go to Home</button>
        </div>
      `;

      document.body.appendChild(logoutMessage);

      const goHomeBtn = document.getElementById("go-home");
      if (goHomeBtn) {
        goHomeBtn.addEventListener("click", () => {
          window.location.href = "../index.html";
        });
      }

      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };
    });
  }
});
