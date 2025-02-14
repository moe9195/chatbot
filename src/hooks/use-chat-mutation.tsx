import ollama, { Message } from "ollama";

import { useMutation } from "@tanstack/react-query";

export const useChatMutation = () => {
  console.log("HELLO WORLD");
  const { mutateAsync } = useMutation({
    mutationKey: ["chat"],
    mutationFn: (messages: Message[]) => {
      return ollama.chat({
        model: "deepseek-r1:14b",
        messages: messages,
        stream: true,
      });
    },
  });

  const abort = () => ollama.abort();

  return { mutateAsync, abort };
};
