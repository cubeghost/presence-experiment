import React, { Component } from 'react';
import autobind from 'class-autobind';
import { connect } from 'react-redux';

import { identify, setUsername } from 'state/actions';
import { isStringEmpty } from 'utils';

import CursorPicker from 'components/CursorPicker';

const mapStateToProps = state => ({
  cursor: state.self.cursor,
  isConnected: state.connection.isConnected,
});

const mapDispatchToProps = dispatch => ({
  dispatchIdentify: username => dispatch(identify(username)),
});

class Identify extends Component {

  constructor() {
    super();
    autobind(this);

    this.state = {
      username: ''
    };
  }

  handleInput(event) {
    this.setState({ username: event.target.value });
  }

  identify(event) {
    if (event) event.preventDefault();

    const { dispatchIdentify } = this.props;
    const { username } = this.state;
    dispatchIdentify(username);
  }

  render() {
    const { cursor } = this.props;
    const { username } = this.state;

    return (
      <div>
        <form onSubmit={this.identify}>
          <CursorPicker />
          <label htmlFor="username">username: </label>
          <input
            type="text"
            autoFocus={true}
            id="username"
            value={username}
            onChange={this.handleInput}
          />
          <button 
            type="submit" 
            onClick={this.identify} 
            disabled={!cursor || !username}
          >
            ok
          </button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Identify);