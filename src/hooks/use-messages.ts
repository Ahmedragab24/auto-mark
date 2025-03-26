import { useState } from "react";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "other";
  timestamp: Date;
  image?: string;
}

export function useMessages(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const sendMessage = (content: string, image?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      image,
    };
    setMessages([...messages, newMessage]);
  };

  return {
    messages,
    sendMessage,
  };
}
