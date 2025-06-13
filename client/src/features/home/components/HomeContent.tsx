
import type React from "react"
import { Box, Container, Typography, Button } from "@mui/material"
import { motion } from "framer-motion"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"

interface HomeContentProps {
  onShowWeeklyTheme: () => void
  onShowPreviousChallenges: () => void
}

export const HomeContent: React.FC<HomeContentProps> = ({ onShowWeeklyTheme, onShowPreviousChallenges }) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          p: 4,
          borderRadius: 4,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          maxWidth: 800,
          mx: "auto",
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 2,
            borderRadius: "50%",
            bgcolor: "rgba(196, 163, 109, 0.2)",
          }}
        >
          <CameraAltIcon sx={{ fontSize: 40, color: "#C4A36D" }} />
        </Box>

        <Typography
          variant="h2"
          component={motion.h2}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 50%, #f59e0b 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 800,
            mb: 2,
            textShadow: "0 4px 20px rgba(196, 163, 109, 0.3)",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            letterSpacing: "-0.02em",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              background: "linear-gradient(90deg, transparent, #C4A36D, transparent)",
              borderRadius: "2px",
            },
          }}
        >
          Weekly Photo Contest
        </Typography>

        <Typography
          variant="h5"
          component={motion.p}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            color: "white",
            mb: 4,
            maxWidth: 600,
            lineHeight: 1.7,
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            fontWeight: 400,
            letterSpacing: "0.01em",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "40px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              borderRadius: "1px",
            },
          }}
        >
          Join our exciting weekly themed photography contests! Each week features a new creative challenge for you to
          showcase your unique perspective. Upload your best shots, vote for your favorites, and get recognized for your
          talent.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            variant="contained"
            size="large"
            endIcon={<CalendarTodayIcon />}
            onClick={onShowWeeklyTheme}
            sx={{
              bgcolor: "#C4A36D",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#b3926a",
              },
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            This Week's Theme
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<EmojiEventsIcon />}
            onClick={onShowPreviousChallenges}
            sx={{
              borderColor: "rgba(255,255,255,0.5)",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            View Past Winners
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
