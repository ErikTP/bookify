const signupForm = document.getElementById('signupForm');
const signupUsernameInput = document.getElementById('username');
const signupPasswordInput = document.getElementById('password');

signupForm.addEventListener('submit', function(event) {
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
    };

    localStorage.setItem('user', JSON.stringify(user));

    alert(`Konto skapat! Du kan nu logga in som ${username}.`);
    window.location.href = 'login.html'; 
});

