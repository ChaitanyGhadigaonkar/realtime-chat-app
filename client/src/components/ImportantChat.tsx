import { MessageType } from "@/types";

import Message from "./Message";

const ImportantChat = ({
  messages,
  user,
  room,
}: {
  messages: MessageType[];
  user: { id: string; name: string } | undefined;
  room: string;
}) => {
  return (
    <div className="w-1/4 border border-stone-500 rounded-md flex flex-col justify-between">
      <div className="h-14 px-2 bg-red-800 text-white flex justify-center items-center flex-col">
        {" "}
        <h3 className="font-semibold text-center">Important Chats</h3>( 10
        upvotes)
      </div>
      <div className="chat-section flex-1 ">chat section</div>
      <div className="chat-section h-[700px] overflow-y-auto">
        {messages &&
          messages.map((message) => {
            return (
              message.type === "most" && (
                <Message
                  key={message.id}
                  messageObj={message}
                  type={message.name === user?.name ? "send" : "receive"}
                  user={user}
                  roomId={room}
                />
              )
            );
          })}
      </div>
    </div>
  );
};

export default ImportantChat;
