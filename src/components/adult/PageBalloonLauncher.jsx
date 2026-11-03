import React, { useState } from 'react';
import { sfx } from '../../utils/audioPlayer';

/**
 * 3D Curled Fold-Over Ribbon Tab for Balloon Game
 * Sayfanın altından/arkasından çıkıp sol orta kenar üzerine katlanan kırmızı 3D kurdele
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
          viewBox="0 0 84 48"
          className="ribbon-fold-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* 3D Crimson Gradient matching user's folded ribbon */}
            <linearGradient id="foldCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="12%" stopColor="#991b1b" />
              <stop offset="35%" stopColor="#dc2626" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>

            {/* Ambient Shadow inside the curls */}
            <radialGradient id="foldCurlDarkRed" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="85%" stopColor="#250303" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Gold Filigree Stroke */}
            <linearGradient id="foldGoldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Specular Glare */}
            <linearGradient id="foldRedGlare" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Top Curl Inner Hollow (emerging from behind the page sheet) */}
          <path d="M 14 6 C 10 6 4 4 2 8 C 0 12 3 16 8 15 Z" fill="url(#foldCurlDarkRed)" />
          {/* Bottom Curl Inner Hollow */}
          <path d="M 14 42 C 10 42 4 44 2 40 C 0 36 3 32 8 33 Z" fill="url(#foldCurlDarkRed)" />

          {/* Main Curled Fold-Over Ribbon Body: wraps at x=14 and extends to x=78 with rounded dome end */}
          <path
            d="
              M 14 6
              C 10 6 3 3 1 7
              C -1 11 2 16 8 15
              L 12 15
              L 12 33
              L 8 33
              C 2 32 -1 37 1 41
              C 3 45 10 42 14 42
              L 68 42
              C 76 42 82 36 82 28
              L 82 20
              C 82 12 76 6 68 6
              Z
            "
            fill="url(#foldCrimsonGrad)"
            stroke="url(#foldGoldBorder)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Specular Highlight along top fold surface */}
          <path d="M 14 9 L 68 9 C 73 9 77 12 78 16 L 14 16 Z" fill="url(#foldRedGlare)" />

          {/* Crease line where ribbon wraps over page edge at x=14 */}
          <line x1="14" y1="6" x2="14" y2="42" stroke="#450a0a" strokeWidth="1.2" opacity="0.7" />
          <line x1="15" y1="6" x2="15" y2="42" stroke="#fca5a5" strokeWidth="0.8" opacity="0.6" />

          {/* High-Res 3D Balloon Icon inside the tab */}
          <g transform="translate(36, 6) scale(0.68)">
            {/* Strings */}
            <path d="M15 28 Q 21 38 26 46" stroke="#fef08a" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M37 29 Q 31 39 26 46" stroke="#fef08a" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M26 35 L 26 46" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
            {/* Blue Balloon (left) */}
            <ellipse cx="16" cy="19" rx="10" ry="12" fill="#0284c7" />
            <ellipse cx="13" cy="15" rx="3" ry="4" fill="#ffffff" opacity="0.7" />
            {/* Gold Balloon (right) */}
            <ellipse cx="37" cy="20" rx="10" ry="12" fill="#d97706" />
            <ellipse cx="34" cy="16" rx="3" ry="4" fill="#ffffff" opacity="0.7" />
            {/* Center Red Balloon with Letter 'ب' */}
            <ellipse cx="26" cy="21" rx="12.5" ry="15" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
            <ellipse cx="22" cy="15.5" rx="4" ry="6" fill="#ffffff" opacity="0.8" />
            <text
              x="26.5"
              y="26"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12"
              fontWeight="900"
              fontFamily="'Amiri', serif"
            >
              ب
            </text>
          </g>
        </svg>

        {/* Hover Label Badge extending into the right margin */}
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
 * 3D Curled Fold-Over Ribbon Tab for Listen Activity
 * Sayfanın altından/arkasından çıkıp sol orta kenar üzerine katlanan zümrüt 3D kurdele
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
          viewBox="0 0 84 48"
          className="ribbon-fold-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* 3D Emerald Gradient matching app brand */}
            <linearGradient id="foldEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="12%" stopColor="#065f46" />
              <stop offset="35%" stopColor="#059669" />
              <stop offset="85%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Ambient Shadow inside green curls */}
            <radialGradient id="foldCurlDarkGreen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#022c22" />
              <stop offset="85%" stopColor="#011812" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Specular Glare */}
            <linearGradient id="foldGreenGlare" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Top Curl Inner Hollow */}
          <path d="M 14 6 C 10 6 4 4 2 8 C 0 12 3 16 8 15 Z" fill="url(#foldCurlDarkGreen)" />
          {/* Bottom Curl Inner Hollow */}
          <path d="M 14 42 C 10 42 4 44 2 40 C 0 36 3 32 8 33 Z" fill="url(#foldCurlDarkGreen)" />

          {/* Main Curled Fold-Over Ribbon Body */}
          <path
            d="
              M 14 6
              C 10 6 3 3 1 7
              C -1 11 2 16 8 15
              L 12 15
              L 12 33
              L 8 33
              C 2 32 -1 37 1 41
              C 3 45 10 42 14 42
              L 68 42
              C 76 42 82 36 82 28
              L 82 20
              C 82 12 76 6 68 6
              Z
            "
            fill="url(#foldEmeraldGrad)"
            stroke="url(#foldGoldBorder)"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />

          {/* Specular Highlight along top fold surface */}
          <path d="M 14 9 L 68 9 C 73 9 77 12 78 16 L 14 16 Z" fill="url(#foldGreenGlare)" />

          {/* Crease line where ribbon wraps over page edge */}
          <line x1="14" y1="6" x2="14" y2="42" stroke="#022c22" strokeWidth="1.2" opacity="0.7" />
          <line x1="15" y1="6" x2="15" y2="42" stroke="#a7f3d0" strokeWidth="0.8" opacity="0.6" />

          {/* High-Res 3D Headphone Icon */}
          <g transform="translate(37, 6) scale(0.68)">
            {/* Sound waves */}
            <path d="M7 23 C5.5 25.5 5.5 30.5 7 33" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M45 23 C46.5 25.5 46.5 30.5 45 33" stroke="#fef08a" strokeWidth="2.5" strokeLinecap="round" />
            {/* Headband arch */}
            <path d="M12 28 C12 15 20 9 26 9 C32 9 40 15 40 28" fill="none" stroke="#fef08a" strokeWidth="4.5" strokeLinecap="round" />
            {/* Ear Cushions */}
            <rect x="9.5" y="24" width="7" height="15" rx="3.5" fill="#042f2e" stroke="#fef08a" strokeWidth="1.2" />
            <rect x="35.5" y="24" width="7" height="15" rx="3.5" fill="#042f2e" stroke="#fef08a" strokeWidth="1.2" />
            {/* Golden Musical Note in Center */}
            <path d="M26 21 L26 33" stroke="#fef08a" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="23" cy="33.5" r="3.2" fill="#fef08a" />
            <path d="M26 22 C29 22 31 24.5 31 27" fill="none" stroke="#fef08a" strokeWidth="2.4" strokeLinecap="round" />
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
