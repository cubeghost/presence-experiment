import React from 'react';

const styles = {
  zIndex: -1,
  position: 'fixed',
  transform: 'translateX(50%) translateY(50%)',
};

const Sprite = ({ src, x, y }) => (
  <img 
    src={src}
    style={{
      display: 'block',
      position: 'fixed',
      top: '50vh',
      left: '50vw',
      transform: `translateX(${x}px) translateY(${y}px)`
    }}
  />
);

const World = () => (
  <div style={styles}>
    <Sprite src="https://media.giphy.com/media/l41m2A9tjl7qanqMg/giphy.gif" x={100} y={100} />
  </div>
);

export default World;