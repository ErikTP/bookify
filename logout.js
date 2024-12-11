const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "index.html";
})