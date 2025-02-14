import { useCallback, useState } from "react";
import { Box } from "@mui/material";
import { Message } from "../message";
import { Message as ChatMessage } from "ollama";

interface ChatWindowProps {
  messages: ChatMessage[];
  currentMessage: ChatMessage | null;
}

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
    <Box display="flex" flexDirection="column" gap={2} p={2}>
      {messagesWithCurrentMessage.map((message, index) => (
        <Message
          key={index}
          message={message.content}
          isHuman={message.role === "user"}
          expanded={isExpanded(index)}
          onExpand={() => onExpand(index)}
        />
      ))}
    </Box>
  );
};
