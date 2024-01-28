import React, { useEffect, useLayoutEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Message from "./Message";
import { useSocketContext } from "@/context/socketContext";
import { MessageType } from "@/types";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dateFormatter from "@/lib/dateFormatter";
import { v4 as uuidV4 } from "uuid";

const formSchema = z.object({
  message: z.string().min(1, {
    message: "Message cannot be empty",
  }),
});

const MainChat = ({
  room,
  user,
}: {
  room: string;
  user: { id: string; name: string } | undefined;
}) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const context = useSocketContext();

  useLayoutEffect(() => {
    context?.socket?.on(
      "messages",
      ({ messages }: { messages: MessageType[] }) => {
        setMessages(messages);
      }
    );
  }, [context?.socket]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const messageId = uuidV4();
    context?.socket?.emit("send-message", {
      message: {
        id: messageId,
        name: user?.name,
        message: values.message,
        time: dateFormatter(new Date()),
      },
      roomId: room,
      user,
    });
    // setMessages([
    //   ...messages,
    //   {
    //     id: messageId,
    //     name: user?.name as string,
    //     message: values.message,
    //     time: dateFormatter(new Date()),
    //     up: 0,
    //     noOfUpVotes: 1,
    //   },
    // ]);
    form.setValue("message", "");
  }

  return (
    <div className="w-2/4 border border-stone-500 rounded-md flex flex-col justify-between ">
      <div className="h-14 px-2 bg-slate-500 text-white flex justify-center items-center">
        {" "}
        <h3 className="font-semibold text-center">Main Chat</h3>
      </div>
      <div className="chat-section h-[700px] overflow-y-auto">
        {messages &&
          messages.map((message) => {
            return (
              <Message
                key={message.id}
                messageObj={message}
                type={message.name === user?.name ? "send" : "receive"}
                user={user}
                roomId={room}
              />
            );
          })}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-center gap-4"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter message"
                    {...field}
                    className="w-64"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="py-0.5"
          >
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default MainChat;
