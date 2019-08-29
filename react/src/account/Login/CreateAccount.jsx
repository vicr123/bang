import React from 'react';
import Error from '../../Error'

import "./Login.css";

class CreateAccount extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: ""
        };
    }
    
    registerButtonHandler() {
        fetch("/api/users/create", {
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
            alert("Your user account has been registered!");
            
            //TODO: Automatically log in the user given the token
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
        
        return (
            <div className="logIn">
                <h1>Create Account</h1>
                <p>Username:</p>
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange}/>
                <p>Password:</p>
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange}/>
                <button classname="button" onClick={this.registerButtonHandler.bind(this)}>Create Account</button>
            </div>
        );
    }
}

export default CreateAccount;
