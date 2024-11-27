const checkIcon = '<i class="fa-solid fa-check" id="itemCheck"></i>';
const editIcon = '<i class="fa-solid fa-pen-to-square" id="itemEdit"></i>';
const trashIcon = '<i class="fa-solid fa-trash" id="itemDelete"></i>';
const id = new URLSearchParams(window.location.search).get('id');

document.addEventListener("DOMContentLoaded", () => {

    const fetchBooks = () => {
        fetch('db.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response not ok');
                }
                return response.json();
            })
            .then(data => {
                const booksContainer = document.querySelector(".bookItem");
                booksContainer.innerHTML = "";

                data.books.forEach(book => {

                    const listItem = document.createElement("li");
                    listItem.classList.add("book");
                    listItem.classList.add(book.id);
         
                    const span = document.createElement("span");
                    span.textContent = `${book.title} av ${book.author}, Genre: ${book.genre}`;
                    listItem.appendChild(span);

                    const synopsis = document.createElement("details");
                    synopsis.textContent = book.synopsis;
                    listItem.appendChild(synopsis);
                    booksContainer.appendChild(listItem);

                    const image = document.createElement("img");
                    image.src = book.cover;
                    image.alt = `${book.cover} cover`;
                    synopsis.appendChild(image);
                    
                    const bookinfo = document.createElement("div");
                    bookinfo.classList.add("bookinfo");
                    bookinfo.appendChild(image);
                    bookinfo.appendChild(synopsis);
                    listItem.appendChild(bookinfo);
                    listItem.setAttribute("data-status", "available");

                    const deleteButton = document.createElement("button");
                    deleteButton.innerHTML = trashIcon;
                    deleteButton.classList.add("delete-button");
                    listItem.appendChild(deleteButton);
                    deleteButton.addEventListener("click", async (e) => {
                        listItem.remove();
                        const response = await fetch('http://localhost:3005/books/' + book.id, {
                            method: 'DELETE',
                        });
                        
                    });
                    listItem.appendChild(deleteButton);                    

                    const checkButton = document.createElement("button");
                    checkButton.innerHTML = checkIcon;
                    checkButton.classList.add("check-button");
                    listItem.appendChild(checkButton);
                    checkButton.addEventListener("click", () => {
                        if (listItem.style.textDecoration === "line-through") {
                            listItem.style.textDecoration = "none";
                            listItem.setAttribute("data-status", "available");
                        } else {
                            listItem.style.textDecoration = "line-through";
                            listItem.setAttribute("data-status", "not available");  // Set the status to not available when checked
                        }
                    });
                    
                    listItem.appendChild(checkButton);

                    const editButton = document.createElement("button");
                    editButton.innerHTML = editIcon;
                    editButton.classList.add("edit-button");
                    listItem.appendChild(editButton);
                    editButton.addEventListener("click", () => {
                        const editedTitle = prompt("Edit title: ", title.textContent)
                        const editedAuthor = prompt("Edit author: ", author.textContent);            
                        const editedSynopsis = prompt("Edit synopsis: ", synopsis.textContent);
            
                        if (editedTitle !== null && editedAuthor !== null && editedSynopsis !== null) {
                            // Preserve the buttons when editing the text
                            const currentButtons = listItem.querySelectorAll("button");
                            // newListItem.textContent = editedText; // Update only the text content
            
                            listItem.textContent = `${editedTitle} av ${editedAuthor}`;
                            synopsisDetails.textContent = editedSynopsis;
                            listItem.appendChild(synopsisDetails);
                            currentButtons.forEach(button => {
                                listItem.appendChild(button);
                                  // Re-append the buttons after text update
                                // newListItem.setAttribute("data-status", "edited");
                            });
                        }
                    });
                    listItem.appendChild(editButton);
                    bookItem.appendChild(listItem); //slutligen skapas listitemet

                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
            
    };  
        fetchBooks();

});