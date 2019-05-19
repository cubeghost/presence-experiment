import React from 'react';

const Link = ({ href, children, ...otherProps }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener"
  >
    {children}
  </a>
);

export default Link;