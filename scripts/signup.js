const signupForm = document.getElementById('signupForm');
const signupUsernameInput = document.getElementById('username');
const signupPasswordInput = document.getElementById('password');
const role = "user";

signupForm.addEventListener('submit', async(event) => {
    event.preventDefault();

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();
   

    if (username === '' || password === '') {
        alert('Vänligen fyll i alla fält!');
        return;
    }

    const user = {
        username: username,
        password: password,
        role: role,
        history: [],
        reviews: []
    };


    try {
        const response = await fetch('https://localhost:3005/users', {
            method: "POST", 
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json"

            }
        });

        if (response.ok) {
            console.log('User created:', user);
        } else {
            console.log('Failed to create user:', response.status);
        }
        } catch (error) {
            console.error("Error creating user:", error);
        }
    });


