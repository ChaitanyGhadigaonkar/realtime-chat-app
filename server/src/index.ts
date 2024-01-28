import express from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import { events } from "./events";
import { User, UserManager, Message } from "./managers/User";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello From Real Time Chat app</h1>");
});

const userManager = new UserManager();

io.on("connection", (socket: Socket) => {
  console.log(`socket connected with socket id` + socket.id);
  socket.emit(events.HELLO, "world");

  socket.on("join-room", ({ roomId, user }: { roomId: string; user: User }) => {
    socket.join(roomId);
    userManager.joinRoom(roomId, user);
    console.log(user.name + " joined the room " + roomId);
    userManager.broadcastMessages(io, roomId);
    socket.to(roomId).emit("notify", { user });
  });

  socket.on(
    "send-message",
    ({
      message,
      roomId,
      user,
    }: {
      message: { id: string; name: string; message: string; time: any };
      roomId: string;
      user: User;
    }) => {
      userManager.addMessage(roomId, message);
      userManager.broadcastMessages(io, roomId);
    }
  );

  socket.on(
    "upvote-message",
    ({
      messageId,
      user,
      roomId,
    }: {
      messageId: string;
      user: { name: string; id: string };
      roomId: string;
    }) => {
      userManager.upvoteMessage(user, roomId, messageId);
      // console.log(userManager.getMessages(roomId));
      userManager.broadcastMessages(io, roomId);
    }
  );
  socket.on(
    "downvote-message",
    ({
      messageId,
      user,
      roomId,
    }: {
      messageId: string;
      user: { name: string; id: string };
      roomId: string;
    }) => {
      userManager.downvoteMessage(user, roomId, messageId);
      // console.log(userManager.getMessages(roomId));
      userManager.broadcastMessages(io, roomId);
    }
  );

  socket.on(
    "leave-room",
    ({ roomId, user }: { roomId: string; user: User }) => {
      console.log(user.name + "leaves the room");
      socket.leave(roomId);
    }
  );
});

server.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
