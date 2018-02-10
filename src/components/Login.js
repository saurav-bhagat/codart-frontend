import React from 'react';
import './../css/login.css';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Acmlogo from './../img/acm-white1.png';
import DotTech from './../img/tech2.png';
import HackerEarth from './../img/hackerearth.png';
import vitlogo from './../img/vitlogo.png';
import Codartlogo from './../img/codartlogo.png';
import io from 'socket.io-client';
let socket = io.connect(`http://192.168.225.42:3000`);

class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            password : '',
            username : '',
            loginValue : 'Sign in'
        }
        this.passwordChange = this.passwordChange.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    passwordChange(e) {
        this.setState({password : e.target.value});
    }
    usernameChange(e) {
        this.setState({username : e.target.value});
    }
    handleLogin(e) {

        this.setState ({ loginValue : 'sigining in...' });
        axios.post('http://192.168.43.12:3000/user/login', {
            username: this.state.username,
            password: this.state.password
          })
          .then((response) => {
            console.log(response);
            localStorage.setItem('token', response.data.token);
            // socket.emit('join', localStorage.getItem('token'), (err)=> {
            //     console.log(err);
            // })
            // console.log("Joining");
            this.props.history.push("/questionspace");

          })
          .catch((error) => {
            console.log(error);
          });
    }
    render(){
        return(
            <div className="section-1">
                <div className="row">
                    <div className="left-section col s1">
                        <hr />
                    </div>
                    <div className="right-section col s11">
                        <div className="center-text" >
                            <img src={Codartlogo} alt="Codart" className="codart-logo" />
                            <span></span>
                        </div>
                        <br />
                        <div className="login-wrapper">
                            <div className="card">
                                <div className="inside-card">
                                    <h4>Login</h4>
                                    <form>
                                        <div className="input-field ">
                                            <input id="username" type="text" className="validate" onChange={this.usernameChange} required />
                                            <label htmlFor="username">Username</label>
                                        </div>
                                        <div className="input-field ">
                                            <input type="password" className="validate" onChange={this.passwordChange} required />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </form>
                                    <br />
                                    <button className="btn waves login-btn" onClick={this.handleLogin}>{this.state.loginValue}</button>
                                    <br /><br />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <br />
                <div className="sponsor-section row">
                    <h3><span className="ul-anim">In Association with:</span></h3>
                    <div className="col s6">
                        <a href="http://hackerearth.com" className="tooltipped" data-position="right" data-delay="50" data-tooltip="HackerEarth" rel='noopener noreferrer' target="_blank"><img src={HackerEarth} alt="hackereath" className="hackerearth-img" /></a>
                    </div>
                    <div className="col s6">
                        <a href="http://get.tech" className="tooltipped" data-position="right" data-delay="50" data-tooltip=".tech" rel='noopener noreferrer' target="_blank"><img src={DotTech} alt=".tech" className="dottech-img" /></a>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }
}



class Footer extends React.Component {
  render(){
    return(
      <div>

        <div className="row " id="footer">
            <div className="col m4 left hide-on-med-and-down">
                <img src={Acmlogo} alt="ACM" id="acmlogo" />
            </div>
            <div className="col m4 center-align hide-on-med-and-down" id="footermid">
                <div className="middle-box">
                    <a href="https://github.com/ACMVITU"><i className="fa fa-github fa-2x" id="gitfooter" aria-hidden="true"></i></a>
                    <a href="https://facebook.com/acmvitu"><i className="fa fa-facebook fa-2x" id="fbfooter" aria-hidden="true"></i></a>
                </div>
            </div>
            <div className="col m4 hide-on-med-and-down">
                <img src={vitlogo} alt="VIT" className="right" />
            </div>

            <div className="col s12 center show-on-small hide-on-med-and-up">
                <img src={Acmlogo} alt="ACM" id="acmlogomob" />
            </div>
            <div className="col s12 center-align show-on-small  hide-on-med-and-up" id="footermidmob">
                <div className="middle-box">
                    <a href="https://github.com/ACMVITU"><i className="fa fa-github fa-2x" id="gitfootermob" aria-hidden="true"></i></a>
                    <a href="https://facebook.com/acmvitu"><i className="fa fa-facebook fa-2x" id="fbfootermob" aria-hidden="true"></i></a>
                </div>
            </div>
            <div className="col s12 center-align">
                <img src={vitlogo} alt="VIT" className="show-on-small hide-on-med-and-up"
                    style={{marginLeft: 'auto',marginRight : 'auto'}} />
            </div>

        </div>
      </div>
    );
  }
}


export default withRouter(Login);
