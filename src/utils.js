import { flow, isEmpty, trim } from 'lodash/fp';

export const isStringEmpty = flow(trim, isEmpty);

export const getPositionStyle = ({ x, y }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  transform: `translate(${x}px,${y}px)`,
});