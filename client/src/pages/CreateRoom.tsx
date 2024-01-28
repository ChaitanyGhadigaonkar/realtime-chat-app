import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "@/context/socketContext";
import { events } from "@/events";

const CreateRoom = () => {
  const context = useSocketContext();
  const navigate = useNavigate();
  const createRoomSchema = z.object({
    name: z
      .string({ required_error: "name is required" })
      .min(5, "minimum 5 character name")
      .max(25),
    roomId: z.string(),
  });

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      roomId: "",
    },
  });

  function onSubmit(values: z.infer<typeof createRoomSchema>) {
    navigate(`/room/${values.roomId}`, {
      state: { name: values.name, roomId: values.roomId },
    });
  }

  return (
    <div className="flex-1 mx-auto w-3/4">
      <h1 className="text-primary font-semibold text-xl text-center my-4">
        Create or Join Room
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=""
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="roomId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Room Id</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Room Id"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              variant={"default"}
              className="my-2"
            >
              Create Room
            </Button>
            <Button
              className="my-2 py-2"
              variant={"outline"}
              onClick={() => {
                form.setValue("roomId", uuidV4());
              }}
            >
              Generate Room Id
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateRoom;
