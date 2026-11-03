import React, { useState } from 'react';
import { sfx } from '../../utils/audioPlayer';

/**
 * Modern Minimalist 3D Fold-Over Ribbon Tab for Balloon Game
 * (2. Görsel referansı: Sayfa kenarını saran pürüzsüz saten kurdele)
 */
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
    <div className="ribbon-fold-tab-item">
      <button
        type="button"
        className={`ribbon-fold-btn ribbon-fold-btn-red ${isHovered ? 'is-hovered' : ''}`}
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
          viewBox="0 0 135 62"
          className="ribbon-fold-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Drop shadow for the ribbon flap onto the page */}
            <filter id="ribbonRedShadow" x="-10%" y="-10%" width="130%" height="150%">
              <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#000000" floodOpacity="0.22" />
            </filter>

            {/* Smooth Red Ribbon Gradient (Image 2 style) */}
            <linearGradient id="ribbonRedMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef3e36" />
              <stop offset="12%" stopColor="#ff5952" />
              <stop offset="28%" stopColor="#f8433a" />
              <stop offset="80%" stopColor="#f03c35" />
              <stop offset="100%" stopColor="#eb332b" />
            </linearGradient>

            {/* Dark Underside shadow of the loop */}
            <linearGradient id="ribbonRedDarkUnder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#80100c" />
              <stop offset="100%" stopColor="#b31e18" />
            </linearGradient>

            {/* Cylinder Specular Highlight Strip */}
            <linearGradient id="cylinderHighlightRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Underside Roll at bottom-left (emerging from behind the page sheet) */}
          <path
            d="
              M 24 51
              C 24 51 16 58 8 56
              C 2 54 0 47 0 47
              L 0 50
              C 0 55 6 59 14 59
              C 20 59 24 53 24 51
              Z
            "
            fill="url(#ribbonRedDarkUnder)"
          />

          {/* 2. Main Ribbon Body (Cylinder Loop + Flat Flap with Semicircular Cap) */}
          <g filter="url(#ribbonRedShadow)">
            <path
              d="
                M 24 10
                C 14 10 0 14 0 24
                L 0 47
                C 0 47 6 53 14 53
                C 20 53 24 50 24 50
                L 106 50
                C 121 50 133 41 133 30
                C 133 19 121 10 106 10
                Z
              "
              fill="url(#ribbonRedMain)"
            />

            {/* Cylinder highlight band on the left fold */}
            <path
              d="
                M 12 11
                C 6 13 4 18 4 25
                L 4 45
                C 6 50 11 52 14 52
                L 18 52
                C 14 50 10 45 10 37
                L 10 21
                C 10 15 14 12 18 11
                Z
              "
              fill="url(#cylinderHighlightRed)"
            />
          </g>

          {/* Minimalist Clean White Balloon Icon in the visible flap */}
          <g transform="translate(64, 18) scale(0.64)" opacity="0.95">
            <ellipse cx="20" cy="18" rx="14" ry="17" fill="#ffffff" />
            <polygon points="17,35 23,35 21,38 19,38" fill="#ffffff" />
            <path d="M 11 12 C 13 8 18 7 21 8" stroke="#f03c35" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.35" />
            <path d="M 20 38 Q 23 42 20 45 Q 17 48 20 51" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </g>
        </svg>

        {/* Hover Label Badge */}
        <span className={`ribbon-edge-badge ribbon-edge-badge-red ${isHovered ? 'is-visible' : ''}`} aria-hidden={!isHovered}>
          <span>🎈</span>
          <span>{de ? 'Fliegende Ballons' : 'Balon Patlat'}</span>
          <span className="ribbon-badge-arrow">▸</span>
        </span>
      </button>
    </div>
  );
}

/**
 * Modern Minimalist 3D Fold-Over Ribbon Tab for Listen Activity
 * (Site zümrüt yeşili temasıyla uyumlu sade kurdele)
 */
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
    <div className="ribbon-fold-tab-item">
      <button
        type="button"
        className={`ribbon-fold-btn ribbon-fold-btn-green ${isHovered ? 'is-hovered' : ''}`}
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
          viewBox="0 0 135 62"
          className="ribbon-fold-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Drop shadow */}
            <filter id="ribbonGreenShadow" x="-10%" y="-10%" width="130%" height="150%">
              <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#000000" floodOpacity="0.22" />
            </filter>

            {/* Smooth Emerald Ribbon Gradient matching site theme */}
            <linearGradient id="ribbonGreenMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="12%" stopColor="#10b981" />
              <stop offset="28%" stopColor="#059669" />
              <stop offset="80%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>

            {/* Underside shadow */}
            <linearGradient id="ribbonGreenDarkUnder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#022c22" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Cylinder Specular Highlight Strip */}
            <linearGradient id="cylinderHighlightGreen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Underside Roll */}
          <path
            d="
              M 24 51
              C 24 51 16 58 8 56
              C 2 54 0 47 0 47
              L 0 50
              C 0 55 6 59 14 59
              C 20 59 24 53 24 51
              Z
            "
            fill="url(#ribbonGreenDarkUnder)"
          />

          {/* 2. Main Ribbon Body */}
          <g filter="url(#ribbonGreenShadow)">
            <path
              d="
                M 24 10
                C 14 10 0 14 0 24
                L 0 47
                C 0 47 6 53 14 53
                C 20 53 24 50 24 50
                L 106 50
                C 121 50 133 41 133 30
                C 133 19 121 10 106 10
                Z
              "
              fill="url(#ribbonGreenMain)"
            />

            {/* Cylinder Highlight Strip */}
            <path
              d="
                M 12 11
                C 6 13 4 18 4 25
                L 4 45
                C 6 50 11 52 14 52
                L 18 52
                C 14 50 10 45 10 37
                L 10 21
                C 10 15 14 12 18 11
                Z
              "
              fill="url(#cylinderHighlightGreen)"
            />
          </g>

          {/* Minimalist Clean White Headphone Icon */}
          <g transform="translate(63, 19) scale(0.61)" opacity="0.95">
            <path d="M 7 24 C 7 13 15 6 24 6 C 33 6 41 13 41 24" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
            <rect x="5" y="21" width="7" height="15" rx="3.5" fill="#ffffff" />
            <rect x="36" y="21" width="7" height="15" rx="3.5" fill="#ffffff" />
            <path d="M 23 20 L 23 28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="21" cy="28.5" r="2.8" fill="#ffffff" />
          </g>
        </svg>

        {/* Hover Label Badge */}
        <span className={`ribbon-edge-badge ribbon-edge-badge-teal ${isHovered ? 'is-visible' : ''}`} aria-hidden={!isHovered}>
          <span>🎧</span>
          <span>{de ? 'Hören und finden' : 'Dinle ve bul'}</span>
          <span className="ribbon-badge-arrow" style={{ color: '#34d399' }}>▸</span>
        </span>
      </button>
    </div>
  );
}

/**
 * Sayfa 14 Sol Orta Kenar Etkinlik Başlatıcıları
 */
export default function Page14ActivityLaunchers({ lang = 'tr', disabled = false, onLaunchBalloon, onLaunchListen }) {
  const de = lang === 'de';
  return (
    <div
      className="page-edge-ribbon-launchers"
      role="region"
      aria-label={de ? 'Seitenaktivitäten' : 'Sayfa etkinlikleri'}
    >
      <PageBalloonLauncher lang={lang} disabled={disabled} onLaunch={onLaunchBalloon} />
      <PageListenLauncher lang={lang} disabled={disabled} onLaunch={onLaunchListen} />
    </div>
  );
}
