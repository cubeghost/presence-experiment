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
      transform: `translateX(${x}) translateY(${y})`
    }}
  />
);

const World = () => (
  <div style={styles}>
    <Sprite src="https://media.giphy.com/media/3otO6xRxnsZ8213SJa/100w.webp" x="20" y="40" />
  </div>
);

export default World;