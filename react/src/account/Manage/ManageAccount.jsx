import React from 'react';
import Error from '../../Error'

import Modal from '../../Modal'
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
        let performLogOut = () => {
            localStorage.removeItem("loginToken");
            LoginHandler.reloadLogin();
            //Modal unmounts automatically when the login changes
        }
        Modal.mount(<Modal title="Log Out" cancelable={true} width={400}>
            <div class="VerticalBox">
                <span>Log out of your account now?</span>
                <button className="deleteButton" onClick={performLogOut}>Log Out</button>
                <button onClick={Modal.unmount}>Cancel</button>
            </div>
        </Modal>)
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
