import React from 'react';
import Error from '../../Error'

import "./Login.css";

class CreateAccount extends Error {
    render() {
        return (
            <div className="logIn">
                <h1>Create Account</h1>
                <p>Username:</p>
                <input type="text" username="uname"/>
                <p>Password:</p>
                <input type="password" password="pword"/>
                <button classname="button">Create Account</button>
            </div>
        );
    }
}

export default CreateAccount;
