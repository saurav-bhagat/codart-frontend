import React from 'react';
import './../css/general.css';
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showLogout: true
        }
    }

    componentDidMount() {
        if(localStorage.getItem('token') === null )
        {
            this.setState({showLogout : false});
        }
        else{
            this.setState({showLogout : true});
        }
    }
    render() {
        return (
            <div className="custom-nav-wrapper">
                <div className="nav-links">
                    { this.state.showLogout &&
                        <Link to='/logout'><button className="btnn logout-class">Logout</button></Link>
                     }

                    &nbsp; &nbsp; &nbsp;
                    { this.state.showLogout &&
                        <Link to={'/' + this.props.ledorque}><button className="btnn ledorque-class">{this.props.ledorque}</button></Link>
                    }
                </div>
            </div>
        );
    }
}

export default Navbar;
