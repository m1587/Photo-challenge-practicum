import { useRef } from 'react';
import { Login, type LoginRef } from './Login';
import { Register } from './Registration';

export const AuthButtons = () => {
  // רפרנס לפונקציה שפותחת את מודל ההתחברות
  const loginRef = useRef<LoginRef>(null);

  const handleLoginSuccess = () => {
    // לוגיקה שתרוץ לאחר התחברות מוצלחת
    console.log("Login successful");
  };

  return (
    <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
      {/* העברת רפרנס לקומפוננטת Login */}
      <Login ref={loginRef} onLoginSuccess={handleLoginSuccess} />
      
      {/* העברת פונקציה שפותחת את מודל ההתחברות */}
      <Register onSwitchToLogin={() => {
        if (loginRef.current) {
          loginRef.current.openLoginModal();
        }
      }} />
    </div>
  );
};