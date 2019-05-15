import React from 'react';

import { CURSORS } from 'consts';
import { getPositionStyle } from 'utils';

const User = ({
  username,
  position,
  cursor,
  typing,
}) => {
  if (!position || !username) return null;

  return (
    <div style={getPositionStyle(position)}>
      <img src={CURSORS[cursor].file} />
      <span style={{ marginLeft: '0.25em' }}>{username}</span>
      {(typing !== null) && (
        <span>&nbsp;is typing "{typing}"</span>
      )}
    </div>
  );
};

export default User;