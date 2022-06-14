import { userFilterById } from "../libs/users.js";

export const reactNotificationEvent = (socket, io) => {
  // call socket raise event
  console.log("------------ React Event data ------------");
  socket.on("reactEvent", ({ users, data }) => {
    console.log(users);

    console.log(data);
    // console.log(message);
    users.forEach((callId) => {
      // let backendUser = userIdBackendMsg(callId);

      let userFilter = userFilterById(callId);
      console.log("------------ React Event ------------");
      console.log(userFilter);
      userFilter.forEach((backendUser) => {
        console.log(backendUser);
        if (backendUser) {
          io.to(backendUser.id).emit("reactEventBackend", { data });
        }
      });
    });
  });
};
