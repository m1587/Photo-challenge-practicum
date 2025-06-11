import { useState } from "react"
import { Box, Button, Typography, Fade, Chip } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import LinkIcon from "@mui/icons-material/Link"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ShareIcon from "@mui/icons-material/Share"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

type ImageShareProps = {
  imageUrl: string // כתובת מלאה לתמונה
}

export default function ImageShare({ imageUrl }: ImageShareProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    setIsLoading(true)
    try {
      await navigator.clipboard.writeText(imageUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    } catch (err) {
      console.error("שגיאה בהעתקת הקישור:", err)
      // אפשר להוסיף כאן הודעת שגיאה
    } finally {
      setIsLoading(false)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this amazing photo!",
          text: "Look at this photo from our photography contest",
          url: imageUrl,
        })
      } catch (err) {
        console.error("שגיאה בשיתוף:", err)
      }
    } else {
      // fallback לעותק הקישור
      handleShare()
    }
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        background: "linear-gradient(135deg, rgba(196, 163, 109, 0.05) 0%, rgba(196, 163, 109, 0.02) 100%)",
        border: "1px solid rgba(196, 163, 109, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <ShareIcon sx={{ color: "#C4A36D", fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          Share this photo
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Copy Link Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={isCopied ? <CheckCircleIcon /> : <ContentCopyIcon />}
          onClick={handleShare}
          disabled={isLoading}
          sx={{
            borderColor: isCopied ? "#10b981" : "#C4A36D",
            color: isCopied ? "#10b981" : "#1e293b",
            backgroundColor: isCopied ? "rgba(16, 185, 129, 0.05)" : "rgba(196, 163, 109, 0.05)",
            fontWeight: 500,
            textTransform: "none",
            borderRadius: 1.5,
            px: 2,
            py: 0.5,
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              borderColor: isCopied ? "#059669" : "#b3926a",
              backgroundColor: isCopied ? "rgba(16, 185, 129, 0.1)" : "rgba(196, 163, 109, 0.1)",
              transform: "translateY(-1px)",
              boxShadow: isCopied ? "0 4px 12px rgba(16, 185, 129, 0.2)" : "0 4px 12px rgba(196, 163, 109, 0.2)",
            },
            "&.Mui-disabled": {
              borderColor: "rgba(0,0,0,0.12)",
              color: "rgba(0,0,0,0.26)",
            },
          }}
        >
          {isCopied ? "Copied!" : "Copy Link"}
        </Button>

        {/* Native Share Button (if supported) */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <Button
            variant="contained"
            size="small"
            startIcon={<ShareIcon />}
            onClick={handleNativeShare}
            sx={{
              background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
              color: "white",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: 1.5,
              px: 2,
              py: 0.5,
              boxShadow: "0 2px 8px rgba(196, 163, 109, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #b3926a 0%, #c19660 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(196, 163, 109, 0.4)",
              },
            }}
          >
            Share
          </Button>
        )}
      </Box>

      {/* Success Message */}
      <AnimatePresence>
        {isCopied && (
          <Fade in timeout={300}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              sx={{ mt: 1.5 }}
            >
              <Chip
                icon={<CheckCircleIcon />}
                label="Link copied to clipboard!"
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#10b981",
                  color: "#10b981",
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  fontWeight: 500,
                  "& .MuiChip-icon": {
                    color: "#10b981",
                  },
                  animation: "pulse 1.5s ease-in-out",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              />
            </Box>
          </Fade>
        )}
      </AnimatePresence>

      {/* URL Preview */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          borderRadius: 1.5,
          background: "rgba(255, 255, 255, 0.7)",
          border: "1px solid rgba(196, 163, 109, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <LinkIcon sx={{ color: "#64748b", fontSize: 16 }} />
          <Typography
            variant="caption"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Image URL
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "#374151",
            fontSize: "12px",
            fontFamily: "monospace",
            wordBreak: "break-all",
            lineHeight: 1.4,
            backgroundColor: "rgba(248, 250, 252, 0.8)",
            p: 1,
            borderRadius: 1,
            border: "1px solid rgba(196, 163, 109, 0.05)",
          }}
        >
          {imageUrl}
        </Typography>
      </Box>
    </Box>
  )
}
