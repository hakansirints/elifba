import React from 'react';
import filters from '../../graphics/glass-filters.svg?raw';

// Trusted, local SVG definitions are installed once; no rendering loop or dependency.
export default function GlassFilters() {
  return <div className="glass-filter-defs" aria-hidden="true" dangerouslySetInnerHTML={{ __html: filters }}/>;
}
