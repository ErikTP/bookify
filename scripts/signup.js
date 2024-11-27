const signupForm = document.getElementById('signupForm');
const signupUsernameInput = document.getElementById('username');
const signupPasswordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (username === '' || password === '' || email === '' || phone === '') {
        alert('Vänligen fyll i alla fält!');
        return;
    }

    const user = {
        username: username,
        password: password,
        email: email,
        phone: phone,
    };

    localStorage.setItem('user', JSON.stringify(user));

    alert(`Konto skapat! Du kan nu logga in som ${username}.`);
    window.location.href = 'login.html'; 
});
