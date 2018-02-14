import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from './Navbar';
import './../css/leaderboard.css';
import './../css/general.css';

let socket;
const TeamRow = (props) => {
  return(
      <tr>
          <td>{props.data.username}</td>
          <td>{props.data.score}</td>
      </tr>
  );
};

class Leaderboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ledetails : []
        }
        socket = io(`http://192.168.225.42:3000`);
        socket.emit('lead', "saurav");
        socket.on('connect', () => {
            console.log("connected inside leaderboard");
        });
        socket.on('score', (res) => {
            console.log(res);
            let temp = [];
            for(let i=0; i< res.length ;i++)
            {
                temp.push(res[i]);
            }
            this.setState({ledetails : temp});
        });
        socket.on('disconnect', () => {
            console.log("disconnected");
        });
    }

    componentDidMount() {
        axios.get("http://192.168.225.42:3000/user/leaderboard")
            .then(res => {

                for(let i=0; i< res.data.data.length ;i++)
                {
                    this.state.ledetails.push(res.data.data[i]);
                }

                this.setState({});

            })
    }

    render() {
        let leaderBoard = this.state.ledetails;
        return(
            <div id="leaderBoard-wrapper">
                <Navbar ledorque="questionspace" />
                <br />
                {/* <Link to='/'>Home</Link> */}
                <div className="tb-container">
                    <br /> <br />
                    <table className="bordered">
                        <thead>
                        <tr>
                            <th>Team Name</th>
                            <th>Score</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                leaderBoard.map((team,index) => {
                                return <TeamRow key = {index} data = {team} index={index} />
                                })
                            }

                        </tbody>
                    </table>
                    <br />
                </div>
            </div>
        );
    }
}


export default Leaderboard;
