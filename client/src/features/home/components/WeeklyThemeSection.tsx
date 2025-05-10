// "use client"

// import type React from "react"
// import { Box, Typography, Container, Button, Paper, Alert, Card, CardMedia, CardContent } from "@mui/material"
// import { motion } from "framer-motion"
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
// import UploadIcon from "@mui/icons-material/Upload"
// import HowToVoteIcon from "@mui/icons-material/HowToVote"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import FileUploader from "../upload/FileUploader"
// import { useEffect, useState } from "react"
// import axios from "axios"
// import ImageGallery from "../gallery/ImageGallery"

// interface WeeklyThemeSectionProps {
//   isLoggedIn: boolean
//   showUploader: boolean
//   showVoting: boolean
//   uploadedFiles: { fileName: string; url: string }[]
//   onBack: () => void
//   onShowUploader: () => void
//   onShowVoting: () => void
//   onHideUploader: () => void
//   onHideVoting: () => void
// }

// export const WeeklyThemeSection: React.FC<WeeklyThemeSectionProps> = ({
//   isLoggedIn,
//   showUploader,
//   showVoting,
//   uploadedFiles,
//   onBack,
//   onShowUploader,
//   onShowVoting,
//   onHideUploader,
//   onHideVoting,
// }) => {
//   const [theme, setTheme] = useState<any>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<any>(null);
//   const [imageUrl, setImageUrl] = useState<string>('');
//   const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
//     const [snackbarMessage, setSnackbarMessage] = useState<string>('');
//   const generateImage = async (): Promise<void> => {
//     if (!theme.title)return;
//     setLoading(true);
//     setError('');
//     try {
//       const token = import.meta.env.VITE_HF_TOKEN;

//       const response = await fetch(
//         'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: 'Bearer '+ token,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ inputs: "sky" }),
//         }
//       );

//       if (!response.ok) {
//         const data = await response.json();
//         console.error('שגיאה מהמודל:', data);
//         setError(data.error || 'קרתה שגיאה בלתי צפויה.');
//         setLoading(false);
//         return;
//       }

//       const blob = await response.blob();
//       const imageObjectUrl = URL.createObjectURL(blob);
//       setImageUrl(imageObjectUrl);
      
//       // הודעת הצלחה
//       setSnackbarMessage('התמונה נוצרה בהצלחה!');
//       setSnackbarOpen(true);
//       console.log('תמונה נוצרה בהצלחה:', imageObjectUrl);
//     } catch (error) {
//       console.error('שגיאה כללית:', error);
//       setError('אירעה שגיאה בעת יצירת התמונה.');
//     }
//     setLoading(false);
//   };
//   useEffect(() => {
//     const fetchTheme = async () => {
//       try {

//         const response = await axios.get("https://localhost:7282/api/Challenge/active-challenge");
//         const themeData = response.data;
//         setTheme(themeData);
//         setLoading(false);
//       } catch (err) {
//         setError(err);
//         setLoading(false);
//       }
//     };

//     fetchTheme();
//   }, []);
//   useEffect(() => {
//     if (theme?.title) {
//       generateImage();
//     }
//   }, [theme]);
//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         width: "100%",
//         position: "relative",
//         overflow: "hidden",
//         pt: { xs: 10, md: 4 },
//         pb: 6,
//         backgroundImage: "url(https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070)",
//         backgroundSize: "cover",
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: "rgba(0, 0, 0, 0.6)",
//           backdropFilter: "blur(2px)",
//           zIndex: 0,
//         },
//       }}
//     >
//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//           <Button
//             startIcon={<ArrowBackIcon />}
//             onClick={onBack}
//             sx={{
//               color: "white",
//               mb: 4,
//               "&:hover": {
//                 bgcolor: "rgba(255,255,255,0.1)",
//               },
//             }}
//           >
//             Back to Home
//           </Button>
//         </motion.div>

//         <Paper
//           component={motion.div}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           elevation={0}
//           sx={{
//             p: 4,
//             bgcolor: "rgba(255,255,255,0.1)",
//             backdropFilter: "blur(10px)",
//             borderRadius: 4,
//             boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
//             border: "1px solid rgba(255,255,255,0.2)",
//             mb: 4,
//           }}
//         >
//           <ThemeHeader />
//           <ThemeCard
//             theme={theme}
//             isLoggedIn={isLoggedIn}
//             showUploader={showUploader}
//             showVoting={showVoting}
//             onShowUploader={onShowUploader}
//             onShowVoting={onShowVoting}
//           />

//           {isLoggedIn && showUploader && (
//             <Box
//               component={motion.div}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               sx={{ mt: 4 }}
//             >
//               <FileUploader />
//               <Button
//                 variant="text"
//                 onClick={onHideUploader}
//                 sx={{
//                   color: "white",
//                   mt: 2,
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.1)",
//                   },
//                 }}
//               >
//                 Cancel Upload
//               </Button>
//             </Box>
//           )}

//           {isLoggedIn && showVoting && (
//             <Box
//               component={motion.div}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               sx={{ mt: 4 }}
//             >
//               <ImageGallery uploadedFiles={uploadedFiles} />
//               <Button
//                 variant="text"
//                 onClick={onHideVoting}
//                 sx={{
//                   color: "white",
//                   mt: 2,
//                   "&:hover": {
//                     bgcolor: "rgba(255,255,255,0.1)",
//                   },
//                 }}
//               >
//                 Back to Theme
//               </Button>
//             </Box>
//           )}
//         </Paper>
//       </Container>
//     </Box>
//   )
// }

// const ThemeHeader = () => (
//   <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//     <Box
//       sx={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         p: 2,
//         borderRadius: "50%",
//         bgcolor: "rgba(196, 163, 109, 0.2)",
//         mr: 2,
//       }}
//     >
//       <CalendarTodayIcon sx={{ fontSize: 28, color: "#C4A36D" }} />
//     </Box>
//     <Typography
//       variant="h4"
//       sx={{
//         color: "#C4A36D",
//         fontWeight: 700,
//         textShadow: "0 2px 4px rgba(0,0,0,0.3)",
//       }}
//     >
//       This Week's Theme
//     </Typography>
//   </Box>
// )

// interface ThemeCardProps {
//   theme: {
//     title: string
//     description: string
//     endDate: string
//     image: string
//   }
//   isLoggedIn: boolean
//   showUploader: boolean
//   showVoting: boolean
//   onShowUploader: () => void
//   onShowVoting: () => void
// }

// const ThemeCard: React.FC<ThemeCardProps> = ({
//   theme,
//   isLoggedIn,
//   showUploader,
//   showVoting,
//   onShowUploader,
//   onShowVoting,
// }) => {
//   // שימוש בתמונה מקומית כברירת מחדל במקום שירות חיצוני
//   // const defaultImage = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070"

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
//         image={theme.image 
//           // || defaultImage
//         }
//         alt={theme.title}
//         sx={{
//           width: { xs: "100%", md: "40%" },
//           height: { xs: 200, md: "auto" },
//           objectFit: "cover",
//         }}
//         onError={(e) => {
//           console.error("Error loading theme image")
//           // אם התמונה לא נטענת, השתמש בתמונת ברירת מחדל
//           // ;(e.target as HTMLImageElement).src = defaultImage
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
import type React from "react"
import { useEffect, useState } from "react"
import { Box, Typography, Container, Button, Paper } from "@mui/material"
import { motion } from "framer-motion"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import axios from "axios"
import FileUploader from "../../upload/components/FileUploader"
import ImageGallery from "../../gallery/components/ImageGallery"
import ThemeCardWithGenerator from "./ThemeCardWithGenerator"

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
        const response = await axios.get("https://localhost:7282/api/Challenge/active-challenge")
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
