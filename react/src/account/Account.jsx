import React from 'react';
import Error from '../Error'

import Fetch from "../fetch";
import Login from "./Login/Login";
import CreateAccount from "./Login/CreateAccount";
import ManageAccount from "./Manage/ManageAccount";

class Account extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentPane: "login"
        }
    }
    
    onPaneChange(pane) {
        this.setState({
            currentPane: pane
        });
    }
    
    onLoginChanged() {
        //Invalidate the cache
        Fetch.invalidate();
        this.props.onLoginChanged();
    }
    
    renderMainSection() {
        if (this.props.currentLogin.username == null) {
            switch (this.state.currentPane) {
                case "login":
                    return <Login onPaneChange={this.onPaneChange.bind(this)} onLoginChanged={this.onLoginChanged.bind(this)} />
                case "createAccount":
                    return <CreateAccount onPaneChange={this.onPaneChange.bind(this)} onLoginChanged={this.onLoginChanged.bind(this)} />
            }
        } else {
            return <ManageAccount onLoginChanged={this.onLoginChanged.bind(this)} currentLogin={this.props.currentLogin} />
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