import React from 'react';
import { Balloon, Headphones } from 'lucide-react';
import { sfx } from '../../utils/audioPlayer';
import '../../styles/page14-launchers.css';

function ActivityLauncher({ activity, lang = 'tr', disabled = false, onLaunch }) {
  const de = lang === 'de';
  const balloon = activity === 'balloon';
  const title = balloon ? (de ? 'Fliegende Ballons' : 'Balon Patlat') : (de ? 'Hören und finden' : 'Dinle ve bul');
  const label = `${title}: ${de ? (balloon ? 'Spiel starten' : 'Übung starten') : (balloon ? 'Oyunu başlat' : 'Etkinliği başlat')}`;
  const Icon = balloon ? Balloon : Headphones;

  return (
    <button
      type="button"
      className={`page14-activity-button page14-activity-${activity}`}
      aria-label={label}
      title={title}
      disabled={disabled}
      onPointerDown={event => event.stopPropagation()}
      onPointerUp={event => event.stopPropagation()}
      onClick={event => {
        event.stopPropagation();
        if (disabled) return;
        if (balloon) sfx.playPop(); else sfx.playStar();
        onLaunch?.();
      }}
    >
      <span className="page14-glass-icon"><Icon size={27} strokeWidth={1.8} aria-hidden="true" /></span>
      <span className="page14-activity-tooltip" aria-hidden="true">{title}</span>
    </button>
  );
}

export function PageBalloonLauncher(props) {
  return <ActivityLauncher {...props} activity="balloon" />;
}

export function PageListenLauncher(props) {
  return <ActivityLauncher {...props} activity="listen" />;
}

export default function Page14ActivityLaunchers({ lang = 'tr', pageWidth = 320, disabled = false, onLaunchBalloon, onLaunchListen }) {
  const de = lang === 'de';
  // The source page's inner frame starts at x=148 in its 1281px artwork.
  const marginWidth = pageWidth * 148 / 1281;
  const railWidth = marginWidth * .78;
  const sizeFactor = .75;
  return (
    <div className="page14-activity-launchers" style={{ '--launcher-size-factor': sizeFactor, '--page14-mobile-scale': railWidth / 64, '--page14-mobile-inset': `${(marginWidth - railWidth * sizeFactor) / 2}px` }} role="region" aria-label={de ? 'Seitenaktivitäten' : 'Sayfa etkinlikleri'}>
      <div className="page14-controls-glass">
        <PageBalloonLauncher lang={lang} disabled={disabled} onLaunch={onLaunchBalloon} />
        <PageListenLauncher lang={lang} disabled={disabled} onLaunch={onLaunchListen} />
      </div>
    </div>
  );
}
