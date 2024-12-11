const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('loginMessage'); 

// Evenlistener on the login form that listens to submit
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim(); // We use trim() to remove empty spaces
    const password = passwordInput.value.trim();

    if (username === '') {
        usernameInput.setCustomValidity('Fyll i användarnamn!');
        usernameInput.reportValidity();
        return;
    } else {
        usernameInput.setCustomValidity(''); // Rensa tidigare fel
    }

    if (password === '') {
        passwordInput.setCustomValidity(' Fyll i lösenord!');
        passwordInput.reportValidity();
        return;
    } else {
        passwordInput.setCustomValidity(''); // Rensa tidigare fel
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

        if (user) { 
            const userData = {
                id: user.id,
                username: user.username,
                role: user.role,
            };

         // Spara data i localstorage
         localStorage.setItem("storedUser", JSON.stringify(userData));
            alert(`Välkommen ${userData.username}!`);
            
            // Redirects the user based on their role
            if (userData.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'member.html';
            }
        } else {
            loginMessage.textContent = "Fel användarnamn eller lösenord, prova igen!";
            loginMessage.classList.add("visible"); // Gör meddelandet synligt
            }
        })

    .catch((error) => {
        console.error("Fel vid hämtning av användare:", error); // Logs any error that occurs during the fetch process
        loginMessage.textContent = "Ett fel inträffade. Försök igen senare."; // Displays a generic error message to the user
        loginMessage.classList.add("visible"); // Gör meddelandet synligt
    });
});
