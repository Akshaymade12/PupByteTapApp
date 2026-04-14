console.log("Admin Login Page Loaded");

const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email === "admin@pupbyte.com" && password === "12345") {
    alert("Login Successful");
    
    // Dashboard open (temporary)
    document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Welcome Admin Dashboard 🚀</h1>";
    
  } else {
    alert("Invalid Credentials");
  }
});
