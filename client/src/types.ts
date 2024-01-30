export type MessageType = {
  id: string;
  name: string;
  message: string;
  time: any;
  type: "normal" | "medium" | "most";
  upVotes: { count: number; users: string[] };
  downVotes: { count: number; users: string[] };
};

export type User = {
  id: string;
  name: string;
};
