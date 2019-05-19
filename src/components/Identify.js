import React, { Component } from 'react';
import { connect } from 'react-redux';

import { identify, setUsername, setShouldPersistIdentity } from 'state/actionCreators';

import CursorPicker from 'components/CursorPicker';

const mapStateToProps = state => ({
  username: state.self.username,
  isSubmitDisabled: !(state.self.cursor && state.self.username),
  shouldPersistIdentity: state.self.shouldPersistIdentity,
});

const mapDispatchToProps = dispatch => ({
  dispatchIdentify: event => {
    if (event) event.preventDefault();
    return dispatch(identify());
  },
  dispatchSetUsername: event => dispatch(setUsername(event.target.value)),
  dispatchSetShouldPersistIdentity: event => dispatch(setShouldPersistIdentity(event.target.checked)),
});

class Identify extends Component {

  componentDidMount() {
    const { shouldPersistIdentity, isSubmitDisabled, dispatchIdentify } = this.props;

    if (shouldPersistIdentity && !isSubmitDisabled) {
      dispatchIdentify();
    }
  }

  render() {
    const { 
      username, 
      isSubmitDisabled, 
      shouldPersistIdentity, 
      dispatchSetUsername, 
      dispatchIdentify, 
      dispatchSetShouldPersistIdentity, 
    } = this.props;

    return (
      <div>
        <form className="inline pink" onSubmit={dispatchIdentify}>
          <CursorPicker />
          <label 
            htmlFor="username" 
            className="underline"
          >
            username:
          </label>
          <input
            type="text"
            //autoFocus={true}
            id="username"
            value={username}
            onChange={dispatchSetUsername}
          />
          <button 
            type="submit" 
            className="box pink"
            onClick={dispatchIdentify} 
            disabled={isSubmitDisabled}
          >
            ok
          </button>
          <label htmlFor="shouldPersistIdentity">
            &nbsp;&nbsp;
            <input
              type="checkbox" 
              id="shouldPersistIdentity" 
              checked={shouldPersistIdentity}
              onChange={dispatchSetShouldPersistIdentity}
            />
            remember me
          </label>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Identify);