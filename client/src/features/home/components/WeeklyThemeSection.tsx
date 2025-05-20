
import type React from "react"
import { useEffect, useState } from "react"
import { Box, Typography, Container, Button, Paper } from "@mui/material"
import { motion } from "framer-motion"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FileUploader from "../../upload/components/FileUploader"
import ImageGallery from "../../gallery/components/ImageGallery"
import ThemeCardWithGenerator from "./ThemeCardWithGenerator"
 import api from "../../../lib/axiosConfig"

interface WeeklyThemeSectionProps {
  isLoggedIn: boolean
  showUploader: boolean
  showVoting: boolean
  uploadedFiles: { fileName: string; url: string }[]
  onBack: () => void
  onShowUploader: () => void
  onShowVoting: () => void
  onHideUploader: () => void
  onHideVoting: () => void
}

export const WeeklyThemeSectionWithGenerator: React.FC<WeeklyThemeSectionProps> = ({
  isLoggedIn,
  showUploader,
  showVoting,
  uploadedFiles,
  onBack,
  onShowUploader,
  onShowVoting,
  onHideUploader,
  onHideVoting,
}) => {
  const [theme, setTheme] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await api.get("Challenge/active-challenge")
        const themeData = response.data
        setTheme(themeData)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    fetchTheme()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 10, md: 4 },
        pb: 6,
        backgroundImage: "url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070)",
        backgroundSize: "cover",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(2px)",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              color: "white",
              mb: 4,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Back to Home
          </Button>
        </motion.div>

        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.2)",
            mb: 4,
          }}
        >
          <ThemeHeader />
          <ThemeCardWithGenerator
            theme={theme}
            isLoggedIn={isLoggedIn}
            showUploader={showUploader}
            showVoting={showVoting}
            onShowUploader={onShowUploader}
            onShowVoting={onShowVoting}
          />

          {isLoggedIn && showUploader && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ mt: 4 }}
            >
              <FileUploader />
              <Button
                variant="text"
                onClick={onHideUploader}
                sx={{
                  color: "white",
                  mt: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Cancel Upload
              </Button>
            </Box>
          )}

          {isLoggedIn && showVoting && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ mt: 4 }}
            >
              <ImageGallery uploadedFiles={uploadedFiles} />
              <Button
                variant="text"
                onClick={onHideVoting}
                sx={{
                  color: "white",
                  mt: 2,
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Back to Theme
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}

const ThemeHeader = () => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        borderRadius: "50%",
        bgcolor: "rgba(196, 163, 109, 0.2)",
        mr: 2,
      }}
    >
      <CalendarTodayIcon sx={{ fontSize: 28, color: "#C4A36D" }} />
    </Box>
    <Typography
      variant="h4"
      sx={{
        color: "#C4A36D",
        fontWeight: 700,
        textShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      This Week's Theme
    </Typography>
  </Box>
)
