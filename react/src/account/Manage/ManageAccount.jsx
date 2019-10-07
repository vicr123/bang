import React from 'react';
import Error from '../../Error'

import LoginHandler from '../../LoginHandler'

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
        LoginHandler.reloadLogin();
    }
    
    render() {
        return (
            <div className="logIn">
                <h1>Hi {LoginHandler.loginDetails.username}</h1>
                <button className="button" onClick={this.logOutButtonHandler.bind(this)}>Log Out</button>
            </div>
        );
    }
}

export default ManageAccount;
