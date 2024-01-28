import React from "react";

const MediumImportantChat = () => {
  return (
    <div className="w-1/4 border border-stone-500 rounded-md flex flex-col justify-between">
      <div className="h-14 px-2 bg-green-800 text-white flex justify-center items-center flex-col">
        {" "}
        <h3 className="font-semibold text-center">Important Chats</h3>( 3 - 5
        upvotes)
      </div>
      <div className="chat-section flex-1 ">chat section</div>
    </div>
  );
};

export default MediumImportantChat;
