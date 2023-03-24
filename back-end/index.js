const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { actions } = require("./actions");

const http = require("http");
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  // console.log('socket connected', socket.id)

  socket.on(actions.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(actions.JOINED, {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  socket.on(actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(actions.CODE_CHANGE, { code });
  });

  socket.on(actions.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(actions.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(actions.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(5000, () => {
  console.log(`Listening... on PORT ${PORT}`);
});
