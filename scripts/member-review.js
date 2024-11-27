// Variable holding the ID of the selected book
let selectedBookId = null;

// Get the modal element and the close button
const reviewModal = document.getElementById("reviewModal");
const closeButton = document.querySelector(".review-modal-close-button");
const reviewForm = document.getElementById("reviewForm");

// Function to handle review button clicks and open the modal
function handleReviewButtonClick(event) {
    const target = event.target;
  
    if (target.classList.contains("button-review")) {
      const bookId = target.closest("li").getAttribute("data-book-id"); // Get the ID of the book
      openReviewModal(bookId); // Open the review form modal
    }
  }
  
// Event listener to handle review button click
listEl.addEventListener("click", handleReviewButtonClick);

//Function to open the modal and set the ID of the selected book
function openReviewModal(bookId) {
    selectedBookId = bookId; // Save book ID
  
    // Get the book element from the list based on bookId
    const bookElement = document.querySelector(`[data-book-id="${bookId}"]`);
  
    // Get the book's title and author from the book element
    const bookTitle = bookElement.querySelector(".book-title").textContent;
    const bookAuthor = bookElement.querySelector(".book-meta").textContent;
  
    // Show book title and author in the modal
    document.getElementById("modalBookTitle").textContent = bookTitle;
    document.getElementById("modalBookAuthor").textContent = bookAuthor;
  
    reviewModal.style.display = "block"; // Display the modal
}

// Function to close the modal
function closeReviewModal() {
  reviewModal.style.display = "none"; // Hide the modal
  selectedBookId = null; // Clear the book ID
}

// Event listener for close button
closeButton.addEventListener("click", closeReviewModal);

// Close the modal when the user clicks outside the modal's content
window.addEventListener("click", (event) => {
  if (event.target === reviewModal) {
    closeReviewModal();
  }
});

// Manage the form submission to create the review
reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    // Create the review data object, including title and author
    const review = {
      title: document.getElementById("modalBookTitle").textContent,  // Add book title
      author: document.getElementById("modalBookAuthor").textContent, // Add author of the book
      name: document.getElementById("reviewWritersName").value, // Add name of the writer of the review
      comment: document.getElementById("reviewComment").value, // Add review comment
      bookId: selectedBookId
    };
  
    try {
      await fetch("http://localhost:3005/reviews", {
        method: "POST",
        body: JSON.stringify(review),
        headers: { "Content-Type": "application/json" }
      });
      
      alert("Recensionen har sparats!");
      closeReviewModal(); // Close the modal after the review is saved

      window.location.reload(); // Refresh the page to show new reviews
    } catch (error) {
      console.error("Error creating review:", error);
      alert("Kunde inte spara recensionen.");
    }
  });
  
// Function to POST reviews to JSON-server
const createReview = async(event) => {
    event.preventDefault();

    const review = {
        name: memberReviewForm.reviewWritersName.value,
        title: memberReviewForm.reviewBookTitle.value,
        author: memberReviewForm.reviewBookAuthor.value,
        comment: memberReviewForm.reviewComment.value,
    }

    await fetch("http://localhost:3005/reviews", {
        method: "POST",
        body: JSON.stringify(review),
        headers: { "Content-Type" : "application/json" }
    });

    window.location.replace("/member.html#reviews");
}

// Function to fetch (GET) reviews from JSON-server
const renderMemberReviews = async () => {
  let uri = "http://localhost:3005/reviews";
  const reviewList = document.getElementById("memberReviewOutPut");

  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    const reviews = await response.json();

    // Build and add reviews
    reviews.forEach(review => {
      const reviewElement = createReviewElement(review);
      reviewList.appendChild(reviewElement);
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
  }
};

// Function to build a review list item to the DOM
const createReviewElement = (review) => {
  const reviewItem = document.createElement("li");  // Create container for a single review
  reviewItem.classList.add("review"); // Add classname

  const titleHeading = document.createElement("h3");  
  titleHeading.textContent = review.title;

  const authorSpan = document.createElement("p");
  authorSpan.textContent = review.author;

  const commentParagraph = document.createElement("p"); 
  commentParagraph.textContent = review.comment;

  const nameSpan = document.createElement("span"); 
  nameSpan.textContent = `Postad av: ${review.name}`;

  // Add the elements to the review item
  reviewItem.appendChild(titleHeading); 
  reviewItem.appendChild(authorSpan); 
  reviewItem.appendChild(nameSpan);
  reviewItem.appendChild(commentParagraph);

  return reviewItem;
};

   