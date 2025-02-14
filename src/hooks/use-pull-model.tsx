import { useQuery } from "@tanstack/react-query";
import ollama from "ollama";

export const usePullModel = () => {
  const query = useQuery({
    queryKey: ["pull-model"],
    queryFn: () => {
      return ollama.pull({
        model: "deepseek-r1:14b",
      });
    },
  });

  return query;
};
