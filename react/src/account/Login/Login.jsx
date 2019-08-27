import React from 'react';
import Error from '../../Error'

import "./Login.css";

class Login extends Error {
    render() {
        return (
            <div classname="logIn">
                <h2>Login</h2>
                <p>Username:</p>
                <input type="text" username="uname"/>
                <p>Password:</p>
                <input type="password" password="pword"/>
                <button />
            </div>
        );
    }
}

export default Login;
