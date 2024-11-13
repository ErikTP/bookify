// Trash icon for delete button
const trashIcon = '<i class="fa-solid fa-trash" id="itemDelete"></i>';

function bookInput() {
    // Initialize an empty array
    const inputArray = [];

    // Get the input elements
    const inputTitle = document.getElementById("titleInput");
    const inputAuthor = document.getElementById("authorInput");

    // Get the values of the input elements
    const title = inputTitle.value;
    const author = inputAuthor.value;

    // Add the values to the array
    inputArray.push(title, author);

    // Combine title and author for display
    const titleAndAuthor = inputArray[0] + " av " + inputArray[1];

    // Check if inputs are true (are filled)
    if(title && author !== "") {
        // Create a new list item element
        const listItem = document.createElement("li");
        listItem.innerHTML = titleAndAuthor;

        // Add click event to show or hide more information
        listItem.addEventListener("click", function() {
            toggleBookDetails(listItem, title, author);
        });

        // Create a delete button and attach the delete functionality
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = trashIcon;
        deleteButton.setAttribute("aria-label", `Ta bort ${title}`); // lägger till aria label med bokens titel
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent triggering book details display on delete
            listItem.remove(); // Remove the list item
        });
        listItem.appendChild(deleteButton);

        // Append the new item to the book list
        document.getElementById("myBook").appendChild(listItem);

        // Clear the input fields
        inputTitle.value = "";
        inputAuthor.value = "";

        // Send a message in alert pop up
        alert("Boken har lagts till!");
    
    } else {
        alert("Du måste fylla i både bok och författare.");
    }
};


// Function to create and show a modal with book details
function toggleBookDetails(listItem, title, author) {
    // Create a modal element if it doesn't exist
    let modal = document.getElementById("bookDetailsModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "bookDetailsModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2 id="modalTitle"></h2>
                <p id="modalAuthor"></p>
                <p id="modalDescription"></p>
            </div>
        `;
        document.body.appendChild(modal);

        // Close button functionality
        modal.querySelector('.close').onclick = function() {
            modal.style.display = "none";
        };
    }

    // Set the content of the modal
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalAuthor").textContent = "Författare: " + author;
    document.getElementById("modalDescription").textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    // Display the modal
    modal.style.display = "block";

    // Close modal on click outside the content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}