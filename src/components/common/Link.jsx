import React from 'react';
import { routeUrl } from '../../utils/urls';
import { navigate } from '../../utils/navigation';
export default function Link({ to, children, onClick, ...props }) {
  return <a href={routeUrl(to)} {...props} onClick={e => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); navigate(to);
  }}>{children}</a>;
}
