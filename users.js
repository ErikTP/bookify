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
                    userListItem.classList.add("user", user.userId);

                    const span = document.createElement("span");
                    span.textContent = `Username: ${user.username} Password: ${user.password}, Role: ${user.role}, User ID: ${user.id}`;
                    userListItem.appendChild(span);

                    const history = document.createElement("details");
                    if (!user.history || user.history.length === 0) {
                        history.textContent = "List is empty";
                    } else {
                        history.textContent = user.history.join(", ");
                    }
                    userListItem.appendChild(history);

                    // Delete Button
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

                    // Edit Button
                    const userEditButton = document.createElement("button");
                    userEditButton.innerHTML = userEditIcon;
                    userEditButton.classList.add("edit-button");
                    userListItem.appendChild(userEditButton);
                    userEditButton.addEventListener("click", async () => {
                        const editedUsername = prompt("Edit username: ");
                        const editedPassword = prompt("Edit password: ");
                        const editedRole = prompt("Edit role: ");
                        const editedUser = {
                            username: editedUsername,
                            password: editedPassword,
                            role: editedRole
                        };

                        if (editedUsername && editedPassword) {
                            try {
                                const response = await fetch('http://localhost:3005/users/' + `${user.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(editedUser),
                                });

                                if (response.ok) {
                                    const updatedUser = await response.json();

                                    span.textContent = `Username: ${updatedUser.username} Password: ${updatedUser.password}, Role: ${updatedUser.role}`;
                                    history.textContent = updatedUser.history ? updatedUser.history.join(", ") : "List is empty";
                                } else {
                                    console.log("Error updating user.");
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    });

                    usersContainer.appendChild(userListItem);
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

    };

    fetchUsers();
});
