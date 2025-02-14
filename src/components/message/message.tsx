import { useMemo } from "react";
import "./styles.css";
import "katex/dist/katex.min.css";

import { ThinkBox } from "./think-box";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Explicitly export the types
export interface MessageProps {
  message: string;
  isHuman: boolean;
  expanded: boolean;
  onExpand: () => void;
  isThinking?: boolean;
}

const parseMessage = (message: string) => {
  const OPEN_TAG = "<think>";
  const CLOSE_TAG = "</think>";

  if (message.includes(CLOSE_TAG)) {
    const [thinkBlock, textBlock] = message.split(CLOSE_TAG);
    return { thinkBlock: thinkBlock.replace(OPEN_TAG, ""), textBlock };
  }

  // If we don't have a closing tag but have an opening tag, we're still thinking
  if (message.includes(OPEN_TAG)) {
    return { thinkBlock: message.replace(OPEN_TAG, ""), textBlock: "" };
  }

  return { thinkBlock: "", textBlock: message };
};

const processLatexNotation = (text: string) => {
  return text.replace(/\\\[\n?([\s\S]*?)\n?\\\]/g, (_, p1) => {
    const cleaned = p1.trim();
    return `$$${cleaned}$$`;
  });
};

export const Message = ({
  message,
  isHuman,
  expanded,
  onExpand,
}: MessageProps) => {
  const { textBlock, thinkBlock } = useMemo(
    () => parseMessage(message),
    [message]
  );

  const { processedTextBlock, processedThinkBlock } = useMemo(() => {
    const processedTextBlock = processLatexNotation(textBlock);
    const processedThinkBlock = processLatexNotation(thinkBlock);
    return { processedTextBlock, processedThinkBlock };
  }, [textBlock, thinkBlock]);

  return (
    <div className={isHuman ? "message human" : "message bot"}>
      <div className="content">
        {isHuman ? (
          <div className="avatar-human">MR</div>
        ) : (
          <div className="avatar-bot">DS</div>
        )}
        <div className="response">
          {isHuman ? (
            <div className="text">{message}</div>
          ) : (
            <>
              <ThinkBox
                thinkBlock={processedThinkBlock}
                expanded={expanded}
                onExpand={() => onExpand()}
              />
              <div className="text">
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[
                    [rehypeKatex, { strict: false, trust: true }],
                  ]}
                >
                  {processedTextBlock}
                </Markdown>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
