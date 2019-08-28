import React from 'react';
import Error from '../../Error'

import "./Login.css";

class Login extends Error {
    render() {
        return (
            <div classname="logIn">
                <h1>Log In</h1>
                <p>Username:</p>
                <input type="text" username="uname"/>
                <p>Password:</p>
                <input type="password" password="pword"/>
                <button classname="button">Log In</button>
            </div>
        );
    }
}

export default Login;