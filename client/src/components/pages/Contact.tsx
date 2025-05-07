import { Box, Typography, Container, TextField, Button, Grid, Paper, Snackbar, Alert } from "@mui/material"
import { motion } from "framer-motion"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import SendIcon from "@mui/icons-material/Send"
import { useState } from "react"
import axios from "axios"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSnackbarMessage("");
    setOpenSnackbar(false);

    try {
      console.log(formData);
      // שליחה לשרת דרך axios
      const response = await axios.post("https://localhost:7282/api/Contact/send-email", formData);
      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Message sent successfully!");
        setOpenSnackbar(true);

        setFormData({ name: "", email: "", subject: "", message: "" }); // איפוס השדות
      }
    } catch (err) {
      setSnackbarSeverity("error");
      setSnackbarMessage("There was an error sending the message. Please try again.");
      setOpenSnackbar(true);
    } finally {

      setLoading(false);
    }
  };
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
        pt: { xs: 10, md: 0 },
      }}
    >
      {/* Background with overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=2074)",
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

      {/* Content */}
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            textAlign: "center",
            mb: 6,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#C4A36D",
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "white",
              mt: 2,
              maxWidth: 600,
              mx: "auto",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          >
            We'd love to hear from you. Reach out with any questions or feedback.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, color: "#333", fontWeight: 600 }}>
                Send a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={handleChange}
                      label="Name"
                      name="name"
                      type="text"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0,0,0,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,0,0,0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      label="Email"
                      name="email"
                      type="email"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0,0,0,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,0,0,0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      value={formData.subject}
                      onChange={handleChange}
                      label="Subject"
                      name="subject"
                      type="text"
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0,0,0,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,0,0,0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      value={formData.message}
                      onChange={handleChange}
                      label="Message"
                      name="message"
                      type="text"
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "rgba(0,0,0,0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "rgba(0,0,0,0.3)",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{
                        bgcolor: "#C4A36D",
                        color: "white",
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                        "&:hover": {
                          bgcolor: "#b3926a",
                        },
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" sx={{ mb: 4, color: "white", fontWeight: 600 }}>
                Contact Information
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    mr: 2,
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(196, 163, 109, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EmailIcon sx={{ color: "#C4A36D" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    contact@photoimages.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    mr: 2,
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(196, 163, 109, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PhoneIcon sx={{ color: "#C4A36D" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    +972 50 123 4567
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    mr: 2,
                    p: 1.5,
                    borderRadius: "50%",
                    bgcolor: "rgba(196, 163, 109, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocationOnIcon sx={{ color: "#C4A36D" }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                    Address
                  </Typography>
                  <Typography variant="body1" sx={{ color: "white" }}>
                    Tel Aviv, Israel
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  )
}

export default Contact

