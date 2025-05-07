
import type React from "react"
import { Grid, Paper, Box, Card, CardContent, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { Challenge } from "../../types/challenge"
interface ChallengeGridProps {
  challenges: Challenge[]
  selectedChallenge: Challenge | null
  setSelectedChallenge: (challenge: Challenge) => void
}

export const ChallengeGrid: React.FC<ChallengeGridProps> = ({
  challenges,
  selectedChallenge,
  setSelectedChallenge,
}) => {
  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      elevation={0}
      sx={{
        p: 4,
        bgcolor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {challenges.length > 0 ? (
          challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              isSelected={selectedChallenge?.id === challenge.id}
              onClick={() => setSelectedChallenge(challenge)}
            />
          ))
        ) : (
          <LoadingMessage />
        )}
      </Grid>
    </Paper>
  )
}

interface ChallengeCardProps {
  challenge: any
  index: number
  isSelected: boolean
  onClick: () => void
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, index, isSelected, onClick }) => {
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
    >
      <Card
        sx={{
          cursor: "pointer",
          height: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: 3,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          bgcolor: isSelected ? "rgba(196, 163, 109, 0.1)" : "rgba(255, 255, 255, 0.9)",
          border: isSelected ? "1px solid rgba(196, 163, 109, 0.3)" : "1px solid rgba(255,255,255,0.2)",
          overflow: "hidden",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
          },
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            height: 8,
            bgcolor: isSelected ? "#C4A36D" : "rgba(196, 163, 109, 0.3)",
            transition: "background-color 0.3s ease",
          }}
        />
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: "#333",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {challenge.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography component="span" sx={{ fontWeight: 500 }}>End date:</Typography>
            <Typography component="span" sx={{ fontWeight: 500 }}>
              {new Date(challenge.endDate).toLocaleDateString()}
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}

const LoadingMessage = () => (
  <Box
    sx={{
      py: 4,
      textAlign: "center",
      width: "100%",
    }}
    component={motion.div}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <Typography variant="body1" sx={{ color: "white" }}>
    Loading challenges...
    </Typography>
  </Box>
)

