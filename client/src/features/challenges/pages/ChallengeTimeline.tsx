"use client"

import { Box, Paper, Typography, Chip } from "@mui/material"
import { motion } from "framer-motion"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import type { Challenge } from "../../../types/challenge"

interface ChallengeTimelineProps {
  challenges: Challenge[]
  selectedChallenge: Challenge | null
  setSelectedChallenge: (challenge: Challenge) => void
}

export const ChallengeTimeline = ({
  challenges,
  selectedChallenge,
  setSelectedChallenge,
}: ChallengeTimelineProps) => {
  // Group challenges by year
  const challengesByYear = challenges.reduce(
    (acc, challenge) => {
      const year = new Date(challenge.endDate).getFullYear()
      if (!acc[year]) acc[year] = []
      acc[year].push(challenge)
      return acc
    },
    {} as Record<number, Challenge[]>,
  )

  const years = Object.keys(challengesByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <Box sx={{ position: "relative" }}>
      {/* Timeline Line */}
      <Box
        sx={{
          position: "absolute",
          left: { xs: 20, md: 40 },
          top: 0,
          bottom: 0,
          width: 4,
          background: "linear-gradient(180deg, #C4A36D 0%, #d4a574 50%, #C4A36D 100%)",
          borderRadius: 2,
          zIndex: 1,
        }}
      />

      {years.map((year, yearIndex) => (
        <motion.div
          key={year}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: yearIndex * 0.1 }}
        >
          {/* Year Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              position: "relative",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                width: { xs: 40, md: 80 },
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C4A36D 0%, #d4a574 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "18px",
                boxShadow: "0 4px 12px rgba(196, 163, 109, 0.3)",
                mr: 3,
              }}
            >
              {year}
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: "#1e293b",
                fontWeight: 600,
              }}
            >
              {challengesByYear[year].length} Challenge{challengesByYear[year].length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          {/* Challenges for this year */}
          <Box sx={{ ml: { xs: 6, md: 10 }, mb: 6 }}>
            {challengesByYear[year].map((challenge, challengeIndex) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: yearIndex * 0.1 + challengeIndex * 0.05 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    background:
                      selectedChallenge?.id === challenge.id
                        ? "linear-gradient(135deg, rgba(196, 163, 109, 0.1) 0%, rgba(196, 163, 109, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedChallenge?.id === challenge.id
                        ? "2px solid rgba(196, 163, 109, 0.3)"
                        : "1px solid rgba(196, 163, 109, 0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      border: "1px solid rgba(196, 163, 109, 0.3)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: challenge.winnerImageUrl
                        ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                        : "linear-gradient(90deg, #C4A36D 0%, #d4a574 100%)",
                    },
                  }}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#1e293b",
                            fontWeight: 600,
                          }}
                        >
                          {challenge.title}
                        </Typography>
                        {challenge.winnerImageUrl && (
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label="Completed"
                            size="small"
                            sx={{
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              border: "1px solid rgba(16, 185, 129, 0.2)",
                              "& .MuiChip-icon": {
                                color: "#10b981",
                              },
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {challenge.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 500,
                        }}
                      >
                        Ended: {new Date(challenge.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      ))}
    </Box>
  )
}
