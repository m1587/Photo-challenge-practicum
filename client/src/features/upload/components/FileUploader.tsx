
import type React from "react"
import { useState, useContext, useEffect } from "react"
import { Box, Grid, Paper, Fade, Slide, CircularProgress } from "@mui/material"
import { UserContext } from "../../../context/UserContext"
import axios from "axios"
import { UploadForm } from "./UploadForm"
import { UploadHeader } from "./UploadHeader"
import { fetchAddImage, fetchPresignedUrl } from "../../../services/image"
import { fetchActiveChallengeId, fetchIsUploaded } from "../../../services/challenge"
import ErrorSnackbar from "../../../components/pages/Error"
import SuccessSnackbar from "../../../components/pages/Success"
const FileUploader = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("Your Component must be used within a UserProvider")

  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentCaption, setCurrentCaption] = useState<string>("")
  const [isCaptionUpdated, setIsCaptionUpdated] = useState(false)
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const getToken = () => localStorage.getItem("token")

  useEffect(() => {
    const fetchActiveChallenge = async () => {
      try {
        const token = getToken()
        const response = await fetchActiveChallengeId(token)
        setActiveChallengeId(response.data.id)
      } catch (error) {
        showSnackbar("Error retrieving active challenge", "warning")
      }
    }

    fetchActiveChallenge()
  }, [])

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message)
    setIsError(severity === "error" || severity === "warning")
    setSnackbarOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setIsCaptionUpdated(false)
      setProgress(0)
    }
  }

  const checkIfUserUploaded = async () => {
    if (!activeChallengeId) {
      return true
    }
    try {
      const token = getToken()
      const response = await fetchIsUploaded(token, context.state.id, activeChallengeId)
      if (response.data.hasUploaded) {
        showSnackbar("You can only upload one photo per challenge", "warning")
        return true
      }
      return false
    } catch (error) {
      showSnackbar("Error checking upload status", "warning")
      return false
    }
  }

  const handleUpload = async () => {
    if (!file || !activeChallengeId) return

    const hasAlreadyUploaded = await checkIfUserUploaded()
    if (hasAlreadyUploaded) {
      return
    }

    setIsUploading(true)

    try {
      const token = getToken()
      const response = await fetchPresignedUrl(token, file.name)
      const presignedUrl = response.data.url

      await axios.put(presignedUrl, file, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1))
          setProgress(percent)
        },
      })

      const imageData = {
        UserId: context.state.id,
        ImageURL: `https://photo-challenge-bucket-testpnoren.s3.us-east-1.amazonaws.com/${file.name}`,
        Caption: currentCaption,
        ChallengeId: activeChallengeId,
      }

      await fetchAddImage(token, imageData)
      showSnackbar("Photo uploaded successfully! 🎉", "success")

      // איפוס שדות עם אנימציה
      setTimeout(() => {
        setFile(null)
        setCurrentCaption("")
        setIsCaptionUpdated(false)
        setProgress(0)
      }, 1000)
    } catch (error) {
      showSnackbar("Upload failed. Please try again.", "warning")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Fade in timeout={800}>
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: "1px solid rgba(196, 163, 109, 0.1)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.04)",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #C4A36D 0%, #d4a574 50%, #C4A36D 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s ease-in-out infinite",
          },
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "-200% 0" },
            "100%": { backgroundPosition: "200% 0" },
          },
        }}
      >
        <Box sx={{ p: 4 }}>
          <Slide direction="down" in timeout={600}>
            <Box>
              <UploadHeader />
            </Box>
          </Slide>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Slide direction="up" in timeout={800}>
                <Box>
                  <UploadForm
                    file={file}
                    progress={progress}
                    currentCaption={currentCaption}
                    isCaptionUpdated={isCaptionUpdated}
                    handleFileChange={handleFileChange}
                    setCurrentCaption={setCurrentCaption}
                    handleUpload={handleUpload}
                  />


                  ...

                  {isUploading && (
                    <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                      <CircularProgress />
                    </Box>
                  )}

                </Box>
              </Slide>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Slide direction="left" in timeout={1000}>
                <Paper
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, rgba(196, 163, 109, 0.05) 0%, rgba(196, 163, 109, 0.02) 100%)",
                    border: "1px solid rgba(196, 163, 109, 0.1)",
                    borderRadius: 3,
                    height: "fit-content",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        boxShadow: "0 4px 12px rgba(196, 163, 109, 0.3)",
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: "18px",
                          color: "white",
                        }}
                      >
                        💡
                      </Box>
                    </Box>
                    <Box sx={{ color: "#1e293b", fontSize: "16px", fontWeight: 600, mb: 1 }}>Upload Tips</Box>
                    <Box sx={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
                      • Use high-quality images (JPG, PNG)
                      <br />• Maximum file size: 10MB
                      <br />• Add descriptive captions
                      <br />• One photo per challenge
                    </Box>
                  </Box>
                </Paper>
              </Slide>
            </Grid>
          </Grid>
          {isError ? (
            <ErrorSnackbar
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              error={{ response: { status: 400 } }}
            />
          ) : (
            <SuccessSnackbar
              open={snackbarOpen}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMessage}
            />
          )}

        </Box>
      </Paper>
    </Fade>
  )
}

export default FileUploader
