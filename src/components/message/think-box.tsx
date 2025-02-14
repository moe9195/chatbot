import { Button, Collapse, Box, Typography } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";

interface ThinkBoxProps {
  thinkBlock: string;
  expanded: boolean;
  isThinking: boolean;
  thoughtFor: number;
  onExpand: () => void;
}

export const ThinkBox = ({ thinkBlock, expanded, isThinking, thoughtFor, onExpand }: ThinkBoxProps) => {
  const cleanThinkBlock = thinkBlock.trim();
  const hasContent = cleanThinkBlock.length > 0;

  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        onClick={hasContent ? onExpand : undefined}
        endIcon={hasContent && (
          <ChevronRight
            sx={{
              transition: "transform 0.2s",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)"
            }}
          />
        )}
      >
        {isThinking ? "Thinking..." : `Thought for ${thoughtFor} seconds`}
      </Button>
      <Collapse in={expanded && hasContent} timeout="auto" unmountOnExit>
        <Box mt={2} p={2} bgcolor="grey.800" borderRadius={1}>
          <Typography variant="body2" fontFamily="monospace">
            {cleanThinkBlock}
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );
};
