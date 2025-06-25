
import type React from "react"
import { Box, Divider, Typography, Card, CardMedia, CardContent, Avatar } from "@mui/material"
import { motion } from "framer-motion"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import StarIcon from "@mui/icons-material/Star"
import { useState } from "react"
import type { Challenge } from "../../../types/challenge"
import ErrorSnackbar from "../../../components/pages/Error"

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
          my: 4,
          borderColor: "rgba(255,255,255,0.2)",
          "&::before, &::after": {
            borderColor: "rgba(255,255,255,0.2)",
          },
        }}
      />

      {/* Trophy Header Section with enhanced styling */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          position: "relative",
        }}
      >
        {/* Decorative elements */}
        <Box
          component={motion.div}
          animate={{
            rotate: [0, 360],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          sx={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,163,109,0.15) 0%, rgba(196,163,109,0) 70%)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 3,
            borderRadius: 3,
            bgcolor: "rgba(196, 163, 109, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(196, 163, 109, 0.3)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            component={motion.div}
            animate={{
              y: [0, -4, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(196, 163, 109, 0.2)",
              p: 1.5,
              borderRadius: "50%",
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 36, color: "#C4A36D" }} />
          </Box>

          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#C4A36D",
                fontWeight: 700,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                letterSpacing: "0.5px",
              }}
            >
              The Winning Picture
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                mt: 0.5,
              }}
            >
              Selected by our panel of expert judges
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Challenge Description */}
      <Typography
        variant="body1"
        component={motion.p}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        sx={{
          mb: 5,
          color: "white",
          textAlign: "center",
          maxWidth: 700,
          mx: "auto",
          lineHeight: 1.8,
          fontSize: "1.05rem",
          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          position: "relative",
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            height: "2px",
            width: "60px",
            background:
              "linear-gradient(90deg, rgba(196,163,109,0) 0%, rgba(196,163,109,0.6) 50%, rgba(196,163,109,0) 100%)",
            left: "50%",
            transform: "translateX(-50%)",
          },
          "&::before": {
            top: "-15px",
          },
          "&::after": {
            bottom: "-15px",
          },
          px: 2,
        }}
      >
        {challenge.description}
      </Typography>

      {/* Winner Card with enhanced styling */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        sx={{
          maxWidth: 700,
          mx: "auto",
          mt: 2,
          boxShadow: "0 16px 50px rgba(0,0,0,0.3)",
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(255,255,255,0.4)",
          position: "relative",
        }}
      >
        {/* Award ribbon */}
        <Box
          component={motion.div}
          initial={{ rotate: -15, x: -10 }}
          animate={{ rotate: -15, x: -10 }}
          sx={{
            position: "absolute",
            top: 20,
            left: 0,
            bgcolor: "#C4A36D",
            color: "white",
            py: 0.5,
            px: 3,
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <StarIcon sx={{ fontSize: 16 }} />
          WINNER
        </Box>

        <CardMedia
          component="img"
          image={challenge.winnerImageUrl}
          alt="Winning photo"
          sx={{
            objectFit: "cover",
            height: { xs: 300, sm: 400 },
            width: "100%",
            bgcolor: "#f5f5f5",
            transition: "transform 0.5s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/400?text=Winner+Image+Not+Found"
            setSnackOpen(true)
          }}
        />
        <CardContent
          sx={{
            p: 3,
            background: "linear-gradient(to top, rgba(196,163,109,0.05), rgba(255,255,255,0))",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "rgba(196,163,109,0.2)",
                color: "#C4A36D",
                fontWeight: "bold",
                border: "2px solid #C4A36D",
              }}
            >
              {challenge.winnerUserName?.charAt(0) || "W"}
            </Avatar>
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: "0.85rem",
                  mb: 0.5,
                }}
              >
                Photographer
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {challenge.winnerUserName}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Error Snackbar - keeping the original logic */}
      <ErrorSnackbar
        open={snackOpen}
        onClose={() => setSnackOpen(false)}
        error={{
          message: "Error loading winner image. An alternate image is displayed.",
          response: { status: 404 },
        }}
      />
    </Box>
  )
}
