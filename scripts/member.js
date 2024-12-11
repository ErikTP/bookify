// Hämtar list-elementet där böckerna ska visas
const listEl = document.getElementById("memberBookListOutput");

// Funktion som skapar två knappar (låna och reservera) och lägger dem till ett listobjekt
function addButtonsToBook(listItem, bookStatus) {
    const loanButton = document.createElement("button");
    loanButton.classList.add("button-loan");
    loanButton.textContent = bookStatus === "available" ? "Låna" : "Lämna tillbaka"; // Sätt text beroende på status
    loanButton.setAttribute('status', bookStatus); // Sätt initial status från databasen
    listItem.appendChild(loanButton); // Lägg till knappen som ett barn till listobjektet

    const reserveButton = document.createElement("button"); // Skapa en "Reservera"-knapp
    reserveButton.classList.add("button-reserve");
    reserveButton.textContent = "Reservera"; // Text för reservera-knappen
    reserveButton.setAttribute('status', 'available');
    listItem.appendChild(reserveButton);

    const reviewButton = document.createElement("button");
    reviewButton.classList.add("button-review");
    reviewButton.textContent = "Lämna recension";
    reviewButton.setAttribute('status', 'Leave review');
    listItem.appendChild(reviewButton);
}

// Funktion för att rendera en lista av böcker
function renderBooks(bookList, element) {
    bookList.forEach(book => {
        const listItem = document.createElement("li");
        listItem.classList.add("book-item");
        listItem.setAttribute("data-book-id", book.id); // Lägg till bokens ID som data-attribut

        const bookCover = document.createElement("img");
        bookCover.src = book.cover || "default-cover.jpg"; // Standardbild om omslag saknas (OBS - lägg till)
        listItem.appendChild(bookCover);

        const bookName = document.createElement("h3");
        bookName.classList.add("book-title");
        bookName.textContent = book.title;
        listItem.appendChild(bookName);

        const bookAuthor = document.createElement("p");
        bookAuthor.classList.add("book-meta");
        bookAuthor.textContent = book.author;
        listItem.appendChild(bookAuthor);

        addButtonsToBook(listItem, book.status); // Passera bokens status
        element.appendChild(listItem);
    });
}

// Funktion för att hämta (GET) data från vår JSON-server 
// Här används "nya" syntaxen med async/await
// Async visar att funktionen innehåller asynkron kod
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3005/books'); // Skicka en HTTP GET-förfrågan till servern
        const books = await response.json(); // Konvertera svaret till JSON
        renderBooks(books, listEl); // Skicka listan av böcker och list-elementet till renderingsfunktionen
    } catch (error) {
        console.error('Error fetching books:', error); // Logga eventuella fel under hämtning av data
    }
}

fetchBooks(); // Anropa funktionen för att hämta och visa böckerna

// Funktion för att hämta en bok med hjälp av bookId
async function fetchBookById(bookId) {
    try {
        const response = await fetch(`http://localhost:3005/books/${bookId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch book");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        return null;
    }
}


// Funktion för att uppdatera bokstatus i databasen
const updateBookStatus = async (bookId, newStatus) => {
    try {
        const updatedBook = { 
            status: newStatus 
        };

        const response = await fetch(`http://localhost:3005/books/${bookId}`, {
            method: "PATCH",
            body: JSON.stringify(updatedBook),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            return true; // Om uppdateringen lyckades

        } else {
            console.error("Misslyckades att uppdatera bokens status.");
            return false;
        }

    } catch (error) {
        console.error("Ett fel inträffade vid uppdatering av bokens status:", error);
        return false;
    }
};

// Funktion för att hämta inloggad användare
function getLoggedInUser() {
    const storedUser = JSON.parse(localStorage.getItem("storedUser"));
    return storedUser; // Returnera hela användarobjektet
}

// Funktion som uppdaterar användarens lånade böcker i db.json
async function updateUserBorrowedBooks(userId, bookId) {
    try {
        // Hämta bokens information baserat på bookId
        const book = await fetchBookById(bookId);
        if (!book) {
            console.error("Boken kunde inte hittas");
            return false;
        }

        // Hämta användardata
        const response = await fetch(`http://localhost:3005/users/${userId}`);
        const userData = await response.json();

        // Uppdatera borrowed-listan med ett objekt som innehåller titel och författare
        const borrowedBooks = userData.borrowed || [];

        borrowedBooks.push({ 
            title: book.title, 
            author: book.author, 
            borrowedAt: new Date().toLocaleDateString("sv-SE") // Lägg till tidsstämpel
        });

        const updatedUser = { ...userData, borrowed: borrowedBooks };

        // Skicka PATCH-förfrågan för att uppdatera användarens data
        const updateResponse = await fetch(`http://localhost:3005/users/${userId}`, {
            method: "PATCH",
            body: JSON.stringify(updatedUser),
            headers: { "Content-Type": "application/json" },
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update user's borrowed books");
        }

        return true;

    } catch (error) {
        console.error("Error updating user's borrowed books:", error);
        return false;
    }
};

// Funktion som hanterar klick för knappar kopplade till böckerna som kan lånas/reseveras
async function handleListClick(event) {
    const target = event.target;

    if (target.classList.contains("button-loan")) {
        const listItem = target.closest(".book-item");
        const bookId = listItem.getAttribute("data-book-id");
        const currentStatus = target.getAttribute("status");
        const user = getLoggedInUser();

        if (!user) {
            alert("Du måste vara inloggad för att låna böcker.");
            return;
        }

        if (currentStatus === "available") {
            const success = await updateBookStatus(bookId, "unavailable");
            if (success) {
                const userUpdateSuccess = await updateUserBorrowedBooks(user.id, bookId);
                if (success && userUpdateSuccess) {
                    target.setAttribute("status", "unavailable");
                    target.textContent = "Lämna tillbaka";
                    alert("Du har nu lånat boken.");
                    window.location.replace("/member.html#memberBookListOutput");
                }
            }
        } else if (currentStatus === "unavailable") {
            const success = await updateBookStatus(bookId, "available");
            if (success) {
                target.setAttribute("status", "available");
                target.textContent = "Låna";
                alert("Du har nu lämnat tillbaka boken.");
                window.location.replace("/member.html#memberBookListOutput");
            }
        }
    }
}

// Eventlyssnare kopplad till klick på knappar i boklistan
listEl.addEventListener("click", handleListClick);

// Funktion som hämtar den inloggade användarens data från db.json
async function fetchBorrowedBooks() {
    try {
        const user = getLoggedInUser(); // Hämta den inloggade användaren från localStorage
        if (!user) {
            console.error("Ingen användare är inloggad.");
            return [];
        }

        // Hämta användarens data från databasen
        const response = await fetch(`http://localhost:3005/users/${user.id}`);
        if (!response.ok) {
            throw new Error("Kunde inte hämta användarens data.");
        }

        const userData = await response.json();
        return userData.borrowed || []; // Returnera de lånade böckerna som en lista av objekt
    } catch (error) {
        console.error("Ett fel inträffade när lånade böcker hämtades:", error);
        return [];
    }
};

// Skapar listan med lånade böcker
function renderBorrowedBooks(borrowedBooks) {
    const borrowedBooksList = document.getElementById("borrowedBooksList");
    borrowedBooksList.innerHTML = ""; // Töm tidigare innehåll

    if (borrowedBooks.length === 0) {
        const noBooks = document.createElement("li");
        noBooks.textContent = `Du har inte lånat några böcker.`;
        borrowedBooksList.appendChild(noBooks);
        return;
    }

    borrowedBooks.forEach(book => {
            const listItem = document.createElement("li");
        
            const bookName = document.createElement("h3");
            bookName.classList.add("book-title");
            bookName.textContent = book.title;
            listItem.appendChild(bookName);
        
            const bookAuthor = document.createElement("p");
            bookAuthor.classList.add("book-meta");
            bookAuthor.textContent = `Författare: ${book.author}`;
            listItem.appendChild(bookAuthor);
        
            const borrowedDate = document.createElement("p");
            borrowedDate.classList.add("book-meta");
            borrowedDate.textContent = `Lånad: ${book.borrowedAt}`;
            listItem.appendChild(borrowedDate);
        
            // Lägg till i början av listan
            borrowedBooksList.insertBefore(listItem, borrowedBooksList.firstChild);
    });
};

// Funktion som hämtar och visar de lånade böckerna när sidan laddas
async function displayBorrowedBooks() {
    const borrowedBooks = await fetchBorrowedBooks(); // Hämta användarens lånade böcker
    renderBorrowedBooks(borrowedBooks); // Rendera böckerna i DOM
}

// Kör funktionen när sidan laddas
window.addEventListener("DOMContentLoaded", () => {
    displayBorrowedBooks();
});



// ????
window.addEventListener("DOMContentLoaded", () => renderMemberReviews());