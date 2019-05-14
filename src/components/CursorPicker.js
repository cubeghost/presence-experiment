import React, { Component } from 'react';
import { map } from 'lodash';
import { connect } from 'react-redux';

import { setCursor } from 'state/actionCreators';
import { CURSORS } from 'consts';

const CursorOption = ({ file, id, isSelected, dispatchSetCursor }) => (
  <label 
    htmlFor={`CursorOption-${id}`}
    style={{
      backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.2)' : 'transparent',
      display: 'inline-block',
      padding: '2px',
    }}
  >
    <input
      type="radio"
      id={`CursorOption-${id}`}
      onChange={dispatchSetCursor}
      style={{
        opacity: 0,
        height: 0,
        width: 0,
        margin: 0,
        display: 'block',
      }}
    />
    <img 
      src={file} 
      style={{ display: 'block' }}
    />
  </label>
);
const mapStateToProps = (state, ownProps) => ({
  isSelected: state.self.cursor === ownProps.id,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetCursor: event => dispatch(setCursor(ownProps.id)),
});
const ConnectedCursorOption = connect(mapStateToProps, mapDispatchToProps)(CursorOption);

class CursorPicker extends Component {
  render() {
    return (
      <div>
        <p>select a cursor:</p>
        {map(CURSORS, cursor => (
          <ConnectedCursorOption {...cursor} key={`CursorOption-${cursor.id}`} />
        ))}
      </div>
    );
  }
}

export default CursorPicker;