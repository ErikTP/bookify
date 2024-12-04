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
    reserveButton.textContent = "Reservera"; // Standardtext för reservera-knappen
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
        bookCover.src = book.cover || "default-cover.jpg"; // Standardbild om omslag saknas
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

window.addEventListener("DOMContentLoaded", () => renderMemberReviews());

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
                if (userUpdateSuccess) {
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

// Funktion som hämtar inloggad användare från LocalStorage
function getLoggedInUser() {
    const user = localStorage.getItem("user"); // Nyckeln ska vara en sträng
    console.log(user); // Kontrollera vad som hämtas från LocalStorage
    return user ? JSON.parse(user) : null; // Om user är null, returnera null; annars parsa till JSON
}

// Funktion som uppdaterar användarens borrowed-lista i databasen
async function updateUserBorrowedBooks(userId, bookId) {
    try {
        // Hämta nuvarande användaruppgifter från databasen
        const response = await fetch(`http://localhost:3005/users/${userId}`);
        const userData = await response.json();

        // Uppdatera borrowed-listan
        const borrowedBooks = userData.borrowed || [];
        borrowedBooks.push(bookId);

        const updatedUser = { borrowed: borrowedBooks };

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
}
