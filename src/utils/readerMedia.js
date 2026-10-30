// Short, individually tappable alphabet exercises need no persistent transport.
export function isQuickLetterAudio(hotspot, pageNumber) {
  return hotspot.type === 'audio' && hotspot.audio_path?.includes('/arabic/') && pageNumber >= 14 && pageNumber <= 43 && hotspot.bounds.width < .2 && hotspot.bounds.height < .15;
}
const overlaps = (a, b) => Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
export function clampPlayerPosition(point, size, viewport) {
  return { x: Math.max(12, Math.min(point.x, Math.max(12, viewport.width - size.width - 12))), y: Math.max(12, Math.min(point.y, Math.max(12, viewport.height - size.height - 12))) };
}
export function placeReaderPlayer({ viewport, size, stage, book, anchor, obstacles = [] }) {
  const middle = anchor ? anchor.y + anchor.height / 2 : book.y + book.height / 2;
  const controls = obstacles.find(rect => rect.kind === 'dock');
  const candidates = [
    { x: book.x + book.width + 16, y: middle - size.height / 2 },
    { x: book.x - size.width - 16, y: middle - size.height / 2 },
    { x: stage.x + (stage.width - size.width) / 2, y: (controls?.y ?? viewport.height - 26) - size.height - 14 },
    { x: stage.x + (stage.width - size.width) / 2, y: book.y - size.height - 14 },
    { x: stage.x + 16, y: stage.y + 80 },
    { x: stage.x + stage.width - size.width - 16, y: stage.y + 80 },
  ].map(point => clampPlayerPosition(point, size, viewport));
  const score = point => {
    const rect = { ...point, ...size };
    return overlaps(rect, book) * 4 + obstacles.reduce((sum, obstacle) => sum + overlaps(rect, obstacle) * 12, 0) + Math.max(0, stage.x + 12 - point.x) * size.height * 10;
  };
  return candidates.reduce((best, point) => score(point) < score(best) ? point : best);
}
