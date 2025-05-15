import type React from "react"
// import {useState } from "react"
import { Box, Typography, Card, CardMedia, CardContent, Alert, Button } from "@mui/material"
import UploadIcon from "@mui/icons-material/Upload"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
// import GenerateImageButton from "./GenerateImageButton"

interface ThemeCardProps {
  theme: {
    title: string
    description: string
    endDate: string
    image?: string
  }
  isLoggedIn: boolean
  showUploader: boolean
  showVoting: boolean
  onShowUploader: () => void
  onShowVoting: () => void
}
const ThemeCardWithGenerator: React.FC<ThemeCardProps> = ({
  theme,
  isLoggedIn,
  showUploader,
  showVoting,
  onShowUploader,
  onShowVoting,
}) => {
  // const [themeImage, setThemeImage] = useState<string | undefined>(theme.image)
  const defaultImage ="/assets/logo.svg"
  // const generatePrompt = () => {
  //   return `High quality professional photograph of ${theme.title}: ${theme.description}`
  // }
  // // Handle the generated image
  // const handleImageGenerated = (imageUrl: string) => {
  //   setThemeImage(imageUrl)
  // }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        bgcolor: "rgba(255,255,255,0.95)",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    >
      <CardMedia
        component="img"
       image={
          // themeImage || 
           defaultImage}
        alt={theme.title}
        sx={{
          width: { xs: "100%", md: "40%" },
          height: { xs: 200, md: "auto" },
          objectFit: "cover",
        }}
        onError={(e) => {
        const img = e.target as HTMLImageElement
        if (img.src !== window.location.origin + defaultImage) {
          console.error("Error loading theme image", img.src)
          img.src = defaultImage
        }
        }}
      />
      <CardContent sx={{ p: 4, flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#333", fontWeight: 600 }}>
          {theme.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "#555", fontSize: "1.1rem" }}>
          {theme.description}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
            Contest Details:
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
            • Submissions close: {theme.endDate}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
            • Voting period: Saturday & Sunday
          </Typography>
          <Typography variant="body2" sx={{ color: "#555" }}>
            • Winner announced: Monday
          </Typography>
        </Box>

        {/* AI Image Generation Button */}
{/*         <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
            Theme Visualization:
          </Typography>
          <GenerateImageButton
            prompt={generatePrompt()}
            onImageGenerated={handleImageGenerated}
            disabled={!isLoggedIn && !generatePrompt().trim()}
          />
          {!isLoggedIn && (
            <Typography variant="caption" sx={{ display: "block", mt: 1, color: "#666" }}>
              Please log in to generate AI images for this theme
            </Typography>
          )}
        </Box> */}

        {!isLoggedIn ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please log in to participate in this week's contest.
          </Alert>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {!showUploader && !showVoting && (
              <>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  onClick={onShowUploader}
                  sx={{
                    bgcolor: "#C4A36D",
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor: "#b3926a",
                    },
                  }}
                >
                  Upload Your Photo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<HowToVoteIcon />}
                  onClick={onShowVoting}
                  sx={{
                    borderColor: "#C4A36D",
                    color: "#C4A36D",
                    fontWeight: 500,
                    "&:hover": {
                      borderColor: "#b3926a",
                      bgcolor: "rgba(196, 163, 109, 0.05)",
                    },
                  }}
                >
                  Vote on Submissions
                </Button>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default ThemeCardWithGenerator
