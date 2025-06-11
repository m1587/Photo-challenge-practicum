
import { Box, CircularProgress, Typography, LinearProgress } from "@mui/material"
import { motion } from "framer-motion"

interface LoadingSpinnerProps {
  message?: string
  progress?: number
  variant?: "circular" | "linear" | "dots"
  size?: "small" | "medium" | "large"
}

export const LoadingSpinner = ({
  message = "Loading...",
  progress,
  variant = "circular",
  size = "medium",
}: LoadingSpinnerProps) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  }

  if (variant === "dots") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
                }}
              />
            </motion.div>
          ))}
        </Box>
        <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
          {message}
        </Typography>
      </Box>
    )
  }

  if (variant === "linear") {
    return (
      <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
        <Typography variant="body2" sx={{ mb: 2, textAlign: "center", color: "#64748b" }}>
          {message}
        </Typography>
        <LinearProgress
          variant={progress !== undefined ? "determinate" : "indeterminate"}
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(196, 163, 109, 0.1)",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(90deg, #C4A36D 0%, #d4a574 100%)",
              borderRadius: 4,
            },
          }}
        />
        {progress !== undefined && (
          <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1, color: "#64748b" }}>
            {Math.round(progress)}%
          </Typography>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <CircularProgress
          size={sizeMap[size]}
          thickness={4}
          sx={{
            color: "#C4A36D",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </motion.div>
      <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  )
}
