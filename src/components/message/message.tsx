import { useMemo, useEffect, useState, useRef } from "react";
import "katex/dist/katex.min.css";
import { ThinkBox } from "./think-box";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Card, CardContent, CardHeader, Avatar, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
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
    return {
      thinkBlock: thinkBlock.replace(OPEN_TAG, ""),
      textBlock,
      isThinking: false
    };
  }

  if (message.includes(OPEN_TAG)) {
    return {
      thinkBlock: message.replace(OPEN_TAG, ""),
      textBlock: "",
    };
  }

  return { thinkBlock: "", textBlock: message, };
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
  const thinkingTime = useRef(0);
  const thinkingInterval = useRef<NodeJS.Timeout | null>(null);

  const { textBlock, thinkBlock } = useMemo(
    () => parseMessage(message),
    [message]
  );

  const { processedTextBlock, processedThinkBlock } = useMemo(() => {
    const processedTextBlock = processLatexNotation(textBlock);
    const processedThinkBlock = processLatexNotation(thinkBlock);
    return { processedTextBlock, processedThinkBlock };
  }, [textBlock, thinkBlock]);


  const isThinking = textBlock.length === 0;

  useEffect(() => {
    if (isThinking && !thinkingInterval.current) {
      thinkingInterval.current = setInterval(() => {
        thinkingTime.current += 1;
      }, 1000);
    } else if (!isThinking && thinkingInterval.current) {
      clearInterval(thinkingInterval.current);
      thinkingInterval.current = null;
    }

    return () => {
      if (thinkingInterval.current) {
        clearInterval(thinkingInterval.current);
        thinkingInterval.current = null;
      }
    };

  }, [isThinking]);


  return (
    <Card sx={{ backgroundColor: isHuman ? 'primary.main' : 'secondary.main', color: 'text.primary', mb: 2 }}>
      <CardHeader
        title={isHuman ? 'Human' : 'AI'}
        avatar={
          <Avatar sx={{ bgcolor: isHuman ? 'info.dark' : 'error.dark', width: 36, height: 36 }}>
            {!isHuman && <AutoAwesomeOutlinedIcon sx={{
              width: 18,
              height: 18,
              color: 'primary.main',
            }} />}
          </Avatar>
        }
      />
      <CardContent>
        {isHuman ? (
          <Typography variant="body1">{message}</Typography>
        ) : (
          <>
            <ThinkBox
              thinkBlock={processedThinkBlock}
              expanded={expanded}
                onExpand={onExpand}
                isThinking={isThinking}
                thoughtFor={thinkingTime.current}
              />
              <Typography variant="body1">
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[
                    [rehypeKatex, { strict: false, trust: true }],
                  ]}
                >
                  {processedTextBlock}
                </Markdown>
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};
