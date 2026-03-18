import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from '../common/Footer';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout-root">
      <Navbar variant="dark" />
      <main className="layout-main">
        {children ?? <Outlet />}
      </main>
      <Footer className="footer-dark" />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1c1e26',
            color: '#f5f0e8',
            border: '1px solid #2e3142',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontFamily: "'Instrument Sans', sans-serif",
          },
          success: {
            iconTheme: { primary: '#34c77b', secondary: '#1c1e26' },
          },
          error: {
            iconTheme: { primary: '#e05a5a', secondary: '#1c1e26' },
          },
        }}
      />
    </div>
  );
}