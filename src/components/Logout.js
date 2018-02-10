import React from 'react';
import io from 'socket.io-client';
import {
  withRouter
} from 'react-router-dom';
let socket = io(`http://192.168.43.12:3000`);



class Logout extends React.Component{
  componentWillMount() {
    localStorage.removeItem('token');
    socket.emit('disconnect');
      window.location.reload();
    this.props.history.push('/');
  }
  render(){
    return(
      <p>Login again</p>
    );
  }
}

export default withRouter(Logout);
