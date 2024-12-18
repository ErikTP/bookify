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
        const response = await fetch('http://localhost:3005/books');
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

    // Renderar varje bok som en slide
    books.forEach(book => {
        const slide = document.createElement('div');
        slide.className = 'book';

        // Lägger till status-klassen baserat på tillgänglighet
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

    // Automatiskt byter slides var 5:e sekund
    let autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000);

    // Gå till föregående slide
    prevButton.addEventListener('click', () => {
        clearInterval(autoSlide); // Stoppa automatisk växling
        goToSlide(currentIndex - 1);
        autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000); // Starta om
    });

    // Gå till nästa slide
    nextButton.addEventListener('click', () => {
        clearInterval(autoSlide); // Stoppar automatisk växling
        goToSlide(currentIndex + 1);
        autoSlide = setInterval(() => goToSlide(currentIndex + 1), 5000); // Starta om
    });

    // Initierar första sliden
    goToSlide(currentIndex);
}

async function fetchReviews() {
  try {
      const response = await fetch('http://localhost:3005/reviews');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
  }
}

async function renderReviews() {
  const reviews = await fetchReviews(); // Hämtar recensionerna
  const container = document.querySelector('.medlemskap-sektion');
  container.innerHTML = ''; // Rensar tidigare innehåll

  reviews.forEach((review, index) => {
      const reviewDiv = document.createElement('div');
      reviewDiv.className = `review-slide ${index >= 2 ? 'locked' : ''}`;

      reviewDiv.innerHTML = `
          <p class="review-book"><strong>Bokrecension:</strong> ${review.title} (${review.author})</p> 
          <p class="review-text">${review.comment}</p> 
          <p class="review-member"><strong> ${review.profilePicture} ${review.name}</strong></p> 
          <p class="review-rating">${'★'.repeat(review.rating)}</p> 
          <p class="review-date"><em>Datum:</em> ${new Date(review.date).toLocaleDateString()}</p>
      `;

      container.appendChild(reviewDiv);
  });

  // Skapar och lägger till knappen längst ner
  const unlockButton = document.createElement('button');
  unlockButton.className = 'unlock-button';
  unlockButton.textContent = 'Lås upp fler recensioner för medlemmar';
  unlockButton.onclick = () => {
      window.location.href = "signup.html"; 
  };

  // Centrerar knappen längst ner i medlemskap-behållaren
  const wrapper = document.querySelector('.medlemskap-behållare');
  wrapper.appendChild(unlockButton);
}

// Kör funktionen när sidan laddas
document.addEventListener('DOMContentLoaded', renderReviews);

document.addEventListener('DOMContentLoaded', () => {
    renderSlideshow();
});