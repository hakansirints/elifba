import React from 'react';
import { assetUrl } from '../../utils/urls';
import { AudioLines, Video } from 'lucide-react';

export default function BookHotspot({ hotspot, label, audio, disabled, onActivate }) {
  const media = ['audio', 'video'].includes(hotspot.type);
  const compact = hotspot.bounds.width < .2 && hotspot.bounds.height < .15;
  const active = media && audio.url === assetUrl(hotspot.type === 'video' ? hotspot.video_path : hotspot.audio_path) && audio.status !== 'idle';
  return <button
    className={`book-hotspot ${media ? 'media-hotspot' : 'navigation-hotspot'} ${compact ? 'hotspot-compact' : 'hotspot-passage'} ${active ? 'hotspot-active' : ''}`}
    aria-label={label}
    aria-pressed={media ? active : undefined}
    aria-busy={active && audio.status === 'loading' ? true : undefined}
    data-state={active ? audio.status : 'idle'}
    tabIndex={disabled ? -1 : 0}
    style={{ left: `${hotspot.bounds.x * 100}%`, top: `${hotspot.bounds.y * 100}%`, width: `${hotspot.bounds.width * 100}%`, height: `${hotspot.bounds.height * 100}%` }}
    onClick={onActivate}
  >{media && <><span className="hotspot-corners" aria-hidden="true" /><span className="hotspot-rail" aria-hidden="true"><span className="hotspot-rail-icon">{hotspot.type === 'video' ? <Video size={14} /> : <AudioLines size={14} />}</span></span></>}</button>;
}
