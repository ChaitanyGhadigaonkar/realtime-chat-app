import ImportantChat from "@/components/ImportantChat";
import MainChat from "@/components/MainChat";
import MediumImportantChat from "@/components/MediumImportantChat";
import { SocketContextType, useSocketContext } from "@/context/socketContext";
import { MessageType } from "@/types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v1 as uuidV4 } from "uuid";

const Room = () => {
  const [room, setRoom] = useState("");

  const [user, setUser] = useState<undefined | { name: string; id: string }>();
  const [messages, setMessages] = useState<MessageType[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const context: SocketContextType | undefined = useSocketContext();

  useEffect(() => {
    if (!location.state && !location.state?.name && !location.state?.roomId) {
      navigate("/create-room");
    } else {
      setRoom(location.state.roomId);
      setUser({ name: location.state.name, id: uuidV4() });
    }
  }, []);

  useEffect(() => {
    context?.socket?.emit("join-room", {
      roomId: room,
      user: { id: user?.id, name: user?.name },
    });
    context?.socket?.on(
      "messages",
      ({ messages }: { messages: MessageType[] }) => {
        setMessages(messages);
      }
    );

    return () => {
      context?.socket?.emit("leave-room", {
        roomId: room,
        user: { id: user?.id, name: user?.name },
      });
    };
  }, [context?.socket, user]);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-2 ">
      <h1 className="font-semibold font-sans text-xl">Room : {room} </h1>

      <div className="flex flex-1 w-full gap-4">
        <div className="chat flex flex-1 h-full gap-4">
          <MainChat
            room={room}
            user={user}
            messages={messages}
          />
          <MediumImportantChat
            room={room}
            user={user}
            messages={messages}
          />
          <ImportantChat
            room={room}
            user={user}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
};

export default Room;
