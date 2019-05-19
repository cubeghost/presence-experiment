import React from 'react';

const Sprite = ({ name, position, ...otherProps }) => (
  <img 
    alt={name}
    style={{
      display: 'block',
      position: 'absolute',
      zIndex: -2,
      ...position
    }}
    {...otherProps}
  />
);

const World = () => (
  <div className="world">

    <Sprite 
      name="palm tree"
      source="https://giphy.com/stickers/VsIzjbp1YqdGg"
      src="https://media.giphy.com/media/VsIzjbp1YqdGg/giphy.gif"
      width={200}
      position={{
        bottom: 0,
        right: '40vw'
      }}
    />

    <Sprite 
      name="sunset"
      source="https://giphy.com/stickers/l41m2A9tjl7qanqMg"
      src="https://media.giphy.com/media/l41m2A9tjl7qanqMg/giphy.gif"
      width={300}
      position={{
        bottom: '-20px',
        right: '10vw'
      }}
    />
    
    <Sprite 
      name="twirly rainbow thing"
      source="https://giphy.com/stickers/7XuS2vVsAc83iwIuAF"
      src="https://media.giphy.com/media/7XuS2vVsAc83iwIuAF/200.gif"
      width={100}
      position={{
        top: '30vh',
        left: '20vw'
      }}
     />

    <Sprite 
      name="transforming geometric object"
      source="https://giphy.com/stickers/AyN4lt9z581zi"
      src="https://media.giphy.com/media/AyN4lt9z581zi/giphy.gif"
      width={150}
      position={{
        top: '-20px',
        right: '10vw'
      }}
    />
    
    <Sprite 
      name="sparkle"
      source="https://giphy.com/stickers/fo2dhRTmaULbStoFkX"
      src="https://media.giphy.com/media/fo2dhRTmaULbStoFkX/200.gif"
      width={150}
      position={{
        top: '7vw',
        right: '15vw'
      }}
    />
    
    <Sprite 
      name="crystal floating serenely"
      source="https://giphy.com/stickers/3ov9jDblR6W2d6NfJC"
      src="https://media.giphy.com/media/3ov9jDblR6W2d6NfJC/200.gif"  
      width={150}
      position={{
        bottom: '34vh',
        right: '32vw'
      }}
    />
    
  </div>
);

export default World;

/*
    ufo 
    <Sprite 
      source="https://gifcities.org/?q=ufo"
      src="https://web.archive.org/web/20091027023806/http://www.geocities.com/jd676767/tiny-ufo.gif"
      position={{
        top: '20vh',
        right: '30vh'
      }}
    />
    
*/