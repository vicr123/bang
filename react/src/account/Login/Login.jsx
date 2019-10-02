import React from 'react';
import Error from '../../Error'
import Fetch from '../../fetch'

class Login extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: ""
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
            alert("error Error!");
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
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange} placeholder="Username" />
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange} placeholder="Password" />
                <button classname="button" onClick={this.logInButtonHandler.bind(this)} >Log In</button>
                <h2>Don't have an account yet? Create one!</h2>
                <button className="button" onClick={createAccount.bind(this)}>Create Account</button>
            </div>
        );
    }
}

export default Login;
