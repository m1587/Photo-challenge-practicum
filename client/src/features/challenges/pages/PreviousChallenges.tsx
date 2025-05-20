import { useState, useEffect } from "react"
import { Box, Container } from "@mui/material"
import { ChallengeHeader } from "../components/ChallengeHeader"
import { ChallengeGrid } from "../components/ChallengeGrid"
import { WinnerDisplay } from "../components/WinnerDisplay"
import { Snackbar, Alert } from "@mui/material"
import { Challenge } from "../../../types/challenge"
import { fetchPreviousChallenges } from "../../../services/challenge"
const PreviousChallenges = () => {
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetchPreviousChallenges()
        setChallenges(response.data)
        setSnackMessage("The challenges have been successfully loaded!")
        setSnackSeverity("success")
        setSnackOpen(true)
      } catch (error) {
        console.error("Error fetching challenges:", error)
        setSnackMessage("Error loading challenges. Please try again later.")
        setSnackSeverity("error")
        setSnackOpen(true)
      }
    }
    fetchChallenges()
  }, [])

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
        pt: { xs: 10, md: 4 },
        pb: 6,
      }}
    >
      <BackgroundOverlay />
      <Container maxWidth="lg">
        <ChallengeHeader />
        <ChallengeGrid
          challenges={challenges}
          selectedChallenge={selectedChallenge}
          setSelectedChallenge={setSelectedChallenge}
        />
        {selectedChallenge && selectedChallenge.winnerImageUrl && <WinnerDisplay challenge={selectedChallenge} />}
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackSeverity}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

const BackgroundOverlay = () => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url(https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=2029)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(2px)",
      },
      zIndex: -1,
    }}
  />
)

export default PreviousChallenges

