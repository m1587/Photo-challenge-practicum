
import React, { useState, useRef, useEffect } from "react"
import {Dialog, DialogContent, DialogTitle, Box, IconButton, Typography, Card, CardMedia, CardContent, CircularProgress, Paper} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CollectionsIcon from "@mui/icons-material/Collections"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

interface GalleryDialogProps {
  open: boolean
  onClose: () => void
  uploadedFiles: { fileName: string; url: string; caption?: string }[]
  likes: { [key: string]: number }
  captions: { [key: string]: string }
  imageData: { [key: string]: any }
  handleLike: (imageName: string) => Promise<void>
  isLoading?: boolean
}

export const GalleryDialog: React.FC<GalleryDialogProps> = ({ open, onClose, uploadedFiles, likes, captions, imageData,
 handleLike, isLoading = false,}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showArrows, setShowArrows] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null)
  const getImageUrl = (file: { fileName: string; url: string }) => {
    if (imageData[file.fileName]?.imageURL) {
      return imageData[file.fileName].imageURL
    }
    if (file.url) {
      return file.url
    }
    return `https://photo-challenge-bucket-testpnoren.s3.us-east-1.amazonaws.com/${file.fileName}`
  }

  // בדיקה אם צריך להציג חיצים (אם יש גלילה אופקית)
  useEffect(() => {
    if (carouselRef.current) {
      const checkOverflow = () => {
        const element = carouselRef.current
        if (element) {
          setShowArrows(element.scrollWidth > element.clientWidth)
        }
      }

      checkOverflow()
      window.addEventListener("resize", checkOverflow)
      return () => window.removeEventListener("resize", checkOverflow)
    }
  }, [uploadedFiles, open])

  // התחלת מעבר אוטומטי כשהדיאלוג פתוח
  useEffect(() => {
    if (open && uploadedFiles.length > 1) {
      startAutoPlay()
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval)
      }
    }
  }, [open, uploadedFiles])

  const startAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
    }

    const interval = setInterval(() => {
      scrollToNext()
    }, 5000) // מעבר כל 5 שניות

    setAutoPlayInterval(interval)
  }

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval)
      setAutoPlayInterval(null)
    }
  }

  const scrollToNext = () => {
    if (uploadedFiles.length <= 1) return

    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % uploadedFiles.length
      scrollToIndex(newIndex)
      return newIndex
    })
  }

  const scrollToPrev = () => {
    if (uploadedFiles.length <= 1) return

    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + uploadedFiles.length) % uploadedFiles.length
      scrollToIndex(newIndex)
      return newIndex
    })
  }

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const cards = carouselRef.current.querySelectorAll(".carousel-card")
      if (cards[index]) {
        const card = cards[index] as HTMLElement
        const scrollPosition = card.offsetLeft - carouselRef.current.offsetLeft

        carouselRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        })
      }
    }
  }

  // עצירת המעבר האוטומטי כשהמשתמש מנווט ידנית
  const handleManualNavigation = (direction: "next" | "prev") => {
    stopAutoPlay()
    if (direction === "next") {
      scrollToNext()
    } else {
      scrollToPrev()
    }
    // הפעלה מחדש של המעבר האוטומטי אחרי 10 שניות של חוסר פעילות
    setTimeout(startAutoPlay, 10000)
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        stopAutoPlay()
        onClose()
      }}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CollectionsIcon sx={{ color: "#C4A36D" }} />
          <Typography variant="h6" sx={{ color: "#333", fontWeight: 600 }}>
            Photo Gallery
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            stopAutoPlay()
            onClose()
          }}
          size="small"
          sx={{ color: "rgba(0,0,0,0.5)" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 1 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#C4A36D" }} />
          </Box>
        ) : (
          <>
            {/* קרוסלת תמונות */}
            <Box sx={{ position: "relative", width: "100%", mb: 4 }}>
              {/* חץ שמאלה */}
              {showArrows && uploadedFiles.length > 1 && (
                <IconButton
                  onClick={() => handleManualNavigation("prev")}
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon />
                </IconButton>
              )}

              {/* מיכל הקרוסלה */}
              <Box
                ref={carouselRef}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "none", // הסתרת סרגל גלילה בפיירפוקס
                  msOverflowStyle: "none", // הסתרת סרגל גלילה ב-IE/Edge
                  "&::-webkit-scrollbar": { display: "none" }, // הסתרת סרגל גלילה בכרום/ספארי
                  gap: 2,
                  py: 2,
                  px: showArrows ? 6 : 0, // מרווח לחיצים
                }}
              >
                {uploadedFiles.length > 0 ? (
                  uploadedFiles.map((file, index) =>
                    file?.fileName ? (
                      <Box
                        key={index}
                        className="carousel-card"
                        sx={{
                          flex: "0 0 auto",
                          width: { xs: "85%", sm: "45%", md: "30%" },
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <ImageCard
                          file={file}
                          imageUrl={getImageUrl(file)}
                          caption={captions[file.fileName] || "No caption available"}
                          likes={likes[file.fileName] || 0}
                          onLike={() => handleLike(file.fileName)}
                        />
                      </Box>
                    ) : null,
                  )
                ) : (
                  <Box sx={{ textAlign: "center", width: "100%", py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#555" }}>
                      No photos have been uploaded yet.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* חץ ימינה */}
              {showArrows && uploadedFiles.length > 1 && (
                <IconButton
                  onClick={() => handleManualNavigation("next")}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.9)",
                    },
                  }}
                  aria-label="Next image"
                >
                  <ChevronRightIcon />
                </IconButton>
              )}
            </Box>

            {/* אינדיקטורים לתמונות */}
            {uploadedFiles.length > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 3, gap: 1 }}>
                {uploadedFiles.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      stopAutoPlay()
                      setCurrentIndex(index)
                      scrollToIndex(index)
                      setTimeout(startAutoPlay, 10000)
                    }}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: currentIndex === index ? "#C4A36D" : "rgba(0,0,0,0.2)",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface ImageCardProps {
  file: { fileName: string; url: string }
  imageUrl: string
  caption: string
  likes: number
  onLike: () => void
}

const ImageCard: React.FC<ImageCardProps> = ({ file, imageUrl, caption, likes, onLike }) => {
  const [hasError, setHasError] = React.useState(false)

  const handleImageError = () => {
    setHasError(true)
  }

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {hasError ? (
        // תצוגת שגיאה במקום התמונה
        <Paper
          sx={{
            height: 200,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
            p: 2,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 40, color: "#999", mb: 1 }} />
          <Typography variant="body2" sx={{ color: "#666", textAlign: "center" }}>
          The image cannot be loaded.
          </Typography>
          <Typography variant="caption" sx={{ color: "#999", textAlign: "center", mt: 1, fontSize: "0.7rem" }}>
            {file.fileName}
          </Typography>
        </Paper>
      ) : (
        // תצוגת התמונה הרגילה
        <CardMedia
          component="img"
          image={imageUrl}
          alt={file.fileName}
          sx={{
            objectFit: "cover",
            width: "100%",
            height: 200,
            bgcolor: "#f5f5f5",
          }}
          onError={handleImageError}
          loading="lazy"
        />
      )}
      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            color: "#333",
            fontWeight: 500,
            minHeight: "2.5rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            flexGrow: 1,
          }}
        >
          {caption}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            p: 0.5,
            borderRadius: 1.5,
            bgcolor: "rgba(196, 163, 109, 0.1)",
            mt: "auto",
          }}
        >
          <IconButton
            onClick={onLike}
            size="small"
            sx={{
              color: "#C4A36D",
              p: 0.5,
              "&:hover": {
                bgcolor: "rgba(196, 163, 109, 0.2)",
              },
            }}
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          >
            {likes}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
export default GalleryDialog
