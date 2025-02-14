type ChevronProps = {
  expanded: boolean;
};

const Chevron = ({ expanded }: ChevronProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      style={{
        marginLeft: "8px",
        display: "inline-block",
        transition: "transform 0.2s ease",
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
      }}
    >
      <path
        d="M9 18L15 12L9 6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

type ThinkBoxProps = {
  thinkBlock: string;
  expanded: boolean;
  onExpand: () => void;
  isThinking?: boolean;
};

export const ThinkBox = ({ thinkBlock, expanded, onExpand, isThinking = true }: ThinkBoxProps) => {
  const hasContent = thinkBlock.trim().length > 0;
  
  return (
    <div>
      <button 
        className="think-button" 
        onClick={hasContent ? onExpand : undefined}
      >
        {isThinking ? "Thinking..." : "Done"}
        {(isThinking || hasContent) && <Chevron expanded={expanded} />}
      </button>

      {expanded && hasContent && <div className="think">{thinkBlock}</div>}
    </div>
  );
};
