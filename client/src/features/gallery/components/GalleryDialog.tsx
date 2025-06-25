import React, { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Paper,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CollectionsIcon from "@mui/icons-material/Collections"
import ThumbUpIcon from "@mui/icons-material/ThumbUp"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ImageComments from "./ImageComments"
import ImageShare from "./ImageShare"

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

export const GalleryDialog: React.FC<GalleryDialogProps> = ({
  open,
  onClose,
  uploadedFiles,
  likes,
  captions,
  imageData,
  handleLike,
  isLoading = false,
}) => {
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
    }, 5000)

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

  const handleManualNavigation = (direction: "next" | "prev") => {
    stopAutoPlay()
    if (direction === "next") {
      scrollToNext()
    } else {
      scrollToPrev()
    }
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
            <Box sx={{ position: "relative", width: "100%", mb: 4 }}>
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

              <Box
                ref={carouselRef}
                sx={{
                  display: "flex",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                  gap: 2,
                  py: 2,
                  px: showArrows ? 6 : 0,
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
                          imageData={imageData[file.fileName]}
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
  imageData?: any
}

interface FloatingHeart {
  id: number
  x: number
  y: number
}

const ImageCard: React.FC<ImageCardProps> = ({ file, imageUrl, caption, likes, onLike, imageData }) => {
  const [hasError, setHasError] = React.useState(false)
  const [isLiking, setIsLiking] = React.useState(false)
  const [floatingHearts, setFloatingHearts] = React.useState<FloatingHeart[]>([])
  const [heartCounter, setHeartCounter] = React.useState(0)
  const likeButtonRef = useRef<HTMLButtonElement>(null)

  const handleImageError = () => {
    setHasError(true)
  }

  const createFloatingHearts = () => {
    const numberOfHearts = 2 // מספר קבוע של אלמנטים
    const newHearts: FloatingHeart[] = []
    
    for (let i = 0; i < numberOfHearts; i++) {
      newHearts.push({
        id: heartCounter + i,
        x: Math.random() * 40 - 20, // -20px to +20px from center
        y: 0,
      })
    }
    
    setFloatingHearts(prev => [...prev, ...newHearts])
    setHeartCounter(prev => prev + numberOfHearts)
    
    // Remove hearts after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => !newHearts.find(newHeart => newHeart.id === heart.id)))
    }, 1500)
  }

  const handleLikeClick = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    createFloatingHearts()
    
    try {
      await onLike()
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setTimeout(() => setIsLiking(false), 600)
    }
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
        
        {/* Like Section with Floating Hearts */}
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
            mb: 2,
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Floating Hearts Container */}
          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            {floatingHearts.map((heart) => (
              <Box
                key={heart.id}
                sx={{
                  position: "absolute",
                  left: heart.x,
                  animation: "gentleFloat 1.5s ease-out forwards",
                  "@keyframes gentleFloat": {
                    "0%": {
                      transform: "translateY(0) scale(0.8)",
                      opacity: 0.9,
                    },
                    "30%": {
                      transform: "translateY(-15px) scale(1)",
                      opacity: 1,
                    },
                    "100%": {
                      transform: "translateY(-35px) scale(0.9)",
                      opacity: 0,
                    },
                  },
                }}
              >
                <ThumbUpIcon 
                  sx={{ 
                    color: "#C4A36D", 
                    fontSize: "1rem",
                    filter: "drop-shadow(0 1px 3px rgba(196, 163, 109, 0.3))"
                  }} 
                />
              </Box>
            ))}
          </Box>

          <IconButton
            ref={likeButtonRef}
            onClick={handleLikeClick}
            disabled={isLiking}
            size="small"
            sx={{
              color: "#C4A36D",
              p: 0.5,
              position: "relative",
              transform: isLiking ? "scale(1.1)" : "scale(1)",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(196, 163, 109, 0.15)",
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              "&:disabled": {
                color: "#C4A36D",
                transform: "scale(1.1)",
                bgcolor: "rgba(196, 163, 109, 0.1)",
              },
              // גלו עדין כשלוחצים
              ...(isLiking && {
                boxShadow: "0 0 15px rgba(196, 163, 109, 0.3)",
                bgcolor: "rgba(196, 163, 109, 0.15)",
              }),
            }}
          >
            <ThumbUpIcon 
              fontSize="small" 
              sx={{
                transition: "transform 0.3s ease",
                ...(isLiking && {
                  animation: "gentlePulse 0.6s ease-in-out",
                  "@keyframes gentlePulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.15)" },
                  },
                }),
              }}
            />
          </IconButton>
          
          <Typography
            variant="body2"
            sx={{
              color: "#333",
              fontWeight: 500,
              fontSize: "0.75rem",
              transform: isLiking ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            {likes}
          </Typography>
        </Box>

        <Box sx={{ mt: 1 }}>
          <ImageShare imageUrl={imageUrl} />
        </Box>
        
        {/* Comments Section */}
        {imageData && (
          <ImageComments
            challengeId={imageData.challengeId?.toString() || "1"}
            imageId={imageData.id?.toString() || "1"}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default GalleryDialog