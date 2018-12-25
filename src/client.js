import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import io from 'socket.io-client';

class Client extends Component {
  componentDidMount() {
    const socket = io();
  }

  render() {
    return (
      <div>
        <h1>hi</h1>
      </div>
    );
  }
}

ReactDOM.render(<Client />, document.querySelector('#react-root'));
