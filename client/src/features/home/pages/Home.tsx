
import { useState, useEffect, useContext } from "react"
import { Box, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { HomeBackground } from "../components/HomeBackground"
import { HomeContent } from "../components/HomeContent"
import { UserContext } from "../../../context/UserContext"
import { WeeklyThemeSectionWithGenerator } from "../components/WeeklyThemeSection"
import PreviousChallenges from "../../challenges/pages/PreviousChallenges"
import { fetchImageUpload } from "../../../services/image"
const Home = () => {
  const [showPreviousChallenges, setShowPreviousChallenges] = useState(false)
  const [showWeeklyTheme, setShowWeeklyTheme] = useState(false)
  const [showUploader, setShowUploader] = useState(false)
  const [showVoting, setShowVoting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; url: string }[]>([])

  const context = useContext(UserContext)
  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }

  const { state } = context
  const isLoggedIn = !!state.name

  // Reset states when component mounts
  useEffect(() => {
    setShowUploader(false)
    setShowVoting(false)
  }, [])

  const getToken = () => localStorage.getItem("token")

  // פונקציה לשליפת הקבצים שהועלו
  const fetchUploadedFiles = async () => {
    try {
      const token = getToken()
      if (!token) return

      console.log("Fetching uploaded files...")

      // const response = await api.get("upload", {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      const response = await fetchImageUpload(token);
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid response data:", response.data)
        return
      }

      console.log("Files received:", response.data)

      // מכין מערך של אובייקטים עם שם הקובץ
      const files = response.data.map((fileName: string) => ({
        fileName,
        url: "",
      }))

      setUploadedFiles(files)
    } catch (error) {
      console.error("שגיאה בהבאת רשימת הקבצים:", error)
    }
  }

  useEffect(() => {
    if (showVoting) {
      fetchUploadedFiles()
    }
  }, [showVoting])

  // If showing previous challenges, render that component
  if (showPreviousChallenges) {
    return (
      <>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowPreviousChallenges(false)}
          sx={{
            color: "white",
            m: 4,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Back to Home
        </Button>
        <PreviousChallenges />
      </>
    )
  }

  // If showing the weekly theme section
  if (showWeeklyTheme) {
    return (
      <WeeklyThemeSectionWithGenerator
        isLoggedIn={isLoggedIn}
        showUploader={showUploader}
        showVoting={showVoting}
        uploadedFiles={uploadedFiles}
        onBack={() => {
          setShowWeeklyTheme(false)
          setShowUploader(false)
          setShowVoting(false)
        }}
        onShowUploader={() => {
          setShowUploader(true)
          setShowVoting(false)
        }}
        onShowVoting={() => {
          setShowVoting(true)
          setShowUploader(false)
        }}
        onHideUploader={() => setShowUploader(false)}
        onHideVoting={() => setShowVoting(false)}
      />
    )
  }

  // Otherwise render the home page
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: { xs: 10, md: 0 },
      }}
    >
      <HomeBackground />
      <HomeContent
        onShowWeeklyTheme={() => setShowWeeklyTheme(true)}
        onShowPreviousChallenges={() => setShowPreviousChallenges(true)}
      />
    </Box>
  )
}

export default Home

