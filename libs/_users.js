const users = [];

// Join user to chat
export function userJoin(id, userId, firstName, lastName, email, userName, avatar) {
    const user = { id, userId, firstName, lastName, email, userName, avatar };

    users.push(user);

    return {
        newJoin: user,
        allUser: users
    };
}

// Get current user
export function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// Current use fiend 
export function sendUserId(userName) {
    return users.find(user => user.userName === userName)
}

// user id send for message with backend 
export function userIdBackendMsg(id) {
    return users.find(user => user.userId === id)
}
// user socket id send for message with backend 
export function userSocketIdBackendMsg(id) {
    return users.find(user => user.id === id)
}
// User leaves chat
export function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        // return users.splice(index, 1)[0];
        return {
            leaveUser: users.splice(index, 1)[0],
            allUser: users

        }
    }
}

// Get room users
export function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}
