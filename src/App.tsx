import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './shared/context/ThemeContext';
import { AuthProvider } from './shared/context/AuthContext';
import ErrorBoundary from './shared/components/Effects/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

function SkipToContent() {
  return (
    <a href="#main-content" className="sr-only">
      Skip to content
    </a>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <SkipToContent />
            <AppRoutes />
            <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
