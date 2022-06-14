import { getAllUsersDevices } from "../libs/users.js";
const audioCall = (socket, io) => {
  socket.on("audioCall", (data) => {
    const allUserDevices = getAllUsersDevices(data.receivers);
    allUserDevices.length > 0 &&
      allUserDevices.map((device) => {
        io.to(device.id).emit("receiveAudioCall", {
          message: "Success",
          callId: data.callId,
        });
      });
    io.to(socket.id).emit("responseAudioCall", {
      message: "Success",
      callId: data.callId,
    });
  });
};

export default audioCall;
