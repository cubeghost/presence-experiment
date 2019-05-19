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
    <div className="user" style={getPositionStyle(position)}>
      <img src={CURSORS[cursor].file} alt={CURSORS[cursor].id} />
      <span className="username">
        {username}
        {(typing !== null) && (
          <span>&nbsp;is typing "{typing}"</span>
        )}
      </span>
    </div>
  );
};

export default User;