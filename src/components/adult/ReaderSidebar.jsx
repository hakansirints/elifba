import { assetUrl } from '../../utils/urls';
import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, List, Grid2X2, Bookmark, NotebookPen, Search, X, ChevronRight, Trash2 } from 'lucide-react';
import { SECTIONS_DATA } from '../../data/curriculumData';
import { normalizeReaderText, searchReaderPages } from '../../utils/readerTools';

export default function ReaderSidebar({ tab, setTab, pages, currentPage, reader, onReaderChange, go, close, lang }) {
  const de = lang === 'de', [query, setQuery] = useState(''), closeRef = useRef(null), sidebarRef = useRef(null);
  const mobile = innerWidth < 800;
  useEffect(() => { closeRef.current?.focus(); }, []);
  const tabs = [['contents', List, de ? 'Inhalt' : 'Dizin'], ['pages', Grid2X2, de ? 'Seiten' : 'Sayfalar'], ['bookmarks', Bookmark, de ? 'Merkliste' : 'Yer imleri'], ['notes', NotebookPen, de ? 'Notizen' : 'Notlar']];
  const open = n => { go(n); if (innerWidth < 800) close(); };
  const term = normalizeReaderText(query), results = searchReaderPages(pages, query);
  const topicName = topic => de ? topic.nameDe : topic.nameTr;
  const orderedTopics = SECTIONS_DATA.flatMap(s => s.topics).sort((a, b) => a.page - b.page);
  const headingFor = n => orderedTopics.filter(t => t.page <= n).at(-1);
  return <aside id="reader-sidebar" className="reader-sidebar reader-glass" ref={sidebarRef} role={mobile ? 'dialog' : undefined} aria-modal={mobile ? true : undefined} aria-label={de ? 'Buchnavigation' : 'Kitap gezinmesi'} onKeyDown={e => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (mobile && e.key === 'Tab') {
      const items = [...sidebarRef.current.querySelectorAll('button,input,textarea')].filter(el => !el.disabled && el.tabIndex !== -1 && el.getClientRects().length);
      const first = items[0], last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  }}>
    <div className="reader-sidebar-heading"><span className="reader-sidebar-mark"><BookOpen size={20} /></span><div><h2>{de ? 'Mein Buch' : 'Kitabım'}</h2><p>Kur’an Öğreniyorum <span>· {pages.length} {de ? 'Seiten' : 'sayfa'}</span></p></div><button ref={closeRef} className="reader-control" onClick={close} aria-label={de ? 'Navigation schließen' : 'Paneli kapat'}><X size={18} /></button></div>
    <label className="reader-search-field"><Search size={17} /><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={de ? 'Thema, Wort oder Seite suchen' : 'Konu, kelime veya sayfa ara'} aria-label={de ? 'Im Buch suchen' : 'Kitapta ara'} /></label>
    <div className="reader-sidebar-tabs" role="tablist" aria-label={de ? 'Buchbereiche' : 'Kitap bölümleri'}>{tabs.map(([id, Icon, label], i) => <button id={`reader-tab-${id}`} key={id} role="tab" aria-controls="reader-sidebar-content" aria-selected={tab === id} tabIndex={tab === id ? 0 : -1} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const index = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setTab(tabs[index][0]); document.getElementById(`reader-tab-${tabs[index][0]}`)?.focus(); } }} onClick={() => { setQuery(''); setTab(id); }}><Icon size={17} /><span>{label}</span></button>)}</div>
    <div id="reader-sidebar-content" className="reader-sidebar-content" role="tabpanel" aria-labelledby={`reader-tab-${tab}`}>
      {term ? <div className="reader-search-results"><p className="reader-panel-caption" role="status">{results.length} {de ? 'Seiten gefunden' : 'sayfa bulundu'}</p>{results.map(p => <button className="reader-result" key={p.page_number} onClick={() => open(p.page_number)}><span className="reader-result-page">{p.page_number}</span><span><strong>{headingFor(p.page_number) ? topicName(headingFor(p.page_number)) : p.title}</strong><small>{(p.text || '').replace(/\s+/g, ' ').slice(0, 140)}</small></span><ChevronRight size={15} /></button>)}{!results.length && <p className="reader-empty">{de ? 'Versuche ein anderes Wort.' : 'Farklı bir kelime veya sayfa numarası dene.'}</p>}</div>
      : tab === 'contents' ? SECTIONS_DATA.map((section, index) => <div className="reader-toc-section" key={index}><h3>{de ? section.titleDe || section.nameDe : section.titleTr || section.nameTr}</h3>{[...section.topics].sort((a, b) => a.page - b.page).map((topic, i) => { const next = orderedTopics.find(t => t.page > topic.page)?.page || 75; const active = currentPage >= topic.page && currentPage < next; return <button key={`${topic.page}-${i}`} className={active ? 'active' : ''} aria-current={active ? 'location' : undefined} onClick={() => open(topic.page)}><span>{topicName(topic)}</span><small>{topic.page}</small></button>; })}</div>)
      : tab === 'pages' ? <div className="reader-thumbnails">{pages.map(p => <button key={p.page_number} aria-label={`${de ? 'Seite' : 'Sayfa'} ${p.page_number}`} aria-current={p.page_number === currentPage ? 'page' : undefined} onClick={() => open(p.page_number)}><img src={assetUrl(p.thumbnail)} alt="" loading="lazy" /><span>{p.page_number}</span></button>)}</div>
      : tab === 'bookmarks' ? <><p className="reader-panel-caption">{de ? 'Deine gespeicherten Seiten' : 'Kaydettiğin sayfalar'}</p>{reader.bookmarks.filter(n=>n>=6).length ? reader.bookmarks.filter(n=>n>=6).sort((a, b) => a - b).map(n => <div className="reader-saved-row" key={n}><button className="reader-result" onClick={() => open(n)}><span className="reader-result-page"><Bookmark size={16} /></span><span><strong>{de ? 'Seite' : 'Sayfa'} {n}</strong><small>{headingFor(n) ? topicName(headingFor(n)) : 'Kur’an Öğreniyorum'}</small></span></button><button className="reader-control" onClick={() => onReaderChange({ bookmarks: reader.bookmarks.filter(p => p !== n) })} aria-label={`${de ? 'Lesezeichen entfernen' : 'Yer imini kaldır'} ${n}`}><Trash2 size={16} /></button></div>) : <div className="reader-empty"><Bookmark size={24} /><p>{de ? 'Markiere eine Seite mit dem Lesezeichen-Symbol.' : 'Bir sayfayı yer imi simgesine dokunarak buraya ekleyebilirsin.'}</p></div>}</>
      : <><label className="reader-note-label" htmlFor="reader-note">{de ? `Notiz zu Seite ${currentPage}` : `Sayfa ${currentPage} için notun`}</label><textarea id="reader-note" maxLength={10000} value={reader.notes[currentPage] || ''} placeholder={de ? 'Was möchtest du dir merken?' : 'Bu sayfayla ilgili hatırlamak istediklerin…'} onChange={e => onReaderChange({ notes: { ...reader.notes, [currentPage]: e.target.value } })} /><p className="reader-panel-caption">{de ? 'Wird auf diesem Gerät automatisch gespeichert.' : 'Bu cihazda otomatik kaydedilir.'}</p>{Object.entries(reader.notes).filter(([n, note]) => Number(n)>=6&&note.trim()).sort(([a], [b]) => Number(a) - Number(b)).map(([n, note]) => <div className="reader-saved-row" key={n}><button className="reader-result" onClick={() => open(Number(n))}><span className="reader-result-page">{n}</span><span><strong>{de ? 'Seitennotiz' : 'Sayfa notu'}</strong><small>{note}</small></span></button><button className="reader-control" onClick={() => { const notes = { ...reader.notes }; delete notes[n]; onReaderChange({ notes }); }} aria-label={`${de ? 'Notiz löschen' : 'Notu sil'} ${n}`}><Trash2 size={16} /></button></div>)}</>}
    </div>
    <div className="reader-sidebar-progress"><span>{de ? 'Lesefortschritt' : 'Okuma konumu'}<strong>{Math.round((currentPage - 5) / pages.length * 100)}%</strong></span><progress max={pages.length} value={currentPage - 5} aria-label={de ? 'Lesefortschritt' : 'Kitaptaki konum'} /></div>
  </aside>;
}

