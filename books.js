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

                    // Delete Button
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

                    // Check Button
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
                            listItem.setAttribute("data-status", "not available");
                        }
                    });

                    // Edit Button
                    const editButton = document.createElement("button");
                    editButton.innerHTML = editIcon;
                    editButton.classList.add("edit-button");
                    listItem.appendChild(editButton);
                    editButton.addEventListener("click", async () => {
                        const editedTitle = prompt("Edit title: ", book.title);
                        const editedAuthor = prompt("Edit author: ", book.author);            
                        const editedSynopsis = prompt("Edit synopsis: ", book.synopsis);
                        const editedGenre = prompt("Edit genre: ", book.genre);

                        if (editedTitle && editedAuthor && editedSynopsis) {
                            const editedBook = {
                                title: editedTitle,
                                author: editedAuthor,
                                synopsis: editedSynopsis,
                                genre: editedGenre,
                                cover: book.cover
                            };

                            try {
                                const response = await fetch('http://localhost:3005/books/' + `${book.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(editedBook),
                                });

                                if (response.ok) {
                                    const updatedBook = await response.json();
                                    span.textContent = `${updatedBook.title} av ${updatedBook.author}, Genre: ${updatedBook.genre}`;
                                    synopsis.textContent = updatedBook.synopsis;
                                    image.src = updatedBook.cover; 
                                } else {
                                    console.log("Error updating book.");
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    });

                    listItem.appendChild(deleteButton); 
                    listItem.appendChild(checkButton);  
                    listItem.appendChild(editButton);

                    booksContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });

    };

    fetchBooks();

});
