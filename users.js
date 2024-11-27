const userCheckIcon = '<i class="fa-solid fa-check" id="itemCheck"></i>';
const userEditIcon = '<i class="fa-solid fa-pen-to-square" id="itemEdit"></i>';
const userTrashIcon = '<i class="fa-solid fa-trash" id="itemDelete"></i>';
const userId = new URLSearchParams(window.location.search).get('id');

document.addEventListener("DOMContentLoaded", () => {

    const fetchUsers = () => {
        fetch('db.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response not ok');
                }
                return response.json();
            })
            .then(data => {
                const usersContainer = document.querySelector("#userItem");
                usersContainer.innerHTML = "";

                data.users.forEach(user => {

                    const userListItem = document.createElement("li");
                    userListItem.classList.add("user");
                    userListItem.classList.add(user.userId);
         
                    const span = document.createElement("span");
                    span.textContent = `Username: ${user.username} Password: ${user.password}, Role: ${user.role}`;
                    userListItem.appendChild(span);

                    
                    const history = document.createElement("details");
                    
                    if (!user.history || user.history.length === 0)  {
                        userListItem.appendChild(history);
                        history.textContent = "List is empty";
                    }
                    else {
                        userListItem.appendChild(history);
                        history.textContent = user.history;                       
                    }

                    const userDeleteButton = document.createElement("button");
                    userDeleteButton.innerHTML = userTrashIcon;
                    userDeleteButton.classList.add("delete-button");
                    userListItem.appendChild(userDeleteButton);
                    userDeleteButton.addEventListener("click", async (e) => {
                        userListItem.remove();
                        const response = await fetch('http://localhost:3005/users/' + `${user.id}`, {
                            method: 'DELETE',
                        });
                        
                    });
                    userListItem.appendChild(userDeleteButton);

                    const userEditButton = document.createElement("button");
                    userEditButton.innerHTML = userEditIcon;
                    userEditButton.classList.add("edit-button");
                    userListItem.appendChild(userEditButton);
                    userEditButton.addEventListener("click", () => {
                        const editedUsername = prompt("Edit username: ");
                        const editedPassword = prompt("Edit password: ");
                        const editedRole = prompt("Edit role: ");    

            
                        if (editedUsername !== null && editedPassword !== null) {
                            const currentButtons = userListItem.querySelectorAll("button");
                            userListItem.textContent = `Username: ${editedUsername} Password: ${editedPassword}, Role: ${editedRole}`;
                            currentButtons.forEach(button => {
                                userListItem.appendChild(button);
                                if (!user.history || user.history.length === 0)  {
                                    userListItem.appendChild(history);
                                    history.textContent = "List is empty";
                                }
                                else {
                                    userListItem.appendChild(history);
                                    history.textContent = user.history;                       
                                }
                            });
                        }
                    });
                    
                    userListItem.appendChild(userEditButton);
                    userItem.appendChild(userListItem); //slutligen skapas userListItemet

                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
            
    };  
        fetchUsers();

});