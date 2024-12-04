var navLinks = document.getElementById("navLinks");

function showMenu() {
    navLinks.style.right = "0";
}

function hideMenu() {
    navLinks.style.right = "-200px";
}

// Funktion för att hämta böcker
async function fetchBooks() {
    try {
      const response = await fetch('http://localhost:3000/books');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }
  
  async function renderSlideshow() {
    const books = await fetchBooks();
    const slidesContainer = document.querySelector('.slides-container');
  
    // Rendera varje bok som en slide
    books.forEach(book => {
      const slide = document.createElement('div');
      slide.className = 'book';
  
      // Lägg till status-klassen baserat på tillgänglighet
      const statusClass = book.status === "available" ? "available" : "unavailable";
  
      slide.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p><strong>Författare:</strong> ${book.author}</p>
        <p>${book.synopsis}</p>
        <p class="book-status ${statusClass}">${book.status === "available" ? "Tillgänglig för utlåning" : "Ej tillgänglig för utlåning"}</p>
      `;
      slidesContainer.appendChild(slide);
    });
  
    initializeSlideshow();
  }
  
  // Funktion för att hantera slideshow
  function initializeSlideshow() {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slides-container .book');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    let currentIndex = 0;
  
    // Funktion för att gå till en viss slide
    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      const offset = -currentIndex * 100; // Beräkna hur mycket som ska förflyttas
      slidesContainer.style.transform = `translateX(${offset}%)`;
    }
  
    // Automatiskt byt slides var 5:e sekund
    let autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);
  
    // Gå till föregående slide
    prevButton.addEventListener('click', () => {
      clearInterval(autoSlide); // Stoppa automatisk växling
      goToSlide(currentIndex - 1);
      autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000); // Starta om
    });
  
    // Gå till nästa slide
    nextButton.addEventListener('click', () => {
      clearInterval(autoSlide); // Stoppa automatisk växling
      goToSlide(currentIndex + 1);
      autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000); // Starta om
    });
  
    // Initiera första sliden
    goToSlide(currentIndex);
  }
  
  // Kör slideshow-rendering när sidan laddas
  document.addEventListener('DOMContentLoaded', renderSlideshow);