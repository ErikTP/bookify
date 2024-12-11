const adminWelcome = document.getElementById("welcome");
const username = localStorage.getItem("storedUser");

const user = JSON.parse(username);
adminWelcome.textContent = `Välkommen ${user.username.charAt(0).toUpperCase() + user.username.slice(1)}, du är inloggad som ${user.role}`;



