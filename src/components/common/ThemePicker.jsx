import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { THEMES } from '../../utils/themes';

export default function ThemePicker({ theme, onChange, lang = 'tr' }) {
  const [open, setOpen] = useState(false), ref = useRef(null), trigger = useRef(null);
  const de = lang === 'de';
  useEffect(() => {
    if (!open) return;
    const dismiss = event => { if (!ref.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus({preventScroll:true}); } };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="theme-picker" ref={ref}>
    <button ref={trigger} type="button" className="refract-btn icon-button theme-toggle" aria-label={de ? 'Farbmodus wählen' : 'Renk modunu seç'} aria-expanded={open} onClick={() => setOpen(v => !v)}><Palette size={18}/></button>
    {open && <div className="theme-options" role="group" aria-label={de ? 'Farbmodi' : 'Renk modları'}>
      <p>{de ? 'Farbmodus' : 'Renk modu'}</p>
      {THEMES.map(item => <button key={item.id} type="button" className="theme-option" aria-pressed={theme === item.id} onClick={() => { onChange(item.id); setOpen(false); trigger.current?.focus({preventScroll:true}); }}><span className={`theme-swatch swatch-${item.id}`} aria-hidden="true"/><span>{item[lang]}</span>{theme === item.id && <Check size={16}/>}</button>)}
    </div>}
  </div>;
}
