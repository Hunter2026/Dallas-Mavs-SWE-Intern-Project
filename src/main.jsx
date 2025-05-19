// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// Main App
import App from './App.jsx';

// Global styles (optional)
import './style.css';

// Material UI theming
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // import your custom theme

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* applies theme's background.default */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
