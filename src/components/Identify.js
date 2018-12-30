import React, { Component } from 'react';
import autobind from 'class-autobind';
import { connect } from 'react-redux';

import { identify, setUsername } from 'state/actions';

import CursorPicker from 'components/CursorPicker';

const mapStateToProps = state => ({
  isSubmitDisabled: !(state.self.cursor && state.self.username),
});

const mapDispatchToProps = dispatch => ({
  dispatchIdentify: event => {
    if (event) event.preventDefault();
    return dispatch(identify());
  },
  dispatchSetUsername: event => dispatch(setUsername(event.target.value))
});

class Identify extends Component {

  constructor() {
    super();
    autobind(this);
  }

  render() {
    const { username, isSubmitDisabled, dispatchSetUsername, dispatchIdentify } = this.props;

    return (
      <div>
        <form onSubmit={dispatchIdentify}>
          <CursorPicker />
          <label htmlFor="username">username: </label>
          <input
            type="text"
            autoFocus={true}
            id="username"
            value={username}
            onChange={dispatchSetUsername}
          />
          <button 
            type="submit" 
            onClick={dispatchIdentify} 
            disabled={isSubmitDisabled}
          >
            ok
          </button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Identify);