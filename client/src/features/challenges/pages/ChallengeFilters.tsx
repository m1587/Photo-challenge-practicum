
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { motion } from "framer-motion"
import SearchIcon from "@mui/icons-material/Search"
import GridViewIcon from "@mui/icons-material/GridView"
import TimelineIcon from "@mui/icons-material/Timeline"
import SortIcon from "@mui/icons-material/Sort"
import FilterListIcon from "@mui/icons-material/FilterList"
import ClearIcon from "@mui/icons-material/Clear"

type SortOption = "newest" | "oldest" | "alphabetical" | "popular"

interface ChallengeFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>
  viewMode: "grid" | "timeline"
  setViewMode: (mode: "grid" | "timeline") => void
  selectedYear: number | null
  setSelectedYear: (year: number | null) => void
  availableYears: number[]
  totalResults: number
}

export const ChallengeFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  selectedYear,
  setSelectedYear,
  availableYears,
  totalResults,
}: ChallengeFiltersProps) => {
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedYear(null)
    setSortBy("newest")
  }

  const hasActiveFilters = searchQuery || selectedYear

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
        backdropFilter: "blur(20px)",
        borderRadius: 3,
        border: "1px solid rgba(196, 163, 109, 0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <FilterListIcon sx={{ color: "#C4A36D" }} />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={`${totalResults} challenges found`}
                variant="outlined"
                sx={{
                  borderColor: "#C4A36D",
                  color: "#1e293b",
                  fontWeight: 600,
                }}
              />
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Chip
                    label="Clear filters"
                    variant="outlined"
                    size="small"
                    onDelete={clearFilters}
                    deleteIcon={<ClearIcon />}
                    sx={{
                      borderColor: "#ef4444",
                      color: "#ef4444",
                      "&:hover": {
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                      },
                    }}
                  />
                </motion.div>
              )}
            </Box>

            {/* View Mode Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  border: "1px solid rgba(196, 163, 109, 0.3)",
                  color: "#64748b",
                  "&.Mui-selected": {
                    backgroundColor: "#C4A36D",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#b3926a",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(196, 163, 109, 0.1)",
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="timeline" aria-label="timeline view">
                <TimelineIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr", md: "3fr 1fr 1fr" },
          gap: 2,
          alignItems: "end",
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search challenges..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C4A36D" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery("")} sx={{ color: "#64748b" }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "& fieldset": {
                borderColor: "rgba(196, 163, 109, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(196, 163, 109, 0.4)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#C4A36D",
              },
            },
          }}
        />

        {/* Sort */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#64748b" }}>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            label="Sort by"
            startAdornment={<SortIcon sx={{ color: "#C4A36D", mr: 1 }} />}
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(196, 163, 109, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(196, 163, 109, 0.4)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#C4A36D",
              },
            }}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="alphabetical">A-Z</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
          </Select>
        </FormControl>

        {/* Year Filter */}
        <FormControl fullWidth>
          <InputLabel sx={{ color: "#64748b" }}>Year</InputLabel>
          <Select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            label="Year"
            sx={{
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(196, 163, 109, 0.2)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(196, 163, 109, 0.4)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#C4A36D",
              },
            }}
          >
            <MenuItem value="">All Years</MenuItem>
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Paper>
  )
}
