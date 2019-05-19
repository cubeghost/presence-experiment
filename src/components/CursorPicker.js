import React, { Component } from 'react';
import classNames from 'classnames';
import { map } from 'lodash';
import { connect } from 'react-redux';

import { setCursor } from 'state/actionCreators';
import { CURSORS } from 'consts';

const CursorOption = ({ file, id, isSelected, dispatchSetCursor }) => (
  <label 
    htmlFor={`CursorOption-${id}`}
    className={classNames('cursor-option', {
      'is-selected': isSelected
    })}
  >
    <input
      type="radio"
      id={`CursorOption-${id}`}
      onChange={dispatchSetCursor}
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
      <div className="cursor-picker">
        <p><strong>select a cursor:</strong></p>
        {map(CURSORS, cursor => (
          <ConnectedCursorOption {...cursor} key={`CursorOption-${cursor.id}`} />
        ))}
      </div>
    );
  }
}

export default CursorPicker;