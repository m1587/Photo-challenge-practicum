import type React from "react"
import { Box, Divider, Typography, Card, CardMedia, CardContent, Snackbar, Alert } from "@mui/material"
import { motion } from "framer-motion"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import { useState } from "react"
import { Challenge } from "../../../types/challenge"
interface WinnerDisplayProps {
  challenge: Challenge
}

export const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ challenge }) => {
  const [snackOpen, setSnackOpen] = useState(false)
  if (!challenge.winnerImageUrl) return null

  return (
    <Box
      sx={{ mt: 6 }}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Divider
        sx={{
          my: 3,
          borderColor: "rgba(255,255,255,0.2)",
          "&::before, &::after": {
            borderColor: "rgba(255,255,255,0.2)",
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(196, 163, 109, 0.2)",
          }}
        >
          <EmojiEventsIcon sx={{ fontSize: 28, color: "#C4A36D" }} />
          <Typography
            variant="h5"
            sx={{
              color: "#C4A36D",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            The winning picture
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: "white",
          textAlign: "center",
          maxWidth: 700,
          mx: "auto",
          lineHeight: 1.6,
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {challenge.description}
      </Typography>

      <Card
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          maxWidth: 700,
          mx: "auto",
          mt: 2,
          boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "white",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
      >
        <CardMedia
          component="img"
          image={challenge.winnerImageUrl}
          alt="Winning photo"
          sx={{
            objectFit: "cover",
            height: 400,
            width: "100%",
            bgcolor: "#f5f5f5",
          }}
          onError={(e) => {
            console.error("Error loading winner image")
              ; (e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Winner+Image+Not+Found"
            setSnackOpen(true)
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="body1"
            sx={{
              color: "#333",
              fontStyle: "italic",
              textAlign: "center",
              fontSize: "1.1rem",
            }}
          >
            {challenge.winnerUserName}
          </Typography>
        </CardContent>
      </Card>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error loading winner image. An alternate image is displayed.
        </Alert>
      </Snackbar>
    </Box>
  )
}

