import { useRef } from 'react';
import { Login, type LoginRef } from './Login';
import { Register } from './Registration';

export const AuthButtons = () => {
 
  const loginRef = useRef<LoginRef>(null);

  const handleLoginSuccess = () => {
   
    console.log("Login successful");
  };

  return (
    <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
     
      <Login ref={loginRef} onLoginSuccess={handleLoginSuccess} />
      
     
      <Register onSwitchToLogin={() => {
        if (loginRef.current) {
          loginRef.current.openLoginModal();
        }
      }} />
    </div>
  );
};