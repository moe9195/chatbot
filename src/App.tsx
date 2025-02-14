import { useState } from "react";
import { Box, Button, CircularProgress, Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Chatbox, ChatWindow } from "./components";
import { usePullModel, useChatMutation, useChatHistory } from "./hooks";
import { Message as ChatMessage } from "ollama";

function App() {
  const { messages, setMessages, clearHistory } = useChatHistory();
  const [currentMessage, setCurrentMessage] = useState<ChatMessage | null>(
    null
  );

  const {
    isLoading: isPulling,
    isSuccess: isPulled,
    isError: isErrorPulling,
  } = usePullModel();

  const mutation = useChatMutation();

  const onSendMessage = async (text: string) => {
    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);

    const response = await mutation.mutateAsync([...messages, userMessage]);

    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    for await (const part of response) {
      assistantMessage.content += part.message.content;
      setCurrentMessage({ ...assistantMessage });
    }

    setMessages((prev) => [...prev, { ...assistantMessage }]);
    setCurrentMessage(null);
  };

  const onStop = () => {
    mutation.abort();

    setMessages((prev) => [...prev, { role: "assistant", content: "Stopped" }]);
    setCurrentMessage(null);
  };

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100vh" p={2}>
      {isPulling && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      )}
      {isPulled && (
        <>
          <IconButton
            color="error"
            onClick={clearHistory}
            sx={{ position: "fixed", top: 8, right: 8, borderRadius: "50%", fontSize: 12, width: 32, height: 32, padding: 0 }}
          >
            <ClearIcon />
          </IconButton>
          <ChatWindow messages={messages} currentMessage={currentMessage} />
          <Chatbox
            onSend={onSendMessage}
            onStop={onStop}
            isHuman={currentMessage === null || currentMessage?.role === "user"}
          />
        </>
      )}
      {isErrorPulling && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <Typography variant="h6" color="error">
            Failed to pull model
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default App;
