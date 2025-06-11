import { useState, useEffect, useMemo } from "react"
import { Box, Container, Fab, Zoom, useMediaQuery, useTheme } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { ChallengeHeader } from "../components/ChallengeHeader"
import { ChallengeGrid } from "../components/ChallengeGrid"
import { WinnerDisplay } from "../components/WinnerDisplay"
import type { Challenge } from "../../../types/challenge"
import { fetchPreviousChallenges } from "../../../services/challenge"
import SuccessSnackbar from "../../../components/pages/Success"
import ErrorSnackbar from "../../../components/pages/Error"
import { LoadingSkeleton } from "./LoadingSkeleton"
import { ChallengeFilters } from "./ChallengeFilters"
import { ChallengeTimeline } from "./ChallengeTimeline"

type ViewMode = "grid" | "timeline"
type SortOption = "newest" | "oldest" | "popular" | "alphabetical"

const PreviousChallenges = () => {
  // State management
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMessage, setSnackMessage] = useState("")
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success")
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // New features state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch challenges with enhanced loading
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true)
      try {
        // Simulate minimum loading time for better UX
        const [response] = await Promise.all([
          fetchPreviousChallenges(),
          new Promise((resolve) => setTimeout(resolve, 1000)),
        ])

        setChallenges(response.data)
        setSnackMessage("Challenges loaded successfully!")
        setSnackSeverity("success")
        setSnackOpen(true)
      } catch (error) {
        console.error("Error fetching challenges:", error)
        setSnackMessage("Failed to load challenges. Please try again.")
        setSnackSeverity("error")
        setSnackOpen(true)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChallenges()
  }, [])

  // Enhanced filtering and sorting
  const filteredAndSortedChallenges = useMemo(() => {
    const filtered = challenges.filter((challenge) => {
      const matchesSearch =
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYear = selectedYear ? new Date(challenge.endDate).getFullYear() === selectedYear : true

      return matchesSearch && matchesYear
    })

    // Sort challenges
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        case "oldest":
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "popular":
          // Assuming we have a popularity metric, fallback to newest
          return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [challenges, searchQuery, sortBy, selectedYear])

  // Get unique years for filter
  const availableYears = useMemo(() => {
    const years = challenges.map((challenge) => new Date(challenge.endDate).getFullYear())
    return [...new Set(years)].sort((a, b) => b - a)
  }, [challenges])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleChallengeSelect = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    if (isMobile) {
      setShowDetailsModal(true)
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        pt: { xs: 10, md: 4 },
        pb: 6,
      }}
    >
      <BackgroundOverlay />

      <Container maxWidth="xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <ChallengeHeader />

          {/* Filters and Controls */}
          <ChallengeFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
            totalResults={filteredAndSortedChallenges.length}
          />

          {/* Content based on view mode */}
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ChallengeGrid
                  challenges={filteredAndSortedChallenges}
                  selectedChallenge={selectedChallenge}
                  setSelectedChallenge={handleChallengeSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChallengeTimeline
                  challenges={filteredAndSortedChallenges}
                  selectedChallenge={selectedChallenge}
                  setSelectedChallenge={handleChallengeSelect}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Winner Display */}
          <AnimatePresence>
            {selectedChallenge && selectedChallenge.winnerImageUrl && !showDetailsModal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <WinnerDisplay challenge={selectedChallenge} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
            color: "white",
            zIndex: 1000,
            "&:hover": {
              background: "linear-gradient(135deg, #b3926a 0%, #c19660 100%)",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
          aria-label="scroll to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Snackbars */}
      {snackSeverity === "success" ? (
        <SuccessSnackbar open={snackOpen} onClose={() => setSnackOpen(false)} message={snackMessage} />
      ) : (
        <ErrorSnackbar
          open={snackOpen}
          onClose={() => setSnackOpen(false)}
          error={{
            message: snackMessage,
            response: { status: 500 },
          }}
        />
      )}
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
