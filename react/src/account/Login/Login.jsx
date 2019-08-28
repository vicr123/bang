import React from 'react';
import Error from '../../Error'

import "./Login.css";

class Login extends Error {
    render() {
        return (
            <div className="logIn">
                <h1>Log In</h1>
                <p>Username:</p>
                <input type="text" username="uname"/>
                <p>Password:</p>
                <input type="password" password="pword"/>
                <button classname="button">Log In</button>
                <h2>Don't have an account yet? Create one!</h2>
                <button className="button">Create Account</button>
            </div>
        );
    }
}

export default Login;
