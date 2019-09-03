import React from 'react';
import Error from '../../Error'

import "../../App.css";

class Login extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: ""
        };
    }
    
    logInButtonHandler() {
        fetch("/api/users/getToken", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.currentUsername,
                password: this.state.currentPassword
            })
        }).then((response) => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then((json) => {
            localStorage.setItem("loginToken", json.token)
            this.props.onLoginChanged();
        }).catch(function() {
            alert("error Error!");
        })
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
                <p>Username:</p>
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange}/>
                <p>Password:</p>
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange}/>
                <button classname="button" onClick={this.logInButtonHandler.bind(this)} >Log In</button>
                <h2>Don't have an account yet? Create one!</h2>
                <button className="button" onClick={createAccount.bind(this)}>Create Account</button>
            </div>
        );
    }
}

export default Login;
