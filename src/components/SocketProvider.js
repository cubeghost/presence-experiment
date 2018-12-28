import { Component } from 'react';
import { connect } from 'react-redux';

import { setSocketId, socketConnect, socketDisconnect, identify } from 'state/actions';

const mapDispatchToProps = dispatch => ({
  dispatchSetSocketId: socketId => dispatch(setSocketId(socketId)),
  dispatchConnect: () => dispatch(socketConnect()),
  dispatchDisconnect: () => dispatch(socketDisconnect()),
  dispatchIdentify: () => dispatch(identify()),
});

class SocketProvider extends Component {
  componentDidMount() {
    const { 
      socket, 
      dispatchSetSocketId, 
      dispatchConnect, 
      dispatchDisconnect, 
      dispatchIdentify 
    } = this.props;

    socket.on('connect', () => {
      dispatchSetSocketId(this.props.socket.id);
      dispatchConnect();
    });
    socket.on('reconnect', () => {
      dispatchSetSocketId(this.props.socket.id);
      dispatchConnect();
      dispatchIdentify();
    });
    socket.on('disconnect', reason => {
      console.error('disconnect', reason);
      dispatchDisconnect();
    });
  }

  componentWillUnmount() {
    const { socket, dispatchDisconnect } = this.props;

    socket.close();
    dispatchDisconnect();
  }

  render() {
    return this.props.children;
  }
  
}

export default connect(null, mapDispatchToProps)(SocketProvider);