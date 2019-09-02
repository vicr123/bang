import React from 'react';
import Error from '../Error'

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
    
    render() {
        if (this.props.currentLogin.username == null) {
            switch (this.state.currentPane) {
                case "login":
                    return <Login onPaneChange={this.onPaneChange.bind(this)} onLoginChanged={this.props.onLoginChanged} />
                case "createAccount":
                    return <CreateAccount onLoginChanged={this.props.onLoginChanged} />
            }
        } else {
            return <ManageAccount onLoginChanged={this.props.onLoginChanged} currentLogin={this.props.currentLogin} />
        }
    }
}

export default Account;