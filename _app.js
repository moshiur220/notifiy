import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  sendUserId,
  userIdBackendMsg,
  userJoin,
  userLeave,
} from "./libs/users.js";
import { formatMessage } from "./libs/message.js";

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
    ({ userId, firstName, lastName, email, userName, avatar }) => {
      // console.log({ firstName, lastName, email, userName, avatar });
      // console.log(userId);
      const userList = userJoin(
        socket.id,
        userId,
        firstName,
        lastName,
        email,
        userName,
        avatar
      );
      console.log(userList);
      io.emit("userList", userList);
    }
  );

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
  socket.on("textMessage", (data) => {
    const sendUser = sendUserId(data.userName);
    // console.log(data);
    // console.log(sendUserId(data.userName));
    io.to(socket.id).emit("message", formatMessage(data, "me"));
    console.log(formatMessage(data, "me"));
    if (sendUser) {
      console.log("login from others");
      console.log(sendUser);
      console.log(formatMessage(data, "to"));
      io.to(sendUser.id).emit("message", formatMessage(data, "to"));
    }
    //oi.to(data.id).emit('message', message)
  });
  // frontend call even
  socket.on("call_frontend", (data) => {
    console.log(data);
    const backendUser = userIdBackendMsg(data.toUser);
    console.log(backendUser);

    if (backendUser) {
      io.to(backendUser.id).emit("server_call_receive", {
        backendUser,
        fromUser: data.fromUser,
      });
    }
    // server send call emit
    // io.to(sendUser.id).emit('server_call_receive', formatMessage(data.fromUser, "fromCall"))
  });

  // return and send call
  socket.on("returnCallFrontend", (userId) => {
    let callId = uuidv4();
    console.log(userId);
    const backendUser = userIdBackendMsg(userId);
    // console.log(backendUser);
    if (backendUser) {
      io.to(socket.id).emit("serverCallReceiveUrl", { data: null, callId });
      io.to(backendUser.id).emit("serverCallReceiveUrl", {
        data: backendUser,
        callId,
      });
    }
  });
  // custom event
  socket.on("message", (data) => {
    console.log(data);
  });

  // listen data from frontend react global event
  socket.on("fanReactStatus", (data) => {
    console.log(data);
    socket.broadcast.emit("backFanReactStatus", data);
  });

  // hie

  // Socket disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // leave from socket
    const userList = userLeave(socket.id);
    socket.emit("userList", userList);
  });
});

//**************** start the server ********************
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
