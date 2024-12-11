const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
    alert("Du loggas ut från Bokklubben.");
    localStorage.clear();
    window.location.href = "index.html";
});
