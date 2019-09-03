import React from 'react';
import Error from '../../Error'

class ManageAccount extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: ""
        };
    }
    
    logOutButtonHandler() {
        localStorage.removeItem("loginToken");
        this.props.onLoginChanged();
    }
    
    render() {
        return (
            <div className="logIn">
                <h1>Hi {this.props.currentLogin.username}</h1>
                <button className="button" onClick={this.logOutButtonHandler.bind(this)}>Log Out</button>
            </div>
        );
    }
}

export default ManageAccount;
