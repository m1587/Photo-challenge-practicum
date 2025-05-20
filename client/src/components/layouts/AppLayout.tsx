
import { useState, useRef } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Login, LoginRef } from '../../features/user/components/Login';
import { UserName } from '../../features/user/components/UserName';
import Register from '../../features/user/components/Registration';

const AppLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // יצירת רפרנס לקומפוננטת Login
  const loginRef = useRef<LoginRef>(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // פונקציה שתעבור לקומפוננטת Register
  const handleSwitchToLogin = () => {
    if (loginRef.current) {
      loginRef.current.openLoginModal();
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
            zIndex: 0,
          },
        }}
      >
        <Navbar />
        <Box
          sx={{
            position: "fixed",
            top: 80,
            left: 20,
            zIndex: 1100,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {isLoggedIn ? (
            <>
              <UserName />
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* העברת הרפרנס לקומפוננטת Login */}
              <Login ref={loginRef} onLoginSuccess={handleLoginSuccess} />
              {/* העברת פונקציית המעבר לקומפוננטת Register */}
              <Register onSwitchToLogin={handleSwitchToLogin} />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            mt: 8,
            p: 3,
            position: "relative",
            zIndex: 1,
            pt: 10,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
