import { useSocketContext } from "@/context/socketContext";
import { MessageType, User } from "@/types";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";

const Message = ({
  messageObj: { id, name, message, time, upVotes, downVotes },
  type,
  user,
  roomId,
}: {
  messageObj: MessageType;
  type: string;
  user: { id: string; name: string } | undefined;
  roomId: string;
}) => {
  const context = useSocketContext();
  const handleUpVote = () => {
    context?.socket?.emit("upvote-message", {
      user: user,
      messageId: id,
      roomId,
    });
  };
  const handleDownVote = () => {
    context?.socket?.emit("downvote-message", {
      user: user,
      messageId: id,
      roomId,
    });
  };
  return (
    <div
      className={`flex w-full ${
        type === "send" ? "justify-end" : "justify-start  "
      }`}
    >
      <div
        className={`w-64 h-40 flex flex-col gap-2 rounded-md bg-slate-600 text-white my-2 mx-2 px-2 py-2 `}
      >
        <div className="top text-sm font-semibold flex gap-1 w-full justify-between">
          <h4>{user?.name === name ? "you" : name}</h4>
          <p className="text-slate-400 text-xs text-center">
            {time.toLocaleString()}
          </p>
        </div>
        <div className="message w-full text-clip h-14">{message}</div>
        <div className="bottom w-full flex items-end justify-end font-bold gap-2">
          {upVotes.count - downVotes.count}
          <ArrowBigUp
            className="cursor-pointer"
            fill={upVotes.users.includes((user as User).id) ? "white" : " "}
            onClick={handleUpVote}
          />
          <ArrowBigDown
            className="cursor-pointer"
            onClick={handleDownVote}
            fill={downVotes.users.includes((user as User).id) ? "white" : " "}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
