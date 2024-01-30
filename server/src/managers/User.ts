import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface User {
  name: string;
  id: string;
}
export interface Message {
  id: string;
  name: string;
  message: string;
  time: any;
  upVotes: { count: number; users: string[] };
  downVotes: { count: number; users: string[] };
  type: "normal" | "medium" | "most";
}
export interface Room {
  users: User[];
  messages: Message[];
  MediumImpMessages: Message[];
  MostImpMessages: Message[];
}

export class UserManager {
  private rooms: Map<string, Room>;
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  joinRoom(roomId: string, user: User) {
    this.addUser(user, roomId);
  }

  // leaveRoom(roomId: string, user: User) {
  //   this.removeUser(roomId, user.id);
  //   // console.log(this.rooms);
  // }

  addUser(user: User, roomId: string) {
    if (!this.rooms.get(roomId)) {
      // no room is present
      this.rooms.set(roomId, {
        users: [],
        messages: [],
        MediumImpMessages: [],
        MostImpMessages: [],
      });
    }

    // add user to the room
    this.rooms.get(roomId)?.users.push({
      name: user.name,
      id: user.id,
    });
  }

  getUsers(roomId: string) {
    return this.rooms.get(roomId) ? this.rooms.get(roomId)?.users : [];
  }

  getUser(roomId: string, userId: string): User | null {
    return (
      this.rooms.get(roomId)?.users.find((user) => user.id === userId) ?? null
    );
  }

  addMessage(
    roomId: string,
    message: { id: string; name: string; message: string; time: any }
  ) {
    const upVotes = { count: 0, users: [] };
    const downVotes = { count: 0, users: [] };
    this.rooms.get(roomId)?.messages.push({
      id: message.id,
      name: message.name,
      message: message.message,
      time: message.time,
      type: "normal",
      upVotes,
      downVotes,
    });
  }
  getMessages(roomId: string) {
    // console.log(this.rooms.get(roomId)?.messages);
    return this.rooms.get(roomId)?.messages;
  }

  upvoteMessage(user: User, roomId: string, messageId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.messages.forEach((message) => {
        if (message.id === messageId) {
          if (!message.upVotes.users.includes(user.id)) {
            message.upVotes.count += 1;
            const diff = message.upVotes.count - message.downVotes.count;
            if (diff >= 3 && diff <= 5) {
              message.type = "medium";
            }
            if (diff > 5) {
              // TODO: change 5 to 10
              message.type = "most";
            }
            message.upVotes.users.push(user.id);
            message.downVotes.users = message.downVotes.users.filter(
              (id) => id !== user.id
            );
          }
        }
      });
    }
  }
  downvoteMessage(user: User, roomId: string, messageId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.messages.forEach((message) => {
        if (message.id === messageId) {
          if (!message.downVotes.users.includes(user.id)) {
            message.downVotes.count += 1;

            const diff = message.upVotes.count - message.downVotes.count;
            if (diff >= 3 && diff <= 5) {
              message.type = "medium";
            }
            if (diff < 3) {
              message.type = "normal";
            }

            message.downVotes.users.push(user.id);
            message.upVotes.users = message.upVotes.users.filter(
              (id) => id !== user.id
            );
          }
        }
      });
    }
  }
  broadcastMessages(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    roomId: string
  ) {
    const room = this.rooms.get(roomId);
    if (room) {
      io.to(roomId).emit("messages", {
        messages: room.messages,
      });
    }
  }
}
