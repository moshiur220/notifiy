import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  roomIdCheck,
  roomJoin,
  sendUserId,
  userIdBackendMsg,
  userJoin,
  userLeave,
  userFilterById,
} from "./libs/users.js";
import { formatMessage } from "./libs/message.js";
import audioCall from "./events/audioCall.js";
import { reactNotificationEvent } from "./events/userNotification.js";

//************* initialize the app ********************

dotenv.config();
const app = express();
//New Server Create
const server = http.createServer(app);
// Socket New instance create
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8080;
// app.options('*', cors())

// web url test

app.get("/", (req, res) => {
  res.send("Server running....");
});
//*************** */ Socket start and middleware ********************

io.on("connection", (socket) => {
  console.log("new user connect");
  // user event
  socket.on(
    "connectDisconnect",
    ({ userId, firstName, lastName, email, userName, avatar, deviceId }) => {
      // console.log({ firstName, lastName, email, userName, avatar });
      // console.log(userId);

      const userList = userJoin(
        socket.id,
        userId,
        firstName,
        lastName,
        email,
        userName,
        avatar,
        deviceId
      );
      console.log(userList);
      io.emit("userList", userList);
    }
  );

  // New room connection
  socket.on("newRoomConnect", (roomInfo) => {
    socket.join(roomInfo.roomId);
    io.to(roomInfo.roomId).emit("group event", "Group Message");
  });

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("broadcast", `server: ${msg}`);
  });

  // user userIdSendMessage
  socket.on("userIdSendMessage", (userId) => {
    console.log(userId);
    const backendUser = userIdBackendMsg(userId);
    console.log(backendUser);

    if (backendUser) {
      io.to(backendUser.id).emit("backendUserId", backendUser);
    }
  });
  // Private chat event here
  socket.on("textMessage", ({ users, roomId, message }) => {
    console.log(users);
    // console.log(message);
    users.forEach((callId) => {
      // let backendUser = userIdBackendMsg(callId);
      let userFilter = userFilterById(callId);
      console.log("------------ userFilter ------------");
      console.log(userFilter);
      userFilter.forEach((backendUser) => {
        console.log(backendUser);
        if (backendUser) {
          io.to(backendUser.id).emit("message", { roomId, message });
        }
      });
    });
  });
  // frontend call even
  socket.on("call_frontend", (data) => {
    console.log(data.receivers);
    data.receivers.forEach((callId) => {
      let backendUser = userIdBackendMsg(callId);
      if (backendUser) {
        io.to(backendUser.id).emit("server_call_receive", {
          backendUser,
          callStatus: data,
          // fromUser: data.fromUser,
        });
      }
    });
  });

  // return and send call
  socket.on("returnCallFrontend", ({ userId, data }) => {
    let callId = uuidv4();
    // console.log(data);
    console.log("userId: " + userId);
    console.log("here iam");
    const backendUser = userIdBackendMsg(userId);
    console.log("backendUser: " + JSON.stringify(backendUser));
    if (backendUser) {
      io.to(socket.id).emit("serverCallReceiveUrl", { data: data, callId });
      io.to(backendUser.id).emit("serverCallReceiveUrl", {
        data: data,
        callId,
      });
    }
  });
  // custom event
  socket.on("message", (data) => {
    console.log(data);
  });

  // react  event here (user react) post
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

  // listen data from frontend react global event
  socket.on("fanReactStatus", (data) => {
    console.log("---------------- fanReactStatus ----------------");
    console.log(data);
    socket.broadcast.emit("backFanReactStatus", data);
  });

  // hie

  // Socket disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // leave from socket
    const userList = userLeave(socket.id);
    console.log("userLeave");
    console.log(userList);
    socket.emit("userList", userList);
  });

  // function react event

  // reactNotificationEvent(socket, io);
  // Coded by Romeo
  // audioCall(socket, io);
});
//**************** start the server ********************
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
