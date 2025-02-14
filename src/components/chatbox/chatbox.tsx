import { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import StopIcon from "@mui/icons-material/Stop";

interface ChatboxProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isHuman: boolean;
}

export const Chatbox = ({ onSend, onStop, isHuman }: ChatboxProps) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const trimmedValue = value.trim();
      if (trimmedValue) {
        setValue("");
        onSend(trimmedValue);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Box display="flex" justifyContent="center" p={2} position="sticky" bottom={0} bgcolor="background.paper" boxShadow={3} borderRadius={2} mb={2}>
      <TextField
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your text here"
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        disabled={!isHuman}
        InputProps={{
          endAdornment: !isHuman && (
            <IconButton onClick={onStop}>
              <StopIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};
