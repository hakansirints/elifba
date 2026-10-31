import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/site-palettes.css';
import './styles/theme.css';
import './styles/video.css';
import './styles/glass-refraction.css';
import GlassFilters from './components/common/GlassFilters';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlassFilters />
    <App />
  </React.StrictMode>
);
