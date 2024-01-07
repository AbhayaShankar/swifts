const { Server } = require("socket.io");

const io = new Server({
  cors: "http://localhost:5173",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("New Socket Connection", socket.id);

  //   listen to a connection and keep track of socket id and userId for a user.
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("Online Users", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
