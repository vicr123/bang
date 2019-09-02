import React from 'react';
import Error from '../Error'

import Login from "./Login/Login";
import CreateAccount from "./Login/CreateAccount";

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
        switch (this.state.currentPane) {
            case "login":
                return <Login onPaneChange={this.onPaneChange.bind(this)} onLoginChanged={this.props.onLoginChanged} />
            case "createAccount":
                return <CreateAccount />
        }
    }
}

export default Account;