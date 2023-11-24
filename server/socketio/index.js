module.exports = (io) => {
  function getActiveUsers(roomId) {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      const users = [];
      for (const socketId of room) {
        const socket = io.sockets.sockets.get(socketId);
        users.push(socket.userData);
      }
      return users;
    } else {
      return [];
    }
  }

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("audio", (data) => {
      console.log(data);
    });
    socket.on("hello", (data, cb) => {
      console.log(data);
      cb("hello from server");
    });

    // socket.on("room:join", (data, cb) => joinRoom(data, cb, socket));
    // socket.on("room:leave", (data, cb) => leaveRoom(data, cb, socket));
    // socket.on("onEmotion", (data, cb) => leaveRoom(data, cb, socket));

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
    socket.getActiveUsers = getActiveUsers;
  });
};
