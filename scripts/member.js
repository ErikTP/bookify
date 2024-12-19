// Hämtar list-elementet där böckerna ska visas
const listEl = document.getElementById("memberBookListOutput");

// Hämta den inloggade användaren från localStorage
const userLoggedIn = getLoggedInUser();

// Funktion för att rendera listan av böcker
function renderBooks(bookList, element) {
    // Itererar igenom listan av böcker
    bookList.forEach(book => {
        const listItem = document.createElement("li"); // Skapar ett nytt listobjekt
        listItem.classList.add("book-item"); // Lägger till en CSS-klass för styling
        listItem.setAttribute("data-book-id", book.id); // Lagrar bok-id i ett data-attribut

        // Skapar och lägger till en bild för bokomslaget
        const bookCover = document.createElement("img");
        bookCover.classList.add("book-info"); // Lägger till en CSS-klass
        bookCover.src = book.cover || "default-cover.jpg"; // Använd en standardbild om omslag saknas
        bookCover.addEventListener("click", () => openBookInfoModal(book)); // Eventlyssnare vid klick
        listItem.appendChild(bookCover);

        // Skapar och lägger till bokens titel
        const bookName = document.createElement("h3");
        bookName.classList.add("book-title"); // Lägger till en CSS-klass
        bookName.textContent = book.title; // Sätter texten till bokens titel
        listItem.appendChild(bookName);

        // Skapar och lägger till författarens namn
        const bookAuthor = document.createElement("p");
        bookAuthor.classList.add("book-meta"); // Lägger till en CSS-klass
        bookAuthor.textContent = book.author; // Sätter texten till författarens namn
        listItem.appendChild(bookAuthor);

        // Skapar en knapp för att låna eller återlämna boken
        const loanButton = document.createElement("button");
        loanButton.classList.add("button-loan"); // Lägger till en CSS-klass

        if (book.status === "available") {
            loanButton.textContent = "Låna"; // Text för tillgänglig bok
            loanButton.setAttribute('status', "available"); // Sätter status som "tillgänglig"
        } else if (book.status === "unavailable" && book.borrowedBy === userLoggedIn.id) {
            loanButton.textContent = "Lämna tillbaka"; // Text för böcker lånade av användaren
            loanButton.setAttribute('status', "unavailable");
        } else {
            loanButton.setAttribute('status', "unavailable");
            loanButton.textContent = "Ej tillgänglig"; // Text för utlånade böcker
            loanButton.disabled = true; // Inaktiverar knappen
        }

        listItem.appendChild(loanButton); // Lägger till låna-knappen i listobjektet

        // Kontroll: Lägg till reservera-knapp om boken är utlånad och inte lånad av användaren
        if (book.status === "unavailable" && book.borrowedBy !== userLoggedIn.id) {
            const reserveButton = document.createElement("button");
            reserveButton.classList.add("button-reserve"); // Lägger till en CSS-klass

            if (book.reservedBy === userLoggedIn.id) {
                reserveButton.textContent = "Ångra reservation"; // Text om användaren reserverat boken
                reserveButton.setAttribute('status', "reserved-by-user");
            } else if (book.reservedBy) {
                reserveButton.textContent = "Reserverad"; // Text om boken är reserverad av annan användare
                reserveButton.disabled = true; // Inaktiverar knappen
            } else {
                reserveButton.textContent = "Reservera"; // Text om boken inte är reserverad
                reserveButton.setAttribute('status', "not-reserved");
            }

            listItem.appendChild(reserveButton); // Lägger till reservera-knappen i listobjektet
        }

        // Skapar en knapp för att lämna recension
        const reviewButton = document.createElement("button");
        reviewButton.classList.add("button-review"); // Lägger till en CSS-klass
        reviewButton.textContent = "Lämna recension"; // Sätter texten
        reviewButton.setAttribute('status', 'Leave review');
        listItem.appendChild(reviewButton);

        element.appendChild(listItem); // Lägger till listobjektet i DOM-elementet
    });
};

// Funktion för att hämta (GET) data från vår JSON-server
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:3005/books'); // Skicka en HTTP GET-förfrågan
        const books = await response.json(); // Konvertera svaret till JSON-format
        renderBooks(books, listEl); // Rendera böckerna med funktionen "renderBooks"
    } catch (error) {
        console.error('Error fetching books:', error); // Logga fel vid problem med hämtning
    }
}

fetchBooks(); // Kör funktionen för att hämta och visa böckerna

// Funktion för att hämta en bok med hjälp av bookId
async function fetchBookById(bookId) {
    try {
        const response = await fetch(`http://localhost:3005/books/${bookId}`); // GET-förfrågan för en specifik bok
        if (!response.ok) {
            throw new Error("Failed to fetch book"); // Hantera misslyckade svar
        }
        return await response.json(); // Returnera bokobjektet
    } catch (error) {
        console.error("Error fetching book by ID:", error); // Logga fel
        return null; // Returnera null vid fel
    }
}

// Funktion för att uppdatera bokstatus i databasen
const updateBookStatus = async (bookId, newStatus, borrowedBy) => {
    try {
        const updatedBook = { 
            status: newStatus,
            borrowedBy: borrowedBy // Lägger till låntagarens ID eller null
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
        console.log(updatedUser);

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

// Funktion för att uppdatera en bok (t.ex. ändra status)
async function updateBook(bookId, updatedData) {
    try {
        const response = await fetch(`http://localhost:3005/books/${bookId}`, {
            method: "PATCH", // PATCH används för att delvis uppdatera resurser
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData), // Skickar data som JSON.
        });

        if (!response.ok) {
            throw new Error("Failed to update book"); // Ger fel om svar inte är OK
        }

        return await response.json(); // Returnerar den uppdaterade bokinformationen
    } catch (error) {
        console.error("Error updating book:", error); // Loggar fel om det inträffar
        return null; // Returnerar null om det blir fel
    }
}

// Funktion som hanterar klick för knappar kopplade till böckerna som kan lånas/reseveras
async function handleButtonClick(event) {
    const button = event.target; // Hämtar elementet som användaren klickade på
    const listItem = button.closest(".book-item"); // Hittar närmaste listobjekt
    const bookId = listItem.getAttribute("data-book-id"); // Hämtar bokens ID

    // Om knappen är en "Låna"-knapp
    if (button.classList.contains("button-loan")) {
        if (button.getAttribute("status") === "available") {
            const updatedBook = await updateBook(bookId, { // Uppdaterar bokens status till "unavailable"
                status: "unavailable",
                borrowedBy: userLoggedIn.id, // Sätter användarens ID som låntagare
            });

            if (updatedBook) {
                // Uppdatera användarens lånehistorik i databasen
                const success = await updateUserBorrowedBooks(userLoggedIn.id, bookId);
                if (success) {
                    fetchBooks(); // Hämta och rendera böcker igen
                    displayBorrowedBooks(); // Uppdatera lånehistoriken i DOM
                }
            }
        } else if (button.getAttribute("status") === "unavailable") {
            const updatedBook = await updateBook(bookId, { // Uppdaterar bokens status till "available"
                status: "available",
                borrowedBy: null, // Tömmer låntagare
            });

            if (updatedBook) fetchBooks();
        }
    }

    // Om knappen är en "Reservera"-knapp
    if (button.classList.contains("button-reserve")) {
        if (button.getAttribute("status") === "not-reserved") {
            const updatedBook = await updateBook(bookId, { // Sätter användaren som den som reserverar boken
                reservedBy: userLoggedIn.id,
            });
            if (updatedBook) fetchBooks();
        } else if (button.getAttribute("status") === "reserved-by-user") {
            const updatedBook = await updateBook(bookId, { // Tar bort reservationen.
                reservedBy: null,
            });
            if (updatedBook) fetchBooks();
        }
    }

    // Om knappen är en "Lämna recension"-knapp
    // if (button.classList.contains("button-review")) {
    //     console.log("Review button clicked for book ID:", bookId);
    //     // KOD FÖR REDENSIONER KAN LÄGGAS TILL HÄR
    // }
}


// Lyssnar efter klick på hela listan med knappar (i boklistan) och anropar hanteraren
listEl.addEventListener("click", handleButtonClick);

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

// Funktion som skapar listan med lånade böcker
function renderBorrowedBooks(borrowedBooks) {
    const borrowedBooksList = document.getElementById("borrowedBooksList");
    borrowedBooksList.innerHTML = ""; // Töm tidigare innehåll - BÄTTRE LÖSNING ÄN INNER-HTML?

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
    console.log(borrowedBooks); 
}

// Kör funktionen när sidan laddas
window.addEventListener("DOMContentLoaded", () => {
    displayBorrowedBooks();
});

// Uppdatera bokstatus för reservation
const updateBookReservation = async (bookId, reservedBy) => {
    try {
        const updatedBook = { reservedBy: reservedBy }; // Om reservedBy är null tas reservationen bort

        const response = await fetch(`http://localhost:3005/books/${bookId}`, {
            method: "PATCH",
            body: JSON.stringify(updatedBook),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            return true;
        } else {
            console.error("Misslyckades att uppdatera reservationen.");
            return false;
        }
    } catch (error) {
        console.error("Ett fel inträffade vid uppdatering av reservationen:", error);
        return false;
    }
};

// Hämta Book Info Modal element
const bookInfcloseButton = document.querySelector(".modal-close-button");

// Funktion för att öppna modalen och visa bokinfo
function openBookInfoModal(book) {
    const modalTitle = document.querySelector("#bookInfoModal .modal-title");
    const modalAuthor = document.querySelector("#bookInfoModal .book-meta");
    const modalDescription = document.querySelector("#bookInfoModal .modal-description");
    const modalCover = document.querySelector("#bookInfoModal .modal-book-cover");;

    // Uppdatera modalen med bokens information
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `Författare: ${book.author}`;
    modalDescription.textContent = book.synopsis || "Ingen beskrivning tillgänglig.";
    modalCover.src = book.cover || "default-cover.jpg";

    // Visa modalen
    bookInfoModal.style.display = "block";
}

// Funktion för att stänga modalen
function closeBookInfoModal() {
    bookInfoModal.style.display = "none";
}

// Lägg till händelsehanterare för stäng-knappen
bookInfcloseButton.addEventListener("click", closeBookInfoModal);

// Lägg till evnt för att stänga modalen när man klickar utanför den
window.addEventListener("click", (event) => {
    if (event.target === bookInfoModal) {
        closeBookInfoModal();
    }
});
