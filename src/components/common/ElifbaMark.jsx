import React from 'react';
import mark from '../../graphics/elifba-mark.svg';

// Original Elif-Ba identity: an open book, crescent and small guiding stars.
export default function ElifbaMark({className='',decorative=false}) {
  return <img className={`elifba-mark ${className}`} src={mark} alt={decorative?'':'Elif-Ba · Kitap ve hilal'} aria-hidden={decorative||undefined} width="64" height="64" draggable="false"/>;
}
