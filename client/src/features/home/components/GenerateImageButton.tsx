
import { useState } from "react"
import { Button, CircularProgress, Snackbar, Alert } from "@mui/material"
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh"
import axios from "axios"
interface GenerateImageButtonProps {
  prompt: string
  onImageGenerated?: (imageUrl: string) => void
  disabled?: boolean
}

const GenerateImageButton = ({ prompt, onImageGenerated, disabled = false }: GenerateImageButtonProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const generateImage = async (): Promise<void> => {
    if (!prompt) {
      setError("No prompt provided")
      setSnackbarMessage("Please provide a prompt for image generation")
      setSnackbarOpen(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get token from environment variable
      const token = import.meta.env.VITE_HF_TOKEN;

      if (!token) {
        throw new Error("Hugging Face token not found")
      }

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      
      if (!response.data.ok) {
        const data = await response.data.json()
        console.error("Error from model:", data)
        throw new Error(data.error || "An unexpected error occurred")
      }

      const blob = await response.data.blob()
      const imageObjectUrl = URL.createObjectURL(blob)

      // Call the callback with the generated image URL
      if (onImageGenerated) {
        onImageGenerated(imageObjectUrl)
      }

      // Success message
      setSnackbarMessage("Image generated successfully!")
      setSnackbarOpen(true)
      console.log("Image generated successfully:", imageObjectUrl)
    } catch (error) {
      console.error("General error:", error)
      setError(error instanceof Error ? error.message : "An error occurred while generating the image")
      setSnackbarMessage(error instanceof Error ? error.message : "An error occurred while generating the image")
      setSnackbarOpen(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
        onClick={generateImage}
        disabled={loading || disabled || !prompt}
        sx={{
          bgcolor: "#C4A36D",
          color: "white",
          fontWeight: 500,
          "&:hover": {
            bgcolor: "#b3926a",
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(196, 163, 109, 0.5)",
          },
        }}
      >
        {loading ? "Generating..." : "Generate AI Image"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default GenerateImageButton
