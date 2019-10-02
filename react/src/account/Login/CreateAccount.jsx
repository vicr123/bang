import React from 'react';
import Error from '../../Error'
import Fetch from '../../fetch'

class CreateAccount extends Error {
    constructor(props) {
        super(props);
        
        this.state = {
            currentUsername: "",
            currentPassword: ""
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
        
        return (
            <div className="logIn">
                <h1>Create Account</h1>
                <input type="text" username="uname" value={this.state.currentUsername} onChange={usernameChange} placeholder="Username" />
                <input type="password" password="pword" value={this.state.currentPassword} onChange={passwordChange} placeholder="Password" />
                <button classname="button" onClick={this.registerButtonHandler.bind(this)}>Create Account</button>
            </div>
        );
    }
}

export default CreateAccount;
