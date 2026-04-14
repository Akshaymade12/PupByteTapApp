console.log("Admin Login Page Loaded");

const loginBtn = document.querySelector(".login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (email === "admin@pupbyte.com" && password === "12345") {
      alert("Login Successful");
      document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;color:white;font-family:Arial,sans-serif;">
          <h1>Welcome Admin Dashboard 🚀</h1>
        </div>
      `;
    } else {
      alert("Invalid Credentials");
    }
  });
} else {
  console.log("Login button not found");
}
