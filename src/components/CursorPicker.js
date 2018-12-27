import React, { Component } from 'react';
import { map } from 'lodash';

const cursors = {
  'black-cat': { file: require('assets/black-cat.gif'), id: 'black-cat' },
  'brown-cat': { file: require('assets/brown-cat.png'), id: 'brown-cat' },
  'cat-sleepy': { file: require('assets/cat-sleepy.gif'), id: 'cat-sleepy' },
  'deer': { file: require('assets/deer.gif'), id: 'deer' },
  'dinosaur': { file: require('assets/dino.gif'), id: 'dinosaur' },
  'dog-pant': { file: require('assets/dog-pant.gif'), id: 'dog-pant' },
  'frog': { file: require('assets/frog.gif'), id: 'frog' },
  'lizard': { file: require('assets/lizard.gif'), id: 'lizard' },
  'orange-cat': { file: require('assets/orange-cat.png'), id: 'orange-cat' },
  'peacock': { file: require('assets/peacock.gif'), id: 'peacock' },
  'penguin': { file: require('assets/penguin.gif'), id: 'penguin' },
  'persian-sparkle': { file: require('assets/persian-sparkle.gif'), id: 'persian-sparkle' },
  'shihtzu': { file: require('assets/shihtzu.gif'), id: 'shihtzu' },
  'trex-sparkle': { file: require('assets/trex-sparkle.gif'), id: 'trex-sparkle' },
};

console.log(cursors)

class CursorPicker extends Component {

  render() {
    return (
      <div>
        {map(cursors, cursor => (
          <img src={cursor.file} key={`cursor-${cursor.id}`} />
        ))}
      </div>
    );
  }
}

export default CursorPicker;