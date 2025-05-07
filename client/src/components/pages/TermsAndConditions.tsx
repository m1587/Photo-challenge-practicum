
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Typography, 
  Button, 
  Box,
  Divider,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface TermsAndConditionsProps {
  open: boolean;
  onClose: () => void;
}

export function TermsAndConditions({ open, onClose }: TermsAndConditionsProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="terms-dialog-title"
    >
      <DialogTitle id="terms-dialog-title" sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        mb: 1
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Terms and Conditions</Typography>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ maxHeight: '70vh' }}>
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>1. Introduction</Typography>
          <Typography variant="body2" paragraph>
            Welcome to our photo contest platform. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these Terms.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>2. Definitions</Typography>
          <Typography variant="body2" paragraph>
            "Platform" refers to our website and services.
            "User", "You", and "Your" refers to you, the person accessing this platform.
            "Company", "We", "Us", and "Our" refers to the operators of this platform.
            "Content" refers to all materials uploaded to the platform, including but not limited to photos, text, and comments.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>3. Account Registration</Typography>
          <Typography variant="body2" paragraph>
            To participate in contests, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>4. Photo Submissions</Typography>
          <Typography variant="body2" paragraph>
            By submitting photos to our contests, you:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">
                Confirm that you own the copyright to the submitted photos or have permission from the copyright owner.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">
                Grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display the submitted photos for the purpose of operating and promoting the platform.
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">
                Understand that your photos may be viewed and voted on by other users.
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>5. Prohibited Content</Typography>
          <Typography variant="body2" paragraph>
            You may not submit photos that:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">Infringe on the intellectual property rights of others.</Typography>
            </Box>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">Contain explicit, obscene, or offensive content.</Typography>
            </Box>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">Depict violence or cruelty.</Typography>
            </Box>
            <Box component="li" sx={{ mb: 0.5 }}>
              <Typography variant="body2">Violate any applicable laws or regulations.</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>6. Voting and Contests</Typography>
          <Typography variant="body2" paragraph>
            We strive to maintain fair and transparent voting processes. Any attempt to manipulate votes through automated means or multiple accounts is prohibited and may result in disqualification.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>7. Privacy</Typography>
          <Typography variant="body2" paragraph>
            Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your personal information.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>8. Termination</Typography>
          <Typography variant="body2" paragraph>
            We reserve the right to terminate or suspend your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>9. Changes to Terms</Typography>
          <Typography variant="body2" paragraph>
            We may modify these Terms at any time. Your continued use of the platform after any changes indicates your acceptance of the modified Terms.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>10. Disclaimer of Warranties</Typography>
          <Typography variant="body2" paragraph>
            The platform is provided "as is" and "as available" without any warranties of any kind, either express or implied.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>11. Limitation of Liability</Typography>
          <Typography variant="body2" paragraph>
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>12. Governing Law</Typography>
          <Typography variant="body2" paragraph>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>13. Contact Information</Typography>
          <Typography variant="body2" paragraph>
            If you have any questions about these Terms, please contact us at support@photocontest.com.
          </Typography>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Last updated: April 11, 2025
          </Typography>
        </Box>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            bgcolor: "#C4A36D",
            "&:hover": {
              bgcolor: "#b3926a",
            }
          }}
        >
          I Understand
        </Button>
      </Box>
    </Dialog>
  );
}

export default TermsAndConditions;