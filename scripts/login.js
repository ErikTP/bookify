const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === '' || password === '') {
        alert("Vänligen fyll i både användarnamn och lösenord!");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        alert("Inga användare finns registrerade. Skapa ett konto först!");
        return; 
    }

    if (username === storedUser.username && password === storedUser.password) {
        alert(`Välkommen, ${storedUser.username}!`);
        
        if (storedUser.username === 'admin') { 
            window.location.href = 'admin.html'; 
        } else {
            window.location.href = 'member.html'; 
        }
    } else {
        alert("Fel användarnamn eller lösenord.");
    }
});


