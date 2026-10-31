export const THEMES = [
  { id: 'sepia', tr: 'Sepya', de: 'Sepia' },
  { id: 'aqua', tr: 'Su Yeşili', de: 'Wassergrün' },
  { id: 'dark', tr: 'Karanlık', de: 'Dunkel' },
];
// Existing light-mode preferences migrate to the new water-green theme.
export const normalizeTheme = value => THEMES.some(t => t.id === value) ? value : 'aqua';
