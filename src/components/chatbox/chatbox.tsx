import { useState } from "react";
import "./styles.css";

type ChatboxProps = {
  onSend: (text: string) => void;
  onStop: () => void;
  isHuman: boolean;
};

export const Chatbox = ({ onSend, onStop, isHuman }: ChatboxProps) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (event.shiftKey) {
        setValue((prevValue) => prevValue + "\n");
      } else {
        const trimmedValue = value.trim();
        if (trimmedValue) {
          setValue("");
          onSend(trimmedValue); // Just call onSend, remove the setMessages call
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="chatbox">
      <div className="textarea-container">
        <textarea
          value={value}
          className={"textarea" + (!isHuman ? " disabled" : "")}
          placeholder="Enter your text here"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          disabled={!isHuman}
        />
        {!isHuman && (
          <button className="stop-button" onClick={onStop}>
            <div className="stop-icon"></div>
          </button>
        )}
      </div>
    </div>
  );
};
