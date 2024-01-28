export type MessageType = {
  id: string;
  name: string;
  message: string;
  time: any;
  // type: string;
  upVotes: { count: number; users: string[] };
  downVotes: { count: number; users: string[] };
};
