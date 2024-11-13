const form = document.getElementById('userForm');
const sendFormData = async (formData) => {
    try {
        const response = await fetch('http://localhost:3005/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Något gick fel vid kommunikationen med servern.');
        }

        const data = await response.json();
        console.log('Data skickad:', data);
        alert('Formulär skickat!');
        
    } catch (error) {
        console.error('Fel vid skickandet av formuläret:', error);
        alert('Något gick fel. Vänligen försök igen.');
    }
};


form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim()
    };

    sendFormData(formData);
});

