import React from 'react';
import Error from '../../Error'

import LoginHandler from '../../LoginHandler'
import Modal from '../../Modal.jsx'
import TrendingView from '../../posts/TrendingView';

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
        let showMyPosts = () => {
            this.props.onPaneChange("myposts");
        }
        
        return (
            <div className="logIn">
                <h1>Hi {LoginHandler.loginDetails.username}</h1>
                <button className="button" onClick={showMyPosts}>My Posts</button>
                <button className="button deleteButton" onClick={this.logOutButtonHandler.bind(this)}>Log Out</button>
            </div>
        );
    }
}

export default ManageAccount;
