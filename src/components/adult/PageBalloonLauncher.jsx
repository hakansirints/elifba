import React, { useState } from 'react';
import { sfx } from '../../utils/audioPlayer';

export function PageBalloonLauncher({ lang = 'tr', disabled = false, onLaunch }) {
  const de = lang === 'de';
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    sfx.playPop();
    onLaunch?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div className="page-launcher-item">
      {/* Tooltip / Badge that pops up on hover: "Balon Patlat" */}
      <div className={`pbl-hover-badge ${isHovered ? 'is-visible' : ''}`} aria-hidden={!isHovered}>
        <span>{de ? 'Fliegende Ballons' : 'Balon Patlat'}</span>
        <span className="pbl-badge-arrow" />
      </div>

      {/* Balloon Icon Button */}
      <button
        type="button"
        className={`page-balloon-icon-btn ${isHovered ? 'is-hovered' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-label={de ? 'Fliegende Ballons: Spiel starten' : 'Balon Patlat: Oyunu başlat'}
        title={de ? 'Fliegende Ballons' : 'Balon Patlat'}
      >
        <svg
          viewBox="0 0 52 56"
          className="pbl-icon-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Primary Red 3D glossy gradient */}
            <radialGradient id="pblRed3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ff8a8a" />
              <stop offset="30%" stopColor="#ef4444" />
              <stop offset="75%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>

            {/* Cyan 3D gradient */}
            <radialGradient id="pblCyan3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="35%" stopColor="#0ea5e9" />
              <stop offset="75%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            {/* Amber 3D gradient */}
            <radialGradient id="pblAmber3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>

            {/* Specular glare reflection */}
            <linearGradient id="pblGlare3D" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Strings */}
          <path d="M15 28 Q 21 38 26 46" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M37 29 Q 31 39 26 46" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M26 35 L 26 46" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M26 46 Q 23 49 25 52 Q 28 55 24 56" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" />

          {/* Balloon Blue (left) */}
          <g>
            <ellipse cx="16" cy="19" rx="10.5" ry="12.5" transform="rotate(-8 16 19)" fill="url(#pblCyan3D)" />
            <ellipse cx="13" cy="15" rx="3" ry="4.5" transform="rotate(-24 13 15)" fill="url(#pblGlare3D)" />
            <polygon points="14.5,30 17.5,30 16.5,31.5 15,31.5" fill="#0284c7" />
          </g>

          {/* Balloon Amber (right) */}
          <g>
            <ellipse cx="37" cy="20" rx="10.5" ry="12.5" transform="rotate(8 37 20)" fill="url(#pblAmber3D)" />
            <ellipse cx="34" cy="16" rx="3" ry="4.5" transform="rotate(-12 34 16)" fill="url(#pblGlare3D)" />
            <polygon points="35.5,31 38.5,31 37.5,32.5 36,32.5" fill="#b45309" />
          </g>

          {/* Balloon Red (center front) */}
          <g>
            <ellipse cx="26" cy="21" rx="12.5" ry="15" fill="url(#pblRed3D)" />
            <ellipse cx="22" cy="15.5" rx="4" ry="6.5" transform="rotate(-22 22 15.5)" fill="url(#pblGlare3D)" />
            <polygon points="24,34.5 28,34.5 27,36.5 25,36.5" fill="#991b1b" />
            {/* Arabic letter 'ب' on red balloon */}
            <text
              x="26"
              y="25.5"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontWeight="900"
              fontFamily="'Amiri', 'Traditional Arabic', serif"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
            >
              ب
            </text>
          </g>

          {/* Sparkles */}
          <path d="M43 7 L44 10 L47 11 L44 12 L43 15 L42 12 L39 11 L42 10 Z" fill="#fbbf24" className="pbl-sparkle" />
          <path d="M7 11 L8 13 L10 14 L8 15 L7 17 L6 15 L4 14 L6 13 Z" fill="#38bdf8" className="pbl-sparkle pbl-sparkle-2" />
        </svg>
      </button>
    </div>
  );
}

export function PageListenLauncher({ lang = 'tr', disabled = false, onLaunch }) {
  const de = lang === 'de';
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    sfx.playStar();
    onLaunch?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div className="page-launcher-item">
      {/* Tooltip / Badge: "Dinle ve bul" */}
      <div className={`pbl-hover-badge pbl-hover-badge-teal ${isHovered ? 'is-visible' : ''}`} aria-hidden={!isHovered}>
        <span>{de ? 'Hören und finden' : 'Dinle ve bul'}</span>
        <span className="pbl-badge-arrow pbl-badge-arrow-teal" />
      </div>

      <button
        type="button"
        className={`page-listen-icon-btn ${isHovered ? 'is-hovered' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        aria-label={de ? 'Hören und finden: Übung starten' : 'Dinle ve bul: Etkinliği başlat'}
        title={de ? 'Hören und finden' : 'Dinle ve bul'}
      >
        <svg
          viewBox="0 0 52 56"
          className="pbl-icon-svg pll-icon-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="pllTeal3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#5eead4" />
              <stop offset="35%" stopColor="#14b8a6" />
              <stop offset="75%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#042f2e" />
            </radialGradient>
            <radialGradient id="pllAmber3D" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
          </defs>

          {/* Sound waves left */}
          <path d="M7 23 C5.5 25.5 5.5 30.5 7 33" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M4 19 C1.5 24 1.5 32 4 37" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

          {/* Sound waves right */}
          <path d="M45 23 C46.5 25.5 46.5 30.5 45 33" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M48 19 C50.5 24 50.5 32 48 37" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />

          {/* Headband arch */}
          <path d="M12 28 C12 15 20 9 26 9 C32 9 40 15 40 28" fill="none" stroke="#0f766e" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M19 12 C21.5 10.5 24 10 26 10 C28 10 30.5 10.5 33 12" fill="none" stroke="#2dd4bf" strokeWidth="2.4" strokeLinecap="round" />

          {/* Left Ear Cushion */}
          <g>
            <rect x="9.5" y="24" width="7" height="15" rx="3.5" fill="url(#pllTeal3D)" stroke="#042f2e" strokeWidth="1" />
            <rect x="14" y="26" width="2.5" height="11" rx="1.2" fill="#ccfbf1" opacity="0.85" />
          </g>

          {/* Right Ear Cushion */}
          <g>
            <rect x="35.5" y="24" width="7" height="15" rx="3.5" fill="url(#pllTeal3D)" stroke="#042f2e" strokeWidth="1" />
            <rect x="35.5" y="26" width="2.5" height="11" rx="1.2" fill="#ccfbf1" opacity="0.85" />
          </g>

          {/* Center Musical Note in Amber */}
          <path d="M26 22 L26 33" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="23" cy="33.5" r="3" fill="#f59e0b" />
          <path d="M26 23 C29 23 31 25.5 31 28" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" />

          {/* Top golden sparkle */}
          <path d="M26 3 L27 5.5 L30 6.5 L27 7.5 L26 10 L25 7.5 L22 6.5 L25 5.5 Z" fill="#fbbf24" className="pbl-sparkle" />
        </svg>
      </button>
    </div>
  );
}

export default function Page14ActivityLaunchers({ lang = 'tr', disabled = false, onLaunchBalloon, onLaunchListen }) {
  return (
    <div className="page-activity-launchers-row">
      <PageBalloonLauncher lang={lang} disabled={disabled} onLaunch={onLaunchBalloon} />
      <PageListenLauncher lang={lang} disabled={disabled} onLaunch={onLaunchListen} />
    </div>
  );
}
