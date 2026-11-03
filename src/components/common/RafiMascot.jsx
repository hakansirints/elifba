import React from 'react';

/**
 * Rafi (Canlı Kitapçık) - Elif-Ba Maskotu
 * 
 * Özellikler:
 * - Gövdeye bağlı kıvrımlı kollar ve beyaz eldivenli eller
 * - Altta ayak/bacak görevi gören çift kırlangıç kuyruğu kitap ayracı
 * - Başarı: Neşeyle zıplama, kollar havada zafer pozu, bacak tekmeleri, konfeti
 * - Başarısızlık / Teşvik: Gözyaşı YOK! Sevimli, motive edici, "Bir daha dene!" başparmak hareketi
 * - Düşünme: Çenede el, havada ipucu balonu, ritmik ayak vuruşu
 * - Boşta: Canlı göz kırpma, nefes alma ve dostça el sallama
 */
export default function RafiMascot({ state = 'idle', happy = false, tone, className = '' }) {
  // Durum çözümleme: happy veya tone parametreleriyle geriye dönük tam uyum
  let resolvedState = state;
  if (happy) {
    resolvedState = 'success';
  } else if (tone) {
    if (['correct', 'match', 'complete'].includes(tone)) {
      resolvedState = 'success';
    } else if (['encourage', 'wrong', 'try-again', 'mismatch', 'fail', 'sad'].includes(tone)) {
      resolvedState = 'fail';
    } else if (['ready', 'prompt', 'listen'].includes(tone)) {
      resolvedState = 'think';
    }
  }

  if (resolvedState === 'success') {
    return (
      <svg
        viewBox="0 0 160 160"
        className={`rafi-mascot rafi-success overflow-visible ${className}`}
        style={{ animation: 'rafi-jump 0.85s cubic-bezier(0.28, 0.84, 0.42, 1) infinite' }}
        aria-hidden="true"
        focusable="false"
      >
        {/* Parıldayan Yıldızlar */}
        <g style={{ animation: 'rafi-star-spin 3s linear infinite', transformOrigin: '80px 75px' }}>
          <polygon points="20,20 23,28 32,29 25,35 27,43 20,38 13,43 15,35 8,29 17,28" fill="#facc15" opacity="0.9" />
          <polygon points="140,20 143,28 152,29 145,35 147,43 140,38 133,43 135,35 128,29 137,28" fill="#facc15" opacity="0.9" />
          <circle cx="28" cy="70" r="3" fill="#e78a4e" />
          <circle cx="132" cy="70" r="3" fill="#22c55e" />
        </g>

        {/* Taban Gölgesi */}
        <ellipse cx="80" cy="154" rx="42" ry="6" fill="#000000" opacity="0.25" />

        {/* İKİ ADET AYRAÇ BACAK (Neşeyle tekmeler atan ayaklar) */}
        <g style={{ transformOrigin: '60px 124px', animation: 'rafi-leg-kick-left 0.85s ease-in-out infinite' }}>
          <path d="M 54,122 L 54,150 L 61,143 L 68,150 L 68,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <line x1="61" y1="124" x2="61" y2="140" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </g>
        <g style={{ transformOrigin: '100px 124px', animation: 'rafi-leg-kick-right 0.85s ease-in-out infinite' }}>
          <path d="M 92,122 L 92,150 L 99,143 L 106,150 L 106,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <line x1="99" y1="124" x2="99" y2="140" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Kitap Gövdesi (Zümrüt Yeşil Kapak) */}
        <rect x="36" y="38" width="88" height="90" rx="20" fill="#14654f" stroke="#22c55e" strokeWidth="3" />
        
        {/* Altın Köşe Muhafazaları */}
        <path d="M 36,52 L 36,38 L 50,38 Z" fill="#fbbf24" />
        <path d="M 124,52 L 124,38 L 110,38 Z" fill="#fbbf24" />
        <path d="M 36,114 L 36,128 L 50,128 Z" fill="#fbbf24" />
        <path d="M 124,114 L 124,128 L 110,128 Z" fill="#fbbf24" />

        {/* Krem Sayfalar */}
        <path d="M 44,47 Q 80,53 116,47 L 116,117 Q 80,123 44,117 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <line x1="80" y1="50" x2="80" y2="120" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="2,3" />

        {/* Mutlu Kavisli Kapalı Gözler */}
        <path d="M 54,76 Q 63,63 72,76" fill="none" stroke="#1c1917" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 88,76 Q 97,63 106,76" fill="none" stroke="#1c1917" strokeWidth="4.5" strokeLinecap="round" />

        {/* Pembe Yanaklar */}
        <ellipse cx="53" cy="85" rx="7.5" ry="4.5" fill="#f43f5e" opacity="0.65" />
        <ellipse cx="107" cy="85" rx="7.5" ry="4.5" fill="#f43f5e" opacity="0.65" />

        {/* Büyük Neşeli Ağız */}
        <path d="M 68,85 Q 80,103 92,85 Z" fill="#991b1b" />
        <path d="M 72,87 Q 80,94 88,87 Z" fill="#f43f5e" />

        {/* GÖVDEYE BAĞLI KOLLAR (Havaya kalkan zafer kolları) */}
        <g style={{ transformOrigin: '38px 76px', animation: 'rafi-cheer-arm-left 0.85s ease-in-out infinite' }}>
          <path d="M 38,76 Q 22,54 20,38" fill="none" stroke="#14654f" strokeWidth="6" strokeLinecap="round" />
          <circle cx="19" cy="36" r="8" fill="#ffffff" stroke="#14654f" strokeWidth="2.5" />
          <circle cx="25" cy="38" r="3" fill="#ffffff" stroke="#14654f" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '122px 76px', animation: 'rafi-cheer-arm-right 0.85s ease-in-out infinite' }}>
          <path d="M 122,76 Q 138,54 140,38" fill="none" stroke="#14654f" strokeWidth="6" strokeLinecap="round" />
          <circle cx="141" cy="36" r="8" fill="#ffffff" stroke="#14654f" strokeWidth="2.5" />
          <circle cx="135" cy="38" r="3" fill="#ffffff" stroke="#14654f" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (['fail', 'sad', 'wrong'].includes(resolvedState)) {
    // HATALI CEVAP / ÜZGÜN MOD: Masum, üzgün/mahzun bakışlar, aşağı kıvrık dudaklar ve sevimli gözyaşı damlası
    return (
      <svg
        viewBox="0 0 160 160"
        className={`rafi-mascot rafi-sad rafi-fail overflow-visible ${className}`}
        style={{ animation: 'rafi-sad 2.4s ease-in-out infinite' }}
        aria-hidden="true"
        focusable="false"
      >
        <ellipse cx="80" cy="154" rx="36" ry="5.5" fill="#000000" opacity="0.22" />

        {/* İki Ayraç Ayak (Biraz mahzun, içe dönük duruş) */}
        <g style={{ transformOrigin: '62px 124px', transform: 'rotate(3deg)' }}>
          <path d="M 55,122 L 55,148 L 62,142 L 69,148 L 69,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <line x1="62" y1="124" x2="62" y2="139" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>
        <g style={{ transformOrigin: '98px 124px', transform: 'rotate(-3deg)' }}>
          <path d="M 91,122 L 91,148 L 98,142 L 105,148 L 105,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
          <line x1="98" y1="124" x2="98" y2="139" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Kitap Gövdesi */}
        <rect x="36" y="42" width="88" height="90" rx="18" fill="#14654f" stroke="#22c55e" strokeWidth="2.5" />
        
        {/* Altın Köşe Muhafazaları */}
        <path d="M 36,54 L 36,42 L 48,42 Z" fill="#fbbf24" opacity="0.8" />
        <path d="M 124,54 L 124,42 L 112,42 Z" fill="#fbbf24" opacity="0.8" />
        <path d="M 36,118 L 36,130 L 48,130 Z" fill="#fbbf24" opacity="0.8" />
        <path d="M 124,118 L 124,130 L 112,130 Z" fill="#fbbf24" opacity="0.8" />

        {/* Krem Sayfalar */}
        <path d="M 44,50 Q 80,56 116,50 L 116,118 Q 80,124 44,118 Z" fill="#fef3c7" />
        <line x1="80" y1="53" x2="80" y2="120" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2,3" opacity="0.6" />

        {/* Üzgün/Mahzun Kaşlar (Ortası yukarı kalkık, kenarları düşük) */}
        <path d="M 54,63 Q 63,69 72,63" fill="none" stroke="#1c1917" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M 88,63 Q 97,69 106,63" fill="none" stroke="#1c1917" strokeWidth="3.4" strokeLinecap="round" />

        {/* Büyük Islak Üzgün Gözler */}
        <circle cx="63" cy="78" r="8.5" fill="#1c1917" />
        <circle cx="65.5" cy="76" r="3" fill="#ffffff" />
        <circle cx="61" cy="81" r="1.5" fill="#ffffff" opacity="0.8" />
        
        <circle cx="97" cy="78" r="8.5" fill="#1c1917" />
        <circle cx="94.5" cy="76" r="3" fill="#ffffff" />
        <circle cx="99" cy="81" r="1.5" fill="#ffffff" opacity="0.8" />

        {/* Sevimli Gözyaşı Damlası */}
        <g style={{ animation: 'rafi-teardrop 2s ease-in-out infinite' }}>
          <path d="M 108,83 C 108,80 113,76 113,76 C 113,76 118,80 118,83 C 118,86.2 115.8,88.5 113,88.5 C 110.2,88.5 108,86.2 108,83 Z" fill="#38bdf8" opacity="0.95" />
          <circle cx="114" cy="82" r="1.1" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Hafif Kızarık Mahzun Yanaklar */}
        <ellipse cx="53" cy="86" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />
        <ellipse cx="107" cy="86" rx="6" ry="3.5" fill="#f43f5e" opacity="0.4" />

        {/* Aşağı Kıvrık Üzgün Ağız (Frown / Üzgün Dudak) */}
        <path d="M 72,94 Q 80,84 88,94" fill="none" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />

        {/* GÖVDEYE BAĞLI AŞAĞI SARKAN ÜZGÜN KOLLAR */}
        <g style={{ transformOrigin: '38px 78px' }}>
          <path d="M 38,78 Q 26,92 32,106" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="32" cy="107" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
        </g>

        <g style={{ transformOrigin: '122px 78px' }}>
          <path d="M 122,78 Q 134,92 128,106" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="128" cy="107" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  if (resolvedState === 'think') {
    return (
      <svg
        viewBox="0 0 160 160"
        className={`rafi-mascot rafi-think overflow-visible ${className}`}
        style={{ animation: 'rafi-idle 2.8s ease-in-out infinite', transformOrigin: '80px 120px' }}
        aria-hidden="true"
        focusable="false"
      >
        {/* Düşünce Balonu */}
        <g transform="translate(104, 12)">
          <circle cx="6" cy="24" r="3" fill="#cbd5e1" />
          <circle cx="12" cy="15" r="4.5" fill="#cbd5e1" />
          <ellipse cx="26" cy="6" rx="15" ry="12" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.8" />
          <text x="26" y="11" fontSize="15" fontWeight="900" fill="#e78a4e" textAnchor="middle" fontFamily="system-ui">?</text>
        </g>

        <ellipse cx="80" cy="154" rx="38" ry="6" fill="#000000" opacity="0.25" />

        {/* Ayaklar (Sağ ayak düşünceli tık tık ritmi) */}
        <g style={{ transformOrigin: '62px 124px' }}>
          <path d="M 55,122 L 55,148 L 62,142 L 69,148 L 69,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: '98px 124px', animation: 'rafi-foot-tap 1.2s ease-in-out infinite' }}>
          <path d="M 91,122 L 91,148 L 98,142 L 105,148 L 105,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        </g>

        <rect x="36" y="40" width="88" height="90" rx="18" fill="#14654f" stroke="#22c55e" strokeWidth="2.5" />
        <path d="M 44,48 Q 80,54 116,48 L 116,118 Q 80,124 44,118 Z" fill="#fef3c7" />

        <circle cx="62" cy="74" r="9" fill="#1c1917" />
        <circle cx="66" cy="70" r="3.5" fill="#ffffff" />
        <circle cx="98" cy="74" r="9" fill="#1c1917" />
        <circle cx="102" cy="70" r="3.5" fill="#ffffff" />

        <path d="M 52,65 Q 62,56 72,64" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 90,67 Q 99,67 108,61" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="80" cy="91" r="4.5" fill="#1c1917" />

        {/* Kollar: Sol kalçada, Sağ çenede */}
        <g style={{ transformOrigin: '38px 80px' }}>
          <path d="M 38,80 Q 22,88 32,98" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="35" cy="98" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
        </g>
        <g style={{ transformOrigin: '122px 80px' }}>
          <path d="M 122,80 Q 128,98 96,98" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="92" cy="96" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
          <ellipse cx="88" cy="92" rx="3" ry="5" fill="#ffffff" stroke="#14654f" strokeWidth="1.5" transform="rotate(-30 88 92)" />
        </g>
      </svg>
    );
  }

  // IDLE / BOŞTA (Varsayılan)
  return (
    <svg
      viewBox="0 0 160 160"
      className={`rafi-mascot rafi-idle overflow-visible ${className}`}
      style={{ animation: 'rafi-idle 3s ease-in-out infinite' }}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="80" cy="154" rx="40" ry="6" fill="#000000" opacity="0.25" />

      {/* İki Ayraç Ayak */}
      <g style={{ transformOrigin: '62px 124px', animation: 'rafi-breathe 3s ease-in-out infinite' }}>
        <path d="M 55,122 L 55,148 L 62,142 L 69,148 L 69,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <line x1="62" y1="124" x2="62" y2="139" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>
      <g style={{ transformOrigin: '98px 124px', animation: 'rafi-breathe 3s ease-in-out infinite' }}>
        <path d="M 91,122 L 91,148 L 98,142 L 105,148 L 105,122 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
        <line x1="98" y1="124" x2="98" y2="139" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Gövde */}
      <rect x="36" y="40" width="88" height="90" rx="18" fill="#14654f" stroke="#22c55e" strokeWidth="2.5" />
      <path d="M 44,48 Q 80,54 116,48 L 116,118 Q 80,124 44,118 Z" fill="#fef3c7" />
      <line x1="80" y1="52" x2="80" y2="120" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="2,3" />

      {/* Göz Kırpma */}
      <g style={{ transformOrigin: '80px 76px', animation: 'rafi-blink 4.5s infinite' }}>
        <circle cx="62" cy="76" r="8.5" fill="#1c1917" />
        <circle cx="64.5" cy="73.5" r="3" fill="#ffffff" />
        <circle cx="98" cy="76" r="8.5" fill="#1c1917" />
        <circle cx="100.5" cy="73.5" r="3" fill="#ffffff" />
      </g>

      <ellipse cx="53" cy="84" rx="6.5" ry="3.5" fill="#f43f5e" opacity="0.5" />
      <ellipse cx="107" cy="84" rx="6.5" ry="3.5" fill="#f43f5e" opacity="0.5" />
      <path d="M 72,85 Q 80,94 88,85" fill="none" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />

      {/* Gövdeye Bağlı Kollar (Sol el selam veriyor, Sağ kol yanda) */}
      <g style={{ transformOrigin: '38px 76px', animation: 'rafi-wave-arm 1.5s ease-in-out infinite' }}>
        <path d="M 38,76 Q 20,68 18,50" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="18" cy="48" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
        <circle cx="23" cy="51" r="2.8" fill="#ffffff" stroke="#14654f" strokeWidth="1.2" />
      </g>

      <g style={{ transformOrigin: '122px 76px' }}>
        <path d="M 122,76 Q 134,84 134,95" fill="none" stroke="#14654f" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="134" cy="98" r="7.5" fill="#ffffff" stroke="#14654f" strokeWidth="2" />
      </g>
    </svg>
  );
}
