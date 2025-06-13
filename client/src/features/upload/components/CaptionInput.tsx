"use client"

import type React from "react"
import { TextField, Zoom } from "@mui/material"

interface CaptionInputProps {
  value: string
  onChange: (caption: string) => void
  isVisible: boolean
}

const CaptionInput: React.FC<CaptionInputProps> = ({ value, onChange, isVisible }) => {
  if (!isVisible) return null

  return (
    <Zoom in timeout={600}>
      <TextField
        label="Add a caption"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        placeholder="Describe your photo, tell its story..."
        sx={{
          mt: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            background: "rgba(255, 255, 255, 0.8)",
            "& fieldset": {
              borderColor: "rgba(196, 163, 109, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "#C4A36D",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#C4A36D",
              borderWidth: "2px",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
            "&.Mui-focused": {
              color: "#C4A36D",
            },
          },
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Zoom>
  )
}

export default CaptionInput
