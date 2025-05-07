import { createBrowserRouter } from 'react-router-dom';
import AppLayout from './components/layouts/AppLayout';
import Contact from './components/pages/Contact';
import PreviousChallenges from './components/challenges/PreviousChallenges';
import Home from './components/home/Home';
import TermsAndConditions from './components/pages/TermsAndConditions';
import ResetPasswordPage from './components/user/ResetPasswordPage';
import { Login } from './components/user/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/Contact',
        element: <Contact />,
      },
      {
        path: '/previous-challenges',
        element: <PreviousChallenges />,
      },
      {
        path: '/terms-and-conditions',
        element: <TermsAndConditions open={true} onClose={() => {}} />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/login',
        element: <Login onLoginSuccess={() => console.log('Login successful')} />,
      }
    ],
  },
]);
