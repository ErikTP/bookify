const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage'); 

// Evenlistener on the login form that listens to submit
loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the page from reloading, allowing us to manage the login using JavaScript

    const username = usernameInput.value.trim(); // We use trim() to remove empty spaces
    const password = passwordInput.value.trim();

    // Checks if the username or password is blank 
    // If this is the case, a message will appear in loginMessage and the function will end with return
    if (username === '' || password === '') {
        loginMessage.textContent = "Vänligen fyll i både användarnamn och lösenord.";
        return;
    }

    fetch("http://localhost:3005/users", { // Get the userdata from db.json file (JSON list of users)
        method: "GET"
    })
        .then((response) => {
            console.log(response); // TEST - logs the raw response from the server
            return response.json(); // Converts the server's response from JSON to JavaScript objects
        })
        .then((users) => {
            // Searches through the user list (users)
            // A user is found when username and password match the entered values
            const user = users.find(
                (user) => user.username === username && user.password === password
            );

            // If a matching user is found
            if (user) { // If user exists - create object (userData)
                const userData = {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                };

                // Saves user data in localStorage
                // This allows the information to be used on other pages (and lets us know if the user is logged in)
                localStorage.setItem("storedUser", JSON.stringify(userData));

                alert(`Välkommen ${userData.username}!`);
                
                // Redirects the user based on their role
                if (userData.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'member.html';
                }
            } else {
                loginMessage.textContent = "Fel användarnamn eller lösenord.";
            }
        })
        .catch((error) => {
            console.error("Fel vid hämtning av användare:", error); // Logs any error that occurs during the fetch process
            loginMessage.textContent = "Ett fel inträffade. Försök igen senare."; // Displays a generic error message to the user
        });
});
