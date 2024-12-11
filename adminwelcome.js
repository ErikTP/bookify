const adminWelcome = document.getElementById("admin-header");
const username = localStorage.getItem("storedUser");

const user = JSON.parse(username);

adminWelcome.textContent = `Välkommen ${user.username}, du är inloggad som ${user.role}`;
