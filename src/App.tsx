import { useState } from "react";
import "./App.css";
import { Chatbox, ChatWindow } from "./components";
import { usePullModel, useChatMutation } from "./hooks";
import { Message as ChatMessage } from "ollama";

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const clearAll = () => {
    setMessages([]);
    setCurrentMessage(null);
  };

  return (
    <>
      {isPulling && <div className="loading">Loading...</div>}
      {isPulled && (
        <>
          <button
            style={{
              position: "fixed",
              top: 8,
              right: 8,
              borderRadius: "50%",
              fontSize: 12,
              width: 32,
              height: 32,
              padding: 0,
            }}
            onClick={clearAll}
          >
            X
          </button>
          <ChatWindow messages={messages} currentMessage={currentMessage} />

          <Chatbox
            onSend={onSendMessage}
            onStop={onStop}
            isHuman={currentMessage === null || currentMessage?.role === "user"}
          />
        </>
      )}
      {isErrorPulling && <div className="error">Failed to pull model</div>}
    </>
  );
}

export default App;
