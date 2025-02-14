import "./styles.css";
import { Message } from "../message";
import { useCallback, useState } from "react";
import { Message as ChatMessage } from "ollama";

type ChatWindowProps = {
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
};

export const ChatWindow = ({ messages, currentMessage }: ChatWindowProps) => {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const onExpand = useCallback((index: number) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }));
  }, []);

  const isExpanded = (index: number) => expanded[index] || false;

  const messagesWithCurrentMessage = currentMessage
    ? [...messages, currentMessage]
    : messages;

  return (
    <div className="chat-window">
      {messagesWithCurrentMessage.map((message, index) => {
        return (
          <Message
            key={index}
            message={message.content}
            isHuman={message.role === "user"}
            expanded={isExpanded(index)}
            onExpand={() => onExpand(index)}
          />
        );
      })}
    </div>
  );
};
