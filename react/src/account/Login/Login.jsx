import React from 'react';
import Error from '../../Error'
import Fetch from '../../fetch'

// Code for handleKeyDown was based on code that can be found here:
// https://stackoverflow.com/questions/31272207/to-call-onchange-event-after-pressing-enter-key
// 

class Login extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: "",
            errorState: false
        };
    }
    
    async logInButtonHandler() {  
        try {
            let json = await Fetch.post("/users/getToken", {
                username: this.state.currentUsername,
                password: this.state.currentPassword
            });
            
            localStorage.setItem("loginToken", json.token)
            this.props.onLoginChanged();
        } catch (err) {
            this.setState({
                errorState: true
            });
        }
    }
    
    renderErrorState() {
        if (this.state.errorState) {
            return <span className="error">We couldn't log you in with those details.</span>
        } else {
            return null;
        }
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            this.logInButtonHandler();
        }
    }
    
    render() {
        let usernameChange = (e) => {
            this.setState({
                currentUsername: e.target.value
            });
        }
        let passwordChange = (e) => {
            this.setState({
                currentPassword: e.target.value
            });
        }
        
        let createAccount = () => {
            this.props.onPaneChange("createAccount");
        }
        
        return (
            <div className="logIn">
                <h1>Log In</h1>
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange} onKeyDown={this.onKeyDown.bind(this)} placeholder="Username" />
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange} onKeyDown={this.onKeyDown.bind(this)} placeholder="Password" />
                <button classname="button" onClick={this.logInButtonHandler.bind(this)} >Log In</button>
                {this.renderErrorState()}
                <h2>Don't have an account yet? Create one!</h2>
                <button className="button" onClick={createAccount.bind(this)}>Create Account</button>
            </div>
        );
    }
}

export default Login;
