import React from 'react';
import Error from '../Error'

import Fetch from "../fetch";
import Login from "./Login/Login";
import CreateAccount from "./Login/CreateAccount";
import ManageAccount from "./Manage/ManageAccount";
import LoginHandler from "../LoginHandler"

class Account extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPane: "login"
        }
        
        LoginHandler.on("loginDetailsChanged", () => {
            this.forceUpdate();
        })
    }
    
    onPaneChange(pane) {
        this.setState({
            currentPane: pane
        });
    }
    
    renderMainSection() {
        if (LoginHandler.loginDetails.username == null) {
            switch (this.state.currentPane) {
                case "login":
                    return <Login onPaneChange={this.onPaneChange.bind(this)}/>
                case "createAccount":
                    return <CreateAccount />
            }
        } else {
            return <ManageAccount />
        }
    }
    
    render() {
        if (this.props.isInModal) {
            return this.renderMainSection();
        } else {
            return <div class="AccountsContainer">
                {this.renderMainSection()}
                <div class="AccountsContainerFiller" />
            </div>
        }
    }
}

export default Account;