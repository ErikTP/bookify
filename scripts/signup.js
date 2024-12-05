const signupForm = document.getElementById('signupForm');
const signupUsernameInput = document.getElementById('username');
const signupPasswordInput = document.getElementById('password');
const role = "user";

// Hantera sign up form
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    // Username och lösenord
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();

    if (username === '' || password === '') {
        alert('Vänligen fyll i alla fält!');
        return;
    }


    try {
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
        window.location.href = "login.html"; 
      } catch (error) {
        console.error("Ett fel inträffade:", error);
        alert("Ett fel inträffade. Vänligen försök igen.");
      }
     });
  
// signupForm.addEventListener('submit', async(event) => {
//     event.preventDefault();

//     const username = signupUsernameInput.value.trim();
//     const password = signupPasswordInput.value.trim();
   

//     if (username === '' || password === '') {
//         alert('Vänligen fyll i alla fält!');
//         return;
//     }

//     const user = {
//         username: username,
//         password: password,
//         role: role,
//         history: [],
//         reviews: []
//     };


//     try {
//         const response = await fetch('https://localhost:3005/users', {
//             method: "POST", 
//             body: JSON.stringify(user),
//             headers: {"Content-Type": "application/json"

//             }
//         });

//         if (response.ok) {
//             console.log('User created:', user);
//         } else {
//             console.log('Failed to create user:', response.status);
//         }
//         } catch (error) {
//             console.error("Error creating user:", error);
//         }
//     });


