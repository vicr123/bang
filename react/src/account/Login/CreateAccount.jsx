import React from 'react';
import Error from '../../Error'
import Fetch from '../../fetch'

class CreateAccount extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: "",
            errorState: ""
        };
    }
    
    async registerButtonHandler() {
        try {
            let json = await Fetch.post("/users/create", {
                username: this.state.currentUsername,
                password: this.state.currentPassword
            });
            
            //Log the user in given the token
            localStorage.setItem("loginToken", json.token)
            this.props.onLoginChanged();
        } catch (err) {
            let showGenericError = true;
            if (err.status === 400) {
                let json = await err.json();
                let state = {
                    "Missing fields": "Fill in all fields to continue",
                    "Empty Username": "Username cannot be empty",
                    "Username greater than 20 characters": "Username must be 20 characters or less",
                    "Password greater than 128 characters": "Password must be 128 characters or less",
                    "Password less than 8 characters": "Password must be 8 characters or greater"
                };
                
                if (state.hasOwnProperty(json.error)) {
                    this.setState({
                        errorState: state[json.error]
                    });
                    showGenericError = false;
                }
            }
            
            if (showGenericError) {
                this.setState({
                    errorState: "That didn't work. Someone else may already have that username."
                });
            }
        }
    }

    renderErrorState() {
        if (this.state.errorState !== "") {
            return <span className="error">{this.state.errorState}</span>
        } else {
            return null;
        }
    }

    onKeyDown(event) {
        if (event.key === 'Enter') {
            this.registerButtonHandler();
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
        
        return (
            <div className="logIn">
                <h1>Create Account</h1>
                <ul>
                    <li>Usernames must be less than 20 characters</li>
                    <li>Usernames with leading or trailing whitespace will be trimmed</li>
                    <li>Passwords must be 8 characters or greater</li>
                    <li>Passwords must be 128 characters or less</li>
                </ul>
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange} onKeyDown={this.onKeyDown.bind(this)} placeholder="Username" />
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange} onKeyDown={this.onKeyDown.bind(this)} placeholder="Password" />
                <button classname="button" onClick={this.registerButtonHandler.bind(this)}>Create Account</button>
                {this.renderErrorState()}
            </div>
        );
    }
}

export default CreateAccount;
