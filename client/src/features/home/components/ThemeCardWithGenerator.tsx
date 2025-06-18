// import type React from "react"
// import { useEffect, useState } from "react"
// import { Box, Typography, Card, CardMedia, CardContent, Alert, Button } from "@mui/material"
// import UploadIcon from "@mui/icons-material/Upload"
// import HowToVoteIcon from "@mui/icons-material/HowToVote"

// interface ThemeCardProps {
//   theme: {
//     title: string
//     description: string
//     endDate: string
//     image?: string
//   }
//   isLoggedIn: boolean
//   showUploader: boolean
//   showVoting: boolean
//   onShowUploader: () => void
//   onShowVoting: () => void
// }
// const ThemeCardWithGenerator: React.FC<ThemeCardProps> = ({
//   theme,
//   isLoggedIn,
//   showUploader,
//   showVoting,
//   onShowUploader,
//   onShowVoting,
// }) => {
//   const [imageSrc, setImageSrc] = useState<string>("/assets/logo.svg") 

//  useEffect(() => {
//   const fetchPixabayImage = async () => {
//     const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY
//     const query = encodeURIComponent(theme.title)
//     const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&per_page=3&orientation=horizontal`

//     try {
//       const res = await fetch(url)
//       const data = await res.json()
//       if (data.hits && data.hits.length > 0) {
//         setImageSrc(data.hits[0].webformatURL)
//       } else {
//         console.warn("No image found for", theme.title)
//         setImageSrc("/assets/logo.svg")
//       }
//     } catch (error) {
//       console.error("Pixabay error:", error)
//       setImageSrc("/assets/logo.svg")
//     }
//   }

//   fetchPixabayImage()
// }, [theme.title])
//   return (
//     <Card
//       sx={{
//         display: "flex",
//         flexDirection: { xs: "column", md: "row" },
//         overflow: "hidden",
//         bgcolor: "rgba(255,255,255,0.95)",
//         borderRadius: 3,
//         boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
//       }}
//     >
//       <CardMedia
//         component="img"
//         image={imageSrc}
//         alt={theme.title}
//         sx={{
//           width: { xs: "100%", md: "40%" },
//           height: { xs: 200, md: "auto" },
//           objectFit: "cover",
//         }}
//       />

//       <CardContent sx={{ p: 4, flex: 1 }}>
//         <Typography variant="h4" sx={{ mb: 2, color: "#333", fontWeight: 600 }}>
//           {theme.title}
//         </Typography>
//         <Typography variant="body1" sx={{ mb: 3, color: "#555", fontSize: "1.1rem" }}>
//           {theme.description}
//         </Typography>
//         <Box sx={{ mb: 3 }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
//             Contest Details:
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
//             • Submissions close: {theme.endDate}
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>
//             • Voting period: Saturday & Sunday
//           </Typography>
//           <Typography variant="body2" sx={{ color: "#555" }}>
//             • Winner announced: Monday
//           </Typography>
//         </Box>

//         {!isLoggedIn ? (
//           <Alert severity="info" sx={{ mb: 3 }}>
//             Please log in to participate in this week's contest.
//           </Alert>
//         ) : (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//             {!showUploader && !showVoting && (
//               <>
//                 <Button
//                   variant="contained"
//                   startIcon={<UploadIcon />}
//                   onClick={onShowUploader}
//                   sx={{
//                     bgcolor: "#C4A36D",
//                     color: "white",
//                     fontWeight: 500,
//                     "&:hover": {
//                       bgcolor: "#b3926a",
//                     },
//                   }}
//                 >
//                   Upload Your Photo
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<HowToVoteIcon />}
//                   onClick={onShowVoting}
//                   sx={{
//                     borderColor: "#C4A36D",
//                     color: "#C4A36D",
//                     fontWeight: 500,
//                     "&:hover": {
//                       borderColor: "#b3926a",
//                       bgcolor: "rgba(196, 163, 109, 0.05)",
//                     },
//                   }}
//                 >
//                   Vote on Submissions
//                 </Button>
//               </>
//             )}
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// export default ThemeCardWithGenerator

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Box, Typography, Card, CardMedia, CardContent, Button } from "@mui/material"
import UploadIcon from "@mui/icons-material/Upload"
import HowToVoteIcon from "@mui/icons-material/HowToVote"
import LoginIcon from "@mui/icons-material/Login"
import Register from "../../user/components/Registration"
import { Login } from "../../user/components/Login"

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
  onOpenLogin?: () => void // Add this new prop
}

const ThemeCardWithGenerator: React.FC<ThemeCardProps> = ({
  theme,
  isLoggedIn,
  showUploader,
  showVoting,
  onShowUploader,
  onShowVoting,
  onOpenLogin, // Add this to destructuring
}) => {
  const [imageSrc, setImageSrc] = useState<string>("/assets/logo.svg")
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const fetchPixabayImage = async () => {
      const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY
      const query = encodeURIComponent(theme.title)
      const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&per_page=3&orientation=horizontal`

      try {
        const res = await fetch(url)
        const data = await res.json()
        if (data.hits && data.hits.length > 0) {
          setImageSrc(data.hits[0].webformatURL)
        } else {
          console.warn("No image found for", theme.title)
          setImageSrc("/assets/logo.svg")
        }
      } catch (error) {
        console.error("Pixabay error:", error)
        setImageSrc("/assets/logo.svg")
      }
    }

    fetchPixabayImage()
  }, [theme.title])

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
        image={imageSrc}
        alt={theme.title}
        sx={{
          width: { xs: "100%", md: "40%" },
          height: { xs: 200, md: "auto" },
          objectFit: "cover",
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

        {!isLoggedIn ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
              Join our photography community to participate!
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => setShowLoginModal(true)}
                sx={{
                  bgcolor: "#C4A36D",
                  color: "white",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#b3926a",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(196, 163, 109, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Sign In
              </Button>

              <Register onSwitchToLogin={() => onOpenLogin?.()} />
            </Box>
          </Box>
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
        {showLoginModal && (
          <Login
            onLoginSuccess={() => {
              setShowLoginModal(false)
              window.location.reload() // or your preferred way to update login state
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default ThemeCardWithGenerator

