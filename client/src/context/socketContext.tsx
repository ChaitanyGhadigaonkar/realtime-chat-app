import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { connectToSocket } from "@/socket";
import { events } from "@/events";

export interface SocketContextType {
  socket: Socket | undefined;
  setSocket: (state: Socket) => void;
  joinRoom: (roomId: string, name: string) => void;
}

export const socketContext = createContext<SocketContextType | undefined>({
  socket: undefined,
  setSocket: () => {},
  joinRoom: () => {},
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket>();

  function joinRoom(roomId: string, name: string) {
    socket?.emit(events.JOIN_ROOM, { roomId, name });
  }

  useEffect(() => {
    const newSocket = connectToSocket().connect();
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket, setSocket, joinRoom }}>
      {children}
    </socketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(socketContext);
  return context;
};
