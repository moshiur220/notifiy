const users = [];
const userGroup = [];

// room join group

export function roomJoin(roomInfo) {
  let room = { id: roomInfo.roomId, status: roomInfo.status };
  userGroup.push(room);
  // console.log(userGroup);
}
// Check room exist
export function roomIdCheck(roomInfo) {
  console.log(userGroup);
  //return userGroup.findIndex((user) => user.id === id);

  if (userGroup.length === 0) {
    console.log("check length ");
    roomJoin(roomInfo);
    return true;
  } else {
    userGroup.forEach((room) => {
      if (room.id !== roomInfo.roomId) {
        console.log("Add new Room");
        roomJoin(roomInfo);
        return true;
      }
    });
  }
  return false;

  //return true;
  // console.log(u);
}
// Join user to chat
export function userJoin(
  id,
  userId,
  firstName,
  lastName,
  email,
  userName,
  avatar,
  deviceId
) {
  const newUser = {
    id,
    userId,
    firstName,
    lastName,
    email,
    userName,
    avatar,
    deviceId,
  };
  const index = users.findIndex((user) => user.deviceId === newUser.deviceId);
  console.log("index", index);
  console.log(index !== -1);
  if (index !== -1) {
    // return users.splice(index, 1)[0];
    return {
      newJoin: {},
      allUser: users,
    };
  } else {
    users.push(newUser);
    return {
      newJoin: newUser,
      allUser: users,
    };
  }
}

// function use filter user by id
export function userFilterById(id) {
  return users.filter((user) => user.userId === id);
}

// Get current user
export function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// Current use fiend
export function sendUserId(userName) {
  return users.find((user) => user.userName === userName);
}

// user id send for message with backend
export function userIdBackendMsg(id) {
  return users.find((user) => user.userId === id);
}
// user socket id send for message with backend
export function userSocketIdBackendMsg(id) {
  return users.find((user) => user.id === id);
}
// User leaves chat
export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    // return users.splice(index, 1)[0];
    return {
      leaveUser: users.splice(index, 1)[0],
      allUser: users,
    };
  }
}

// Get room users
export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

// Coded by romeo
// Get users
export const getAllUsersDevices = (ids) => {
  console.log(ids);
  return users.filter((user) => ids.includes(user.userId));
};

export const getUserDevices = (id) =>
  users.filter((user) => user.userId === id);
