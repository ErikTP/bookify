const sendbookInputFormData = async (formData) => {
    try {
        const response = await fetch('http://localhost:3005/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Something went wrong with the server.');
        }

        const data = await response.json();
        console.log('Book data sent:', data);
        alert('Book form submitted!');
        
    } catch (error) {
        console.error('Error sending book form:', error);
        alert('Something went wrong. Please try again.');
    }
};

submitBook.addEventListener('click', (e) => {
    e.preventDefault();
    const bookTitleInput = document.getElementById("bookTitleInput");
    const bookAuthorInput = document.getElementById("bookAuthorInput");
    const bookSynopsis = document.getElementById("bookSynopsisInput");
    const bookCoverInput = document.getElementById("bookCoverInput");
    const bookGenreInput = document.getElementById("bookGenreInput");
    const submitBook = document.getElementById("submitBook");
    const status = "available";
    const userReviews = [];

    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const synopsis = bookSynopsis.value.trim();
    // const cover = bookCoverInput.value.trim();
    const genre = bookGenreInput.value.trim();
    const reviews = [];
    // Get the selected file from the input
    const fileInput = bookCoverInput;
    const fileName = fileInput.files[0].name;  // Get the name of the selected file

    // Assuming all book covers are stored in a folder, e.g., "/images/"
    const relativePath = `/images/${fileName}`;  // Construct the relative URL/path

    const formData = {
        title: title,
        author: author,
        synopsis: synopsis,
        genre: genre,
        cover: relativePath,  // Send the relative path of the selected image
        status: status,
        reviews: userReviews
    };

    sendbookInputFormData(formData);
});


const sendUserInputFormData = async (userFormData) => {
    try {
        const response = await fetch('http://localhost:3005/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userFormData)
        });

        if (!response.ok) {
            throw new Error('Something went wrong with the server.');
        }

        const data = await response.json();
        console.log('Book data sent:', data);
        alert('Book form submitted!');
        
    } catch (error) {
        console.error('Error sending book form:', error);
        alert('Something went wrong. Please try again.');
    }
};

submitUser.addEventListener('click', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const userRoleInput = document.getElementById("userRoleInput");
    const submitUser = document.getElementById("submitUser");

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const role = userRoleInput.value.trim();

    const userFormData = {
        username: username,
        password: password,
        role: role,
        history: [],
        reviews: [],
        borrowed: []
    };

    sendUserInputFormData(userFormData);
});