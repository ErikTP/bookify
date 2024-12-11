const signupForm = document.getElementById('signupForm');
const signupUsernameInput = document.getElementById('username');
const signupPasswordInput = document.getElementById('password');
const role = "user";


signupUsernameInput.addEventListener("input", () => {
    signupUsernameInput.setCustomValidity("");
    if (signupUsernameInput.validity.valueMissing) {
        signupUsernameInput.setCustomValidity("Vänligen fyll i ett användarnamn.");
    }
});


signupPasswordInput.addEventListener("input", () => {
    signupPasswordInput.setCustomValidity("");
    if (signupPasswordInput.validity.valueMissing) {
        signupPasswordInput.setCustomValidity("Vänligen fyll i ett lösenord.");
    }
});


signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    // Kontrollera om formuläret är korrekt ifyllt
    if (!signupForm.checkValidity()) {
        signupForm.reportValidity(); // Visa valideringsfel
        return;
    }

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();

    try {
        // Kontrollera om användarnamnet redan existerar
        const response = await fetch("http://localhost:3005/users");
        if (!response.ok) {
            throw new Error("Kunde inte ansluta till servern");
        }
        const users = await response.json();

        const usernameExists = users.some(user => user.username === username);
        if (usernameExists) {
            alert("Användarnamnet är redan upptaget. Vänligen välj ett annat.");
            return;
        }

        // Skapa ny användare
        const user = {
            username: username,
            password: password,
            role: role,
            history: [],
            reviews: []
        };

        const createUserResponse = await fetch("http://localhost:3005/users", {
            method: "POST",
            body: JSON.stringify(user),
            headers: { "Content-Type": "application/json" }
        });

        if (!createUserResponse.ok) {
            throw new Error("Kunde inte skapa användare");
        }

        alert("Ditt konto har blivit skapat!");
        console.log("Redirecting to login.html...");
        window.location.href = "login.html";
        
    } catch (error) {

        console.error("Ett fel inträffade:", error);
        alert("Ett fel inträffade. Vänligen försök igen.");
    }
});
