import type React from "react"
import { useState, useContext, useEffect, useCallback } from "react"
import { Button, Box, Typography, CircularProgress } from "@mui/material"
import CollectionsIcon from "@mui/icons-material/Collections"
import { UserContext } from "../../../context/UserContext"
import { GalleryDialog } from "./GalleryDialog"
import { fetchAddVoteImage, fetchImageName, fetchVoteImage } from "../../../services/image"
import { fetchActiveChallengeId } from "../../../services/challenge"
import ErrorSnackbar from "../../../components/pages/Error"
import SuccessSnackbar from "../../../components/pages/Success"

interface ImageGalleryProps {
  uploadedFiles: { fileName: string; url: string; caption?: string }[]
  compact?: boolean
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ uploadedFiles, compact = false }) => {
  const context = useContext(UserContext)
  const [snackOpen, setSnackOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<any>(null);
  const [isError, setIsError] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackOpen(false);
    setIsError(false);
    setError(null);
    setSuccessMessage("");
  };
  if (!context) {
    throw new Error("Your Component must be used within a UserProvider")
  }

  const [likes, setLikes] = useState<{ [key: string]: number }>({})
  const [captions, setCaptions] = useState<{ [key: string]: string }>({})
  const [imageData, setImageData] = useState<{ [key: string]: any }>({})
  const [showFiles, setShowFiles] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(null)
  const getToken = () => localStorage.getItem("token")
  useEffect(() => {
    const fetchActiveChallenge = async () => {
      const token = getToken()
      if (!token) return

      try {
        // const response = await api.get("Challenge/active-challenge", {
        //   headers: { Authorization: `Bearer ${token}` },
        // })
        const response = await fetchActiveChallengeId(token);
        setActiveChallengeId(response.data.id)
        console.log("אתגר פעיל:", response.data.id);

      } catch (error) {
        console.error("שגיאה בשליפת האתגר הפעיל:", error)
      }
    }

    fetchActiveChallenge()
  }, [])
  // שימוש ב-useCallback כדי למנוע יצירה מחדש של הפונקציה בכל רינדור
  const fetchAllImageData = useCallback(async () => {
    setIsLoading(true)
    const token = getToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const updatedLikes: { [key: string]: number } = {}
      const updatedCaptions: { [key: string]: string } = {}
      const updatedImageData: { [key: string]: any } = {}

      for (const file of uploadedFiles) {
        if (!file?.fileName) continue

        try {
          // const imageResponse = await api.get("Image/Name", {
          //   params: { imageName: file.fileName },
          //   headers: { Authorization: `Bearer ${token}` },
          // })
          const imageResponse = await fetchImageName(token, file.fileName);
          const image = imageResponse.data
          // ✨ סינון לפי האתגר הפעיל
          if (image.challengeId !== activeChallengeId) {
            continue
          }
          updatedImageData[file.fileName] = image
          updatedCaptions[file.fileName] = image.caption || "No caption available"

          // const votesResponse = await api.get(`Vote/Count/${image.id}`, {
          //   headers: { Authorization: `Bearer ${token}` },
          // })
          const votesResponse = await fetchVoteImage(token, image.id);
          updatedLikes[file.fileName] = votesResponse.data?.voteCount || 0
        } catch (error) {
          console.error(`Error fetching data for ${file.fileName}:`, error)
          updatedCaptions[file.fileName] = file.caption || "No caption available"
          updatedLikes[file.fileName] = 0
        }
      }

      setImageData(updatedImageData)
      setCaptions(updatedCaptions)
      setLikes(updatedLikes)
    } catch (error) {
      console.error("Error fetching image data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [uploadedFiles, activeChallengeId])

  const handleLike = async (imageName: string) => {
    const token = getToken()
    if (!token) return

    try {
      // עדכון אופטימלי של הלייקים לפני שליחת הבקשה
      setLikes((prevLikes) => ({
        ...prevLikes,
        [imageName]: (prevLikes[imageName] || 0) + 1,
      }))

      // שליפת מידע על התמונה
      // const imageResponse = await api.get(`Image/Name`, {
      //   params: { imageName },
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      const imageResponse = await fetchImageName(token, imageName);
      const imageId = imageResponse.data?.id
      if (!imageId) return

      // שליחת הצבעה
      // await api.post(
      //   "Vote",
      //   {
      //     userId: context.state.id,
      //     imageId: imageId,
      //   },
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // )
      await fetchAddVoteImage(token, context.state.id, imageId);
      // עדכון מספר הלייקים מתוך השרת אחרי הצבעה מוצלחת
      setSuccessMessage("Your vote has been submitted successfully!");
      setIsError(false);
      setSnackOpen(true);
      await fetchAllImageData()
    } catch (error) {
      console.error("Error during vote:", error)

      // במקרה של שגיאה, נחזיר את הלייקים למצב הקודם
      setLikes((prevLikes) => ({
        ...prevLikes,
        [imageName]: Math.max((prevLikes[imageName] || 1) - 1, 0),
      }))
      // ✅ הודעת שגיאה
      setError(error);
      setIsError(true);
      setSnackOpen(true);
    }
  }

  useEffect(() => {
    if (showFiles) {
      fetchAllImageData()
    }
  }, [showFiles, fetchAllImageData, fetchAllImageData])

  useEffect(() => {
    if (uploadedFiles.length) {
      fetchAllImageData()
    }
  }, [uploadedFiles, fetchAllImageData, fetchAllImageData])

  // if (uploadedFiles.length === 0 || Object.keys(imageData).length === 0) {
  //   return (
  //     <Typography variant="body2" sx={{ color: "gray", mt: 2 }}>
  //       אין תמונות להציג עבור האתגר הפעיל.
  //     </Typography>
  //   )
  // }
  if (isLoading) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress color="inherit" />
    </Box>
  );
}

if (uploadedFiles.length === 0 || Object.keys(imageData).length === 0) {
  return null;
}
  return (
    <Box sx={{ width: "100%" }}>
      <GalleryButton compact={compact} onClick={() => setShowFiles(true)} />
      <GalleryDialog
        open={showFiles}
        onClose={() => setShowFiles(false)}
        uploadedFiles={uploadedFiles.filter(file => imageData[file.fileName])}
        likes={likes}
        captions={captions}
        imageData={imageData}
        handleLike={handleLike}
        isLoading={isLoading}
      />
      {isError ? (
        <ErrorSnackbar open={snackOpen} onClose={handleCloseSnackbar} error={error} />
      ) : (
        <SuccessSnackbar open={snackOpen} onClose={handleCloseSnackbar} message={successMessage} />
      )}
    </Box>
  )
}

interface GalleryButtonProps {
  compact: boolean
  onClick: () => void
}

const GalleryButton: React.FC<GalleryButtonProps> = ({ compact, onClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: compact ? "space-between" : "center",
        mb: 2,
      }}
    >
      {compact && (
        <Typography
          variant="h6"
          sx={{
            color: "#C4A36D",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CollectionsIcon fontSize="small" />
          Gallery
        </Typography>
      )}
      <Button
        variant="outlined"
        onClick={onClick}
        startIcon={<CollectionsIcon />}
        size={compact ? "small" : "medium"}
        sx={{
          borderColor: "rgba(196, 163, 109, 0.5)",
          color: compact ? "#C4A36D" : "white",
          borderRadius: 1.5,
          fontWeight: 500,
          "&:hover": {
            borderColor: "#C4A36D",
            bgcolor: "rgba(196, 163, 109, 0.1)",
          },
        }}
      >
        Gallery
      </Button>
    </Box>
  )
}

export default ImageGallery


