import type React from "react"
import { useState, useContext, useEffect } from "react"
import { Box, Grid, Snackbar, Alert } from "@mui/material"
import api from "../../../lib/axiosConfig"
import { UserContext } from "../../../context/UserContext"
import axios from "axios"
import { UploadForm } from "./UploadForm"
import { UploadHeader } from "./UploadHeader"

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
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("success")

  const getToken = () => localStorage.getItem("token")
  useEffect(() => {
    const fetchActiveChallenge = async () => {
      try {
        const token = getToken()
        const response = await api.get("Challenge/active-challenge", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setActiveChallengeId(response.data.id)
      } catch (error) {
        showSnackbar("Error retrieving active challenge", "warning")
      }
    }

    fetchActiveChallenge()
  }, [])
  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "success") => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setIsCaptionUpdated(false)
    }
  }

  const checkIfUserUploaded = async () => {
    if (!activeChallengeId) {
      return true
    }
    try {
      const token = getToken()
      const response = await api.get("Challenge/check-uploaded", {
        params: {
          userId: context.state.id,
          challengeId: activeChallengeId, // השתמש במזהה של האתגר הנוכחי
        },
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.data.hasUploaded) {
        showSnackbar("You can only upload one photo per challenge", "warning")
        return true
      }

      return false
    } catch (error) {
      showSnackbar("Error checking upload status:", "warning")
      return false
    }
  }
  const handleUpload = async () => {
    if (!file || !activeChallengeId) return;

    const hasAlreadyUploaded = await checkIfUserUploaded();
    if (hasAlreadyUploaded) {
      return;
    }

    try {
      const token = getToken();
      const response = await api.get("Upload/presigned-url", {
        params: { fileName: file.name },
        headers: { Authorization: `Bearer ${token}` },
      });

      const presignedUrl = response.data.url;
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": "image/jpeg",
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1));
          setProgress(percent);
        },
      });
      const imageData = {
        UserId: context.state.id,
        ImageURL: `https://photo-challenge-bucket-testpnoren.s3.us-east-1.amazonaws.com/${file.name}`,
        Caption: currentCaption,
        ChallengeId: activeChallengeId,
      };

      await api.post("Image", imageData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      showSnackbar("File uploaded successfully!", "success")

      // איפוס שדות
      setFile(null);
      setCurrentCaption("");
      setIsCaptionUpdated(false);
      setProgress(0);

    } catch (error) {
      showSnackbar("An error occurred during the upload process. Please try again.", "warning")
    }
  };
  return (
    <Box
      sx={{
        p: 2,
        position: "relative",
        overflow: "auto",
        maxHeight: "100vh",
      }}
    >
      <UploadHeader />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <UploadForm
            file={file}
            progress={progress}
            currentCaption={currentCaption}
            isCaptionUpdated={isCaptionUpdated}
            handleFileChange={handleFileChange}
            setCurrentCaption={setCurrentCaption}
            handleUpload={handleUpload}
          />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default FileUploader
