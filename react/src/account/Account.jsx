import React from 'react';
import Error from '../Error'

import Fetch from "../fetch";
import Login from "./Login/Login";
import CreateAccount from "./Login/CreateAccount";
import ManageAccount from "./Manage/ManageAccount";
import LoginHandler from "../LoginHandler"
import TrendingView from '../posts/TrendingView';

class Account extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPane: "login"
        }
        
        LoginHandler.on("loginDetailsChanged", () => {
            this.setState({
                currentPane: "login"
            });
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
                    return <CreateAccount onPaneChange={this.onPaneChange.bind(this)}/>
            }
        } else {
            switch (this.state.currentPane) {
                case "login":
                    return <ManageAccount onPaneChange={this.onPaneChange.bind(this)}/>
                case "myposts":
                    return <TrendingView type="mine" />
            }
        }
    }
    
    renderFiller() {
        if (this.state.currentPane != "myposts") return <div class="AccountsContainerFiller" />;
        return null;
    }
    
    render() {
        if (this.props.isInModal) {
            return this.renderMainSection();
        } else {
            return <div class="AccountsContainer">
                {this.renderMainSection()}
                {this.renderFiller()}
            </div>
        }
    }
}

export default Account;