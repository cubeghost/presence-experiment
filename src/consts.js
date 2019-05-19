// TODO this could be a webpack loader 👀
function asset(filename) {
  return `https://cdn.glitch.com/${process.env.PROJECT_ID}%2F${filename}`;
}

export const CURSORS = {
  'black-cat': { file: asset('black-cat.gif'), id: 'black-cat' },
  'brown-cat': { file: asset('brown-cat.png'), id: 'brown-cat' },
  'cat-sleepy': { file: asset('cat-sleepy.gif'), id: 'cat-sleepy' },
  'deer': { file: asset('deer.gif'), id: 'deer' },
  'dinosaur': { file: asset('dino.gif'), id: 'dinosaur' },
  'dog-pant': { file: asset('dog-pant.gif'), id: 'dog-pant' },
  'frog': { file: asset('frog.gif'), id: 'frog' },
  'lizard': { file: asset('lizard.gif'), id: 'lizard' },
  'orange-cat': { file: asset('orange-cat.png'), id: 'orange-cat' },
  'peacock': { file: asset('peacock.gif'), id: 'peacock' },
  'penguin': { file: asset('penguin.gif'), id: 'penguin' },
  'persian-sparkle': { file: asset('persian-sparkle.gif'), id: 'persian-sparkle' },
  'shihtzu': { file: asset('shihtzu.gif'), id: 'shihtzu' },
  'trex-sparkle': { file: asset('trex-sparkle.gif'), id: 'trex-sparkle' },
};
