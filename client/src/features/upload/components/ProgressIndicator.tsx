import type React from "react"
import { Box, Typography, LinearProgress, Fade } from "@mui/material"

interface ProgressIndicatorProps {
  progress: number
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress }) => {
  if (progress <= 0) return null

  return (
    <Fade in timeout={300}>
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            Uploading your photo...
          </Typography>
          <Typography variant="body2" sx={{ color: "#C4A36D", fontWeight: 600 }}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "rgba(196, 163, 109, 0.1)",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #C4A36D 0%, #d4a574 100%)",
              borderRadius: 4,
              boxShadow: "0 2px 4px rgba(196, 163, 109, 0.3)",
            },
          }}
        />
        <Box sx={{ mt: 1, textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Please don't close this window while uploading
          </Typography>
        </Box>
      </Box>
    </Fade>
  )
}

export default ProgressIndicator
