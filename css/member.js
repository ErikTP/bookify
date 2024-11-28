// Hämtar list-elementet där böckerna ska visas
const listEl = document.getElementById("memberBookListOutput");

// Funktion som skapar två knappar (låna och reservera) och lägger dem till ett listobjekt
function addButtonsToBook(listItem) {
    const loanButton = document.createElement("button"); // Skapa en "Låna"-knapp
    loanButton.classList.add("button-loan"); // Lägg till en klass för styling
    loanButton.textContent = "Låna"; // Sätt texten "Låna" på knappen
    loanButton.setAttribute('status', 'available'); // Sätt initial status som "available"
    listItem.appendChild(loanButton); // Lägg till knappen som ett barn till listobjektet

    const reserveButton = document.createElement("button"); // Skapa en "Reservera"-knapp
    reserveButton.classList.add("button-reserve"); // Lägg till en klass för styling
    reserveButton.textContent = "Reservera"; // Sätt texten "Reservera" på knappen
    reserveButton.setAttribute('status', 'available'); // Sätt initial status som "available"
    listItem.appendChild(reserveButton); // Lägg till knappen som ett barn till listobjektet

    const reviewButton = document.createElement("button"); // Skapa en "Reservera"-knapp
    reviewButton.classList.add("button-review"); // Lägg till en klass för styling
    reviewButton.textContent = "Lämna recension"; // Sätt texten "Reservera" på knappen
    reviewButton.setAttribute('status', 'Leave review'); // Sätt initial status som "Leave Review"
    listItem.appendChild(reviewButton); // Lägg till knappen som ett barn till listobjektet
}

// Funktion som hanterar klickhändelser på "Låna böcker" listan (member)
function handleListClick(event) {
    const target = event.target; // Hämtar det element som användaren klickade på

    if (target.classList.contains("button-loan")) { 
        const reserveButton = target.nextElementSibling; // Funkar när reserve-knappen är direkt efter loan-knappen

        if (reserveButton.getAttribute('status') === 'reserved') {
            console.log("Du kan inte låna en bok som är reserverad.");
            alert("Du kan inte låna en bok som är reserverad.");
            return; // Avbryt om boken är reserverad
        } else { 
            reserveButton.style.display = 'none';
        }
        const currentStatus = target.getAttribute('status');

        if (currentStatus === 'loaned') {
            target.setAttribute('status', 'available');
            target.textContent = "Låna";
            alert("Du har nu lämnat tillbaka boken.");
            console.log("Boken är nu återlämnad.");
            reserveButton.style.display = 'block';          
        
        } else {
            target.setAttribute('status', 'loaned');
            target.textContent = "Lämna tillbaka";
            alert("Du har nu lånat boken.");
            console.log("Boken är nu lånad.");      
        }
    }

    if (target.classList.contains("button-reserve")) { 
        const loanButton = target.previousElementSibling; // Loan-knappen är direkt före reserve-knappen

        if (loanButton.getAttribute('status') === 'loaned') {
            alert("Du kan inte reserva en bok som är lånad.");
            console.log("Det går inte att reservera en bok som är lånad.");
            return; // Avbryt om boken är lånad
        }

        const currentStatus = target.getAttribute('status');

        if (currentStatus === 'reserved') {
            target.setAttribute('status', 'available');
            target.textContent = "Reservera";
            alert("Du har nu ångrat din reservation av boken.");
            console.log("Boken är inte längre reseverad.");
            loanButton.style.display = 'block';

        } else {
            target.setAttribute('status', 'reserved');
            target.textContent = "Ångra reservation";
            alert("Du har nu reserverat boken.");
            console.log("Boken är reserverad.");
            loanButton.style.display = 'none';    
        }
    }
}

// Eventlyssnare
listEl.addEventListener("click", handleListClick);

// Funktion för att rendera en lista av böcker
function renderBooks(bookList, element) {
    bookList.forEach(book => {
        const listItem = document.createElement("li");
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

        addButtonsToBook(listItem); // Lägg till knapparna
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

// Anropa funktionen för att hämta och visa böckerna
fetchBooks();
